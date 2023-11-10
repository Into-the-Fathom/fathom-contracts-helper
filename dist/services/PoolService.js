import { SmartContractFactory } from '../utils/SmartContractFactory';
import { Web3Utils } from '../utils/Web3Utils';
export default class PoolService {
    constructor(provider, chainId) {
        this.provider = provider;
        this.chainId = chainId;
    }
    getUserTokenBalance(address, forAddress) {
        const ERC20 = Web3Utils.getContractInstance(SmartContractFactory.ERC20(forAddress), this.provider);
        return ERC20.methods.balanceOf(address).call();
    }
    getTokenDecimals(forAddress) {
        const ERC20 = Web3Utils.getContractInstance(SmartContractFactory.ERC20(forAddress), this.provider);
        return ERC20.methods.decimals().call();
    }
    async getDexPrice(forAddress) {
        const USStable = SmartContractFactory.USDT(this.chainId).address;
        const dexPriceOracle = Web3Utils.getContractInstance(SmartContractFactory.DexPriceOracle(this.chainId), this.provider);
        const result = await dexPriceOracle.methods
            .getPrice(USStable, forAddress)
            .call();
        return result[0];
    }
    getCollateralTokenAddress(forAddress) {
        const abi = SmartContractFactory.CollateralTokenAdapterAbi();
        const collateralTokenAdapter = Web3Utils.getContractInstance({
            address: forAddress,
            abi,
        }, this.provider);
        return collateralTokenAdapter.methods.collateralToken().call();
    }
    setProvider(provider) {
        this.provider = provider;
    }
    setChainId(chainId) {
        this.chainId = chainId;
    }
}
//# sourceMappingURL=PoolService.js.map