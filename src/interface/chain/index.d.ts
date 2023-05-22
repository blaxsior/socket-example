export interface Chain<T> {
    setNextChain(next: Chain<T>): void;
    dispense(arg: T): void;
}