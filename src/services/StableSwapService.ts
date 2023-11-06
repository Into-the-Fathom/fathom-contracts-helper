import Xdc3 from "xdc3";
import { TransactionReceipt } from "xdc3-eth";
import BigNumber from "bignumber.js";

import { SmartContractFactory } from "utils/SmartContractFactory";
import {
  MAX_UINT256
} from "utils/Constants";
import { Web3Utils } from "utils/Web3Utils";

import IStableSwapService from "interfaces/services/IStableSwapService";
import { getEstimateGas } from "utils/getEstimateGas";

export default class StableSwapService implements IStableSwapService {
  provider: Xdc3;
  chainId: number;

  constructor(provider: Xdc3, chainId: number) {
    this.provider = provider;
    this.chainId = chainId;
  }

  swapTokenToStableCoin(
    account: string,
    tokenIn: string,
    tokenInDecimals: number,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const StableSwapModule = Web3Utils.getContractInstance(
          SmartContractFactory.StableSwapModule(this.chainId),
          this.provider
        );
        const options = { from: account, gas: 0 };

        const formattedTokenAmount = BigNumber(tokenIn).multipliedBy(10 ** tokenInDecimals).integerValue(BigNumber.ROUND_DOWN);

        const gas = await getEstimateGas(
          StableSwapModule,
          "swapTokenToStablecoin",
          [account, formattedTokenAmount],
          options
        );
        options.gas = gas;

        return StableSwapModule.methods
          .swapTokenToStablecoin(account, formattedTokenAmount)
          .send(options)
          .then((receipt: TransactionReceipt) => {
            resolve(receipt.blockNumber);
          })
          .catch((e: Error) => {
            reject(e);
          });
      } catch (e: any) {
        reject(e);
      }
    });
  }

  swapStableCoinToToken(
    account: string,
    tokenOut: string,
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const StableSwapModule = Web3Utils.getContractInstance(
          SmartContractFactory.StableSwapModule(this.chainId),
          this.provider
        );

        const options = { from: account, gas: 0 };

        const formattedTokenAmount = this.provider.utils.toWei(tokenOut, "ether");

        const gas = await getEstimateGas(
          StableSwapModule,
          "swapStablecoinToToken",
          [account, formattedTokenAmount],
          options
        );
        options.gas = gas;

        return StableSwapModule.methods
          .swapStablecoinToToken(account, formattedTokenAmount)
          .send(options)
          .then((receipt: TransactionReceipt) => {
            resolve(receipt.blockNumber);
          })
          .catch((e: Error) => {
            reject(e);
          });
      } catch (e: any) {
        reject(e);
      }
    });
  }

  addLiquidity(amount: number, account: string): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const StableSwapModuleWrapper = Web3Utils.getContractInstance(
          SmartContractFactory.StableSwapModuleWrapper(this.chainId),
          this.provider
        );
        const options = { from: account, gas: 0 };

        const formattedTokenAmount = this.provider.utils.toWei(amount.toString(), "ether");

        const gas = await getEstimateGas(
          StableSwapModuleWrapper,
          "depositTokens",
          [formattedTokenAmount],
          options
        );
        options.gas = gas;

        return StableSwapModuleWrapper.methods
          .depositTokens(formattedTokenAmount)
          .send(options)
          .then((receipt: TransactionReceipt) => {
            resolve(receipt.blockNumber);
          })
          .catch((e: Error) => {
            reject(e);
          });
      } catch (e: any) {
        reject(e);
      }
    });
  }

  removeLiquidity(amount: number, account: string): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const StableSwapModuleWrapper = Web3Utils.getContractInstance(
          SmartContractFactory.StableSwapModuleWrapper(this.chainId),
          this.provider
        );

        const options = { from: account, gas: 0 };

        const formattedTokenAmount = this.provider.utils.toWei(amount.toString(), "ether");

        const gas = await getEstimateGas(
          StableSwapModuleWrapper,
          "withdrawTokens",
          [formattedTokenAmount],
          options
        );
        options.gas = gas;

        return StableSwapModuleWrapper.methods
          .withdrawTokens(formattedTokenAmount)
          .send(options)
          .then((receipt: TransactionReceipt) => {
            resolve(receipt.blockNumber);
          })
          .catch((e: Error) => {
            reject(e);
          });
      } catch (e: any) {
        reject(e);
      }
    });
  }

  approveStableCoin(account: string, isStableSwapWrapper = false): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const FathomStableCoin = Web3Utils.getContractInstance(
          SmartContractFactory.FathomStableCoin(this.chainId),
          this.provider
        );

        const options = { from: account, gas: 0 };
        const approvalAddress = isStableSwapWrapper ?
          SmartContractFactory.StableSwapModuleWrapper(this.chainId).address :
          SmartContractFactory.StableSwapModule(this.chainId).address;

        const gas = await getEstimateGas(
          FathomStableCoin,
          "approve",
          [
            approvalAddress,
            MAX_UINT256
          ],
          options
        );
        options.gas = gas;

        return FathomStableCoin.methods
          .approve(
            approvalAddress,
            MAX_UINT256
          )
          .send(options)
          .then((receipt: TransactionReceipt) => {
            resolve(receipt.blockNumber);
          })
          .catch((e: Error) => {
            reject(e);
          });
      } catch (e: any) {
        reject(e);
      }
    });
  }

  async approveUsdt(
    account: string,
    isStableSwapWrapper = false
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const USStable = Web3Utils.getContractInstance(
          SmartContractFactory.USDT(this.chainId),
          this.provider
        );

        const options = { from: account, gas: 0 };
        const approvalAddress = isStableSwapWrapper ?
          SmartContractFactory.StableSwapModuleWrapper(this.chainId).address :
          SmartContractFactory.StableSwapModule(this.chainId).address;

        const gas = await getEstimateGas(
          USStable,
          "approve",
          [
            approvalAddress,
            MAX_UINT256
          ],
          options
        );
        options.gas = gas;

        return USStable.methods
          .approve(
            approvalAddress,
            MAX_UINT256
          )
          .send(options)
          .then((receipt: TransactionReceipt) => {
            resolve(receipt.blockNumber);
          })
          .catch((e: Error) => {
            reject(e);
          });
      } catch (e: any) {
        reject(e);
      }
    });
  }

  claimFeesRewards(account: string): Promise<number | Error> {
    return new Promise( async (resolve, reject) => {
      try {
        const StableSwapModuleWrapper = Web3Utils.getContractInstance(
          SmartContractFactory.StableSwapModuleWrapper(this.chainId),
          this.provider
        );
        const options = { from: account, gas: 0 };

        const gas = await getEstimateGas(
          StableSwapModuleWrapper,
          "claimFeesRewards",
          [],
          options
        );
        options.gas = gas;

        return StableSwapModuleWrapper.methods
          .claimFeesRewards()
          .send(options)
          .then((receipt: TransactionReceipt) => {
            resolve(receipt.blockNumber);
          })
          .catch((e: Error) => {
            reject(e);
          });
      } catch (e: any) {
        reject(e);
      }
    })
  }

  withdrawClaimedFees(account: string): Promise<number | Error> {
    return new Promise( async (resolve, reject) => {
      try {
        const StableSwapModuleWrapper = Web3Utils.getContractInstance(
          SmartContractFactory.StableSwapModuleWrapper(this.chainId),
          this.provider
        );
        const options = { from: account, gas: 0 };

        const gas = await getEstimateGas(
          StableSwapModuleWrapper,
          "withdrawClaimedFees",
          [],
          options
        );
        options.gas = gas;

        return StableSwapModuleWrapper.methods
          .withdrawClaimedFees()
          .send(options)
          .then((receipt: TransactionReceipt) => {
            resolve(receipt.blockNumber);
          })
          .catch((e: Error) => {
            reject(e);
          });
      } catch (e: any) {
        reject(e);
      }
    })
  }

  async approvalStatusStableCoin(
    account: string,
    tokenIn: string,
    tokenInDecimal: number,
    isStableSwapWrapper: boolean = false
  ) {
    const FathomStableCoin = Web3Utils.getContractInstance(
      SmartContractFactory.FathomStableCoin(this.chainId),
      this.provider
    );

    const allowance = await FathomStableCoin.methods
      .allowance(
        account,
        isStableSwapWrapper ?
          SmartContractFactory.StableSwapModuleWrapper(this.chainId).address :
          SmartContractFactory.StableSwapModule(this.chainId).address
      )
      .call();

    return BigNumber(allowance).isGreaterThanOrEqualTo(
      BigNumber(10 ** tokenInDecimal).multipliedBy(tokenIn)
    );
  }

  async approvalStatusUsdt(
    account: string,
    tokenIn: string,
    tokenInDecimal: number,
    isStableSwapWrapper: boolean = false
  ) {
    const USStable = Web3Utils.getContractInstance(
      SmartContractFactory.USDT(this.chainId),
      this.provider
    );

    const allowance = await USStable.methods
      .allowance(
        account,
        isStableSwapWrapper ?
          SmartContractFactory.StableSwapModuleWrapper(this.chainId).address :
          SmartContractFactory.StableSwapModule(this.chainId).address
      )
      .call();

    return BigNumber(allowance).isGreaterThanOrEqualTo(
      BigNumber(10 ** tokenInDecimal).multipliedBy(tokenIn)
    );
  }

  getFeeIn() {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      this.provider
    );

    return StableSwapModule.methods.feeIn().call();
  }

  getFeeOut() {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      this.provider
    );
    return StableSwapModule.methods.feeOut().call();
  }

  getLastUpdate() {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      this.provider
    );
    return StableSwapModule.methods.lastUpdate().call()
  }

  getDailySwapLimit() {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      this.provider
    );
    return StableSwapModule.methods.dailySwapLimit().call();
  }

  getPoolBalance(tokenAddress: string) {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      this.provider
    );
    return StableSwapModule.methods.tokenBalance(tokenAddress).call();
  }

  isDecentralizedState() {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      this.provider
    );
    return StableSwapModule.methods.isDecentralizedState().call();
  }

  isUserWhitelisted(address: string) {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      this.provider
    );
    return StableSwapModule.methods.isUserWhitelisted(address).call();
  }

  usersWrapperWhitelist(address: string) {
    const StableSwapModuleWrapper = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModuleWrapper(this.chainId),
      this.provider
    );
    return StableSwapModuleWrapper.methods.usersWhitelist(address).call();
  }

  getAmounts(amount: string, account: string) {
    const StableSwapModuleWrapper = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModuleWrapper(this.chainId),
      this.provider
    );
    const formattedTokenAmount = this.provider.utils.toWei(amount.toString(), "ether");
    return StableSwapModuleWrapper.methods.getAmounts(formattedTokenAmount).call({
      from: account
    });
  }

  getTotalValueLocked() {
    const StableSwapModule = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModule(this.chainId),
      this.provider
    );
    return StableSwapModule.methods.totalValueLocked().call();
  }

  getDepositTracker(account: string) {
    const StableSwapModuleWrapper = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModuleWrapper(this.chainId),
      this.provider
    );
    return StableSwapModuleWrapper.methods.depositTracker(account).call();
  }

  getActualLiquidityAvailablePerUser(account: string) {
    const StableSwapModuleWrapper = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModuleWrapper(this.chainId),
      this.provider
    );
    return StableSwapModuleWrapper.methods.getActualLiquidityAvailablePerUser(account).call();
  }

  getClaimableFeesPerUser(account: string) {
    const StableSwapModuleWrapper = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModuleWrapper(this.chainId),
      this.provider
    );
    return StableSwapModuleWrapper.methods.getClaimableFeesPerUser(account).call();
  }

  getClaimedFXDFeeRewards(account: string) {
    const StableSwapModuleWrapper = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModuleWrapper(this.chainId),
      this.provider
    );
    return StableSwapModuleWrapper.methods.claimedFXDFeeRewards(account).call();
  }

  getClaimedTokenFeeRewards(account: string) {
    const StableSwapModuleWrapper = Web3Utils.getContractInstance(
      SmartContractFactory.StableSwapModuleWrapper(this.chainId),
      this.provider
    );
    return StableSwapModuleWrapper.methods.claimedTokenFeeRewards(account).call();
  }

  setProvider(provider: Xdc3) {
    this.provider = provider;
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}
