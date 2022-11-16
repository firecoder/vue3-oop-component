import type { Vue } from "../vue/vue";
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
export declare function defineNewLinkedProperties<T extends Vue>(instance: T, newProperties?: Record<string | symbol, unknown>): T;
/**
 * Create a proxy to redirect reads to alternative object if property is missing in target.
 *
 * @param writeTarget write all new properties to this target
 * @param readTargetIfMissingInWrite read all missing properties from here
 */
export declare function createProxyRedirectReads(writeTarget: Record<string | symbol, unknown>, readTargetIfMissingInWrite: Record<string | symbol, unknown>): Record<string | symbol, unknown>;
