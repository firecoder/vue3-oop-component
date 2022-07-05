/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { VueClassComponent } from "../../src/decorator/component-decorator-types";

import { describe, expect, it, vi } from "vitest";
import { ComponentBuilderImpl } from "../../src/decorator/ComponentBuilderImpl";
import { Vue} from "../../src/vue";

describe("builder:", () => {
    describe("getOptionsForComponent()", async () => {
        it ("get options for component without parent", () => {
            const constructorSpy = vi.fn();

            class ComponentClass {
                public message = "";
                public constructor() {
                    constructorSpy();
                }

                static __vccOpts = {
                    props: {
                        message: "string",
                    },
                    __component_decorator_original_options: {
                        props: ["message"],
                    },
                } as VueClassComponent<ComponentClass>["__vccOpts"];
            }

            const builder = new ComponentBuilderImpl(ComponentClass);
            const options = builder.getOptionsForComponent();

            expect(options).not.toBeUndefined();
            expect(Array.isArray(options)).toBeTruthy();
            expect(options.length).toEqual(1);
            expect(options).toEqual([ComponentClass.__vccOpts.__component_decorator_original_options]);
            expect(constructorSpy).not.toHaveBeenCalled();
        });

        it ("get dynamically assigned options for component without parent", () => {
            class ComponentClass {
                public message = "";
            }
            const DynamicComponentClass = (ComponentClass as VueClassComponent<ComponentClass>);
            DynamicComponentClass.__vccOpts = {
                props: {
                    message: "string",
                },
                __component_decorator_original_options: {
                    props: ["message"],
                },
            } as VueClassComponent<ComponentClass>["__vccOpts"];

            const options = new ComponentBuilderImpl(DynamicComponentClass).getOptionsForComponent();

            expect(options).not.toBeUndefined();
            expect(Array.isArray(options)).toBeTruthy();
            expect(options.length).toEqual(1);
            expect(options).toEqual([DynamicComponentClass.__vccOpts.__component_decorator_original_options]);
        });

        it ("get options for component with a parent", () => {
            class ParentComponentClass {
                public messageParent = "";
                static __vccOpts = {
                    props: {
                        messageParent: "string",
                    },
                    __component_decorator_original_options: {
                        props: ["messageParent"],
                    },
                } as VueClassComponent<ParentComponentClass>["__vccOpts"];
            }

            class ComponentClass extends ParentComponentClass {
                public message = "";
                static __vccOpts = {
                    props: {
                        message: "string",
                        messageParent: "string",
                    },
                    __component_decorator_original_options: {
                        props: ["message"],
                    },
                } as (
                    VueClassComponent<ComponentClass>["__vccOpts"]
                    & VueClassComponent<ParentComponentClass>["__vccOpts"]
                );
            }

            const builder = new ComponentBuilderImpl(ComponentClass);
            const options = builder.getOptionsForComponent();

            expect(options).not.toBeUndefined();
            expect(Array.isArray(options)).toBeTruthy();
            expect(options.length).toEqual(2);
            expect(options).toEqual([
                ParentComponentClass.__vccOpts.__component_decorator_original_options,
                ComponentClass.__vccOpts.__component_decorator_original_options,
            ]);
        });

        it ("get options for component with a non-component parent", () => {
            class ParentComponentClass {
            }

            class ComponentClass extends ParentComponentClass {
                public message = "";
                static __vccOpts = {
                    props: {
                        message: "string",
                        messageParent: "string",
                    },
                    __component_decorator_original_options: {
                        props: ["message"],
                    },
                } as VueClassComponent<ComponentClass>["__vccOpts"];
            }

            const options = new ComponentBuilderImpl(ComponentClass).getOptionsForComponent();
            expect(options).not.toBeUndefined();
            expect(Array.isArray(options)).toBeTruthy();
            expect(options.length).toEqual(1);
            expect(options).toEqual([ComponentClass.__vccOpts.__component_decorator_original_options]);
        });

        it ("get options from parent of component only", () => {
            class ParentComponentClass {
                public messageParent = "";
                static __vccOpts = {
                    props: {
                        messageParent: "string",
                    },
                    __component_decorator_original_options: {
                        props: ["messageParent"],
                    },
                } as VueClassComponent<ParentComponentClass>["__vccOpts"];
            }

            class ComponentClass extends ParentComponentClass {
                public message = "";
            }

            const builder = new ComponentBuilderImpl(ComponentClass);
            const options = builder.getOptionsForComponent();

            expect(options).not.toBeUndefined();
            expect(Array.isArray(options)).toBeTruthy();
            expect(options.length).toEqual(1);
            expect(options).toEqual([ParentComponentClass.__vccOpts.__component_decorator_original_options]);
        });

        it ("get options of non-component returns empty array", () => {
            class ParentClass {
            }

            class ChildClass extends ParentClass {
                public message = "";
            }

            const builder = new ComponentBuilderImpl(ChildClass);
            const options = builder.getOptionsForComponent();

            expect(options).not.toBeUndefined();
            expect(Array.isArray(options)).toBeTruthy();
            expect(options.length).toEqual(0);
        });

        it ("get options for component from instance instead of class", () => {
            const componentOptions = {
                props: ["message"],
            };

            const constructorSpy = vi.fn();
            class ComponentClassWithoutStaticOptions extends Vue {
                public message = "";
                public constructor() {
                    super();
                    constructorSpy();
                }
                public _getVueClassComponentOptions() {
                    return (super._getVueClassComponentOptions() || []).concat([componentOptions]);
                }
            }

            const options = new ComponentBuilderImpl(ComponentClassWithoutStaticOptions).getOptionsForComponent();

            expect(options).not.toBeUndefined();
            expect(Array.isArray(options)).toBeTruthy();
            expect(options.length).toEqual(1);
            expect(options).toEqual([componentOptions]);
            expect(constructorSpy).toHaveBeenCalledOnce();
        });
    });
});
