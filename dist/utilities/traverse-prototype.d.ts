export declare type AnyFunction = (...args: any[]) => any;
export declare type AnyInstance<T = any> = Record<string | symbol, T>;
export interface AnyClass<T = any> {
    new (...args: any[]): AnyInstance<T>;
    [prop: string | symbol]: unknown;
}
/**
 * Returns a list of all base classes of the provided class.
 *
 * @param clazz the class to collect all base classes
 */
export declare function getAllBaseClasses<T>(clazz: AnyClass | AnyInstance): AnyClass<T>[];
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
export declare function collectStaticPropertyFromPrototypeChain<T>(clazz: AnyClass | AnyInstance, property: string | symbol): T[];
/**
 * Collects "static" functions on classes from the prototype chain.
 *
 * @param clazz the class to collect static functions from and its prototype chain.
 * @param funcName the name of functions to collect.
 */
export declare function collectStaticFunctionFromPrototypeChain<T = AnyFunction>(clazz: AnyClass | AnyInstance, funcName: string): T[];
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
export declare function getPropertyFromParentClassDefinition<T>(clazz: AnyClass | AnyInstance, property: string | symbol): T | undefined;
