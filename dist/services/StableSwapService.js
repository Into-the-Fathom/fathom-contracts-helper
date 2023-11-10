import EventEmitter from 'eventemitter3';
import BigNumber from 'bignumber.js';
import { MAX_UINT256 } from '../utils/Constants';
import { SmartContractFactory } from '../utils/SmartContractFactory';
import { Web3Utils } from '../utils/Web3Utils';
import { getEstimateGas } from '../utils/getEstimateGas';
import { TransactionStatus, TransactionType, } from '../interfaces/models/ITransaction';
import { xdcPayV1EventHandler } from "../utils/xdcPayV1EventHandler";
export default class StableSwapService {
    constructor(provider, chainId) {
        this.provider = provider;
        this.chainId = chainId;
        this.emitter = new EventEmitter();
    }
    swapTokenToStableCoin(account, tokenIn, tokenInDecimals, tokenName) {
        return new Promise(async (resolve, reject) => {
            try {
                const StableSwapModule = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModule(this.chainId), this.provider);
                const options = { from: account, gas: 0 };
                const formattedTokenAmount = BigNumber(tokenIn)
                    .multipliedBy(10 ** tokenInDecimals)
                    .integerValue(BigNumber.ROUND_DOWN);
                const gas = await getEstimateGas(StableSwapModule, 'swapTokenToStablecoin', [account, formattedTokenAmount], options);
                options.gas = gas;
                xdcPayV1EventHandler(StableSwapModule, resolve, this.emitter, TransactionType.SwapTokenToStableCoin);
                return StableSwapModule.methods
                    .swapTokenToStablecoin(account, formattedTokenAmount)
                    .send(options)
                    .on('transactionHash', (hash) => {
                    this.emitter.emit('pendingTransaction', {
                        hash: hash,
                        type: TransactionType.SwapTokenToStableCoin,
                        active: false,
                        status: TransactionStatus.None,
                        tokenName,
                    });
                })
                    .then((receipt) => {
                    this.emitter.emit('successTransaction', {
                        type: TransactionType.SwapTokenToStableCoin,
                        receipt,
                        tokenName,
                    });
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    this.emitter.emit('errorTransaction', {
                        type: TransactionType.SwapTokenToStableCoin,
                        error,
                        tokenName,
                    });
                    reject(error);
                });
            }
            catch (error) {
                this.emitter.emit('errorTransaction', {
                    type: TransactionType.SwapTokenToStableCoin,
                    error,
                    tokenName,
                });
                reject(error);
            }
        });
    }
    swapStableCoinToToken(account, tokenOut, tokenName) {
        return new Promise(async (resolve, reject) => {
            try {
                const StableSwapModule = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModule(this.chainId), this.provider);
                const options = { from: account, gas: 0 };
                const formattedTokenAmount = this.provider.utils.toWei(tokenOut, 'ether');
                const gas = await getEstimateGas(StableSwapModule, 'swapStablecoinToToken', [account, formattedTokenAmount], options);
                options.gas = gas;
                xdcPayV1EventHandler(StableSwapModule, resolve, this.emitter, TransactionType.SwapStableCoinToToken);
                return StableSwapModule.methods
                    .swapStablecoinToToken(account, formattedTokenAmount)
                    .send(options)
                    .on('transactionHash', (hash) => {
                    this.emitter.emit('pendingTransaction', {
                        hash: hash,
                        type: TransactionType.SwapStableCoinToToken,
                        active: false,
                        status: TransactionStatus.None,
                        tokenName,
                    });
                })
                    .then((receipt) => {
                    this.emitter.emit('successTransaction', {
                        type: TransactionType.SwapStableCoinToToken,
                        receipt,
                        tokenName,
                    });
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    this.emitter.emit('errorTransaction', {
                        type: TransactionType.SwapStableCoinToToken,
                        error,
                        tokenName,
                    });
                    reject(error);
                });
            }
            catch (error) {
                this.emitter.emit('errorTransaction', {
                    type: TransactionType.SwapStableCoinToToken,
                    error,
                    tokenName,
                });
                reject(error);
            }
        });
    }
    addLiquidity(amount, account) {
        return new Promise(async (resolve, reject) => {
            try {
                const StableSwapModuleWrapper = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModuleWrapper(this.chainId), this.provider);
                const options = { from: account, gas: 0 };
                const formattedTokenAmount = this.provider.utils.toWei(amount.toString(), 'ether');
                const gas = await getEstimateGas(StableSwapModuleWrapper, 'depositTokens', [formattedTokenAmount], options);
                options.gas = gas;
                xdcPayV1EventHandler(StableSwapModuleWrapper, resolve, this.emitter, TransactionType.AddLiquidity);
                return StableSwapModuleWrapper.methods
                    .depositTokens(formattedTokenAmount)
                    .send(options)
                    .on('transactionHash', (hash) => {
                    this.emitter.emit('pendingTransaction', {
                        hash: hash,
                        type: TransactionType.AddLiquidity,
                        active: false,
                        status: TransactionStatus.None,
                    });
                })
                    .then((receipt) => {
                    this.emitter.emit('successTransaction', {
                        type: TransactionType.AddLiquidity,
                        receipt,
                    });
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    this.emitter.emit('errorTransaction', {
                        type: TransactionType.AddLiquidity,
                        error,
                    });
                    reject(error);
                });
            }
            catch (error) {
                this.emitter.emit('errorTransaction', {
                    type: TransactionType.AddLiquidity,
                    error,
                });
                reject(error);
            }
        });
    }
    removeLiquidity(amount, account) {
        return new Promise(async (resolve, reject) => {
            try {
                const StableSwapModuleWrapper = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModuleWrapper(this.chainId), this.provider);
                const options = { from: account, gas: 0 };
                const formattedTokenAmount = this.provider.utils.toWei(amount.toString(), 'ether');
                const gas = await getEstimateGas(StableSwapModuleWrapper, 'withdrawTokens', [formattedTokenAmount], options);
                options.gas = gas;
                xdcPayV1EventHandler(StableSwapModuleWrapper, resolve, this.emitter, TransactionType.RemoveLiquidity);
                return StableSwapModuleWrapper.methods
                    .withdrawTokens(formattedTokenAmount)
                    .send(options)
                    .on('transactionHash', (hash) => {
                    this.emitter.emit('pendingTransaction', {
                        hash: hash,
                        type: TransactionType.RemoveLiquidity,
                        active: false,
                        status: TransactionStatus.None,
                    });
                })
                    .then((receipt) => {
                    this.emitter.emit('successTransaction', {
                        type: TransactionType.RemoveLiquidity,
                        receipt,
                    });
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    this.emitter.emit('errorTransaction', {
                        type: TransactionType.RemoveLiquidity,
                        error,
                    });
                    reject(error);
                });
            }
            catch (error) {
                this.emitter.emit('errorTransaction', {
                    type: TransactionType.RemoveLiquidity,
                    error,
                });
                reject(error);
            }
        });
    }
    approveStableCoin(account, isStableSwapWrapper = false) {
        return new Promise(async (resolve, reject) => {
            try {
                const FathomStableCoin = Web3Utils.getContractInstance(SmartContractFactory.FathomStableCoin(this.chainId), this.provider);
                const options = { from: account, gas: 0 };
                const approvalAddress = isStableSwapWrapper
                    ? SmartContractFactory.StableSwapModuleWrapper(this.chainId).address
                    : SmartContractFactory.StableSwapModule(this.chainId).address;
                const gas = await getEstimateGas(FathomStableCoin, 'approve', [approvalAddress, MAX_UINT256], options);
                options.gas = gas;
                xdcPayV1EventHandler(FathomStableCoin, resolve, this.emitter, TransactionType.Approve);
                return FathomStableCoin.methods
                    .approve(approvalAddress, MAX_UINT256)
                    .send(options)
                    .on('transactionHash', (hash) => {
                    this.emitter.emit('pendingTransaction', {
                        hash: hash,
                        type: TransactionType.Approve,
                        active: false,
                        status: TransactionStatus.None,
                    });
                })
                    .then((receipt) => {
                    this.emitter.emit('successTransaction', {
                        type: TransactionType.Approve,
                        receipt,
                    });
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    this.emitter.emit('errorTransaction', {
                        type: TransactionType.Approve,
                        error,
                    });
                    reject(error);
                });
            }
            catch (error) {
                this.emitter.emit('errorTransaction', {
                    type: TransactionType.Approve,
                    error,
                });
                reject(error);
            }
        });
    }
    async approveUsdt(account, isStableSwapWrapper = false) {
        return new Promise(async (resolve, reject) => {
            try {
                const USStable = Web3Utils.getContractInstance(SmartContractFactory.USDT(this.chainId), this.provider);
                const options = { from: account, gas: 0 };
                const approvalAddress = isStableSwapWrapper
                    ? SmartContractFactory.StableSwapModuleWrapper(this.chainId).address
                    : SmartContractFactory.StableSwapModule(this.chainId).address;
                const gas = await getEstimateGas(USStable, 'approve', [approvalAddress, MAX_UINT256], options);
                options.gas = gas;
                xdcPayV1EventHandler(USStable, resolve, this.emitter, TransactionType.Approve);
                return USStable.methods
                    .approve(approvalAddress, MAX_UINT256)
                    .send(options)
                    .on('transactionHash', (hash) => {
                    this.emitter.emit('pendingTransaction', {
                        hash: hash,
                        type: TransactionType.Approve,
                        active: false,
                        status: TransactionStatus.None,
                    });
                })
                    .then((receipt) => {
                    this.emitter.emit('successTransaction', {
                        type: TransactionType.Approve,
                        receipt,
                    });
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    this.emitter.emit('errorTransaction', {
                        type: TransactionType.Approve,
                        error,
                    });
                    reject(error);
                });
            }
            catch (error) {
                this.emitter.emit('errorTransaction', {
                    type: TransactionType.Approve,
                    error,
                });
                reject(error);
            }
        });
    }
    claimFeesRewards(account) {
        return new Promise(async (resolve, reject) => {
            try {
                const StableSwapModuleWrapper = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModuleWrapper(this.chainId), this.provider);
                const options = { from: account, gas: 0 };
                const gas = await getEstimateGas(StableSwapModuleWrapper, 'claimFeesRewards', [], options);
                options.gas = gas;
                xdcPayV1EventHandler(StableSwapModuleWrapper, resolve, this.emitter, TransactionType.ClaimFeesRewards);
                return StableSwapModuleWrapper.methods
                    .claimFeesRewards()
                    .send(options)
                    .on('transactionHash', (hash) => {
                    this.emitter.emit('pendingTransaction', {
                        hash: hash,
                        type: TransactionType.ClaimFeesRewards,
                        active: false,
                        status: TransactionStatus.None,
                    });
                })
                    .then((receipt) => {
                    this.emitter.emit('successTransaction', {
                        type: TransactionType.ClaimFeesRewards,
                        receipt,
                    });
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    this.emitter.emit('errorTransaction', {
                        type: TransactionType.ClaimFeesRewards,
                        error,
                    });
                    reject(error);
                });
            }
            catch (error) {
                this.emitter.emit('errorTransaction', {
                    type: TransactionType.ClaimFeesRewards,
                    error,
                });
                reject(error);
            }
        });
    }
    withdrawClaimedFees(account) {
        return new Promise(async (resolve, reject) => {
            try {
                const StableSwapModuleWrapper = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModuleWrapper(this.chainId), this.provider);
                const options = { from: account, gas: 0 };
                const gas = await getEstimateGas(StableSwapModuleWrapper, 'withdrawClaimedFees', [], options);
                options.gas = gas;
                xdcPayV1EventHandler(StableSwapModuleWrapper, resolve, this.emitter, TransactionType.WithdrawClaimedFees);
                return StableSwapModuleWrapper.methods
                    .withdrawClaimedFees()
                    .send(options)
                    .on('transactionHash', (hash) => {
                    this.emitter.emit('pendingTransaction', {
                        hash: hash,
                        type: TransactionType.WithdrawClaimedFees,
                        active: false,
                        status: TransactionStatus.None,
                    });
                })
                    .then((receipt) => {
                    this.emitter.emit('successTransaction', {
                        type: TransactionType.WithdrawClaimedFees,
                        receipt,
                    });
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    this.emitter.emit('errorTransaction', {
                        type: TransactionType.WithdrawClaimedFees,
                        error,
                    });
                    reject(error);
                });
            }
            catch (error) {
                this.emitter.emit('errorTransaction', {
                    type: TransactionType.WithdrawClaimedFees,
                    error,
                });
                reject(error);
            }
        });
    }
    async approvalStatusStableCoin(account, tokenIn, tokenInDecimal, isStableSwapWrapper = false) {
        const FathomStableCoin = Web3Utils.getContractInstance(SmartContractFactory.FathomStableCoin(this.chainId), this.provider);
        const allowance = await FathomStableCoin.methods
            .allowance(account, isStableSwapWrapper
            ? SmartContractFactory.StableSwapModuleWrapper(this.chainId).address
            : SmartContractFactory.StableSwapModule(this.chainId).address)
            .call();
        return BigNumber(allowance).isGreaterThanOrEqualTo(BigNumber(10 ** tokenInDecimal).multipliedBy(tokenIn));
    }
    async approvalStatusUsdt(account, tokenIn, tokenInDecimal, isStableSwapWrapper = false) {
        const USStable = Web3Utils.getContractInstance(SmartContractFactory.USDT(this.chainId), this.provider);
        const allowance = await USStable.methods
            .allowance(account, isStableSwapWrapper
            ? SmartContractFactory.StableSwapModuleWrapper(this.chainId).address
            : SmartContractFactory.StableSwapModule(this.chainId).address)
            .call();
        return BigNumber(allowance).isGreaterThanOrEqualTo(BigNumber(10 ** tokenInDecimal).multipliedBy(tokenIn));
    }
    getFeeIn() {
        const StableSwapModule = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModule(this.chainId), this.provider);
        return StableSwapModule.methods.feeIn().call();
    }
    getFeeOut() {
        const StableSwapModule = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModule(this.chainId), this.provider);
        return StableSwapModule.methods.feeOut().call();
    }
    getLastUpdate() {
        const StableSwapModule = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModule(this.chainId), this.provider);
        return StableSwapModule.methods.lastUpdate().call();
    }
    getDailySwapLimit() {
        const StableSwapModule = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModule(this.chainId), this.provider);
        return StableSwapModule.methods.dailySwapLimit().call();
    }
    getPoolBalance(tokenAddress) {
        const StableSwapModule = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModule(this.chainId), this.provider);
        return StableSwapModule.methods.tokenBalance(tokenAddress).call();
    }
    isDecentralizedState() {
        const StableSwapModule = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModule(this.chainId), this.provider);
        return StableSwapModule.methods.isDecentralizedState().call();
    }
    isUserWhitelisted(address) {
        const StableSwapModule = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModule(this.chainId), this.provider);
        return StableSwapModule.methods.isUserWhitelisted(address).call();
    }
    usersWrapperWhitelist(address) {
        const StableSwapModuleWrapper = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModuleWrapper(this.chainId), this.provider);
        return StableSwapModuleWrapper.methods.usersWhitelist(address).call();
    }
    getAmounts(amount, account) {
        const StableSwapModuleWrapper = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModuleWrapper(this.chainId), this.provider);
        const formattedTokenAmount = this.provider.utils.toWei(amount.toString(), 'ether');
        return StableSwapModuleWrapper.methods
            .getAmounts(formattedTokenAmount)
            .call({
            from: account,
        });
    }
    getTotalValueLocked() {
        const StableSwapModule = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModule(this.chainId), this.provider);
        return StableSwapModule.methods.totalValueLocked().call();
    }
    getDepositTracker(account) {
        const StableSwapModuleWrapper = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModuleWrapper(this.chainId), this.provider);
        return StableSwapModuleWrapper.methods.depositTracker(account).call();
    }
    getActualLiquidityAvailablePerUser(account) {
        const StableSwapModuleWrapper = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModuleWrapper(this.chainId), this.provider);
        return StableSwapModuleWrapper.methods
            .getActualLiquidityAvailablePerUser(account)
            .call();
    }
    getClaimableFeesPerUser(account) {
        const StableSwapModuleWrapper = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModuleWrapper(this.chainId), this.provider);
        return StableSwapModuleWrapper.methods
            .getClaimableFeesPerUser(account)
            .call();
    }
    getClaimedFXDFeeRewards(account) {
        const StableSwapModuleWrapper = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModuleWrapper(this.chainId), this.provider);
        return StableSwapModuleWrapper.methods.claimedFXDFeeRewards(account).call();
    }
    getClaimedTokenFeeRewards(account) {
        const StableSwapModuleWrapper = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModuleWrapper(this.chainId), this.provider);
        return StableSwapModuleWrapper.methods
            .claimedTokenFeeRewards(account)
            .call();
    }
    setProvider(provider) {
        this.provider = provider;
    }
    setChainId(chainId) {
        this.chainId = chainId;
    }
}
//# sourceMappingURL=StableSwapService.js.map