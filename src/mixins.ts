import type { Vue, VueClass } from "./vue";

export type MixedVueClass<Mixins extends VueClass<Vue>[]> =
    Mixins extends (infer T)[] ? (
        T extends  VueClass<infer V extends Vue> ? VueClass<V> : never
    ) : never
;

// Retain legacy declaration for backward compatibility
export function mixins <A extends Vue> (CtorA: VueClass<A>): VueClass<A>;
export function mixins <A extends Vue, B extends Vue> (CtorA: VueClass<A>, CtorB: VueClass<B>): VueClass<A & B>;
export function mixins <A extends Vue, B extends Vue, C extends Vue> (CtorA: VueClass<A>, CtorB: VueClass<B>, CtorC: VueClass<C>): VueClass<A & B & C>;
export function mixins <A extends Vue, B extends Vue, C extends Vue, D extends Vue> (CtorA: VueClass<A>, CtorB: VueClass<B>, CtorC: VueClass<C>, CtorD: VueClass<D>): VueClass<A & B & C & D>;
export function mixins <A extends Vue, B extends Vue, C extends Vue, D extends Vue, E extends Vue> (CtorA: VueClass<A>, CtorB: VueClass<B>, CtorC: VueClass<C>, CtorD: VueClass<D>, CtorE: VueClass<E>): VueClass<A & B & C & D & E>;
export function mixins<T extends Vue>(...Constructors: VueClass<Vue>[]): VueClass<T>;

export function mixins<T extends VueClass<Vue>[]>(...Constructors: T): MixedVueClass<T>;
export function mixins(...Constructors: VueClass<Vue>[]): VueClass<Vue> {
    // TODO: find reasonable implementation
    return Constructors[0]; // Vue.extend({ mixins: Constructors })
}
