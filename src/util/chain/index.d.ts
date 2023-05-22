import type { Chain } from "../../interface/chain/index.js";
import type { MessageFormat } from "../../interface/messageFormat.interface.js";
export declare abstract class messageActionChain<T> implements Chain<MessageFormat<T>> {
    private _next?;
    private type;
    constructor(type: string);
    setNextChain(next: Chain<MessageFormat<T>>): void;
    dispense(arg: MessageFormat<T>): void;
    protected abstract handle(arg: MessageFormat<T>): boolean;
}
//# sourceMappingURL=index.d.ts.map