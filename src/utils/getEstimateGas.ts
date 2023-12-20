import { ESTIMATE_GAS_MULTIPLIER } from './Constants';
import { Contract } from 'fathom-ethers';

export const getEstimateGas = async (
  contract: Contract,
  methodName: string,
  args: any[],
  options: any,
): Promise<number> => {
  const gas = await contract['estimateGas'][methodName](...args, options);
  return Math.ceil(gas.toNumber() * ESTIMATE_GAS_MULTIPLIER);
};
