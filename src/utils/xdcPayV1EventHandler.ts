import { Contract, EventData } from 'xdc3-eth-contract';
import EventEmitter from 'eventemitter3';
import { TransactionType } from '../interfaces/models/ITransaction';

/**
 * Xdc pay v1 is not resolve after send transaction. We need to catch
 * @param contract
 * @param resolve
 * @param eventEmitter
 * @param type
 */
export const xdcPayV1EventHandler = (
  contract: Contract,
  resolve: (value: number | Error | PromiseLike<number | Error>) => void,
  reject: (reason?: any) => void,
  eventEmitter: EventEmitter,
  type: TransactionType,
) => {
  /**
   * Block for XDC Pay.
   */
  contract.once('allEvents', (error: Error, event: EventData) => {
    if (error) {
      eventEmitter.emit('errorTransaction', {
        type,
        error,
      });
      return reject(error);
    }
    eventEmitter.emit('successTransaction', {
      type,
      event,
    });
    resolve(event.blockNumber);
  });
};
