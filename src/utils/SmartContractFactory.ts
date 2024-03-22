import ERC20Abi from '../abis/ERC20.json';
import CollateralPoolConfigAbi from '../abis/CollateralPoolConfig.json';
import CollateralTokenAdapterAbi from '../abis/CollateralTokenAdapter.json';
import DexPriceOracle from '../abis/DexPriceOracle.json';
import FathomStableCoinProxyActionAbi from '../abis/FathomStablecoinProxyActions.json';
import MainToken from '../abis/MainToken.json';
import MainFathomGovernor from '../abis/MainFathomGovernor.json';
import ProxyWalletAbi from '../abis/ProxyWallet.json';
import ProxyWalletRegistryAbi from '../abis/ProxyWalletRegistry.json';
import StableSwapModule from '../abis/StableSwapModule.json';
import StableSwapModuleWrapper from '../abis/StableSwapModuleWrapper.json';
import Staking from '../abis/Staking.json';
import StakingGetter from '../abis/StakingGetter.json';
import VeFathomAbi from '../abis/vFathom.json';
import FathomVault from '../abis/FathomVault.json';
import FathomPriceOracle from '../abis/FathomPriceOracle.json';
import MultiSigWallet from '../abis/MultiSigWallet.json';

import { APOTHEM_ADDRESSES, XDC_ADDRESSES } from '../addresses';

import { ChainId } from '../types';
import { ContractInterface } from 'fathom-ethers';

export class SmartContractFactory {
  public static Addresses(chainId: ChainId) {
    switch (chainId) {
      case 51:
        return APOTHEM_ADDRESSES;
      case 50:
        return XDC_ADDRESSES;
      default:
        return XDC_ADDRESSES;
    }
  }

  public static PoolConfig(chainId: number) {
    return {
      abi: CollateralPoolConfigAbi.abi as ContractInterface,
      address: SmartContractFactory.Addresses(chainId).COLLATERAL_POOL_CONFIG,
    };
  }

  public static ProxyWalletRegistry(chainId: number) {
    return {
      abi: ProxyWalletRegistryAbi.abi as ContractInterface,
      address: SmartContractFactory.Addresses(chainId).PROXY_WALLET_REGISTRY,
    };
  }

  public static proxyWallet = {
    abi: ProxyWalletAbi.abi as ContractInterface,
  };

  public static FathomStablecoinProxyAction(chainId: number) {
    return {
      abi: FathomStableCoinProxyActionAbi.abi as ContractInterface,
      address:
        SmartContractFactory.Addresses(chainId)
          .FATHOM_STABLE_COIN_PROXY_ACTIONS,
    };
  }

  public static WXDC(chainId: number) {
    return {
      abi: ERC20Abi.abi as ContractInterface,
      address: SmartContractFactory.Addresses(chainId).WXDC,
    };
  }

  public static USDT(chainId: number) {
    return {
      abi: ERC20Abi.abi as ContractInterface,
      address: SmartContractFactory.Addresses(chainId).xUSDT,
    };
  }

  public static ERC20(_address: string) {
    return {
      abi: ERC20Abi.abi as ContractInterface,
      address: _address,
    };
  }

  public static FathomStableCoin(chainId: number) {
    return {
      abi: ERC20Abi.abi as ContractInterface,
      address: SmartContractFactory.Addresses(chainId).FXD,
    };
  }

  public static PositionManager(chainId: number) {
    return {
      address: SmartContractFactory.Addresses(chainId).POSITION_MANAGER,
    };
  }

  public static StabilityFeeCollector(chainId: number) {
    return {
      abi: [],
      address: SmartContractFactory.Addresses(chainId).STABILITY_FEE_COLLATERAL,
    };
  }

  public static StablecoinAdapter(chainId: number) {
    return {
      abi: [],
      address: SmartContractFactory.Addresses(chainId).STABLE_COIN_ADAPTER,
    };
  }

  public static FathomStablecoinProxyActions(chainId: number) {
    return {
      abi: [],
      address:
        SmartContractFactory.Addresses(chainId)
          .FATHOM_STABLE_COIN_PROXY_ACTIONS,
    };
  }

  public static StableSwapModule(chainId: number) {
    return {
      abi: StableSwapModule.abi as ContractInterface,
      address: SmartContractFactory.Addresses(chainId).STABLE_SWAP_MODULE,
    };
  }

  public static StableSwapModuleWrapper(chainId: number) {
    return {
      abi: StableSwapModuleWrapper.abi as ContractInterface,
      address:
        SmartContractFactory.Addresses(chainId).STABLE_SWAP_MODULE_WRAPPER,
    };
  }

  public static MainFathomGovernor(chainId: number) {
    return {
      abi: MainFathomGovernor.abi as ContractInterface,
      address: SmartContractFactory.Addresses(chainId).FTHM_GOVERNOR,
    };
  }

  public static Staking(chainId: number) {
    return {
      abi: Staking.abi as ContractInterface,
      address: SmartContractFactory.Addresses(chainId).STAKING,
    };
  }

  public static MainToken(fthmTokenAddress: string) {
    return {
      abi: MainToken.abi as ContractInterface,
      address: fthmTokenAddress,
    };
  }

  public static FthmToken(chainId: number) {
    return {
      abi: MainToken.abi as ContractInterface,
      address: SmartContractFactory.Addresses(chainId).FTHM_TOKEN,
    };
  }

  public static StakingGetter(chainId: number) {
    return {
      abi: StakingGetter.abi as ContractInterface,
      address: SmartContractFactory.Addresses(chainId).STAKING_GETTER,
    };
  }

  public static vFathom(chainId: number) {
    return {
      abi: VeFathomAbi.abi as ContractInterface,
      address: SmartContractFactory.Addresses(chainId).vFTHM,
    };
  }

  public static FathomVault(vaultAddress: string) {
    return {
      abi: FathomVault.abi as ContractInterface,
      address: vaultAddress,
    };
  }

  public static FathomPriceOracle(chainId: number) {
    return {
      abi: FathomPriceOracle.abi as ContractInterface,
      address: SmartContractFactory.Addresses(chainId).FATHOM_PRICE_ORACLE,
    };
  }

  public static DexPriceOracle(chainId: number) {
    return {
      abi: DexPriceOracle.abi as ContractInterface,
      address: SmartContractFactory.Addresses(chainId).DEX_PRICE_ORACLE,
    };
  }

  public static CollateralTokenAdapterAbi() {
    return CollateralTokenAdapterAbi.abi as ContractInterface;
  }

  public static getAddressByContractName(chainId: number, name: string) {
    const addresses = SmartContractFactory.Addresses(chainId);
    // @ts-ignore
    return addresses[name] ? addresses[name] : '';
  }

  public static MultiSigWallet(chainId: number) {
    return {
      abi: MultiSigWallet.abi as ContractInterface,
      address: SmartContractFactory.Addresses(chainId).MULTI_SIG_WALLET,
    };
  }
}
