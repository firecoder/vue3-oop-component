import type { VueClass } from "./vue";

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type ExtractInstance<T> = T extends VueClass<infer V> ? V : never
