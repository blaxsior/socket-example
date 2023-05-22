import type { Chain } from "../../interface/chain/index.js";
import type { MessageFormat } from "../../interface/messageFormat.interface.js";

export abstract class messageActionChain<T> implements Chain<MessageFormat<T>> {
    private _next?: Chain<MessageFormat<T>>;
    private type: string;

    constructor(type: string) {
        this.type = type;
    }

    setNextChain(next: Chain<MessageFormat<T>>): void {
        this._next = next;
    }

    dispense(arg: MessageFormat<T>): void {
        const condition = this.handle(arg);
        if(!condition && this._next != null) {
            this._next.dispense(arg);
        }
    }
    protected abstract handle(arg: MessageFormat<T>) : boolean;
}