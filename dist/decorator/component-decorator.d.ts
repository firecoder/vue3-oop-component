import type { CompatibleComponentOptions, Vue, VueClass } from "../vue";
import type { ComponentWithCustomSetup, VueClassComponent } from "./component-decorator-types";
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
declare function Component<V extends Vue>(options: CompatibleComponentOptions<V> & ThisType<V>): <VC extends VueClass<V>>(target: VC) => VC & VueClassComponent<V>;
declare function Component<VC extends ComponentWithCustomSetup>(target: VC): VC & VueClassComponent;
declare namespace Component {
    var registerHooks: () => void;
}
export { Component };
