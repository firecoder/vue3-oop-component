import type { CompatibleComponentOptions, Constructor, DecoratedClass, PropOptions } from "../../src";

import { describe, expect, it } from "vitest";
import { createDecorator, Component, Vue } from "../../src";

// taken from here: https://github.com/kaorun343/vue-property-decorator/blob/master/src/decorators/Prop.ts
type TOptions = PropOptions | Constructor[] | Constructor;
export function Prop(options: TOptions = {}) {
    return (target: Vue, key: string) => {
        createDecorator((componentOptions: CompatibleComponentOptions<Vue>, k: string | symbol) => {
            componentOptions.props = componentOptions.props || {};
            (componentOptions.props as unknown as Record<string | symbol, TOptions>)[k] = options;
        })(target, key);
    };
}


describe("Vue:", () => {
    // target.constructor as DecoratedClass
    describe("Decorators",() => {
        @Component
        class ParentClass extends Vue {
            @Prop()
            public parentProp?: string;
        }

        @Component
        class ChildClass extends ParentClass {
            @Prop()
            public childProp?: string;
        }

        @Component
        class AnotherChildClass extends ParentClass {
            @Prop()
            public anotherChildProp?: string;
        }

        it("Decorators in child components are separated from base component.",() => {
            const decoratorsInParentClass = (ParentClass.prototype.constructor as DecoratedClass).__decorators__;
            expect(decoratorsInParentClass).not.to.be.undefined;
            expect(decoratorsInParentClass?.length).to.eq(1, "child decorators are stored in parent class");

            const decoratorsInChildClass = (ChildClass.prototype.constructor as DecoratedClass).__decorators__;
            expect(decoratorsInChildClass).not.to.be.undefined;
            expect(decoratorsInChildClass?.length).to.eq(1);

            const decoratorsInAnotherChildClass = (AnotherChildClass.prototype.constructor as DecoratedClass).__decorators__;
            expect(decoratorsInAnotherChildClass).not.to.be.undefined;
            expect(decoratorsInAnotherChildClass?.length).to.eq(1);
        });

        it("Property decorator separates properties in child from base component.",() => {
            expect(ParentClass.prototype._getVueClassComponentOptions().length).eq(1);
            expect(ChildClass.prototype._getVueClassComponentOptions().length).eq(2);
            expect(AnotherChildClass.prototype._getVueClassComponentOptions().length).eq(2);

            const parentPropertyOptions = ParentClass.prototype._getVueClassComponentOptions()[0].props;
            expect(parentPropertyOptions).not.to.be.undefined;
            expect(Object.getOwnPropertyNames(parentPropertyOptions)).not.to.be.undefined;
            expect(Object.getOwnPropertyNames(parentPropertyOptions).length).to
                .eq(1, `child properties are included in parent properties: ${JSON.stringify(parentPropertyOptions)}`);
            expect(Object.getOwnPropertyNames(parentPropertyOptions)).to.contain("parentProp");

            const childPropertyOptions = ChildClass.prototype._getVueClassComponentOptions()[1].props;
            expect(Object.getOwnPropertyNames(childPropertyOptions).length).to
                .eq(1, `parent or other child properties are included in child properties: ${JSON.stringify(childPropertyOptions)}`);
            expect(Object.getOwnPropertyNames(childPropertyOptions)).to.contain("childProp");

            const anotherChildPropertyOptions = AnotherChildClass.prototype._getVueClassComponentOptions()[1].props;
            expect(Object.getOwnPropertyNames(anotherChildPropertyOptions).length).to
                .eq(1, `parent or other child properties are included in child properties: ${JSON.stringify(anotherChildPropertyOptions)}`);
            expect(Object.getOwnPropertyNames(anotherChildPropertyOptions)).to.contain("anotherChildProp");
        });

    });
});
