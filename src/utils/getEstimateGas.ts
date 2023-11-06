import { ESTIMATE_GAS_MULTIPLIER } from 'utils/Constants';
import { Contract } from 'xdc3-eth-contract';

export const getEstimateGas = async (
  contract: Contract,
  methodName: string,
  args: any[],
  options: any,
): Promise<number> => {
  const gas = await contract.methods[methodName](...args).estimateGas(options);
  return Math.ceil(gas * ESTIMATE_GAS_MULTIPLIER);
};
