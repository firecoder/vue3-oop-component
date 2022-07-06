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
export declare function defineNewLinkedProperties<T extends object>(instance: T, newProperties?: Record<string | symbol, unknown>): T;
