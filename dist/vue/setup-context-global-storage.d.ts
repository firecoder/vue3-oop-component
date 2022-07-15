import type { SetupContext } from "vue";
export declare function getCurrentSetupContext(): SetupContext<import("vue").EmitsOptions>;
export declare function setCurrentSetupContext(newContext: SetupContext | undefined): void;
export declare function clearCurrentSetupContext(): void;
