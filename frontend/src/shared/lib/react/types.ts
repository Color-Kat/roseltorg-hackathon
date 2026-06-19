export type SetState<T> =  React.Dispatch<React.SetStateAction<T>>
export type Fn<T extends any[], R> = (...args: T) => R;
