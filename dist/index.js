var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { computed, getCurrentInstance, h, inject, onActivated, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onDeactivated, onMounted, onRenderTracked, onRenderTriggered, onErrorCaptured, onServerPrefetch, onUnmounted, onUpdated, provide, ref, warn, watch, toRaw, isReactive, reactive, unref, nextTick } from "vue";
const CompositionApi = {
  computed,
  getCurrentInstance,
  h,
  inject,
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onDeactivated,
  onMounted,
  onRenderTracked,
  onRenderTriggered,
  onErrorCaptured,
  onServerPrefetch,
  onUnmounted,
  onUpdated,
  provide,
  ref,
  warn,
  watch
};
function getFunctionFromCompatOrThrowError(vue, name) {
  var _a;
  const legayFunctions = (_a = vue.$) == null ? void 0 : _a.proxy;
  if (typeof legayFunctions[name] === "function") {
    return legayFunctions[name];
  }
  throw new Error("Legacy function is not available with this Vue 3 build. Use @vue/compat instead!");
}
function addLegacyRenderingFunctions(vue) {
  const target = vue;
  [
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
  ].forEach((name) => Object.defineProperty(target, name, {
    get: function() {
      return getFunctionFromCompatOrThrowError(this, name);
    },
    enumerable: false,
    configurable: true
  }));
  return target;
}
function MixinCustomRender(componentClass) {
  return componentClass;
}
function defineNewLinkedProperties(instance, newProperties) {
  if (typeof instance === "undefined" || typeof newProperties === "undefined") {
    return instance;
  }
  const rawInstance = toRaw(instance);
  const reactiveSource = isReactive(newProperties) ? newProperties : reactive(newProperties);
  if (newProperties && typeof newProperties === "object") {
    [].concat(Object.keys(newProperties)).concat(Object.getOwnPropertySymbols(newProperties)).forEach((key) => {
      Object.defineProperty(rawInstance, key, {
        get() {
          return unref(reactiveSource[key]);
        },
        set() {
        },
        configurable: true,
        enumerable: true
      });
    });
  }
  return instance;
}
function createProxyRedirectReads(writeTarget, readTargetIfMissingInWrite) {
  const deletedPropertyNames = {};
  readTargetIfMissingInWrite = readTargetIfMissingInWrite || {};
  return new Proxy(writeTarget || {}, {
    get(target, property) {
      if (!deletedPropertyNames[property] && property in target) {
        return target[property];
      } else if (!deletedPropertyNames[property]) {
        return readTargetIfMissingInWrite[property];
      } else {
        return void 0;
      }
    },
    set(target, property, value) {
      target[property] = value;
      delete deletedPropertyNames[property];
      return true;
    },
    defineProperty(target, property, attributes) {
      Object.defineProperty(target, property, attributes);
      delete deletedPropertyNames[property];
      return true;
    },
    deleteProperty(target, property) {
      delete target[property];
      if (property in readTargetIfMissingInWrite) {
        deletedPropertyNames[property] = true;
      }
      return true;
    },
    getOwnPropertyDescriptor(target, property) {
      if (!deletedPropertyNames[property] && Object.hasOwn(target, property)) {
        return Object.getOwnPropertyDescriptor(target, property);
      } else if (!deletedPropertyNames[property] && Object.hasOwn(readTargetIfMissingInWrite, property)) {
        return Object.getOwnPropertyDescriptor(readTargetIfMissingInWrite, property);
      } else {
        return void 0;
      }
    },
    has(target, property) {
      return !deletedPropertyNames[property] && (typeof property === "string" && Object.hasOwn(target, property) || readTargetIfMissingInWrite && Object.hasOwn(readTargetIfMissingInWrite, property));
    },
    ownKeys(target) {
      return Object.keys(target).concat(Object.keys(readTargetIfMissingInWrite || {})).filter((property) => !deletedPropertyNames[property]);
    }
  });
}
let currentSetupContext = void 0;
function getCurrentSetupContext() {
  return currentSetupContext;
}
function setCurrentSetupContext(newContext) {
  currentSetupContext = newContext;
}
function clearCurrentSetupContext() {
  setCurrentSetupContext(void 0);
}
class VueComponentBaseImpl {
  constructor() {
    __publicField(this, "$");
    __publicField(this, "_setupContext");
    let vueInstance = getCurrentInstance();
    let setupContext = getCurrentSetupContext();
    Object.defineProperty(this, "$", {
      get: () => vueInstance,
      set: (newValue) => {
        vueInstance = newValue;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(this, "_setupContext", {
      get: () => setupContext,
      set: (newValue) => {
        setupContext = newValue;
      },
      enumerable: false,
      configurable: true
    });
    defineNewLinkedProperties(this, vueInstance == null ? void 0 : vueInstance.props);
    addLegacyRenderingFunctions(this);
  }
  getSetupContext() {
    return this._setupContext;
  }
  get $el() {
    var _a, _b;
    return (_b = (_a = this.$) == null ? void 0 : _a.vnode) == null ? void 0 : _b.el;
  }
  get $attrs() {
    var _a;
    return (_a = this.$) == null ? void 0 : _a.attrs;
  }
  get $data() {
    var _a;
    return (_a = this.$) == null ? void 0 : _a.data;
  }
  get $emit() {
    var _a;
    return (_a = this.$) == null ? void 0 : _a.emit;
  }
  get $forceUpdate() {
    var _a;
    return ((_a = this.$) == null ? void 0 : _a.f) || (() => this.$nextTick(() => {
      var _a2;
      return (_a2 = this.$) == null ? void 0 : _a2.update();
    }));
  }
  get $nextTick() {
    var _a, _b;
    return ((_a = this.$) == null ? void 0 : _a.n) || nextTick.bind((_b = this.$) == null ? void 0 : _b.proxy);
  }
  get $parent() {
    var _a;
    return (_a = this.$) == null ? void 0 : _a.parent;
  }
  get $props() {
    var _a;
    return (_a = this.$) == null ? void 0 : _a.props;
  }
  get $options() {
    var _a;
    return ((_a = this.$) == null ? void 0 : _a.type) || {};
  }
  get $refs() {
    var _a;
    return (_a = this.$) == null ? void 0 : _a.refs;
  }
  get $root() {
    var _a;
    return (_a = this.$) == null ? void 0 : _a.root;
  }
  get $slots() {
    var _a;
    return (_a = this.$) == null ? void 0 : _a.slots;
  }
  $watch(source, cb, options) {
    if (typeof source === "string") {
      return watch(() => this[source], cb, options);
    } else {
      return watch(source, cb, options);
    }
  }
  setup() {
  }
  _getVueClassComponentOptions() {
    return [];
  }
}
function isVueClassInstance(instance) {
  return typeof instance === "object" && instance !== null && instance !== void 0 && instance instanceof Vue;
}
function isReservedPrefix(key) {
  return typeof key === "string" && key && (key[0] === "_" || key[0] === "$");
}
const Vue = VueComponentBaseImpl;
function toClass(clazz) {
  if (!(clazz instanceof Function) && clazz instanceof Object) {
    return clazz.constructor;
  } else {
    return clazz;
  }
}
function getAllBaseClasses(clazz, includeThisClass) {
  if (!clazz) {
    return [];
  }
  includeThisClass = !!includeThisClass;
  const collectedClasses = [];
  const childClass = toClass(clazz);
  let parentClass = Object.getPrototypeOf(childClass);
  while (parentClass) {
    collectedClasses.push(parentClass);
    parentClass = Object.getPrototypeOf(parentClass);
  }
  collectedClasses.pop();
  collectedClasses.pop();
  collectedClasses.reverse();
  if (includeThisClass) {
    collectedClasses.push(childClass);
  }
  return collectedClasses;
}
function collectStaticPropertyFromPrototypeChain(clazz, property) {
  if (!clazz || !property) {
    return [];
  }
  return (getAllBaseClasses(clazz, true) || []).filter((parentClass) => Object.hasOwn(parentClass, property)).map((parentClass) => parentClass[property]);
}
function getPropertyFromParentClassDefinition(clazz, property) {
  if (!clazz) {
    return void 0;
  }
  const allParentClasses = getAllBaseClasses(clazz, false);
  allParentClasses.reverse();
  for (const parentClass of allParentClasses) {
    const parentClassDefinition = parentClass.prototype;
    if (parentClassDefinition && Object.hasOwn(parentClassDefinition, property)) {
      return parentClassDefinition[property];
    }
  }
  return void 0;
}
function getInstanceMethodsFromClass(clazz) {
  const allMethods = {};
  if (!clazz) {
    return allMethods;
  }
  const allClasses = getAllBaseClasses(clazz, true);
  allClasses.reverse();
  for (const parentClass of allClasses) {
    const parentClassDefinition = parentClass.prototype;
    [].concat(Object.getOwnPropertyNames(parentClassDefinition)).concat(Object.getOwnPropertySymbols(parentClassDefinition)).forEach((property) => {
      const method = parentClassDefinition[property];
      if (!allMethods[property] && typeof method === "function") {
        allMethods[property] = method;
      }
    });
  }
  return allMethods;
}
function getAllInheritedPropertiesFromPrototypeChain(instance) {
  const allProperties = {};
  if (!instance) {
    return allProperties;
  }
  const allClasses = getAllBaseClasses(instance, true);
  for (const parentClass of allClasses) {
    const parentClassDefinition = Object.getOwnPropertyDescriptors(parentClass.prototype);
    delete parentClassDefinition["constructor"];
    Object.assign(allProperties, parentClassDefinition);
  }
  return allProperties;
}
function generateMultiFunctionWrapper(...wrappedFunctions) {
  wrappedFunctions = (wrappedFunctions || []).filter((func) => func && typeof func === "function");
  return function callAllWrappedFunctions(...args) {
    let returnValue;
    if (Array.isArray(wrappedFunctions) && wrappedFunctions.length > 0) {
      returnValue = wrappedFunctions[0].apply(this, args);
      for (let i = 1; i < wrappedFunctions.length; i++) {
        wrappedFunctions[i].apply(this, args);
      }
    }
    return returnValue;
  };
}
const $lifeCycleHookRegisterFunctions = {
  beforeCreate: () => void 0,
  created: () => void 0,
  beforeMount: function beforeMount(hook, target) {
    return CompositionApi.onBeforeMount(hook, target);
  },
  mounted: function mounted(hook, target) {
    return CompositionApi.onMounted(hook, target);
  },
  beforeDestroy: function beforeDestroy(hook, target) {
    return CompositionApi.onBeforeUnmount(hook, target);
  },
  beforeUnMount: function beforeUnMount(hook, target) {
    return CompositionApi.onBeforeUnmount(hook, target);
  },
  destroyed: function destroyed(hook, target) {
    return CompositionApi.onUnmounted(hook, target);
  },
  unmounted: function unmounted(hook, target) {
    return CompositionApi.onUnmounted(hook, target);
  },
  beforeUpdate: function beforeUpdate(hook, target) {
    return CompositionApi.onBeforeUpdate(hook, target);
  },
  updated: function updated(hook, target) {
    return CompositionApi.onUpdated(hook, target);
  },
  activated: function activated(hook, target) {
    return CompositionApi.onActivated(hook, target);
  },
  deactivated: function deactivated(hook, target) {
    return CompositionApi.onDeactivated(hook, target);
  },
  renderTracked: function render(hook, target) {
    return CompositionApi.onRenderTracked(hook, target);
  },
  renderTriggered: function render2(hook, target) {
    return CompositionApi.onRenderTriggered(hook, target);
  },
  errorCaptured: function errorCaptured(hook, target) {
    return CompositionApi.onErrorCaptured(hook, target);
  },
  serverPrefetch: function serverPrefetch(hook, target) {
    return CompositionApi.onServerPrefetch(hook, target);
  }
};
const $lifeCycleHookNames = Object.getOwnPropertyNames($lifeCycleHookRegisterFunctions);
const $internalHookNames = [
  ...$lifeCycleHookNames,
  "data",
  "render"
];
function isNotInternalHookName(name) {
  return !isInternalHookName(name);
}
function isInternalHookName(name) {
  return !!(name && typeof name === "string" && $internalHookNames.indexOf(name) >= 0);
}
function createReferenceGetterFunc(reference) {
  return function getValueFromReference() {
    return reference.value;
  };
}
function createReferenceSetterFunc(reference) {
  return function setValueToReference(newValue) {
    reference.value = newValue;
  };
}
class ComponentBuilderImpl {
  constructor(instanceOrClass) {
    __publicField(this, "_component");
    __publicField(this, "_hasBeenFinalised", false);
    __publicField(this, "_rawInstance");
    __publicField(this, "_reactiveWrapper");
    __publicField(this, "_watchersToCreate", []);
    if (typeof instanceOrClass === "function") {
      this.setComponentClass(instanceOrClass);
    } else if (typeof instanceOrClass === "object") {
      this.setComponentClass(instanceOrClass.constructor);
      this.instance = instanceOrClass;
    }
  }
  createAndUseNewInstance() {
    if (typeof this._component !== "function") {
      throw new Error("Failed to create new component! No class for the component has been provided.");
    }
    this.instance = new this._component();
    return this;
  }
  get componentClass() {
    var _a;
    return this._component || ((_a = this.rawInstance) == null ? void 0 : _a.constructor);
  }
  get instance() {
    return this.reactiveWrapper;
  }
  set instance(newInstance) {
    if (typeof newInstance === "object") {
      this._rawInstance = toRaw(newInstance);
      this._reactiveWrapper = reactive(this._rawInstance);
    } else {
      this._rawInstance = void 0;
      this._reactiveWrapper = void 0;
    }
  }
  get rawInstance() {
    return this._rawInstance;
  }
  get reactiveWrapper() {
    return this._reactiveWrapper;
  }
  build() {
    this._checkValidInstanceAndThrowError();
    if (this._hasBeenFinalised) {
      CompositionApi.warn(`ComponentBuilder's "build()" function has already been called!
                Calling a second time risks errors with watchers!`);
    }
    this._hasBeenFinalised = true;
    this._createAllWatchers();
    return createVueRenderContext(this.rawInstance, this.reactiveWrapper);
  }
  applyDataValues(dataValues) {
    this._checkValidInstanceAndThrowError();
    if (dataValues) {
      let data = {};
      if (typeof dataValues === "function") {
        data = dataValues.call(this.reactiveWrapper);
      } else if (typeof dataValues === "object") {
        data = dataValues;
      }
      if (data && typeof data === "object") {
        Object.getOwnPropertyNames(data).forEach((key) => Object.defineProperty(this.rawInstance, key, { value: data[key] }));
      }
    }
    return this;
  }
  createComputedValues(computedValues) {
    this._checkValidInstanceAndThrowError();
    if (!computedValues) {
      return this;
    }
    Object.getOwnPropertyNames(computedValues || {}).filter(isNotInternalHookName).forEach((key) => {
      const computedSpec = computedValues[key];
      if (typeof computedSpec === "function") {
        this._defineReactiveProperty(key, CompositionApi.computed(computedSpec.bind(this.reactiveWrapper)), false);
      } else if (computedSpec && typeof computedSpec === "object" && typeof computedSpec.get === "function" && typeof computedSpec.set === "function") {
        this._defineReactiveProperty(key, CompositionApi.computed({
          get: computedSpec.get.bind(this.reactiveWrapper),
          set: computedSpec.set.bind(this.reactiveWrapper)
        }), true);
      } else {
        const jsonDebug = JSON.stringify(computedSpec, void 0, 4);
        CompositionApi.warn(`Invalid "computed" specification for property ${key}: ${jsonDebug}`);
      }
    });
    return this;
  }
  getOptionsForComponent() {
    let allOptions = (this._component && collectStaticPropertyFromPrototypeChain(this._component, "__vccOpts") || []).map((vccOptions) => vccOptions.__component_decorator_original_options).filter((options) => !!options);
    if (!(allOptions == null ? void 0 : allOptions.length) && typeof this._component === "function") {
      const instance = new this._component();
      if (typeof instance._getVueClassComponentOptions === "function") {
        allOptions = (instance._getVueClassComponentOptions() || []).filter((options) => !!options);
      }
    }
    return allOptions || [];
  }
  injectData(injectDefinitions) {
    this._checkValidInstanceAndThrowError();
    const instance = this.reactiveWrapper;
    if (Array.isArray(injectDefinitions)) {
      injectDefinitions.filter(isNotInternalHookName).forEach((propName) => instance[propName] = CompositionApi.inject(propName));
    } else if (typeof injectDefinitions === "object") {
      const injectPropertyIndexes = [
        ...Object.getOwnPropertyNames(injectDefinitions),
        ...Object.getOwnPropertySymbols(injectDefinitions)
      ].filter(isNotInternalHookName);
      for (let i = 0; i < injectPropertyIndexes.length; i++) {
        const propName = injectPropertyIndexes[i];
        const injectSpec = injectDefinitions[propName];
        let defaultValue = void 0;
        let fromProvidedKey = propName;
        if (typeof injectSpec === "symbol") {
          fromProvidedKey = injectSpec;
        } else if (typeof injectSpec === "object") {
          fromProvidedKey = injectSpec.from || fromProvidedKey;
          defaultValue = injectSpec.default;
        } else if (injectSpec) {
          fromProvidedKey = String(injectSpec);
        }
        if (typeof defaultValue === "function") {
          instance[propName] = CompositionApi.inject(fromProvidedKey, defaultValue, true);
        } else {
          instance[propName] = CompositionApi.inject(fromProvidedKey, defaultValue, false);
        }
      }
    }
    return this;
  }
  provideData(providedValuesSpec) {
    let providedValues = providedValuesSpec;
    if (typeof providedValuesSpec === "function") {
      providedValues = providedValuesSpec.apply(this.reactiveWrapper);
    }
    if (typeof providedValues === "object") {
      [
        ...Object.getOwnPropertyNames(providedValues),
        ...Object.getOwnPropertySymbols(providedValues)
      ].filter(isNotInternalHookName).forEach((propName) => CompositionApi.provide(propName, providedValues[propName]));
    }
    return this;
  }
  registerLifeCycleHooks() {
    return this.registerAdditionalLifeCycleHooks(this.rawInstance);
  }
  registerAdditionalLifeCycleHooks(hookFunctions) {
    this._checkValidInstanceAndThrowError();
    const rawHookFunctions = hookFunctions && toRaw(hookFunctions) || void 0;
    if (rawHookFunctions) {
      Object.getOwnPropertyNames($lifeCycleHookRegisterFunctions).filter((hookName) => typeof rawHookFunctions[hookName] === "function").forEach((hookName) => $lifeCycleHookRegisterFunctions[hookName](rawHookFunctions[hookName].bind(this.reactiveWrapper), this.rawInstance.$));
    }
    return this;
  }
  setComponentClass(component) {
    this._component = component;
    return this;
  }
  watcherForPropertyChange(watchers) {
    if (watchers) {
      this._watchersToCreate.push(watchers);
    }
    return this;
  }
  _createAllWatchers() {
    while (Array.isArray(this._watchersToCreate) && this._watchersToCreate.length > 0) {
      try {
        this._performWatcherCreation(this._watchersToCreate.shift());
      } catch (error) {
        console.error("Failed to create watcher!", error);
      }
    }
    return this;
  }
  _performWatcherCreation(watchers) {
    this._checkValidInstanceAndThrowError();
    const reactiveInstance = this.reactiveWrapper;
    if (reactiveInstance && typeof watchers === "object") {
      const watchNames = Object.getOwnPropertyNames(watchers).filter(isNotInternalHookName).filter((watchName) => watchers && watchers[watchName]);
      for (const watchName of watchNames) {
        let watchSpecs = watchers[watchName];
        if (!Array.isArray(watchSpecs)) {
          watchSpecs = [watchSpecs];
        }
        const watchTarget = function(instance, propertyName) {
          return function getPropertyValueForWatcher() {
            return instance[propertyName];
          };
        }(this.reactiveWrapper, watchName);
        for (let i = 0; i < watchSpecs.length; i++) {
          const currentWatchSpec = watchSpecs[i];
          if (typeof currentWatchSpec === "function") {
            CompositionApi.watch(watchTarget, currentWatchSpec.bind(reactiveInstance));
          } else {
            let handler = void 0;
            let handlerName = void 0;
            let watchOptions = {};
            if (typeof currentWatchSpec === "object") {
              watchOptions = currentWatchSpec;
              if (typeof currentWatchSpec.handler === "string") {
                handlerName = currentWatchSpec.handler;
              } else {
                handler = currentWatchSpec.handler;
              }
            } else if (typeof currentWatchSpec === "string") {
              handlerName = currentWatchSpec;
            }
            if (!handler && handlerName) {
              if (handlerName === watchName) {
                throw new Error(`Invalid watcher defined!
                                    Can not watch on property ${watchName} and call same property on change!`);
              } else if (typeof this.rawInstance[handlerName] !== "function") {
                throw new Error(`Invalid watcher defined!
                                    The named handler '${handlerName}' for watched property '${watchName}'
                                    is no member function of the component instance!`);
              }
              handler = function createWatchHandler(propToCall) {
                return function watchHandlerAsName(...args) {
                  return this[propToCall].call(this, ...args);
                };
              }(handlerName).bind(reactiveInstance);
            }
            if (handler) {
              try {
                CompositionApi.watch(watchTarget, handler, watchOptions);
              } catch (error) {
                console.error(`Failed to create watcher on property ${watchName}`, currentWatchSpec, error);
              }
            } else {
              CompositionApi.warn(`No valid watch handler for property "${watchName}" has been provided.`);
            }
          }
        }
      }
    }
    return this;
  }
  _defineReactiveProperty(property, vueReference, hasSetter) {
    this._checkValidInstanceAndThrowError();
    if (property) {
      Object.defineProperty(this.rawInstance, property, {
        get: createReferenceGetterFunc(vueReference).bind(this.reactiveWrapper),
        set: hasSetter ? createReferenceSetterFunc(vueReference).bind(this.reactiveWrapper) : void 0
      });
    }
    return this;
  }
  _checkValidInstanceAndThrowError() {
    if (this._rawInstance === void 0) {
      throw new Error("Failed to build component! No instance has been created yet. Please call 'createAndUseNewInstance()' first!");
    }
  }
}
function createVueRenderContext(instance, reactiveProxy) {
  if (typeof instance === "object") {
    const inheritedProperties = getAllInheritedPropertiesFromPrototypeChain(instance);
    return new Proxy(reactiveProxy, {
      get(target, key) {
        const value = target[key];
        if (typeof value === "function") {
          return value.bind(target);
        } else {
          return value;
        }
      },
      getOwnPropertyDescriptor(target, key) {
        var _a;
        if (isReservedPrefix(key)) {
          return void 0;
        }
        return (_a = Object.getOwnPropertyDescriptor(target, key)) != null ? _a : Object.getOwnPropertyDescriptor(inheritedProperties, key);
      },
      has(target, key) {
        return !isReservedPrefix(key) && (key in target || key in inheritedProperties);
      },
      ownKeys(target) {
        return [].concat(Object.getOwnPropertyNames(target)).concat(Object.getOwnPropertySymbols(target)).concat(Object.getOwnPropertyNames(inheritedProperties)).concat(Object.getOwnPropertySymbols(inheritedProperties)).filter((key) => !isReservedPrefix(key));
      }
    });
  } else {
    throw new Error("Cannot create a proxy of a non-object instance!");
  }
}
function componentFactory(component, options = {}) {
  options = options || {};
  const computedProperties = getComputedValuesDefinitionFromComponentPrototype(component);
  options.computed = Object.assign({}, computedProperties, options.computed);
  const decorators = component.__decorators__;
  if (decorators && decorators.length > 0) {
    const originalMethods = options.methods || {};
    const classMethods = getInstanceMethodsFromClass(component);
    options.methods = createProxyRedirectReads(originalMethods, classMethods);
    decorators.forEach((decoratorFunction) => decoratorFunction(options));
    options.methods = originalMethods;
  }
  applyMethodsFromOptions(component, options);
  const classComponent = component;
  if (typeof options.beforeCreate === "function") {
    if (typeof classComponent.beforeCreate === "function") {
      classComponent.beforeCreate = generateMultiFunctionWrapper(classComponent.beforeCreate, options.beforeCreate);
    } else {
      classComponent.beforeCreate = options.beforeCreate;
    }
  }
  (function storeOptions(clazz, componentOptions) {
    clazz.prototype._getVueClassComponentOptions = function _getVueClassComponentOptions() {
      const parentFunc = getPropertyFromParentClassDefinition(this, "_getVueClassComponentOptions");
      const parentOptions = typeof parentFunc === "function" ? parentFunc() || [] : [];
      return parentOptions.concat([componentOptions]);
    };
  })(component, options);
  const vccOptions = createVccOptions(classComponent, options);
  if (!vccOptions) {
    throw new Error("Failed to create Vue class component options!");
  } else {
    classComponent.__vccOpts = vccOptions;
  }
  return classComponent;
}
function createVccOptions(component, options = {}) {
  if (!component || !options) {
    return void 0;
  }
  const name = options.name || component._componentTag || component.name;
  const vccOpts = {
    name,
    setup: generateSetupFunction(component),
    __component_decorator_original_options: options,
    __component_class: component
  };
  Object.defineProperty(vccOpts, "props", {
    get: generateGetterForProperties(component),
    configurable: true,
    enumerable: true
  });
  Object.defineProperty(vccOpts, "components", {
    get: generateGetterForComponents(component),
    configurable: true,
    enumerable: true
  });
  vccOpts.render = function customRenderHook(...args) {
    var _a, _b;
    let componentInstance = (args || []).filter((arg) => isVueClassInstance(arg)).shift() || void 0;
    if (!isVueClassInstance(componentInstance)) {
      const renderContext = args[0];
      componentInstance = (_a = renderContext == null ? void 0 : renderContext.$) == null ? void 0 : _a.setupState;
    }
    if (isVueClassInstance(componentInstance)) {
      if (typeof componentInstance.render === "function") {
        return componentInstance.render.call(componentInstance, CompositionApi.h, componentInstance._setupContext);
      } else {
        const stopLoopMarker = ((_b = args[args.length - 1]) == null ? void 0 : _b.isParentRenderFunctionCalled) ? args.pop() : void 0;
        let allVccOpts = stopLoopMarker == null ? void 0 : stopLoopMarker.remainingParentsToTry;
        if (!Array.isArray(allVccOpts)) {
          allVccOpts = collectStaticPropertyFromPrototypeChain(componentInstance, "__vccOpts");
          allVccOpts = (allVccOpts || []).filter((vccOpts2) => typeof (vccOpts2 == null ? void 0 : vccOpts2.render) === "function");
          allVccOpts.reverse();
        }
        const parentRenderFunction = (allVccOpts || []).map((vccOpts2) => vccOpts2.render).filter((renderFunc) => typeof renderFunc === "function").shift();
        if (typeof parentRenderFunction === "function") {
          (allVccOpts || []).shift();
          return parentRenderFunction.apply(this, [...args, {
            isParentRenderFunctionCalled: true,
            remainingParentsToTry: allVccOpts || []
          }]);
        }
      }
    }
  };
  return vccOpts;
}
function getComputedValuesDefinitionFromComponentPrototype(component) {
  const allComputedValues = {};
  const proto = component.prototype;
  const allPropertyKeys = [].concat(Object.getOwnPropertyNames(proto)).concat(Object.getOwnPropertySymbols(proto));
  for (const key of allPropertyKeys) {
    if (key === "constructor" || key === "prototype") {
      return;
    }
    if (typeof key === "string" && ($internalHookNames.indexOf(key) > -1 || key.startsWith("$"))) {
      return;
    }
    const descriptor = Object.getOwnPropertyDescriptor(proto, key);
    if (allComputedValues !== void 0 && (descriptor == null ? void 0 : descriptor.get) && (descriptor == null ? void 0 : descriptor.set)) {
      allComputedValues[key] = {
        get: descriptor.get,
        set: descriptor.set
      };
    } else if (allComputedValues !== void 0 && (descriptor == null ? void 0 : descriptor.get)) {
      allComputedValues[key] = descriptor.get;
    }
  }
  return allComputedValues;
}
function applyMethodsFromOptions(component, options) {
  const proto = component.prototype;
  Object.getOwnPropertyNames((options == null ? void 0 : options.methods) || {}).filter((methodName) => typeof ((options == null ? void 0 : options.methods) || {})[methodName] === "function").forEach(function(methodName) {
    if (!(options == null ? void 0 : options.methods) || typeof options.methods[methodName] !== "function") {
      return;
    }
    const newFunction = options.methods[methodName];
    if (typeof proto[methodName] === "function") {
      const originalFunction = proto[methodName];
      proto[methodName] = function(...args) {
        originalFunction.apply(this, args);
        return newFunction.apply(this, args);
      };
    } else if (proto[methodName] === void 0) {
      proto[methodName] = newFunction;
    } else {
      throw new Error("A new function must not overwrite a non-function value");
    }
  });
  return component;
}
function generateGetterForProperties(component) {
  const propertiesDefinition = {};
  let isInitialised = false;
  return function readPropertiesDefinition() {
    if (!isInitialised) {
      isInitialised = true;
      const allPropDefinitions = (new ComponentBuilderImpl(component).getOptionsForComponent() || []).map((options) => options["props"]).filter((value) => value !== void 0 && value !== null);
      for (const propDef of allPropDefinitions) {
        if (Array.isArray(propDef)) {
          propDef.forEach((propertyName) => {
            propertiesDefinition[propertyName] = {};
          });
        } else if (typeof propDef === "object") {
          Object.assign(propertiesDefinition, propDef);
        }
      }
    }
    return propertiesDefinition;
  };
}
function generateGetterForComponents(component) {
  const importedComponents = {};
  let isInitialised = false;
  return function readComponentsDefinition() {
    if (!isInitialised) {
      isInitialised = true;
      const allComponentsDefinitions = (new ComponentBuilderImpl(component).getOptionsForComponent() || []).map((options) => options["components"]).filter((value) => value !== void 0 && value !== null);
      for (const componentsDef of allComponentsDefinitions) {
        if (typeof componentsDef === "object") {
          Object.assign(importedComponents, componentsDef);
        }
      }
    }
    return importedComponents;
  };
}
function generateSetupFunction(component) {
  return function setupClassComponent(properties, context) {
    setCurrentSetupContext(context);
    const vueComponentInternalInstance = CompositionApi.getCurrentInstance() || {};
    const builder = new ComponentBuilderImpl().setComponentClass(component).createAndUseNewInstance();
    const allOptions = builder.getOptionsForComponent();
    allOptions.forEach((options) => {
      if (typeof (options == null ? void 0 : options.beforeCreate) === "function") {
        options.beforeCreate.call(vueComponentInternalInstance);
      }
    });
    builder.rawInstance.$ = vueComponentInternalInstance;
    defineNewLinkedProperties(builder.rawInstance, (vueComponentInternalInstance == null ? void 0 : vueComponentInternalInstance.props) || properties);
    addLegacyRenderingFunctions(builder.rawInstance);
    builder.rawInstance._setupContext = context;
    builder.registerLifeCycleHooks();
    allOptions.forEach((options) => builder.applyDataValues(options.data).createComputedValues(options.computed).injectData(options.inject).provideData(options.provide).registerAdditionalLifeCycleHooks(options).watcherForPropertyChange(options.watch));
    if (typeof builder.rawInstance.setup === "function") {
      builder.rawInstance.setup.call(builder.instance, builder, properties, context);
    }
    allOptions.forEach((options) => {
      if (typeof options.setup === "function") {
        options.setup.call(builder.instance, builder, properties, context);
      }
    });
    if (typeof builder.instance.created === "function") {
      builder.instance.created();
    }
    clearCurrentSetupContext();
    return builder.build();
  };
}
function Component(options) {
  if (typeof options === "function") {
    const Component2 = options;
    return componentFactory(Component2);
  }
  return function ComponentDecorator(Component2) {
    return componentFactory(Component2, options);
  };
}
Component.registerHooks = function registerHooks() {
};
function mixins(...Constructors) {
  return Constructors[0];
}
function createDecorator(callback) {
  return function CreatedVueDecorator(target, key, index) {
    const ConstructorFunc = typeof target === "function" ? target : target.constructor;
    if (!ConstructorFunc.__decorators__) {
      ConstructorFunc.__decorators__ = [];
    }
    if (typeof index !== "number") {
      index = void 0;
    }
    ConstructorFunc.__decorators__.push((options) => callback(options, key || Symbol(), index));
  };
}
export {
  $internalHookNames,
  $lifeCycleHookNames,
  Component,
  CompositionApi,
  MixinCustomRender,
  Vue,
  VueComponentBaseImpl,
  addLegacyRenderingFunctions,
  createDecorator,
  Component as default,
  isInternalHookName,
  isNotInternalHookName,
  isReservedPrefix,
  isVueClassInstance,
  mixins
};
