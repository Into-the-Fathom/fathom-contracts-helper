import Xdc3 from "xdc3";
import {TransactionReceipt} from "xdc3-eth";
import BigNumber from "bignumber.js";

import {SmartContractFactory} from "utils/SmartContractFactory";

import IStakingService from "interfaces/services/IStakingService";

import {getEstimateGas} from "utils/getEstimateGas";

import {
  MAX_UINT256,
} from "utils/Constants";
import {Web3Utils} from "utils/Web3Utils";

export const DAY_SECONDS = 24 * 60 * 60;

export default class StakingService implements IStakingService {
  provider: Xdc3;
  chainId: number;

  constructor(provider: Xdc3, chainId: number) {
    this.provider = provider;
    this.chainId = chainId;
  }

  createLock(
    account: string,
    stakePosition: number,
    unlockPeriod: number
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const Staking = Web3Utils.getContractInstance(
          SmartContractFactory.Staking(this.chainId),
          this.provider
        );
        const endTime = unlockPeriod * DAY_SECONDS;

        const options = {from: account, gas: 0};
        const gas = await getEstimateGas(
          Staking,
          "createLock",
          [this.provider.utils.toWei(stakePosition.toString(), "ether"), endTime],
          options
        );
        options.gas = gas;

        Staking.methods
          .createLock(this.provider.utils.toWei(stakePosition.toString(), "ether"), endTime)
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

  handleUnlock(
    account: string,
    lockId: number,
    amount: number
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const Staking = Web3Utils.getContractInstance(
          SmartContractFactory.Staking(this.chainId),
          this.provider
        );

        const options = {from: account, gas: 0};
        const gas = await getEstimateGas(
          Staking,
          "unlockPartially",
          [lockId, this.provider.utils.toWei(amount.toString(), "ether")],
          options
        );
        options.gas = gas;

        Staking.methods
          .unlockPartially(lockId, this.provider.utils.toWei(amount.toString(), "ether"))
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

  handleEarlyWithdrawal(
    account: string,
    lockId: number
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const Staking = Web3Utils.getContractInstance(
          SmartContractFactory.Staking(this.chainId),
          this.provider
        );

        const options = {from: account, gas: 0};
        const gas = await getEstimateGas(
          Staking,
          "earlyUnlock",
          [lockId],
          options
        );
        options.gas = gas;

        return Staking.methods
          .earlyUnlock(lockId)
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

  handleClaimRewards(
    account: string,
    streamId: number
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const Staking = Web3Utils.getContractInstance(
          SmartContractFactory.Staking(this.chainId),
          this.provider
        );

        const options = {from: account, gas: 0};
        const gas = await getEstimateGas(
          Staking,
          "claimAllLockRewardsForStream",
          [streamId],
          options
        );
        options.gas = gas;

        Staking.methods
          .claimAllLockRewardsForStream(streamId)
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

  handleWithdrawAll(
    account: string,
    streamId: number
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const Staking = Web3Utils.getContractInstance(
          SmartContractFactory.Staking(this.chainId),
          this.provider
        );

        /**
         * For FTHM stream is 0
         */
        const options = {from: account, gas: 0};
        const gas = await getEstimateGas(
          Staking,
          "withdrawStream",
          [streamId],
          options
        );
        options.gas = gas;

        Staking.methods
          .withdrawStream(streamId)
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

  approveStakingFTHM(
    account: string,
    fthmTokenAddress: string
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const FTHMToken = Web3Utils.getContractInstance(
          SmartContractFactory.MainToken(fthmTokenAddress),
          this.provider
        );

        const StakingAddress = SmartContractFactory.Staking(
          this.chainId
        ).address;

        const options = {from: account, gas: 0};
        const gas = await getEstimateGas(
          FTHMToken,
          "approve",
          [StakingAddress, MAX_UINT256],
          options
        );
        options.gas = gas;

        FTHMToken.methods
          .approve(StakingAddress, MAX_UINT256)
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

  async approvalStatusStakingFTHM(
    address: string,
    stakingPosition: number,
    fthmTokenAddress: string
  ) {
    const FTHMToken = Web3Utils.getContractInstance(
      SmartContractFactory.MainToken(fthmTokenAddress),
      this.provider
    );

    const StakingAddress = SmartContractFactory.Staking(this.chainId).address;

    const allowance = await FTHMToken.methods
      .allowance(address, StakingAddress)
      .call();

    return BigNumber(allowance).isGreaterThanOrEqualTo(
      this.provider.utils.toWei(stakingPosition.toString(), "ether")
    );
  }

  getStreamClaimableAmountPerLock(
    streamId: number,
    account: string,
    lockId: number
  ) {
    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      this.provider
    );
    return Staking.methods
      .getStreamClaimableAmountPerLock(streamId, account, lockId)
      .call();
  }

  getStreamClaimableAmount(account: string) {
    const StakingGetter = Web3Utils.getContractInstance(
      SmartContractFactory.StakingGetter(this.chainId),
      this.provider
    );
    return StakingGetter.methods.getStreamClaimableAmount(0, account).call();
  }

  getMinLockPeriod() {
    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      this.provider
    );
    return Staking.methods.minLockPeriod().call();
  }

  getPairPrice(token0: string, token1: string) {
    const DexPriceOracle = Web3Utils.getContractInstance(
      SmartContractFactory.DexPriceOracle(this.chainId),
      this.provider
    );
    return DexPriceOracle.methods.getPrice(token0, token1).call();
  }

  setProvider(provider: Xdc3) {
    this.provider = provider;
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}
