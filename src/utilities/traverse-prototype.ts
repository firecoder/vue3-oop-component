/* eslint-disable @typescript-eslint/no-explicit-any */
export type AnyFunction = (...args: any[]) => any;

export type AnyInstance<T = any> = Record<string | symbol, T>;

// see: https://stackoverflow.com/questions/39392853/is-there-a-type-for-class-in-typescript-and-does-any-include-it
// https://github.com/angular/angular/blob/main/packages/core/src/interface/type.ts
export interface AnyClass<T = any> {
    new(...args: any[]): AnyInstance<T>;
    [prop: string | symbol]: unknown;
}

export function toClass<C>(clazz: AnyClass<C> | AnyInstance<C>): AnyClass<C> {
    // if "clazz" is an instance, then get the class definition of it
    if (!(clazz instanceof Function) && clazz instanceof Object) {
        return clazz.constructor as unknown as AnyClass<C>;
    } else {
        return clazz;
    }
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
    clazz = toClass(clazz);

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
 * Collects "static" property of all classes from the prototype chain.
 *
 * <p>
 *     "static" properties are not inherited down the prototype chain. Hence, this function helps to get a collection
 *     of the named property from all the classes in the prototype chain - a.k.a. from all parent classes and the
 *     child class.
 * </p>
 *
 * @param clazz the class to collect static property from and its prototype chain.
 * @param property the name or key of property to collect.
 */
export function collectStaticPropertyFromPrototypeChain<T>(
    clazz: AnyClass | AnyInstance,
    property: string | symbol,
): T[] {

    if (!clazz || !property) {
        return [];
    }

    const collectedProperties: T[] = (getAllBaseClasses(clazz) || [])
        .filter((parentClass) => Object.hasOwn(parentClass, property))
        .map((parentClass) => parentClass[property] as T)
    ;

    if (Object.hasOwn(clazz, property)) {
        collectedProperties.push(clazz[property] as T);
    }

    return collectedProperties;
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

    return collectStaticPropertyFromPrototypeChain<T>(clazz, funcName)
        .filter((propertyValue) => typeof propertyValue === "function")
    ;
}


/**
 * Get the named property from the parent instance.
 *
 * <p>
 *     Fetches the property from the nearest (first) parent that has such a property. This function is useful for
 *     dynamic chaining of classes and dynamic inheriting properties or functions.
 * </p>
 *
 * @param clazz the check its parents .
 * @param property the name of functions to collect.
 */
export function getPropertyFromParentClassDefinition<T>(
    clazz: AnyClass | AnyInstance,
    property: string | symbol,
): T | undefined {
    if (!clazz) {
        return undefined;
    }

    const allParentClasses = getAllBaseClasses(clazz);
    allParentClasses.reverse(); // because list starts with top class, not with immediate parent

    for (const parentClass of allParentClasses) {
        const parentClassDefinition = parentClass.prototype as Record<string | symbol, T>;
        if (parentClassDefinition && Object.hasOwn(parentClassDefinition, property)) {
            return parentClassDefinition[property];
        }
    }

    return undefined;
}


/**
 * Get all functions from the class.
 *
 * <p>
 *     Reads all properties of this class and all the base classes and returns all functions. For a method, only
 *     the child function is returned, if the child overwrites the method of the same name.
 * </p>
 *
 * @param clazz the check and its parents .
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function getInstanceMethodsFromClass(clazz: AnyClass | AnyInstance): Record<string | symbol, Function> {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const allMethods = {} as Record<string | symbol, Function>;
    if (!clazz) {
        return {};
    }

    const allClasses = getAllBaseClasses(clazz);
    allClasses.push(toClass(clazz));
    allClasses.reverse(); // because list starts with top class, not with immediate parent

    for (const parentClass of allClasses) {
        const parentClassDefinition = parentClass.prototype as Record<string | symbol, unknown>;
        ([] as (string | symbol)[])
            .concat(Object.getOwnPropertyNames(parentClassDefinition))
            .concat(Object.getOwnPropertySymbols(parentClassDefinition))
            .forEach((property) => {
                const method = parentClassDefinition[property];
                if (!allMethods[property] && typeof method === "function") {
                    allMethods[property] = method;
                }
            });
    }

    return allMethods;
}
