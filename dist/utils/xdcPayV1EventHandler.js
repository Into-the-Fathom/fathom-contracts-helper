import { SKIP_ERRORS } from './Constants';
import { debounce } from './debounce';
/**
 * Xdc pay v1 is not resolve after send transaction. We need to catch
 * @param contract
 * @param resolve
 * @param eventEmitter
 * @param type
 */
export const xdcPayV1EventHandler = (contract, resolve, eventEmitter, type) => {
    /**
     * Block for XDC Pay.
     */
    contract.events.allEvents(debounce((eventData, receipt) => {
        if (SKIP_ERRORS.includes(eventData === null || eventData === void 0 ? void 0 : eventData.code)) {
            return;
        }
        eventEmitter.emit('successTransaction', {
            type: type,
            receipt,
        });
        resolve(receipt.blockNumber);
    }, 500));
};
//# sourceMappingURL=xdcPayV1EventHandler.js.map