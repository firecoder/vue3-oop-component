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


/**
 * Create a proxy to redirect reads to alternative object if property is missing in target.
 *
 * @param writeTarget write all new properties to this target
 * @param readTargetIfMissingInWrite read all missing properties from here
 */
export function createProxyRedirectReads<T extends Record<string | symbol, unknown>>(
    writeTarget: Record<string | symbol, unknown>,
    readTargetIfMissingInWrite: Record<string | symbol, unknown>,
): Record<string | symbol, unknown> {
    const deletedPropertyNames = {} as Record<string | symbol, boolean>;

    readTargetIfMissingInWrite = readTargetIfMissingInWrite || {};
    return new Proxy(writeTarget || {}, {
        get(target: Record<string | symbol, unknown>, property: string | symbol): unknown {
            if (!deletedPropertyNames[property] && property in target) {
                return target[property];
            } else if (!deletedPropertyNames[property]) {
                return readTargetIfMissingInWrite[property];
            } else {
                return undefined;
            }
        },

        set(target: Record<string | symbol, unknown>, property: string | symbol, value: unknown): boolean {
            target[property] = value;
            delete deletedPropertyNames[property];
            return true;
        },

        defineProperty(target: Record<string | symbol, unknown>, property: string | symbol, attributes: PropertyDescriptor): boolean {
            Object.defineProperty(target, property, attributes);
            delete deletedPropertyNames[property];
            return true;
        },

        deleteProperty(target: Record<string | symbol, unknown>, property: string | symbol): boolean {
            delete target[property];
            if (property in readTargetIfMissingInWrite) {
                deletedPropertyNames[property] = true;
            }
            return true;
        },

        getOwnPropertyDescriptor(target: Record<string | symbol, unknown>, property: string | symbol): PropertyDescriptor | undefined {
            if (!deletedPropertyNames[property] && Object.hasOwn(target, property)) {
                return Object.getOwnPropertyDescriptor(target, property);
            } else if (!deletedPropertyNames[property] && Object.hasOwn(readTargetIfMissingInWrite, property)) {
                return Object.getOwnPropertyDescriptor(readTargetIfMissingInWrite, property);
            } else {
                return undefined;
            }
        },

        has(target: Record<string | symbol, unknown>, property: string | symbol): boolean {
            return !deletedPropertyNames[property] && (
                (typeof property === "string" && Object.hasOwn(target, property))
                || (readTargetIfMissingInWrite && Object.hasOwn(readTargetIfMissingInWrite, property))
            );
        },

        ownKeys(target: Record<string | symbol, unknown>): ArrayLike<string | symbol> {
            return Object.keys(target)
                .concat(Object.keys(readTargetIfMissingInWrite || {}))
                .filter((property) => !deletedPropertyNames[property]);
        },
    });
}
