import type { CompatibleComponentOptions, Vue, VueClass, VueConstructor } from "../vue";
import type { VueClassComponent } from "./component-decorator-types";
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
declare function Component<V extends Vue = Vue>(options: CompatibleComponentOptions<V> & ThisType<V>): ((Component: VueClass<V>) => VueClassComponent<V>);
declare function Component<V extends Vue = Vue>(target?: VueConstructor<V>): VueClassComponent<V>;
declare namespace Component {
    var registerHooks: () => void;
}
export { Component };
