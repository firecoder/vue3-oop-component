/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
    Component,
    ComponentInternalInstance,
    Slot,
    VNodeProps,
    VNode,
    VNodeArrayChildren,
} from "vue";
import type { VueClass, Vue }  from "./vue";

export type LegacyVNodeChildren =
    | string
    | number
    | boolean
    | VNode
    | VNodeArrayChildren
;

// for legacy
export type ScopedSlot = Function;

export type Data = Record<string, unknown>;
export type VNodeData = Data & VNodeProps;

export interface LegacyVNodeDirective {
    name: string;
    value: unknown;
    arg?: string;
    modifiers?: Record<string, boolean>;
}

export interface LegacyVNodeProps {
    key?: string | number;
    ref?: string;
    refInFor?: boolean;

    staticClass?: string;
    class?: unknown;
    staticStyle?: Record<string, unknown>;
    style?: Record<string, unknown>;
    attrs?: Record<string, unknown>;
    domProps?: Record<string, unknown>;
    on?: Record<string, Function | Function[]>;
    nativeOn?: Record<string, Function | Function[]>;
    directives?: LegacyVNodeDirective[];

    // component only
    props?: Record<string, unknown>;
    slot?: string;
    scopedSlots?: Record<string, ScopedSlot>;
    model?: {
        value: any;
        callback: (v: any) => void;
        expression: string;
    };
}

export type LegacyScopedSlotsData = Array<
    | {
        key: string
        fn: ScopedSlot
      }
    | LegacyScopedSlotsData
>

/**
 * Define the render helper functions that were once available with every Vue component in Vue 2.
 */
export interface VueLegacyRenderFunctions {
    $createElement: (
        | ((type: string | Component, children?: LegacyVNodeChildren) => VNode)
        | ((type: string | Component, props?: Data & LegacyVNodeProps, children?: LegacyVNodeChildren) => VNode)
    );

    _c: (
        | ((type: string | Component, children?: LegacyVNodeChildren) => VNode)
        | ((type: string | Component, props?: Data & LegacyVNodeProps, children?: LegacyVNodeChildren) => VNode)
        );

    /**
     * Runtime helper for v-once.
     * Effectively it means marking the node as static with a unique key.
     *
     * markOnce()
     */
    _o: (tree: VNode | VNode[], index: number, key?: string) => VNode;

    _n: (value: string) => number | string; // toNumber();
    _s: (value: unknown) => string; // toString();

    /**
     * Runtime helper for rendering v-for lists.
     *
     * renderList()
     */
    _l: (
        value: string | unknown[] | number | Record<string, unknown>,
        render: (value: unknown, keyOrIndex: string | number, index?: number) => VNode,
    ) => VNode[];

    /**
     * Runtime helper for rendering <slot>
     *
     * renderSlot()
     */
    _t: (
        name: string,
        fallbackRender?: ((() => VNode[]) | VNode[]),
        props?: Record<string, unknown>,
        bindObject?: Record<string, unknown>,
    ) => (VNode[] | undefined);

    /**
     * Check if two values are loosely equal - that is,
     * if they are plain objects, do they have the same shape?
     *
     * looseEqual()
     */
    _q: (a: unknown, b: unknown) => boolean;

    /**
     * Return the first index at which a loosely equal value can be
     * found in the array (if value is a plain object, the array must
     * contain an object of the same shape), or -1 if it is not present.
     *
     * looseIndexOf()
     */
    _i: (arr: unknown[], value: unknown) => number;

    /**
     * For rendering predefined static trees, defined by the Vue compiler
     *
     * renderStatic()
     */
    _m: (index: number, isInFor: boolean) => VNode | VNode[];

    _f: (id: string) => (<T>(...val: T[]) => unknown | undefined); // resolveFilter();

    /**
     * Runtime helper for checking keyCodes from config.
     * exposed as Vue.prototype._k
     * passing in eventKeyName as last argument separately for backwards compat
     *
     * checkKeyCodes()
     */
    _k: (
        eventKeyCode: number,
        key: string,
        builtInKeyCode?: number | number[],
        eventKeyName?: string,
        builtInKeyName?: string | string[],
    ) => boolean;

    /**
     * Runtime helper for merging v-bind="object" into a VNode's data.
     *
     * bindObjectProps()
     */
    _b: (data: unknown, tag: string, value: unknown, asProperty: boolean, isSync?: boolean) => VNodeProps;


    _v: (value: string | number) => VNode; // createTextVNode()
    _e: (value?: string) => VNode; // createEmptyVNode() - a comment node

    // resolveScopedSlots()
    _u: (
        slots: LegacyScopedSlotsData,
        mergeSlots?: Record<string, Slot | undefined | null>,
        hasDynamicKeys?: boolean,
    ) => Record<string, Slot>;

    _g: (data: unknown, value: unknown) => VNodeData; // bindObjectListeners();

    /**
     * helper to process dynamic keys for dynamic arguments in v-bind and v-on.
     * For example, the following template:
     *
     * <div id="app" :[key]="value">
     *
     * compiles to the following:
     *
     * _c('div', { attrs: bindDynamicKeys({ "id": "app" }, [key, value]) })
     *
     * bindDynamicKeys()
     */
    _d: (baseObj: Record<string, unknown>, values: unknown[]) => Record<string, unknown>;

    /**
     * helper to dynamically append modifier runtime markers to event names.
     * ensure only append when value is already string, otherwise it will be cast
     * to string and cause the type check to miss.
     *
     * prependModifier()
     */
    _p: (value: unknown, symbol: string) => unknown;
}

type VueComponent  = {
    $?: ComponentInternalInstance;
}

function getFunctionFromCompatOrThrowError<F>(vue: VueComponent, name: string) : F {
    const legacyFunctions = (vue.$?.proxy as unknown as Record<string, F>);
    if (typeof legacyFunctions[name] === "function") {
        return legacyFunctions[name];
    }
    throw new Error("Legacy function is not available with this Vue 3 build. Use @vue/compat instead!");
}


/**
 * Map legacy rendering functions from Vue internal component.
 *
 * <p>
 *     This function is called by the constructor of the Vue base class to enable legacy render functions in principle.
 *     However, because this is legacy internal API of Vue 2, the function names are not exposed. You are encouraged
 *     to rewrite your custom rendering function to not relay on these internal functions.
 * </p>
 * <p>
 *     Legacy rendering functions are only available in case {@code @vue/compat} package is used.
 *     see: https://www.npmjs.com/package/@vue/compat
 * </p>
 */
export function addLegacyRenderingFunctions<V>(vue: V): V & VueLegacyRenderFunctions {
    const target = vue as unknown as (V & VueLegacyRenderFunctions);
    [
        "$createElement",
        "_c", "_o", "_n", "_s", "_l", "_t",
        "_q", "_i", "_m", "_f", "_k", "_b",
        "_v", "_e", "_u", "_g", "_d", "_p",
    ].forEach((name) => Object.defineProperty(
        target,
        name,
        {
            get: function () {
                return getFunctionFromCompatOrThrowError(this, name);
            },
            enumerable: false,
            configurable: true,
        },
    ));

    return target;
}

/**
 * Makes legacy render functions visible to child classes.
 *
 * @param componentClass
 * @constructor
 */
export function MixinCustomRender<A extends Vue>(componentClass: VueClass<A>): VueClass<A> & VueLegacyRenderFunctions {
    return componentClass as VueClass<A> & VueLegacyRenderFunctions;
}
