import { toWei } from "xdc3-utils";
import BigNumber from "bignumber.js";
import { ZERO_ADDRESS, MAX_UINT256, WeiPerWad, WeiPerRad } from "utils/Constants";
import { Web3Utils } from "utils/Web3Utils";
import { SmartContractFactory } from "utils/SmartContractFactory";
import { getEstimateGas } from "utils/getEstimateGas";
export default class PositionService {
    constructor(provider, chainId) {
        this.provider = provider;
        this.chainId = chainId;
    }
    openPosition(address, pool, collateral, fathomToken) {
        return new Promise(async (resolve, reject) => {
            try {
                let proxyWalletAddress = await this.proxyWalletExist(address);
                if (proxyWalletAddress === ZERO_ADDRESS) {
                    proxyWalletAddress = await this.createProxyWallet(address);
                }
                /**
                 * Get Proxy Wallet
                 */
                const wallet = Web3Utils.getContractInstanceFrom(SmartContractFactory.proxyWallet.abi, proxyWalletAddress, this.provider);
                const encodedResult = this.provider.eth.abi.encodeParameters(["address"], [address]);
                const jsonInterface = SmartContractFactory.FathomStablecoinProxyAction(this.chainId).abi.filter((abi) => abi.name === "openLockXDCAndDraw")[0];
                const openPositionCall = this.provider.eth.abi.encodeFunctionCall(jsonInterface, [
                    SmartContractFactory.PositionManager(this.chainId).address,
                    SmartContractFactory.StabilityFeeCollector(this.chainId).address,
                    pool.tokenAdapterAddress,
                    SmartContractFactory.StablecoinAdapter(this.chainId).address,
                    pool.id,
                    toWei(fathomToken.toString(), "ether"),
                    encodedResult
                ]);
                const options = {
                    from: address,
                    gas: 0,
                    value: toWei(collateral.toString(), "ether")
                };
                const gas = await getEstimateGas(wallet, "execute", [openPositionCall], options);
                options.gas = gas;
                wallet.methods
                    .execute(openPositionCall)
                    .send(options)
                    .then((receipt) => {
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    reject(error);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    topUpPositionAndBorrow(address, pool, collateral, fathomToken, positionId) {
        return new Promise(async (resolve, reject) => {
            try {
                let proxyWalletAddress = await this.proxyWalletExist(address);
                if (proxyWalletAddress === ZERO_ADDRESS) {
                    proxyWalletAddress = await this.createProxyWallet(address);
                }
                /**
                 * Get Proxy Wallet
                 */
                const wallet = Web3Utils.getContractInstanceFrom(SmartContractFactory.proxyWallet.abi, proxyWalletAddress, this.provider);
                const encodedResult = this.provider.eth.abi.encodeParameters(["address"], [address]);
                const jsonInterface = SmartContractFactory.FathomStablecoinProxyAction(this.chainId).abi.filter((abi) => abi.name === "lockXDCAndDraw")[0];
                const topUpPositionCall = this.provider.eth.abi.encodeFunctionCall(jsonInterface, [
                    SmartContractFactory.PositionManager(this.chainId).address,
                    SmartContractFactory.StabilityFeeCollector(this.chainId).address,
                    pool.tokenAdapterAddress,
                    SmartContractFactory.StablecoinAdapter(this.chainId).address,
                    positionId,
                    fathomToken ? toWei(fathomToken, "ether") : "0",
                    encodedResult
                ]);
                const options = {
                    from: address,
                    gas: 0,
                    value: collateral ? toWei(collateral, "ether") : 0
                };
                const gas = await getEstimateGas(wallet, "execute", [topUpPositionCall], options);
                options.gas = gas;
                wallet.methods
                    .execute(topUpPositionCall)
                    .send(options)
                    .then((receipt) => {
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    reject(error);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    topUpPosition(address, pool, collateral, positionId) {
        return new Promise(async (resolve, reject) => {
            try {
                let proxyWalletAddress = await this.proxyWalletExist(address);
                if (proxyWalletAddress === ZERO_ADDRESS) {
                    proxyWalletAddress = await this.createProxyWallet(address);
                }
                /**
                 * Get Proxy Wallet
                 */
                const wallet = Web3Utils.getContractInstanceFrom(SmartContractFactory.proxyWallet.abi, proxyWalletAddress, this.provider);
                const encodedResult = this.provider.eth.abi.encodeParameters(["address"], [address]);
                const jsonInterface = SmartContractFactory.FathomStablecoinProxyAction(this.chainId).abi.filter((abi) => abi.name === "lockXDC")[0];
                const topUpPositionCall = this.provider.eth.abi.encodeFunctionCall(jsonInterface, [
                    SmartContractFactory.PositionManager(this.chainId).address,
                    pool.tokenAdapterAddress,
                    positionId,
                    encodedResult
                ]);
                const options = {
                    from: address,
                    gas: 0,
                    value: collateral ? toWei(collateral.toString(), "ether") : 0
                };
                const gas = await getEstimateGas(wallet, "execute", [topUpPositionCall], options);
                options.gas = gas;
                wallet.methods
                    .execute(topUpPositionCall)
                    .send(options)
                    .then((receipt) => {
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    reject(error);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async createProxyWallet(address) {
        const proxyWalletRegistry = Web3Utils.getContractInstance(SmartContractFactory.ProxyWalletRegistry(this.chainId), this.provider);
        await proxyWalletRegistry.methods.build(address).send({ from: address });
        return proxyWalletRegistry.methods
            .proxies(address)
            .call();
    }
    proxyWalletExist(address) {
        const proxyWalletRegistry = Web3Utils.getContractInstance(SmartContractFactory.ProxyWalletRegistry(this.chainId), this.provider);
        return proxyWalletRegistry.methods.proxies(address).call();
    }
    closePosition(positionId, pool, address, collateral) {
        return new Promise(async (resolve, reject) => {
            try {
                const proxyWalletAddress = await this.proxyWalletExist(address);
                const wallet = Web3Utils.getContractInstanceFrom(SmartContractFactory.proxyWallet.abi, proxyWalletAddress, this.provider);
                const encodedResult = this.provider.eth.abi.encodeParameters(["address"], [address]);
                const jsonInterface = SmartContractFactory.FathomStablecoinProxyAction(this.chainId).abi.filter((abi) => abi.name === "wipeAllAndUnlockXDC")[0];
                const wipeAllAndUnlockTokenCall = this.provider.eth.abi.encodeFunctionCall(jsonInterface, [
                    SmartContractFactory.PositionManager(this.chainId).address,
                    pool.tokenAdapterAddress,
                    SmartContractFactory.StablecoinAdapter(this.chainId).address,
                    positionId,
                    collateral,
                    encodedResult
                ]);
                const options = { from: address, gas: 0 };
                const gas = await getEstimateGas(wallet, "execute", [wipeAllAndUnlockTokenCall], options);
                options.gas = gas;
                wallet.methods
                    .execute(wipeAllAndUnlockTokenCall)
                    .send(options)
                    .then((receipt) => {
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    reject(error);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    partiallyClosePosition(positionId, pool, address, stableCoin, collateral) {
        return new Promise(async (resolve, reject) => {
            try {
                const proxyWalletAddress = await this.proxyWalletExist(address);
                const wallet = Web3Utils.getContractInstanceFrom(SmartContractFactory.proxyWallet.abi, proxyWalletAddress, this.provider);
                const encodedResult = this.provider.eth.abi.encodeParameters(["address"], [address]);
                const jsonInterface = SmartContractFactory.FathomStablecoinProxyAction(this.chainId).abi.filter((abi) => abi.name === "wipeAndUnlockXDC")[0];
                const wipeAndUnlockTokenCall = this.provider.eth.abi.encodeFunctionCall(jsonInterface, [
                    SmartContractFactory.PositionManager(this.chainId).address,
                    pool.tokenAdapterAddress,
                    SmartContractFactory.StablecoinAdapter(this.chainId).address,
                    positionId,
                    collateral,
                    stableCoin,
                    encodedResult
                ]);
                const options = { from: address, gas: 0 };
                const gas = await getEstimateGas(wallet, "execute", [wipeAndUnlockTokenCall], options);
                options.gas = gas;
                wallet.methods
                    .execute(wipeAndUnlockTokenCall)
                    .send({ from: address })
                    .then((receipt) => {
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    reject(error);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    approve(address, tokenAddress) {
        return new Promise(async (resolve, reject) => {
            try {
                let proxyWalletAddress = await this.proxyWalletExist(address);
                if (proxyWalletAddress === ZERO_ADDRESS) {
                    proxyWalletAddress = await this.createProxyWallet(address);
                }
                const BEP20 = Web3Utils.getContractInstance(SmartContractFactory.BEP20(tokenAddress), this.provider);
                const options = { from: address, gas: 0 };
                const gas = await getEstimateGas(BEP20, "approve", [proxyWalletAddress, MAX_UINT256], options);
                options.gas = gas;
                BEP20.methods
                    .approve(proxyWalletAddress, MAX_UINT256)
                    .send(options)
                    .then((receipt) => {
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    reject(error);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async approvalStatus(address, tokenAddress, collateral) {
        const proxyWalletAddress = await this.proxyWalletExist(address);
        if (proxyWalletAddress === ZERO_ADDRESS) {
            return false;
        }
        const BEP20 = Web3Utils.getContractInstance(SmartContractFactory.BEP20(tokenAddress), this.provider);
        const allowance = await BEP20.methods
            .allowance(address, proxyWalletAddress)
            .call();
        return BigNumber(allowance).isGreaterThanOrEqualTo(WeiPerWad.multipliedBy(collateral));
    }
    approveStableCoin(address) {
        return new Promise(async (resolve, reject) => {
            try {
                let proxyWalletAddress = await this.proxyWalletExist(address);
                if (proxyWalletAddress === ZERO_ADDRESS) {
                    proxyWalletAddress = await this.createProxyWallet(address);
                }
                const fathomStableCoin = Web3Utils.getContractInstance(SmartContractFactory.FathomStableCoin(this.chainId), this.provider);
                const options = { from: address, gas: 0 };
                const gas = await getEstimateGas(fathomStableCoin, "approve", [proxyWalletAddress, MAX_UINT256], options);
                options.gas = gas;
                fathomStableCoin.methods
                    .approve(proxyWalletAddress, MAX_UINT256)
                    .send(options)
                    .then((receipt) => {
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    reject(error);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    balanceStableCoin(address) {
        const fathomStableCoin = Web3Utils.getContractInstance(SmartContractFactory.FathomStableCoin(this.chainId), this.provider);
        return fathomStableCoin.methods.balanceOf(address).call();
    }
    async approvalStatusStableCoin(valueToCheck, address) {
        const proxyWalletAddress = await this.proxyWalletExist(address);
        if (proxyWalletAddress === ZERO_ADDRESS) {
            return false;
        }
        const fathomStableCoin = Web3Utils.getContractInstance(SmartContractFactory.FathomStableCoin(this.chainId), this.provider);
        const [allowance, decimals] = await Promise.all([
            fathomStableCoin.methods
                .allowance(address, proxyWalletAddress)
                .call(),
            fathomStableCoin.methods.decimals().call()
        ]);
        return BigNumber(allowance).dividedBy(10 ** decimals).isGreaterThan(valueToCheck);
    }
    async getDebtValue(debtShare, poolId) {
        const poolConfigContract = Web3Utils.getContractInstance(SmartContractFactory.PoolConfig(this.chainId), this.provider);
        const debtAccumulatedRate = await poolConfigContract.methods
            .getDebtAccumulatedRate(poolId)
            .call();
        const debtShareValue = BigNumber(debtShare)
            .multipliedBy(WeiPerWad)
            .integerValue(BigNumber.ROUND_CEIL);
        const debtValue = BigNumber(debtAccumulatedRate).multipliedBy(debtShareValue);
        return debtValue.dividedBy(WeiPerRad).decimalPlaces(18).toString();
    }
    async getPositionDebtCeiling(poolId) {
        const poolConfigContract = Web3Utils.getContractInstance(SmartContractFactory.PoolConfig(this.chainId), this.provider);
        const debtCeiling = await poolConfigContract.methods
            .getPositionDebtCeiling(poolId)
            .call();
        return BigNumber(debtCeiling).dividedBy(WeiPerRad).integerValue().toString();
    }
    isDecentralizedMode() {
        const proxyWalletRegistry = Web3Utils.getContractInstance(SmartContractFactory.ProxyWalletRegistry(this.chainId), this.provider);
        return proxyWalletRegistry.methods.isDecentralizedMode().call();
    }
    isWhitelisted(address) {
        const proxyWalletRegistry = Web3Utils.getContractInstance(SmartContractFactory.ProxyWalletRegistry(this.chainId), this.provider);
        return proxyWalletRegistry.methods.whitelisted(address).call();
    }
    setChainId(chainId) {
        this.chainId = chainId;
    }
    setProvider(provider) {
        this.provider = provider;
    }
}
//# sourceMappingURL=PositionService.js.map