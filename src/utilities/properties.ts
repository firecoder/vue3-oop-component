import { isRef, isReactive, reactive, toRaw, unref } from "vue";

/**
 * Defines new properties on an instance as "links" to the provided properties object, much like "hard links".
 *
 * <p>
 *     Although this function looks similar to {@code Object.assign()}, it works differently. Properties are
 *     NOT "copied" but the new defined property uses getters and setters to read or write from the original property
 *     in the provided {@code newProperties} parameter. This work like "hard links" in various file systems.
 * </p>
 *
 * @param instance the instance to apply the new properties
 * @param newProperties a reactive object providing all the properties to define and link to.
 */
export function defineNewLinkedProperties<T extends object>(
    instance: T, newProperties?: Record<string | symbol, unknown>,
): T {
    if (typeof instance === "undefined" || typeof newProperties === "undefined") {
        return instance;
    }

    const rawInstance = toRaw(instance);
    const reactiveSource = isReactive(newProperties) ? newProperties : reactive(newProperties);

    // set the properties as passed by Vue
    if (newProperties && typeof newProperties === "object") {
        ([] as (string | symbol)[])
            .concat(Object.keys(newProperties))
            .concat(Object.getOwnPropertySymbols(newProperties))
            .forEach((key) => {
                Object.defineProperty(rawInstance, key, {
                    get() { return unref(reactiveSource[key]); },
                    set() {
                        // ignore. classes do set property values in all derived constructors.
                        // So, setting the property is always done. However, since properties in Vue must not be
                        // overwritten, setting a new value must be available but silently ignored.
                    },
                    configurable: true,
                    enumerable: true,
                });
            })
        ;
    }

    return instance;
}
