import type { Vue, VueClass } from "./vue";
import type { UnionToIntersection, ExtractInstance } from "./utility-types";

export type MixedVueClass<Mixins extends VueClass<Vue>[]> =
    Mixins extends (infer T)[] ? VueClass<UnionToIntersection<ExtractInstance<T>>> : never
;

// Retain legacy declaration for backward compatibility
export function mixins <A> (CtorA: VueClass<A>): VueClass<A>;
export function mixins <A, B> (CtorA: VueClass<A>, CtorB: VueClass<B>): VueClass<A & B>;
export function mixins <A, B, C> (CtorA: VueClass<A>, CtorB: VueClass<B>, CtorC: VueClass<C>): VueClass<A & B & C>;
export function mixins <A, B, C, D> (CtorA: VueClass<A>, CtorB: VueClass<B>, CtorC: VueClass<C>, CtorD: VueClass<D>): VueClass<A & B & C & D>;
export function mixins <A, B, C, D, E> (CtorA: VueClass<A>, CtorB: VueClass<B>, CtorC: VueClass<C>, CtorD: VueClass<D>, CtorE: VueClass<E>): VueClass<A & B & C & D & E>;
export function mixins<T>(...Constructors: VueClass<Vue>[]): VueClass<T>;

export function mixins<T extends VueClass<Vue>[]>(...Constructors: T): MixedVueClass<T>;
export function mixins(...Constructors: VueClass<Vue>[]): VueClass<Vue> {
    // TODO: find reasonable implementation
    return Constructors[0]; // Vue.extend({ mixins: Constructors })
}
