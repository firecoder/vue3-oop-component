export type AnyFunction = (...args: any[]) => any;
export type AnyInstance<T = any> = Record<string | symbol, T>;
export interface AnyClass<T = any> extends Record<string | symbol, unknown> {
    new (...args: any[]): AnyInstance<T>;
}
export declare function toClass<C>(clazz: AnyClass<C> | AnyInstance<C>): AnyClass<C>;
/**
 * Returns a list of all base classes of the provided class.
 *
 * @param clazz the class to collect all base classes
 * @param includeThisClass (optional) if <code>true</code>, the provided class in <code>clazz</code> is added to the
 *     list, too.
 */
export declare function getAllBaseClasses<T>(clazz: AnyClass | AnyInstance, includeThisClass?: boolean): AnyClass<T>[];
/**
 * Collect a "static" property of parent classes, the top parent being first, immediate parent last.
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
export declare function collectStaticFunctionFromPrototypeChain<C, T = AnyFunction>(clazz: C & (AnyClass | AnyInstance), funcName: keyof C & (string | symbol)): T[];
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
export declare function getInstanceMethodsFromClass(clazz: AnyClass | AnyInstance): Record<string | symbol, Function>;
/**
 * Get the property descriptors for all (inherited) properties in the prototype chain.
 *
 * @param instance the instance to read all inherited properties for. If it is a class, all properties of this class
 *     that will be inherited to an instance are included, too.
 */
export declare function getAllInheritedPropertiesFromPrototypeChain(instance: AnyClass | AnyInstance): Record<string | symbol, PropertyDescriptor>;
/**
 * Get the keys of all current and inherited properties of the provided class.
 *
 * @param instance the instance to read all inherited properties for. If it is a class, all properties of this class
 *     that will be inherited to an instance are included, too.
 */
export declare function getAllInheritedPropertyKeys(instance: AnyClass | AnyInstance): (string | symbol)[];
