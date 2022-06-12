export type AnyFunction = (...args: any[]) => any;

export type AnyInstance<T = any> = Record<string | symbol, T>;

// see: https://stackoverflow.com/questions/39392853/is-there-a-type-for-class-in-typescript-and-does-any-include-it
// https://github.com/angular/angular/blob/main/packages/core/src/interface/type.ts
export interface AnyClass<T = any> {
    new(...args: any[]): AnyInstance<T>;
    [prop: string | symbol]: unknown;
}


/**
 * Returns a list of all base classes of the provided class.
 *
 * @param clazz the class to collect all base classes
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function getAllBaseClasses<T>(clazz: AnyClass | AnyInstance): AnyClass<T>[] {
    if (!clazz) {
        return [];
    }

    // traverse to the top parent
    const collectedClasses: AnyClass<T>[] = [ ];

    // if "clazz" is an instance, then get the class definition of it
    if (!(clazz instanceof Function) && clazz instanceof Object) {
        clazz = clazz.constructor as unknown as AnyClass<T>;
    }

    let parentClass = Object.getPrototypeOf(clazz);
    while (parentClass) {
        collectedClasses.push(parentClass);
        parentClass = Object.getPrototypeOf(parentClass);
    }

    // the last elements added are "null" and generic "Object". remove them
    collectedClasses.pop();
    collectedClasses.pop();

    collectedClasses.reverse();
    return collectedClasses;
}

/**
 * Collects "static" functions on classes from the prototype chain.
 *
 * @param clazz the class to collect static functions from and its prototype chain.
 * @param funcName the name of functions to collect.
 */
export function collectStaticFunctionFromPrototypeChain<T = AnyFunction>(
    clazz: AnyClass | AnyInstance,
    funcName: string,
): T[] {

    if (!clazz || !funcName) {
        return [];
    }

    const collectedFunctions: T[] = (getAllBaseClasses(clazz) || [])
        .filter((parentClass) => Object.hasOwn(parentClass, funcName))
        .map((parentClass) => parentClass[funcName] as T)
        .filter((func) => func && typeof func === "function")
    ;

    if (Object.hasOwn(clazz, funcName) && typeof clazz[funcName] === "function") {
        collectedFunctions.push(clazz[funcName]);
    }

    return collectedFunctions;
}
