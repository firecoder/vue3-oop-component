/**
 * Generate a wrapper function that calls all passed-in functions with the same arguments.
 *
 * <p>
 *     The first function to call defines the return value for the function wrapper.
 * </p>
 *
 * @param wrappedFunctions all the wrapped functions to call with the received arguments.
 * @return a function to wrap all the other once, calling each of them if executed.
 */
export declare function generateMultiFunctionWrapper(...wrappedFunctions: ((...args: unknown[]) => unknown)[]): (this: unknown, ...args: unknown[]) => unknown;
