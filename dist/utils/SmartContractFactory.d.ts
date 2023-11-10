import { AbiItem } from 'xdc3-utils';
import { ChainId } from '../types';
export declare class SmartContractFactory {
    static Addresses(chainId: ChainId): {
        FXD: string;
        xUSDT: string;
        WXDC: string;
        COLLATERAL_POOL_CONFIG: string;
        DEX_PRICE_ORACLE: string;
        FATHOM_STABLE_COIN_PROXY_ACTIONS: string;
        FTHM_GOVERNOR: string;
        FTHM_TOKEN: string;
        POSITION_MANAGER: string;
        PRICE_ORACLE: string;
        PROXY_WALLET_REGISTRY: string;
        STABILITY_FEE_COLLATERAL: string;
        STABLE_SWAP_MODULE: string;
        STABLE_SWAP_MODULE_WRAPPER: string;
        STABLE_COIN_ADAPTER: string;
        STAKING: string;
        STAKING_GETTER: string;
        vFTHM: string;
    };
    static PoolConfig(chainId: number): {
        abi: AbiItem[];
        address: string;
    };
    static ProxyWalletRegistry(chainId: number): {
        abi: AbiItem[];
        address: string;
    };
    static proxyWallet: {
        abi: AbiItem[];
    };
    static FathomStablecoinProxyAction(chainId: number): {
        abi: AbiItem[];
        address: string;
    };
    static WXDC(chainId: number): {
        abi: AbiItem[];
        address: string;
    };
    static USDT(chainId: number): {
        abi: AbiItem[];
        address: string;
    };
    static ERC20(_address: string): {
        abi: AbiItem[];
        address: string;
    };
    static FathomStableCoin(chainId: number): {
        abi: AbiItem[];
        address: string;
    };
    static PositionManager(chainId: number): {
        address: string;
    };
    static StabilityFeeCollector(chainId: number): {
        abi: never[];
        address: string;
    };
    static StablecoinAdapter(chainId: number): {
        abi: never[];
        address: string;
    };
    static FathomStablecoinProxyActions(chainId: number): {
        abi: never[];
        address: string;
    };
    static StableSwapModule(chainId: number): {
        abi: AbiItem[];
        address: string;
    };
    static StableSwapModuleWrapper(chainId: number): {
        abi: AbiItem[];
        address: string;
    };
    static FathomGovernor(chainId: number): {
        abi: AbiItem[];
        address: string;
    };
    static MainFathomGovernor(chainId: number): {
        abi: AbiItem[];
        address: string;
    };
    static Staking(chainId: number): {
        abi: AbiItem[];
        address: string;
    };
    static MainToken(fthmTokenAddress: string): {
        abi: AbiItem[];
        address: string;
    };
    static FthmToken(chainId: number): {
        abi: AbiItem[];
        address: string;
    };
    static StakingGetter(chainId: number): {
        abi: AbiItem[];
        address: string;
    };
    static vFathom(chainId: number): {
        abi: AbiItem[];
        address: string;
    };
    static DexPriceOracle(chainId: number): {
        abi: AbiItem[];
        address: string;
    };
    static CollateralTokenAdapterAbi(): AbiItem[];
    static getAddressByContractName(chainId: number, name: string): any;
}
//# sourceMappingURL=SmartContractFactory.d.ts.map