import Xdc3 from 'xdc3';
import IPoolService from '../interfaces/services/IPoolService';
import { SmartContractFactory } from '../utils/SmartContractFactory';
import { Web3Utils } from '../utils/Web3Utils';

export default class PoolService implements IPoolService {
  provider: Xdc3;
  chainId: number;

  constructor(provider: Xdc3, chainId: number) {
    this.provider = provider;
    this.chainId = chainId;
  }

  getUserTokenBalance(address: string, forAddress: string) {
    const BEP20 = Web3Utils.getContractInstance(
      SmartContractFactory.BEP20(forAddress),
      this.provider,
    );

    return BEP20.methods.balanceOf(address).call();
  }

  getTokenDecimals(forAddress: string) {
    const BEP20 = Web3Utils.getContractInstance(
      SmartContractFactory.BEP20(forAddress),
      this.provider,
    );

    return BEP20.methods.decimals().call();
  }

  async getDexPrice(forAddress: string) {
    const USStable = SmartContractFactory.USDT(this.chainId).address;

    const dexPriceOracle = Web3Utils.getContractInstance(
      SmartContractFactory.DexPriceOracle(this.chainId),
      this.provider,
    );

    const result = await dexPriceOracle.methods
      .getPrice(USStable, forAddress)
      .call();

    return result[0];
  }

  getCollateralTokenAddress(forAddress: string) {
    const abi = SmartContractFactory.CollateralTokenAdapterAbi();

    const collateralTokenAdapter = Web3Utils.getContractInstance(
      {
        address: forAddress,
        abi,
      },
      this.provider,
    );

    return collateralTokenAdapter.methods.collateralToken().call();
  }

  setProvider(provider: Xdc3) {
    this.provider = provider;
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}
