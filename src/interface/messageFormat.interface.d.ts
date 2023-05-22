export interface MessageFormat<T = never> {
    type: string,
    payload: T
}