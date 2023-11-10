/**
 * Xdc pay v1 is not resolve after send transaction. We need to catch
 * @param contract
 * @param resolve
 * @param eventEmitter
 * @param type
 */
export const xdcPayV1EventHandler = (contract, resolve, reject, eventEmitter, type) => {
    /**
     * Block for XDC Pay.
     */
    contract.once('allEvents', (error, event) => {
        if (error) {
            eventEmitter.emit('errorTransaction', {
                type,
                error,
            });
            reject(error);
            return;
        }
        eventEmitter.emit('successTransaction', {
            type,
            event,
        });
        resolve(event.blockNumber);
    });
};
//# sourceMappingURL=xdcPayV1EventHandler.js.map