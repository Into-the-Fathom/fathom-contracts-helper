import { ReactElement } from 'react';

export enum TxAction {
  APPROVAL,
  MAIN_ACTION,
  GAS_ESTIMATION,
}

export type TxErrorType = {
  rawError: Error;
  error: ReactElement | string | undefined;
  txAction: TxAction;
};

const DEFAULT_ERROR_MESSAGE = 'An unknown error occurred. Please try again.';

export const getErrorTextFromError = (
  error: any,
  txAction: TxAction,
): TxErrorType => {
  let errorNumber = 1;

  if (
    error.code === 4001 ||
    error.code === 'ACTION_REJECTED' ||
    error.code === 5000
  ) {
    return {
      error: errorMapping[4001] || DEFAULT_ERROR_MESSAGE,
      rawError: error,
      txAction,
    };
  }

  // Try to parse the Pool error number from RPC provider revert error
  const errorBody = (error as any)?.error?.body;

  if (errorBody) {
    const parsedError = JSON.parse((error as any)?.error?.body);
    const parsedNumber = Number(parsedError.error.message.split(': ')[1]);
    if (!isNaN(parsedNumber)) {
      errorNumber = parsedNumber;
    }
  }

  const errorRender = errorMapping[errorNumber];

  if (errorRender) {
    return {
      error: errorRender || DEFAULT_ERROR_MESSAGE,
      rawError: error,
      txAction,
    };
  }

  return {
    error: DEFAULT_ERROR_MESSAGE,
    rawError: error,
    txAction,
  };
};

export const errorMapping: Record<number, string> = {
  1: 'An unknown error occurred. Please try again.',
  502: 'Problem with the selected rpc. Try changing the url of the rpc in MetaMask ',
  4001: 'You cancelled the transaction.',
};
