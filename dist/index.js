var D = Object.defineProperty;
var V = (r, e, t) => e in r ? D(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var l = (r, e, t) => (V(r, typeof e != "symbol" ? e + "" : e, t), t);
import { computed as I, getCurrentInstance as O, h as S, inject as N, onActivated as W, onBeforeMount as x, onBeforeUnmount as T, onBeforeUpdate as U, onDeactivated as R, onMounted as H, onRenderTracked as B, onRenderTriggered as L, onErrorCaptured as M, onServerPrefetch as G, onUnmounted as K, onUpdated as q, provide as J, ref as Q, warn as X, watch as y, toRaw as m, isReactive as Y, reactive as v, unref as Z, nextTick as z } from "vue";
const a = {
  computed: I,
  getCurrentInstance: O,
  h: S,
  inject: N,
  onActivated: W,
  onBeforeMount: x,
  onBeforeUnmount: T,
  onBeforeUpdate: U,
  onDeactivated: R,
  onMounted: H,
  onRenderTracked: B,
  onRenderTriggered: L,
  onErrorCaptured: M,
  onServerPrefetch: G,
  onUnmounted: K,
  onUpdated: q,
  provide: J,
  ref: Q,
  warn: X,
  watch: y
};
function ee(r, e) {
  var n;
  const t = (n = r.$) == null ? void 0 : n.proxy;
  if (typeof t[e] == "function")
    return t[e];
  throw new Error("Legacy function is not available with this Vue 3 build. Use @vue/compat instead!");
}
function te(r) {
  const e = r;
  return [
    "$createElement",
    "_c",
    "_o",
    "_n",
    "_s",
    "_l",
    "_t",
    "_q",
    "_i",
    "_m",
    "_f",
    "_k",
    "_b",
    "_v",
    "_e",
    "_u",
    "_g",
    "_d",
    "_p"
  ].forEach((t) => Object.defineProperty(e, t, {
    get: function() {
      return ee(this, t);
    },
    enumerable: !1,
    configurable: !0
  })), e;
}
function je(r) {
  return r;
}
function j(r, e) {
  if (typeof r > "u" || typeof e > "u")
    return r;
  const t = m(r), n = Y(e) ? e : v(e);
  return e && typeof e == "object" && [].concat(Object.keys(e)).concat(Object.getOwnPropertySymbols(e)).forEach((o) => {
    Object.defineProperty(t, o, {
      get() {
        return Z(n[o]);
      },
      set() {
      },
      configurable: !0,
      enumerable: !0
    });
  }), r;
}
function re(r, e) {
  const t = {};
  return e = e || {}, new Proxy(r || {}, {
    get(n, o) {
      return !t[o] && o in n ? n[o] : t[o] ? void 0 : e[o];
    },
    set(n, o, i) {
      return n[o] = i, delete t[o], !0;
    },
    defineProperty(n, o, i) {
      return Object.defineProperty(n, o, i), delete t[o], !0;
    },
    deleteProperty(n, o) {
      return delete n[o], o in e && (t[o] = !0), !0;
    },
    getOwnPropertyDescriptor(n, o) {
      return !t[o] && Object.hasOwn(n, o) ? Object.getOwnPropertyDescriptor(n, o) : !t[o] && Object.hasOwn(e, o) ? Object.getOwnPropertyDescriptor(e, o) : void 0;
    },
    has(n, o) {
      return !t[o] && (typeof o == "string" && Object.hasOwn(n, o) || e && Object.hasOwn(e, o));
    },
    ownKeys(n) {
      return Object.keys(n).concat(Object.keys(e || {})).filter((o) => !t[o]);
    }
  });
}
let P;
function ne() {
  return P;
}
function $(r) {
  P = r;
}
function oe() {
  $(void 0);
}
class ie {
  constructor() {
    l(this, "$");
    l(this, "_setupContext");
    let e = O(), t = ne();
    Object.defineProperty(this, "$", {
      get: () => e,
      set: (n) => {
        e = n;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(this, "_setupContext", {
      get: () => t,
      set: (n) => {
        t = n;
      },
      enumerable: !1,
      configurable: !0
    }), j(this, e == null ? void 0 : e.props), te(this);
  }
  getSetupContext() {
    return this._setupContext;
  }
  get $el() {
    var e, t;
    return (t = (e = this.$) == null ? void 0 : e.vnode) == null ? void 0 : t.el;
  }
  get $attrs() {
    var e;
    return (e = this.$) == null ? void 0 : e.attrs;
  }
  get $data() {
    var e;
    return (e = this.$) == null ? void 0 : e.data;
  }
  get $emit() {
    var e;
    return (e = this.$) == null ? void 0 : e.emit;
  }
  get $forceUpdate() {
    var e;
    return ((e = this.$) == null ? void 0 : e.f) || (() => this.$nextTick(() => {
      var t;
      return (t = this.$) == null ? void 0 : t.update();
    }));
  }
  get $nextTick() {
    var e, t;
    return ((e = this.$) == null ? void 0 : e.n) || z.bind((t = this.$) == null ? void 0 : t.proxy);
  }
  get $parent() {
    var e;
    return (e = this.$) == null ? void 0 : e.parent;
  }
  get $props() {
    var e;
    return (e = this.$) == null ? void 0 : e.props;
  }
  get $options() {
    var e;
    return ((e = this.$) == null ? void 0 : e.type) || {};
  }
  get $refs() {
    var e;
    return (e = this.$) == null ? void 0 : e.refs;
  }
  get $root() {
    var e;
    return (e = this.$) == null ? void 0 : e.root;
  }
  get $slots() {
    var e;
    return (e = this.$) == null ? void 0 : e.slots;
  }
  $watch(e, t, n) {
    return typeof e == "string" ? y(() => this[e], t, n) : y(e, t, n);
  }
  setup() {
  }
  _getVueClassComponentOptions() {
    return [];
  }
}
const Pe = ie;
function A(r) {
  return !(r instanceof Function) && r instanceof Object ? r.constructor : r;
}
function g(r) {
  if (!r)
    return [];
  const e = [];
  r = A(r);
  let t = Object.getPrototypeOf(r);
  for (; t; )
    e.push(t), t = Object.getPrototypeOf(t);
  return e.pop(), e.pop(), e.reverse(), e;
}
function ce(r, e) {
  if (!r || !e)
    return [];
  const t = (g(r) || []).filter((n) => Object.hasOwn(n, e)).map((n) => n[e]);
  return Object.hasOwn(r, e) && t.push(r[e]), t;
}
function se(r, e) {
  if (!r)
    return;
  const t = g(r);
  t.reverse();
  for (const n of t) {
    const o = n.prototype;
    if (o && Object.hasOwn(o, e))
      return o[e];
  }
}
function ae(r) {
  const e = {};
  if (!r)
    return {};
  const t = g(r);
  t.push(A(r)), t.reverse();
  for (const n of t) {
    const o = n.prototype;
    [].concat(Object.getOwnPropertyNames(o)).concat(Object.getOwnPropertySymbols(o)).forEach((i) => {
      const s = o[i];
      !e[i] && typeof s == "function" && (e[i] = s);
    });
  }
  return e;
}
function fe(...r) {
  return r = (r || []).filter((e) => e && typeof e == "function"), function(...t) {
    let n;
    if (Array.isArray(r) && r.length > 0) {
      n = r[0].apply(this, t);
      for (let o = 1; o < r.length; o++)
        r[o].apply(this, t);
    }
    return n;
  };
}
const b = {
  beforeCreate: () => {
  },
  created: () => {
  },
  beforeMount: function(e, t) {
    return a.onBeforeMount(e, t);
  },
  mounted: function(e, t) {
    return a.onMounted(e, t);
  },
  beforeDestroy: function(e, t) {
    return a.onBeforeUnmount(e, t);
  },
  beforeUnMount: function(e, t) {
    return a.onBeforeUnmount(e, t);
  },
  destroyed: function(e, t) {
    return a.onUnmounted(e, t);
  },
  unmounted: function(e, t) {
    return a.onUnmounted(e, t);
  },
  beforeUpdate: function(e, t) {
    return a.onBeforeUpdate(e, t);
  },
  updated: function(e, t) {
    return a.onUpdated(e, t);
  },
  activated: function(e, t) {
    return a.onActivated(e, t);
  },
  deactivated: function(e, t) {
    return a.onDeactivated(e, t);
  },
  renderTracked: function(e, t) {
    return a.onRenderTracked(e, t);
  },
  renderTriggered: function(e, t) {
    return a.onRenderTriggered(e, t);
  },
  errorCaptured: function(e, t) {
    return a.onErrorCaptured(e, t);
  },
  serverPrefetch: function(e, t) {
    return a.onServerPrefetch(e, t);
  }
}, ue = Object.getOwnPropertyNames(b), E = [
  ...ue,
  "data",
  "render"
];
function h(r) {
  return !le(r);
}
function le(r) {
  return !!(r && typeof r == "string" && E.indexOf(r) >= 0);
}
function pe(r) {
  return function() {
    return r.value;
  };
}
function he(r) {
  return function(t) {
    r.value = t;
  };
}
class C {
  constructor(e) {
    l(this, "_component");
    l(this, "_hasBeenFinalised", !1);
    l(this, "_rawInstance");
    l(this, "_reactiveWrapper");
    l(this, "_watchersToCreate", []);
    typeof e == "function" ? this.setComponentClass(e) : typeof e == "object" && (this.setComponentClass(e.constructor), this.instance = e);
  }
  createAndUseNewInstance() {
    if (typeof this._component != "function")
      throw new Error("Failed to create new component! No class for the component has been provided.");
    return this.instance = new this._component(), this;
  }
  get componentClass() {
    var e;
    return this._component || ((e = this.rawInstance) == null ? void 0 : e.constructor);
  }
  get instance() {
    return this.reactiveWrapper;
  }
  set instance(e) {
    typeof e == "object" ? (this._rawInstance = m(e), this._reactiveWrapper = v(this._rawInstance)) : (this._rawInstance = void 0, this._reactiveWrapper = void 0);
  }
  get rawInstance() {
    return this._rawInstance;
  }
  get reactiveWrapper() {
    return this._reactiveWrapper;
  }
  build() {
    return this._checkValidInstanceAndThrowError(), this._hasBeenFinalised && a.warn(`ComponentBuilder's "build()" function has already been called!
                Calling a second time risks errors with watchers!`), this._hasBeenFinalised = !0, this._createAllWatchers(), this.reactiveWrapper;
  }
  applyDataValues(e) {
    if (this._checkValidInstanceAndThrowError(), e) {
      let t = {};
      typeof e == "function" ? t = e.call(this.reactiveWrapper) : typeof e == "object" && (t = e), t && typeof t == "object" && Object.getOwnPropertyNames(t).forEach((n) => Object.defineProperty(this.rawInstance, n, { value: t[n] }));
    }
    return this;
  }
  createComputedValues(e) {
    return this._checkValidInstanceAndThrowError(), e ? (Object.getOwnPropertyNames(e || {}).filter(h).forEach((t) => {
      const n = e[t];
      if (typeof n == "function")
        this._defineReactiveProperty(t, a.computed(n.bind(this.reactiveWrapper)), !1);
      else if (n && typeof n == "object" && typeof n.get == "function" && typeof n.set == "function")
        this._defineReactiveProperty(t, a.computed({
          get: n.get.bind(this.reactiveWrapper),
          set: n.set.bind(this.reactiveWrapper)
        }), !0);
      else {
        const o = JSON.stringify(n, void 0, 4);
        a.warn(`Invalid "computed" specification for property ${t}: ${o}`);
      }
    }), this) : this;
  }
  getOptionsForComponent() {
    let e = (this._component && ce(this._component, "__vccOpts") || []).map((t) => t.__component_decorator_original_options).filter((t) => !!t);
    if (!(e != null && e.length) && typeof this._component == "function") {
      const t = new this._component();
      typeof t._getVueClassComponentOptions == "function" && (e = (t._getVueClassComponentOptions() || []).filter((n) => !!n));
    }
    return e || [];
  }
  injectData(e) {
    this._checkValidInstanceAndThrowError();
    const t = this.reactiveWrapper;
    if (Array.isArray(e))
      e.filter(h).forEach((n) => t[n] = a.inject(n));
    else if (typeof e == "object") {
      const n = [
        ...Object.getOwnPropertyNames(e),
        ...Object.getOwnPropertySymbols(e)
      ].filter(h);
      for (let o = 0; o < n.length; o++) {
        const i = n[o], s = e[i];
        let c, f = i;
        typeof s == "symbol" ? f = s : typeof s == "object" ? (f = s.from || f, c = s.default) : s && (f = String(s)), typeof c == "function" ? t[i] = a.inject(f, c, !0) : t[i] = a.inject(f, c, !1);
      }
    }
    return this;
  }
  provideData(e) {
    let t = e;
    return typeof e == "function" && (t = e.apply(this.reactiveWrapper)), typeof t == "object" && [
      ...Object.getOwnPropertyNames(t),
      ...Object.getOwnPropertySymbols(t)
    ].filter(h).forEach((n) => a.provide(n, t[n])), this;
  }
  registerLifeCycleHooks() {
    return this.registerAdditionalLifeCycleHooks(this.rawInstance);
  }
  registerAdditionalLifeCycleHooks(e) {
    this._checkValidInstanceAndThrowError();
    const t = e && m(e) || void 0;
    return t && Object.getOwnPropertyNames(b).filter((n) => typeof t[n] == "function").forEach((n) => b[n](t[n].bind(this.reactiveWrapper), this.rawInstance.$)), this;
  }
  setComponentClass(e) {
    return this._component = e, this;
  }
  watcherForPropertyChange(e) {
    return e && this._watchersToCreate.push(e), this;
  }
  _createAllWatchers() {
    for (; Array.isArray(this._watchersToCreate) && this._watchersToCreate.length > 0; )
      try {
        this._performWatcherCreation(this._watchersToCreate.shift());
      } catch (e) {
        console.error("Failed to create watcher!", e);
      }
    return this;
  }
  _performWatcherCreation(e) {
    this._checkValidInstanceAndThrowError();
    const t = this.reactiveWrapper;
    if (t && typeof e == "object") {
      const n = Object.getOwnPropertyNames(e).filter(h).filter((o) => e && e[o]);
      for (const o of n) {
        let i = e[o];
        Array.isArray(i) || (i = [i]);
        const s = function(c, f) {
          return function() {
            return c[f];
          };
        }(this.reactiveWrapper, o);
        for (let c = 0; c < i.length; c++) {
          const f = i[c];
          if (typeof f == "function")
            a.watch(s, f.bind(t));
          else {
            let p, u, d = {};
            if (typeof f == "object" ? (d = f, typeof f.handler == "string" ? u = f.handler : p = f.handler) : typeof f == "string" && (u = f), !p && u) {
              if (u === o)
                throw new Error(`Invalid watcher defined!
                                    Can not watch on property ${o} and call same property on change!`);
              if (typeof this.rawInstance[u] != "function")
                throw new Error(`Invalid watcher defined!
                                    The named handler '${u}' for watched property '${o}'
                                    is no member function of the component instance!`);
              p = function(F) {
                return function(...k) {
                  return this[F].call(this, ...k);
                };
              }(u).bind(t);
            }
            if (p)
              try {
                a.watch(s, p, d);
              } catch (_) {
                console.error(`Failed to create watcher on property ${o}`, f, _);
              }
            else
              a.warn(`No valid watch handler for property "${o}" has been provided.`);
          }
        }
      }
    }
    return this;
  }
  _defineReactiveProperty(e, t, n) {
    return this._checkValidInstanceAndThrowError(), e && Object.defineProperty(this.rawInstance, e, {
      get: pe(t).bind(this.reactiveWrapper),
      set: n ? he(t).bind(this.reactiveWrapper) : void 0
    }), this;
  }
  _checkValidInstanceAndThrowError() {
    if (this._rawInstance === void 0)
      throw new Error("Failed to build component! No instance has been created yet. Please call 'createAndUseNewInstance()' first!");
  }
}
function w(r, e = {}) {
  e = e || {};
  const t = ye(r);
  e.computed = Object.assign({}, t, e.computed);
  const n = r.__decorators__;
  if (n && n.length > 0) {
    const s = e.methods || {}, c = ae(r);
    e.methods = re(s, c), n.forEach((f) => f(e)), e.methods = s;
  }
  me(r, e);
  const o = r;
  typeof e.beforeCreate == "function" && (typeof o.beforeCreate == "function" ? o.beforeCreate = fe(o.beforeCreate, e.beforeCreate) : o.beforeCreate = e.beforeCreate), function(c, f) {
    c.prototype._getVueClassComponentOptions = function() {
      const u = se(this, "_getVueClassComponentOptions");
      return (typeof u == "function" ? u() || [] : []).concat([f]);
    };
  }(r, e);
  const i = de(o, e);
  if (i)
    o.__vccOpts = i;
  else
    throw new Error("Failed to create Vue class component options!");
  return o;
}
function de(r, e = {}) {
  if (!r || !e)
    return;
  const n = {
    name: e.name || r._componentTag || r.name,
    setup: Ce(r),
    __component_decorator_original_options: e
  };
  return Object.defineProperty(n, "props", {
    get: be(r),
    configurable: !0,
    enumerable: !0
  }), Object.defineProperty(n, "components", {
    get: ge(r),
    configurable: !0,
    enumerable: !0
  }), n.render = function(i) {
    if (i && typeof i.render == "function")
      return i.render(a.h, i._setupContext);
  }, n;
}
function ye(r) {
  const e = {}, t = r.prototype, n = [].concat(Object.getOwnPropertyNames(t)).concat(Object.getOwnPropertySymbols(t));
  for (const o of n) {
    if (o === "constructor" || o === "prototype" || typeof o == "string" && (E.indexOf(o) > -1 || o.startsWith("$")))
      return;
    const i = Object.getOwnPropertyDescriptor(t, o);
    e !== void 0 && (i == null ? void 0 : i.get) && (i == null ? void 0 : i.set) ? e[o] = {
      get: i.get,
      set: i.set
    } : e !== void 0 && (i == null ? void 0 : i.get) && (e[o] = i.get);
  }
  return e;
}
function me(r, e) {
  const t = r.prototype;
  return Object.getOwnPropertyNames((e == null ? void 0 : e.methods) || {}).filter((n) => typeof ((e == null ? void 0 : e.methods) || {})[n] == "function").forEach(function(n) {
    if (!(e != null && e.methods) || typeof e.methods[n] != "function")
      return;
    const o = e.methods[n];
    if (typeof t[n] == "function") {
      const i = t[n];
      t[n] = function(...s) {
        return i.apply(this, s), o.apply(this, s);
      };
    } else if (t[n] === void 0)
      t[n] = o;
    else
      throw new Error("A new function must not overwrite a non-function value");
  }), r;
}
function be(r) {
  const e = {};
  let t = !1;
  return function() {
    if (!t) {
      t = !0;
      const o = (new C(r).getOptionsForComponent() || []).map((i) => i.props).filter((i) => i != null);
      for (const i of o)
        Array.isArray(i) ? i.forEach((s) => {
          e[s] = {};
        }) : typeof i == "object" && Object.assign(e, i);
    }
    return e;
  };
}
function ge(r) {
  const e = {};
  let t = !1;
  return function() {
    if (!t) {
      t = !0;
      const o = (new C(r).getOptionsForComponent() || []).map((i) => i.components).filter((i) => i != null);
      for (const i of o)
        typeof i == "object" && Object.assign(e, i);
    }
    return e;
  };
}
function Ce(r) {
  return function(t, n) {
    $(n);
    const o = a.getCurrentInstance() || {}, i = new C().setComponentClass(r).createAndUseNewInstance(), s = i.getOptionsForComponent();
    return s.forEach((c) => {
      typeof (c == null ? void 0 : c.beforeCreate) == "function" && c.beforeCreate.call(o);
    }), i.rawInstance.$ || (i.rawInstance.$ = o, j(i.rawInstance, (o == null ? void 0 : o.props) || t)), i.registerLifeCycleHooks(), s.forEach((c) => i.applyDataValues(c.data).createComputedValues(c.computed).injectData(c.inject).provideData(c.provide).registerAdditionalLifeCycleHooks(c).watcherForPropertyChange(c.watch)), typeof i.rawInstance.setup == "function" && i.rawInstance.setup.call(i.instance, i, t, n), s.forEach((c) => {
      typeof c.setup == "function" && c.setup.call(i.instance, i, t, n);
    }), typeof i.instance.created == "function" && i.instance.created(), oe(), i.build();
  };
}
function _e(r) {
  return typeof r == "function" ? w(r) : function(t) {
    return w(t, r);
  };
}
_e.registerHooks = function() {
};
function $e(...r) {
  return r[0];
}
function Ae(r) {
  return function(t, n, o) {
    const i = typeof t == "function" ? t : t.constructor;
    i.__decorators__ || (i.__decorators__ = []), typeof o != "number" && (o = void 0), i.__decorators__.push((s) => r(s, n || Symbol(), o));
  };
}
export {
  E as $internalHookNames,
  ue as $lifeCycleHookNames,
  _e as Component,
  a as CompositionApi,
  je as MixinCustomRender,
  Pe as Vue,
  ie as VueComponentBaseImpl,
  te as addLegacyRenderingFunctions,
  Ae as createDecorator,
  _e as default,
  le as isInternalHookName,
  h as isNotInternalHookName,
  $e as mixins
};
