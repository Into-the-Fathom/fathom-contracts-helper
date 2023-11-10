import { Contract } from 'xdc3-eth-contract';
import EventEmitter from 'eventemitter3';
import { TransactionType } from '../interfaces/models/ITransaction';
/**
 * Xdc pay v1 is not resolve after send transaction. We need to catch
 * @param contract
 * @param resolve
 * @param eventEmitter
 * @param type
 */
export declare const xdcPayV1EventHandler: (contract: Contract, resolve: (value: number | Error | PromiseLike<number | Error>) => void, eventEmitter: EventEmitter, type: TransactionType) => void;
//# sourceMappingURL=xdcPayV1EventHandler.d.ts.map