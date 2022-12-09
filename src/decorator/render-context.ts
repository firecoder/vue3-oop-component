import type { ReactiveFlags } from "vue";

import { toRaw } from "vue";
import { isReservedPrefix } from "../vue";
import {
    getAllInheritedPropertiesFromPrototypeChain,
} from "../utilities/traverse-prototype";


// the property name for RAW values of reactive objects.
const ReactiveRawProperty: ReactiveFlags.RAW | string = "__v_raw";

/**
 * Convert a component instance into a render context for Vue 3.
 *
 * <p>
 *     Some fixes are needed to make the public component instance work with templates:
 *     <ul>
 *         <li>present all inherited properties as "own" properties</li>
 *         <li>bind `this` context to function values of properties</li>
 *         <li>Hide properties from template that start with Vue reserved prefixes `$` or `_`</li>
 *     </ul>
 * </p>
 *
 * <p>
 *     The render context provides data for the templates. Unfortunately, Vue 3 limits access of properties to
 *     "own properties". It does not check for inherited functions or methods. Thus, a wrapper is needed to provide
 *     access to such properties.
 *     see:
 *     https://github.com/vuejs/core/blob/8dcb6c7bbdd2905469e2bb11dfff27b58cc784b2/packages/runtime-core/src/componentPublicInstance.ts#L265
 * </p>
 *
 * <p>
 *     Another fix is needed to really make member methods work inside templates. The template engine does not bind
 *     the `this` context to functions properly. So, member functions are unable to access any property of the public
 *     component instance. The created render context returns functions with `this` context bound to the proper
 *     instance to work around this issue.
 * </p>
 *
 * <p>
 *     Vue 3 complains about properties on the rendering context that start with "_" or "$" as they are reserved for
 *     use by Vue only - in the eyes of the developers of Vue. However, the prefix "_" is very common for private
 *     member variables and functions of classes. Since these are not intended to be used with the template anyway,
 *     such properties are hidden from the list of "own" properties. Nevertheless, they can be accessed when named
 *     directly.
 * </p>
 *
 * @param instance the component instance to wrap to create a rendering context for.
 */
export function createVueRenderContext<T extends object>(instance: T): T {
    if (instance !== null && instance !== undefined && typeof instance === "object") {
        const inheritedProperties = getAllInheritedPropertiesFromPrototypeChain(toRaw(instance));

        return new Proxy(instance, {
            get(target: Record<string | symbol, unknown>, key: string | symbol, receiver: T): unknown {
                const value = target[key];

                // if the value is a function, bind "this" context to the target. Vue does not do this on the
                // render context created from this proxy.
                // However, do not bind member functions of the "Object" base class.
                if (typeof value === "function" && !Object.hasOwn(Object.prototype, key)) {
                    return value.bind(receiver);

                } else if (value !== null && typeof value === "object" && key === ReactiveRawProperty) {
                    // if someone tries to access the raw instance of a reactive one, then wrap the raw
                    // instance as well to make it work with Vue and the template engine.
                    return createVueRenderContext(value);

                } else {
                    return value;
                }
            },

            getOwnPropertyDescriptor(target: object, key: string | symbol): PropertyDescriptor | undefined {
                // ignore reserved Vue properties
                if (isReservedPrefix(key)) {
                    return undefined;
                }

                // present inherited properties as "own" property
                return Object.getOwnPropertyDescriptor(target, key) ??
                    Object.getOwnPropertyDescriptor(inheritedProperties, key)
                ;
            },

            has(target: object, key: string | symbol): boolean {
                return !isReservedPrefix(key) && (key in target || key in inheritedProperties);
            },

            ownKeys(target: object): ArrayLike<string | symbol> {
                // present inherited properties as "own" property
                return ([] as (string | symbol)[])
                    .concat(Object.getOwnPropertyNames(target))
                    .concat(Object.getOwnPropertySymbols(target))
                    .concat(Object.getOwnPropertyNames(inheritedProperties))
                    .concat(Object.getOwnPropertySymbols(inheritedProperties))

                    // hide properties with reserved prefixes
                    .filter((key) => !isReservedPrefix(key))
                ;
            },
        }) as T;

    } else {
        return instance;
    }
}
