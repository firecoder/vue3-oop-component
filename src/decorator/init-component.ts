import type { CompatibleComponentOptions, Vue } from "../vue";

import { CompositionApi } from "../vue";
import { $internalHookNames } from "./life-cycle-hooks";

export function isNotInternalHookName(name: string | symbol): boolean {
    return name && (
        typeof name === "symbol" ||
        (typeof name === "string" && ($internalHookNames.indexOf(name) < 0))
    ) && true || false;
}

export function applyInjectsOnInstance(
    instance: Vue,
    injectDefinitions: CompatibleComponentOptions<Vue>["inject"],
): void {
    if (!instance) {
        return instance;
    }

    if (Array.isArray(injectDefinitions)) {
        injectDefinitions
            .filter(isNotInternalHookName)
            .forEach((propName) => instance[propName] = CompositionApi.inject(propName));

    } else if (typeof injectDefinitions === "object") {
        const injectPropertyIndexes = [
            ...Object.getOwnPropertyNames(injectDefinitions),
            ...Object.getOwnPropertySymbols(injectDefinitions),
        ].filter(isNotInternalHookName);

        for (let i=0; i < injectPropertyIndexes.length; i++) {
            const propName = injectPropertyIndexes[i];
            const injectSpec = injectDefinitions[propName];

            let defaultValue = undefined;
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
}
