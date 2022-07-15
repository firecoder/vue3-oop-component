import type { SetupContext } from "vue";

let currentSetupContext: SetupContext | undefined = undefined;

export function getCurrentSetupContext() {
    return currentSetupContext;
}

export function setCurrentSetupContext(newContext: SetupContext | undefined) {
    currentSetupContext = newContext;
}

export function clearCurrentSetupContext() {
    setCurrentSetupContext(undefined);
}
