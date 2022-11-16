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
export function generateMultiFunctionWrapper(...wrappedFunctions: ((...args: unknown[]) => unknown)[]) {
    wrappedFunctions = (wrappedFunctions || []).filter((func) => func && typeof func === "function");

    return function callAllWrappedFunctions(this: unknown,  ...args: unknown[]): unknown {
        let returnValue;
        if (Array.isArray(wrappedFunctions) && wrappedFunctions.length > 0) {
            returnValue = wrappedFunctions[0].apply(this, args);
            for (let i=1; i < wrappedFunctions.length; i++) {
                wrappedFunctions[i].apply(this, args);
            }
        }
        return returnValue;
    };
}
