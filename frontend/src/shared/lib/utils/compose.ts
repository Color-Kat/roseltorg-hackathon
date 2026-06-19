type Function<T> = (arg: T) => T;

/**
 * Composes multiple wrapper functions into a single function.
 * Executes from right to left (standard mathematical composition).
 * * Usage: compose(withPWA, withAnalyzer)(config)
 */
export function compose<T>(...functions: Function<T>[]): Function<T> {
    return (initialValue: T) =>
        functions.reduceRight((value, func) => func(value), initialValue);
}