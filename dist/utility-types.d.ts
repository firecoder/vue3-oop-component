import type { VueClass } from "./vue";
export declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export declare type ExtractInstance<T> = T extends VueClass<infer V> ? V : never;
