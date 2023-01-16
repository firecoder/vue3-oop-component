vue3-oop-component
==================

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/vue-%3E=3.0.0-blue.svg)](https://vuejs.org/)

This is a drop-in replacement of [`vue-class-component`](https://github.com/vuejs/vue-class-component) for
[Vue 3](https://vuejs.org/). It seems as if the original project is dead [as there are no commit since 2020](https://github.com/vuejs/vue-class-component/commits/master).




Usage
------

As drop-in replacement, it follows the same syntax as `vue-class-component`. Therefore, you may want to consult
the [`vue-class-component` documentation](https://class-component.vuejs.org/) directly.

Most of the time, all you need to do is to change the import. Beware, that Vue 3 does not export any base class
as default export. Thus, either this import needs to be changed completely, or the (not recommended) the Vue 2
transition export be used instead.

```diff
--- a/MyComponent.vue	2023-01-14 15:23:01.000000000 +0100
+++ b/MyComponent.vue	2023-01-14 15:23:34.000000000 +0100
@@ -100,2 +100,2 @@
-import Vue       from "vue";
-import Component from "vue-component-decorator";
-
+import { Vue }   from "@nexxar/vue3-oop-component";
+import Component from "@nexxar/vue3-oop-component";
+
```

An example of the usage can be viewed [in the unit tests](./tree/main/test/vue/test-components/MessageTextAsDecoratedClass.vue). 


If you use the Vue 2 transition entry point of this package, then the import can be simplified to just change the
target package to import from.

```diff
--- a/MyComponent.vue	2023-01-14 15:23:01.000000000 +0100
+++ b/MyComponent.vue	2023-01-14 15:23:34.000000000 +0100
@@ -100,2 +100,2 @@
-import Vue       from "vue";
-import Component from "vue-component-decorator";
-
+import Vue       from "@nexxar/vue3-oop-component/vue2-transition";
+import Component from "@nexxar/vue3-oop-component";
+
```

For more changes required, see section [*Caveats*](caveats).


### More decorators to structure classes even better

It is advised to use [compagnion decorators](https://github.com/nexxar/vue3-oop-decorators) in order to complement
the class styled components. This decorator package is a repack of the widely known
[`vue-property-decorator`](https://github.com/kaorun343/vue-property-decorator) to make it work with Vue 3 and
this OOP component decorator.



### Building with Vite - how to enable inheritance

If you are using [Vite](https://vitejs.dev/) to build your project (recommended!), beware that Vite strips your
class constructor from the export of an (SFC) component. Als is left is the "setup" factory function. This has
implications when using OOP as the export does not contain the class but an intermediate factory function that you
can not inherit from. So, you should use the package
[`vite-plugin-vue-oop`](https://www.npmjs.com/package/@firecoder-com/vite-plugin-vue-oop) instead of the original
`vite-plugin-vue`. It is vital in order to bring inheritance to your components.



### Switch from Vue 2 to Vue 3 and vice-versa

This package implements support for Vue 3 only but it enables you to use your Vue 2 components with Vue 3. A 
transition package is available though, that just repacks the original `vue-component-decorator`. Hence, the only
thing you need to do, is to use a version 2.x of this package with Vue 2 and a version 3.x of this package with
Vue 3.


- use version 2.x of this package with Vue 2
- use version 3.x of this package with Vue 3




Motivation
----------

Everyone used to the class style components may continue to use the same style with Vue 3. Hence, components can be
seamlessly used with Vue 2 or Vue 3.



### No real support for classes in new Vue 3 component style

The new Vue 3 syntax does not block you from the use of a class as Vue component but does not support it either nor
enables inheritance, which is the very basic principle of
[OOP](https://en.wikipedia.org/wiki/Object-oriented_programming). Therefore, it requires a lot of boilerplate code
for every single class used as a component. This is, where this class decorator comes in handy to handle all those
gory details.



### Easy migration from original `vue-class-component` - just change imported package

Migration from Vue 2 components - that make use of `vue-class-component` and 
[`vue-property-decorator`](https://github.com/kaorun343/vue-property-decorator) - to the Vue 3 coding style requires
a complete rewrite of all components, which are already tested and working. It is really bad to trash working code
and replace it with untested replacements.

Using this package, all you need to do is to rewrite the imports. If you even want to avoid this, then you may
use [NPM overrides](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#overrides)
or [yarn selective dependency resolution](https://classic.yarnpkg.com/lang/en/docs/selective-version-resolutions/) 
along with [Vite's alias feature](https://vitejs.dev/config/shared-options.html#resolve-alias)
to rewrite the imports during build time. The package 
[`vue3-oop-decorators`](https://github.com/nexxar/vue3-oop-decorators) provide a good example of this technique.




### Continued usage of accustomed coding style

At least to me, the new way of writing Vue 3 components seems inferior to using classes and inheritance when it comes
to bigger projects. I see the point of using the new style for more-or-less beginners and for rapid prototyping -
for smaller projects. Nevertheless, an experienced programmer like me, trained with OOP in mind for years, may see
benefits in using a coding style that has been extensively tested and reasearched in Computer Science for decades. I
love Vue and even use it for bigger projects and it worked out perfectly so far. However, for big projects with a
big team you usually rely on component libraries to encapsule common behaviour. Vue 3 makes it hard to create such
libraries with OOP.

So, this package brings back the choice you had back in the days of Vue 2 - use classes or not.




Examples how to define Vue 3 components
---------------------------------------

There are several ways to define a component in Vue 3 and you may choose freely. All styles can be mixed within in a single project as the resulting Vue component is always the same. This decorator enhances your choice!

* [Component using this class decorator](./test/vue/test-components/MessageTextAsDecoratedClass.vue)
* [Component using plain class with boiler plate code](./test/vue/test-components/MessageTextAsClass.vue)
* [Component using "Options API" (no class)](./test/vue/test-components/MessageTextWithDefineComponent.vue) - see [Options API](https://guide.vueframework.com/api/options-api.html)
* [Component using Vue 3 "Composition API" (no class)](./test/vue/test-components/MessageTextWithScriptSetup.vue) - see ["Composition API"](https://vuejs.org/api/composition-api-setup.html)




Caveats
--------

Some features can not be re-implemented, as these have been removed from Vue 3. You need to review your components
and rewrite them to avoid relying on these features. The breaking changes are listed
[in the Vue 3 migration guide](https://v3-migration.vuejs.org/breaking-changes/). The most notable removed features are:

- [template filters](https://v3-migration.vuejs.org/breaking-changes/filters.html) have been overhauled.
- although compatibility in defining a [render function](https://v2.vuejs.org/v2/guide/render-function.html) 
    is maintained, the implementation of the function might need adaption to the
    [new render API](https://v3-migration.vuejs.org/breaking-changes/render-function-api.html).




Todo (missing features)
-----------------------

As this is still work in progress, some features are missing yet:

- mixins

Some features removed from Vue 3 might be better left unimplemented. Bringing them back has not been decided yet.

- [$on, $off, $once](https://v3-migration.vuejs.org/breaking-changes/events-api.html). 
- [$children](https://v3-migration.vuejs.org/breaking-changes/children.html)



