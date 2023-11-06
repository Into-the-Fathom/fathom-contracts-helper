import Xdc3 from "xdc3";
import {TransactionReceipt} from "xdc3-eth";
import {keccak256} from "xdc3-utils";

import {SmartContractFactory} from "utils/SmartContractFactory";
import IProposalService from "interfaces/services/IProposalService";
import {Web3Utils} from "utils/Web3Utils";
import {getEstimateGas} from "utils/getEstimateGas";

export default class ProposalService implements IProposalService {
  provider: Xdc3;
  chainId: number;

  constructor(provider: Xdc3, chainId: number) {
    this.provider = provider;
    this.chainId = chainId;
  }

  createProposal(
    targets: string[],
    values: number[],
    callData: string[],
    description: string,
    account: string
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const FathomGovernor = Web3Utils.getContractInstance(
          SmartContractFactory.FathomGovernor(this.chainId),
          this.provider
        );

        const options = {from: account, gas: 0};
        const gas = await getEstimateGas(
          FathomGovernor,
          "propose",
          [targets, values, callData, description],
          options
        );

        options.gas = gas;
        FathomGovernor.methods
          .propose(targets, values, callData, description)
          .send(options)
          .then((transactionReceipt: TransactionReceipt) => {
            resolve(transactionReceipt.blockNumber);
          })
          .catch((e: Error) => {
            reject(e);
          });
      } catch (e: any) {
        reject(e);
      }
    });
  }

  executeProposal(
    targets: string[],
    values: number[],
    callData: string[],
    description: string,
    account: string
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const FathomGovernor = Web3Utils.getContractInstance(
          SmartContractFactory.FathomGovernor(this.chainId),
          this.provider
        );

        const options = {from: account, gas: 0};
        const gas = await getEstimateGas(
          FathomGovernor,
          "execute",
          [targets, values, callData, keccak256(description)],
          options
        );

        options.gas = gas;
        return FathomGovernor.methods
          .execute(targets, values, callData, keccak256(description))
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

  queueProposal(
    targets: string[],
    values: number[],
    callData: string[],
    description: string,
    account: string
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const FathomGovernor = Web3Utils.getContractInstance(
          SmartContractFactory.FathomGovernor(this.chainId),
          this.provider
        );

        const options = {from: account, gas: 0};
        const gas = await getEstimateGas(
          FathomGovernor,
          "queue",
          [targets, values, callData, keccak256(description)],
          options
        );
        options.gas = gas;
        FathomGovernor.methods
          .queue(targets, values, callData, keccak256(description))
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

  castVote(
    proposalId: string,
    account: string,
    support: string
  ): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const FathomGovernor = Web3Utils.getContractInstance(
          SmartContractFactory.FathomGovernor(this.chainId),
          this.provider
        );

        const options = {from: account, gas: 0};
        const gas = await getEstimateGas(
          FathomGovernor,
          "castVote",
          [proposalId, support],
          options
        );
        options.gas = gas;
        return FathomGovernor.methods
          .castVote(proposalId, support)
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

  hasVoted(
    proposalId: string,
    account: string
  ) {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.FathomGovernor(this.chainId),
      this.provider
    );
    return FathomGovernor.methods.hasVoted(proposalId, account).call();
  }

  viewProposalState(
    proposalId: string,
    account: string
  ) {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.FathomGovernor(this.chainId),
      this.provider
    );
    return FathomGovernor.methods.state(proposalId).call({from: account});
  }

  nextAcceptableProposalTimestamp(account: string) {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.FathomGovernor(this.chainId),
      this.provider
    );

    return FathomGovernor.methods
      .nextAcceptableProposalTimestamp(account)
      .call();
  }

  getVBalance(account: string) {
    const VeFathom = Web3Utils.getContractInstance(
      SmartContractFactory.vFathom(this.chainId),
      this.provider
    );

    return VeFathom.methods.balanceOf(account).call();
  }

  quorum(blockNumber: string) {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.MainFathomGovernor(this.chainId),
      this.provider
    );

    return FathomGovernor.methods.quorum(blockNumber).call();
  }

  proposalVotes(proposalId: string) {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.MainFathomGovernor(this.chainId),
      this.provider
    );

    return FathomGovernor.methods.proposalVotes(proposalId).call();
  }

  proposalThreshold() {
    const FathomGovernor = Web3Utils.getContractInstance(
      SmartContractFactory.MainFathomGovernor(this.chainId),
      this.provider
    );

    return FathomGovernor.methods.proposalThreshold().call();
  }

  setProvider(provider: Xdc3) {
    this.provider = provider;
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}
