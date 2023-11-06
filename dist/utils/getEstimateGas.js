import { ESTIMATE_GAS_MULTIPLIER } from "utils/Constants";
export const getEstimateGas = async (contract, methodName, args, options) => {
    const gas = await contract.methods[methodName](...args).estimateGas(options);
    return Math.ceil(gas * ESTIMATE_GAS_MULTIPLIER);
};
//# sourceMappingURL=getEstimateGas.js.map