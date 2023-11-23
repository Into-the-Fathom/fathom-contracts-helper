import EventEmitter from 'eventemitter3';
import {
  TransactionStatus,
  TransactionType,
} from '../interfaces/models/ITransaction';

export const emitPendingTransaction = (
  emitter: EventEmitter,
  hash: string,
  type: TransactionType,
  tokenName?: string,
) => {
  emitter.emit('pendingTransaction', {
    hash: hash,
    type,
    active: false,
    status: TransactionStatus.None,
    tokenName,
  });
};
