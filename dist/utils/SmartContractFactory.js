import ERC20Abi from '../abis/ERC20.json';
import CollateralPoolConfigAbi from '../abis/CollateralPoolConfig.json';
import CollateralTokenAdapterAbi from '../abis/CollateralTokenAdapter.json';
import DexPriceOracle from '../abis/DexPriceOracle.json';
import FathomStableCoinProxyActionAbi from '../abis/FathomStablecoinProxyActions.json';
import Governor from '../abis/Governor.json';
import MainToken from '../abis/MainToken.json';
import MainTokenGovernor from '../abis/MainTokenGovernor.json';
import ProxyWalletAbi from '../abis/ProxyWallet.json';
import ProxyWalletRegistryAbi from '../abis/ProxyWalletRegistry.json';
import StableSwapModule from '../abis/StableSwapModule.json';
import StableSwapModuleWrapper from '../abis/StableSwapModuleWrapper.json';
import Staking from '../abis/Staking.json';
import StakingGetter from '../abis/StakingGetter.json';
import VeFathomAbi from '../abis/vFathom.json';
import { APOTHEM_ADDRESSES, XDC_ADDRESSES } from '../addresses';
export class SmartContractFactory {
    static Addresses(chainId) {
        switch (chainId) {
            case 51:
                return APOTHEM_ADDRESSES;
            case 50:
                return XDC_ADDRESSES;
            default:
                return XDC_ADDRESSES;
        }
    }
    static PoolConfig(chainId) {
        return {
            abi: CollateralPoolConfigAbi.abi,
            address: SmartContractFactory.Addresses(chainId).COLLATERAL_POOL_CONFIG,
        };
    }
    static ProxyWalletRegistry(chainId) {
        return {
            abi: ProxyWalletRegistryAbi.abi,
            address: SmartContractFactory.Addresses(chainId).PROXY_WALLET_REGISTRY,
        };
    }
    static FathomStablecoinProxyAction(chainId) {
        return {
            abi: FathomStableCoinProxyActionAbi.abi,
            address: SmartContractFactory.Addresses(chainId)
                .FATHOM_STABLE_COIN_PROXY_ACTIONS,
        };
    }
    static WXDC(chainId) {
        return {
            abi: ERC20Abi.abi,
            address: SmartContractFactory.Addresses(chainId).WXDC,
        };
    }
    static USDT(chainId) {
        return {
            abi: ERC20Abi.abi,
            address: SmartContractFactory.Addresses(chainId).xUSDT,
        };
    }
    static ERC20(_address) {
        return {
            abi: ERC20Abi.abi,
            address: _address,
        };
    }
    static FathomStableCoin(chainId) {
        return {
            abi: ERC20Abi.abi,
            address: SmartContractFactory.Addresses(chainId).FXD,
        };
    }
    static PositionManager(chainId) {
        return {
            address: SmartContractFactory.Addresses(chainId).POSITION_MANAGER,
        };
    }
    static StabilityFeeCollector(chainId) {
        return {
            abi: [],
            address: SmartContractFactory.Addresses(chainId).STABILITY_FEE_COLLATERAL,
        };
    }
    static StablecoinAdapter(chainId) {
        return {
            abi: [],
            address: SmartContractFactory.Addresses(chainId).STABLE_COIN_ADAPTER,
        };
    }
    static FathomStablecoinProxyActions(chainId) {
        return {
            abi: [],
            address: SmartContractFactory.Addresses(chainId)
                .FATHOM_STABLE_COIN_PROXY_ACTIONS,
        };
    }
    static StableSwapModule(chainId) {
        return {
            abi: StableSwapModule.abi,
            address: SmartContractFactory.Addresses(chainId).STABLE_SWAP_MODULE,
        };
    }
    static StableSwapModuleWrapper(chainId) {
        return {
            abi: StableSwapModuleWrapper.abi,
            address: SmartContractFactory.Addresses(chainId).STABLE_SWAP_MODULE_WRAPPER,
        };
    }
    static FathomGovernor(chainId) {
        return {
            abi: Governor.abi,
            address: SmartContractFactory.Addresses(chainId).FTHM_GOVERNOR,
        };
    }
    static MainFathomGovernor(chainId) {
        return {
            abi: MainTokenGovernor.abi,
            address: SmartContractFactory.Addresses(chainId).FTHM_GOVERNOR,
        };
    }
    static Staking(chainId) {
        return {
            abi: Staking.abi,
            address: SmartContractFactory.Addresses(chainId).STAKING,
        };
    }
    static MainToken(fthmTokenAddress) {
        return {
            abi: MainToken.abi,
            address: fthmTokenAddress,
        };
    }
    static FthmToken(chainId) {
        return {
            abi: MainToken.abi,
            address: SmartContractFactory.Addresses(chainId).FTHM_TOKEN,
        };
    }
    static StakingGetter(chainId) {
        return {
            abi: StakingGetter.abi,
            address: SmartContractFactory.Addresses(chainId).STAKING_GETTER,
        };
    }
    static vFathom(chainId) {
        return {
            abi: VeFathomAbi.abi,
            address: SmartContractFactory.Addresses(chainId).vFTHM,
        };
    }
    static DexPriceOracle(chainId) {
        return {
            abi: DexPriceOracle.abi,
            address: SmartContractFactory.Addresses(chainId).DEX_PRICE_ORACLE,
        };
    }
    static CollateralTokenAdapterAbi() {
        return CollateralTokenAdapterAbi.abi;
    }
    static getAddressByContractName(chainId, name) {
        const addresses = SmartContractFactory.Addresses(chainId);
        // @ts-ignore
        return addresses[name] ? addresses[name] : '';
    }
}
SmartContractFactory.proxyWallet = {
    abi: ProxyWalletAbi.abi,
};
//# sourceMappingURL=SmartContractFactory.js.map