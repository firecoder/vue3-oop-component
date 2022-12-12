import type { Vue, VueClass } from "./vue";
export type MixedVueClass<Mixins extends VueClass<Vue>[]> = Mixins extends (infer T)[] ? (T extends VueClass<infer V extends Vue> ? VueClass<V> : never) : never;
export declare function mixins<A extends Vue>(CtorA: VueClass<A>): VueClass<A>;
export declare function mixins<A extends Vue, B extends Vue>(CtorA: VueClass<A>, CtorB: VueClass<B>): VueClass<A & B>;
export declare function mixins<A extends Vue, B extends Vue, C extends Vue>(CtorA: VueClass<A>, CtorB: VueClass<B>, CtorC: VueClass<C>): VueClass<A & B & C>;
export declare function mixins<A extends Vue, B extends Vue, C extends Vue, D extends Vue>(CtorA: VueClass<A>, CtorB: VueClass<B>, CtorC: VueClass<C>, CtorD: VueClass<D>): VueClass<A & B & C & D>;
export declare function mixins<A extends Vue, B extends Vue, C extends Vue, D extends Vue, E extends Vue>(CtorA: VueClass<A>, CtorB: VueClass<B>, CtorC: VueClass<C>, CtorD: VueClass<D>, CtorE: VueClass<E>): VueClass<A & B & C & D & E>;
export declare function mixins<T extends Vue>(...Constructors: VueClass<Vue>[]): VueClass<T>;
export declare function mixins<T extends VueClass<Vue>[]>(...Constructors: T): MixedVueClass<T>;
