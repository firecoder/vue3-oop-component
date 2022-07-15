var F = Object.defineProperty;
var k = (r, e, t) => e in r ? F(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var h = (r, e, t) => (k(r, typeof e != "symbol" ? e + "" : e, t), t);
import { toRaw as y, isReactive as D, reactive as v, unref as V, computed as I, getCurrentInstance as g, inject as N, onActivated as W, onBeforeMount as T, onBeforeUnmount as U, onBeforeUpdate as R, onDeactivated as S, onMounted as H, onRenderTracked as B, onRenderTriggered as x, onErrorCaptured as L, onServerPrefetch as M, onUnmounted as G, onUpdated as K, provide as q, ref as J, warn as Q, watch as m, nextTick as X } from "vue";
function j(r) {
  return !(r instanceof Function) && r instanceof Object ? r.constructor : r;
}
function w(r) {
  if (!r)
    return [];
  const e = [];
  r = j(r);
  let t = Object.getPrototypeOf(r);
  for (; t; )
    e.push(t), t = Object.getPrototypeOf(t);
  return e.pop(), e.pop(), e.reverse(), e;
}
function Y(r, e) {
  if (!r || !e)
    return [];
  const t = (w(r) || []).filter((n) => Object.hasOwn(n, e)).map((n) => n[e]);
  return Object.hasOwn(r, e) && t.push(r[e]), t;
}
function Z(r, e) {
  if (!r)
    return;
  const t = w(r);
  t.reverse();
  for (const n of t) {
    const o = n.prototype;
    if (o && Object.hasOwn(o, e))
      return o[e];
  }
}
function z(r) {
  const e = {};
  if (!r)
    return {};
  const t = w(r);
  t.push(j(r)), t.reverse();
  for (const n of t) {
    const o = n.prototype;
    [].concat(Object.getOwnPropertyNames(o)).concat(Object.getOwnPropertySymbols(o)).forEach((c) => {
      const s = o[c];
      !e[c] && typeof s == "function" && (e[c] = s);
    });
  }
  return e;
}
function P(r, e) {
  if (typeof r > "u" || typeof e > "u")
    return r;
  const t = y(r), n = D(e) ? e : v(e);
  return e && typeof e == "object" && [].concat(Object.keys(e)).concat(Object.getOwnPropertySymbols(e)).forEach((o) => {
    Object.defineProperty(t, o, {
      get() {
        return V(n[o]);
      },
      set() {
      },
      configurable: !0,
      enumerable: !0
    });
  }), r;
}
function ee(r, e) {
  const t = {};
  return e = e || {}, new Proxy(r || {}, {
    get(n, o) {
      return !t[o] && o in n ? n[o] : t[o] ? void 0 : e[o];
    },
    set(n, o, c) {
      return n[o] = c, delete t[o], !0;
    },
    defineProperty(n, o, c) {
      return Object.defineProperty(n, o, c), delete t[o], !0;
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
function te(...r) {
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
const a = {
  computed: I,
  getCurrentInstance: g,
  inject: N,
  onActivated: W,
  onBeforeMount: T,
  onBeforeUnmount: U,
  onBeforeUpdate: R,
  onDeactivated: S,
  onMounted: H,
  onRenderTracked: B,
  onRenderTriggered: x,
  onErrorCaptured: L,
  onServerPrefetch: M,
  onUnmounted: G,
  onUpdated: K,
  provide: q,
  ref: J,
  warn: Q,
  watch: m
};
function re(r, e) {
  var n;
  const t = (n = r.$) == null ? void 0 : n.proxy;
  if (typeof t[e] == "function")
    return t[e];
  throw new Error("Legacy function is not available with this Vue 3 build. Use @vue/compat instead!");
}
function ne(r) {
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
      return re(this, t);
    },
    enumerable: !1,
    configurable: !0
  })), e;
}
function we(r) {
  return r;
}
class oe {
  constructor() {
    h(this, "$");
    let e = g();
    Object.defineProperty(this, "$", {
      get: () => e,
      set: (t) => {
        e = t;
      },
      enumerable: !1,
      configurable: !0
    }), P(this, e == null ? void 0 : e.props), ne(this);
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
    return ((e = this.$) == null ? void 0 : e.n) || X.bind((t = this.$) == null ? void 0 : t.proxy);
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
    return typeof e == "string" ? m(() => this[e], t, n) : m(e, t, n);
  }
  setup() {
  }
  _getVueClassComponentOptions() {
    return [];
  }
}
const _e = oe, b = {
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
}, ce = Object.getOwnPropertyNames(b), $ = [
  ...ce,
  "data",
  "render"
];
function p(r) {
  return !ie(r);
}
function ie(r) {
  return !!(r && typeof r == "string" && $.indexOf(r) >= 0);
}
function se(r) {
  return function() {
    return r.value;
  };
}
function ae(r) {
  return function(t) {
    r.value = t;
  };
}
class _ {
  constructor(e) {
    h(this, "_component");
    h(this, "_hasBeenFinalised", !1);
    h(this, "_rawInstance");
    h(this, "_reactiveWrapper");
    h(this, "_watchersToCreate", []);
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
    typeof e == "object" ? (this._rawInstance = y(e), this._reactiveWrapper = v(this._rawInstance)) : (this._rawInstance = void 0, this._reactiveWrapper = void 0);
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
    return this._checkValidInstanceAndThrowError(), e ? (Object.getOwnPropertyNames(e || {}).filter(p).forEach((t) => {
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
    let e = (this._component && Y(this._component, "__vccOpts") || []).map((t) => t.__component_decorator_original_options).filter((t) => !!t);
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
      e.filter(p).forEach((n) => t[n] = a.inject(n));
    else if (typeof e == "object") {
      const n = [
        ...Object.getOwnPropertyNames(e),
        ...Object.getOwnPropertySymbols(e)
      ].filter(p);
      for (let o = 0; o < n.length; o++) {
        const c = n[o], s = e[c];
        let i, f = c;
        typeof s == "symbol" ? f = s : typeof s == "object" ? (f = s.from || f, i = s.default) : s && (f = String(s)), typeof i == "function" ? t[c] = a.inject(f, i, !0) : t[c] = a.inject(f, i, !1);
      }
    }
    return this;
  }
  provideData(e) {
    let t = e;
    return typeof e == "function" && (t = e.apply(this.reactiveWrapper)), typeof t == "object" && [
      ...Object.getOwnPropertyNames(t),
      ...Object.getOwnPropertySymbols(t)
    ].filter(p).forEach((n) => a.provide(n, t[n])), this;
  }
  registerLifeCycleHooks() {
    return this.registerAdditionalLifeCycleHooks(this.rawInstance);
  }
  registerAdditionalLifeCycleHooks(e) {
    this._checkValidInstanceAndThrowError();
    const t = e && y(e) || void 0;
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
      const n = Object.getOwnPropertyNames(e).filter(p).filter((o) => e && e[o]);
      for (const o of n) {
        let c = e[o];
        Array.isArray(c) || (c = [c]);
        const s = function(i, f) {
          return function() {
            return i[f];
          };
        }(this.reactiveWrapper, o);
        for (let i = 0; i < c.length; i++) {
          const f = c[i];
          if (typeof f == "function")
            a.watch(s, f.bind(t));
          else {
            let l, u, d = {};
            if (typeof f == "object" ? (d = f, typeof f.handler == "string" ? u = f.handler : l = f.handler) : typeof f == "string" && (u = f), !l && u) {
              if (u === o)
                throw new Error(`Invalid watcher defined!
                                    Can not watch on property ${o} and call same property on change!`);
              if (typeof this.rawInstance[u] != "function")
                throw new Error(`Invalid watcher defined!
                                    The named handler '${u}' for watched property '${o}'
                                    is no member function of the component instance!`);
              l = function(A) {
                return function(...E) {
                  return this[A].call(this, ...E);
                };
              }(u).bind(t);
            }
            if (l)
              try {
                a.watch(s, l, d);
              } catch (C) {
                console.error(`Failed to create watcher on property ${o}`, f, C);
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
      get: se(t).bind(this.reactiveWrapper),
      set: n ? ae(t).bind(this.reactiveWrapper) : void 0
    }), this;
  }
  _checkValidInstanceAndThrowError() {
    if (this._rawInstance === void 0)
      throw new Error("Failed to build component! No instance has been created yet. Please call 'createAndUseNewInstance()' first!");
  }
}
function O(r, e = {}) {
  e = e || {};
  const t = ue(r);
  e.computed = Object.assign({}, t, e.computed);
  const n = r.__decorators__;
  if (n && n.length > 0) {
    const s = e.methods || {}, i = z(r);
    e.methods = ee(s, i), n.forEach((f) => f(e)), e.methods = s;
  }
  le(r, e);
  const o = r;
  typeof e.beforeCreate == "function" && (typeof o.beforeCreate == "function" ? o.beforeCreate = te(o.beforeCreate, e.beforeCreate) : o.beforeCreate = e.beforeCreate), function(i, f) {
    i.prototype._getVueClassComponentOptions = function() {
      const u = Z(this, "_getVueClassComponentOptions");
      return (typeof u == "function" ? u() || [] : []).concat([f]);
    };
  }(r, e);
  const c = fe(o, e);
  if (c)
    o.__vccOpts = c;
  else
    throw new Error("Failed to create Vue class component options!");
  return o;
}
function fe(r, e = {}) {
  if (!r || !e)
    return;
  const n = {
    name: e.name || r._componentTag || r.name,
    setup: de(r),
    __component_decorator_original_options: e
  };
  return Object.defineProperty(n, "props", {
    get: he(r),
    configurable: !0,
    enumerable: !0
  }), Object.defineProperty(n, "components", {
    get: pe(r),
    configurable: !0,
    enumerable: !0
  }), n;
}
function ue(r) {
  const e = {}, t = r.prototype, n = [].concat(Object.getOwnPropertyNames(t)).concat(Object.getOwnPropertySymbols(t));
  for (const o of n) {
    if (o === "constructor" || o === "prototype" || typeof o == "string" && ($.indexOf(o) > -1 || o.startsWith("$")))
      return;
    const c = Object.getOwnPropertyDescriptor(t, o);
    e !== void 0 && (c == null ? void 0 : c.get) && (c == null ? void 0 : c.set) ? e[o] = {
      get: c.get,
      set: c.set
    } : e !== void 0 && (c == null ? void 0 : c.get) && (e[o] = c.get);
  }
  return e;
}
function le(r, e) {
  const t = r.prototype;
  return Object.getOwnPropertyNames((e == null ? void 0 : e.methods) || {}).filter((n) => typeof ((e == null ? void 0 : e.methods) || {})[n] == "function").forEach(function(n) {
    if (!(e != null && e.methods) || typeof e.methods[n] != "function")
      return;
    const o = e.methods[n];
    if (typeof t[n] == "function") {
      const c = t[n];
      t[n] = function(...s) {
        return c.apply(this, s), o.apply(this, s);
      };
    } else if (t[n] === void 0)
      t[n] = o;
    else
      throw new Error("A new function must not overwrite a non-function value");
  }), r;
}
function he(r) {
  const e = {};
  let t = !1;
  return function() {
    if (!t) {
      t = !0;
      const o = (new _(r).getOptionsForComponent() || []).map((c) => c.props).filter((c) => c != null);
      for (const c of o)
        Array.isArray(c) ? c.forEach((s) => {
          e[s] = {};
        }) : typeof c == "object" && Object.assign(e, c);
    }
    return e;
  };
}
function pe(r) {
  const e = {};
  let t = !1;
  return function() {
    if (!t) {
      t = !0;
      const o = (new _(r).getOptionsForComponent() || []).map((c) => c.components).filter((c) => c != null);
      for (const c of o)
        typeof c == "object" && Object.assign(e, c);
    }
    return e;
  };
}
function de(r) {
  return function(t, n) {
    const o = g() || {}, c = new _().setComponentClass(r).createAndUseNewInstance(), s = c.getOptionsForComponent();
    return s.forEach((i) => {
      typeof (i == null ? void 0 : i.beforeCreate) == "function" && i.beforeCreate.call(o);
    }), c.rawInstance.$ || (c.rawInstance.$ = o, P(c.rawInstance, (o == null ? void 0 : o.props) || t)), c.registerLifeCycleHooks(), s.forEach((i) => c.applyDataValues(i.data).createComputedValues(i.computed).injectData(i.inject).provideData(i.provide).registerAdditionalLifeCycleHooks(i).watcherForPropertyChange(i.watch)), typeof c.rawInstance.setup == "function" && c.rawInstance.setup.call(c.instance, c, t, n), s.forEach((i) => {
      typeof i.setup == "function" && i.setup.call(c.instance, c, t, n);
    }), typeof c.instance.created == "function" && c.instance.created(), c.build();
  };
}
function ye(r) {
  return typeof r == "function" ? O(r) : function(t) {
    return O(t, r);
  };
}
ye.registerHooks = function() {
};
function Ce(...r) {
  return r[0];
}
function Oe(r) {
  return function(t, n, o) {
    const c = typeof t == "function" ? t : t.constructor;
    c.__decorators__ || (c.__decorators__ = []), typeof o != "number" && (o = void 0), c.__decorators__.push((s) => r(s, n || Symbol(), o));
  };
}
export {
  $ as $internalHookNames,
  ce as $lifeCycleHookNames,
  ye as Component,
  a as CompositionApi,
  we as MixinCustomRender,
  _e as Vue,
  oe as VueComponentBaseImpl,
  ne as addLegacyRenderingFunctions,
  Oe as createDecorator,
  ye as default,
  ie as isInternalHookName,
  p as isNotInternalHookName,
  Ce as mixins
};
