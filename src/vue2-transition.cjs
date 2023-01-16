const Vue3 = require("vue");
const Vue2Transition = require("./vue/index");


// make this module compatible with ESM
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });

// re-export all importes
Object.getOwnProperties(Vue3).forEach(function (name) { exports[name] = Vue3[name]; });
Object.getOwnProperties(Vue2Transition).forEach(function (name) { exports[name] = Vue2Transition[name]; });


// Vue 3 does not provide any default export anymore
exports.default = Vue2Transition.Vue;
