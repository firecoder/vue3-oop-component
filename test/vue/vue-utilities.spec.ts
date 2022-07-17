import { describe, expect, it } from "vitest";
import { isVueClassInstance, Vue } from "../../src/vue";

describe("Vue:", () => {
    it("isVueClassInstance(): check true instance", () => {
        class SomeComponent extends Vue { }
        expect(isVueClassInstance(new SomeComponent())).toBeTruthy();
    });

    it("isVueClassInstance(): check class", () => {
        class SomeComponent extends Vue { }
        expect(isVueClassInstance(SomeComponent)).toBeFalsy();
    });

    it("isVueClassInstance(): check any instance", () => {
        class AnyClass { }
        expect(isVueClassInstance(new AnyClass())).toBeFalsy();
    });

    it("isVueClassInstance(): check a proxy of a Vue instance", () => {
        class SomeComponent extends Vue { }
        const proxy = new Proxy(new SomeComponent(), {});
        expect(isVueClassInstance(proxy)).toBeTruthy();
    });

    it("isVueClassInstance(): check shallow clone of a Vue instance", () => {
        class SomeComponent extends Vue { }
        const clonedInstance = Object.assign({}, new SomeComponent());

        expect(clonedInstance.isTypescriptClassBased).toBeUndefined();
        expect(isVueClassInstance(clonedInstance)).toBeFalsy();
    });
});
