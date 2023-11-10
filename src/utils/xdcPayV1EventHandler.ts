import { Contract } from 'xdc3-eth-contract';
import EventEmitter from 'eventemitter3';
import { TransactionReceipt } from 'xdc3-eth';
import { SKIP_ERRORS } from './Constants';
import { TransactionType } from '../interfaces/models/ITransaction';
import { debounce } from './debounce';

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
  eventEmitter: EventEmitter,
  type: TransactionType,
) => {
  /**
   * Block for XDC Pay.
   */
  contract.events.allEvents(
    debounce((eventData: any, receipt: TransactionReceipt) => {
      if (SKIP_ERRORS.includes(eventData?.code)) {
        return;
      }
      eventEmitter.emit('successTransaction', {
        type: type,
        receipt,
      });
      resolve(receipt.blockNumber);
    }, 500),
  );
};
