// taken and adapted from here:
// https://raw.githubusercontent.com/vuejs/vue-class-component/d54490bf603bfbff6dd50f967ba8bacbb76b2c5a/src/index.ts

import type { CompatibleComponentOptions, Vue, VueClass } from "../vue";
import type { ComponentWithCustomSetup, VueClassComponent } from "./component-decorator-types";
import { componentFactory } from "./component-decorator-factory";

/**
 * Decorate and prepare the class to be a Vue class component.
 *
 * <p>
 *     The {@code options} parameter is optional. Just do not use function notation to use the decorator without any
 *     options, like this: {@code Component} and NOT like this: {@code Component({}})}
 * </p>
 * @param options (optional) options to use to prepare the class.
 * @constructor the class to prepare as Vue component.
 */
function Component<V extends Vue>(
    options: CompatibleComponentOptions<V> & ThisType<V>,
): <VC extends VueClass<V>>(target: VC) => VC & VueClassComponent<V>;

function Component<VC extends ComponentWithCustomSetup>(target: VC): VC & VueClassComponent;
function Component(options: ComponentWithCustomSetup | CompatibleComponentOptions<Vue>): unknown {
    // the decorator is used without options directly as decorator function
    if (typeof options === "function") {
        const Component = options;
        return componentFactory(Component);
    }

    // options are provided, a TypeScript decorator function must be returned.
    return function ComponentDecorator(Component: VueClass<Vue>) {
        return componentFactory(Component, options);
    };
}

Component.registerHooks = function registerHooks(): void {
    // is not supported anymore and just available for compatibility purposes.
};

export { Component };
