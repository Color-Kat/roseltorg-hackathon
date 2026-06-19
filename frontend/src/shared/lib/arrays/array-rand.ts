export const arrayRand = <T>(
    array: T[],
    returnValue = true
): T | number => {
    const index = Math.floor(Math.random()*array.length);

    if(!returnValue) return index;
    else return array[index]
}
