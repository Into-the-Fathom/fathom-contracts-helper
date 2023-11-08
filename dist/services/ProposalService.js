import { keccak256 } from 'xdc3-utils';
import EventEmitter from 'eventemitter3';
import { SmartContractFactory } from '../utils/SmartContractFactory';
import { Web3Utils } from '../utils/Web3Utils';
import { getEstimateGas } from '../utils/getEstimateGas';
import { TransactionStatus, TransactionType, } from '../interfaces/models/ITransaction';
export default class ProposalService {
    constructor(provider, chainId) {
        this.provider = provider;
        this.chainId = chainId;
        this.emitter = new EventEmitter();
    }
    createProposal(targets, values, callData, description, account) {
        return new Promise(async (resolve, reject) => {
            try {
                const FathomGovernor = Web3Utils.getContractInstance(SmartContractFactory.FathomGovernor(this.chainId), this.provider);
                const options = { from: account, gas: 0 };
                const gas = await getEstimateGas(FathomGovernor, 'propose', [targets, values, callData, description], options);
                options.gas = gas;
                FathomGovernor.methods
                    .propose(targets, values, callData, description)
                    .send(options)
                    .on('transactionHash', (hash) => {
                    this.emitter.emit('pendingTransaction', {
                        hash: hash,
                        type: TransactionType.CreateProposal,
                        active: false,
                        status: TransactionStatus.None,
                    });
                })
                    .then((receipt) => {
                    this.emitter.emit('successTransaction', {
                        type: TransactionType.CreateProposal,
                        receipt,
                    });
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    this.emitter.emit('errorTransaction', {
                        type: TransactionType.CreateProposal,
                        error,
                    });
                    reject(error);
                });
            }
            catch (error) {
                this.emitter.emit('errorTransaction', {
                    type: TransactionType.CreateLock,
                    error,
                });
                reject(error);
            }
        });
    }
    executeProposal(targets, values, callData, description, account) {
        return new Promise(async (resolve, reject) => {
            try {
                const FathomGovernor = Web3Utils.getContractInstance(SmartContractFactory.FathomGovernor(this.chainId), this.provider);
                const options = { from: account, gas: 0 };
                const gas = await getEstimateGas(FathomGovernor, 'execute', [targets, values, callData, keccak256(description)], options);
                options.gas = gas;
                return FathomGovernor.methods
                    .execute(targets, values, callData, keccak256(description))
                    .send(options)
                    .on('transactionHash', (hash) => {
                    this.emitter.emit('pendingTransaction', {
                        hash: hash,
                        type: TransactionType.ExecuteProposal,
                        active: false,
                        status: TransactionStatus.None,
                    });
                })
                    .then((receipt) => {
                    this.emitter.emit('successTransaction', {
                        type: TransactionType.ExecuteProposal,
                        receipt,
                    });
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    this.emitter.emit('errorTransaction', {
                        type: TransactionType.ExecuteProposal,
                        error,
                    });
                    reject(error);
                });
            }
            catch (error) {
                this.emitter.emit('errorTransaction', {
                    type: TransactionType.ExecuteProposal,
                    error,
                });
                reject(error);
            }
        });
    }
    queueProposal(targets, values, callData, description, account) {
        return new Promise(async (resolve, reject) => {
            try {
                const FathomGovernor = Web3Utils.getContractInstance(SmartContractFactory.FathomGovernor(this.chainId), this.provider);
                const options = { from: account, gas: 0 };
                const gas = await getEstimateGas(FathomGovernor, 'queue', [targets, values, callData, keccak256(description)], options);
                options.gas = gas;
                FathomGovernor.methods
                    .queue(targets, values, callData, keccak256(description))
                    .send(options)
                    .on('transactionHash', (hash) => {
                    this.emitter.emit('pendingTransaction', {
                        hash: hash,
                        type: TransactionType.QueueProposal,
                        active: false,
                        status: TransactionStatus.None,
                    });
                })
                    .then((receipt) => {
                    this.emitter.emit('successTransaction', {
                        type: TransactionType.QueueProposal,
                        receipt,
                    });
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    this.emitter.emit('errorTransaction', {
                        type: TransactionType.QueueProposal,
                        error,
                    });
                    reject(error);
                });
            }
            catch (error) {
                this.emitter.emit('errorTransaction', {
                    type: TransactionType.QueueProposal,
                    error,
                });
                reject(error);
            }
        });
    }
    castVote(proposalId, account, support) {
        return new Promise(async (resolve, reject) => {
            try {
                const FathomGovernor = Web3Utils.getContractInstance(SmartContractFactory.FathomGovernor(this.chainId), this.provider);
                const options = { from: account, gas: 0 };
                const gas = await getEstimateGas(FathomGovernor, 'castVote', [proposalId, support], options);
                options.gas = gas;
                return FathomGovernor.methods
                    .castVote(proposalId, support)
                    .send(options)
                    .on('transactionHash', (hash) => {
                    this.emitter.emit('pendingTransaction', {
                        hash: hash,
                        type: TransactionType.CastVote,
                        active: false,
                        status: TransactionStatus.None,
                    });
                })
                    .then((receipt) => {
                    this.emitter.emit('successTransaction', {
                        type: TransactionType.CastVote,
                        receipt,
                    });
                    resolve(receipt.blockNumber);
                })
                    .catch((error) => {
                    this.emitter.emit('errorTransaction', {
                        type: TransactionType.CastVote,
                        error,
                    });
                    reject(error);
                });
            }
            catch (error) {
                this.emitter.emit('errorTransaction', {
                    type: TransactionType.CastVote,
                    error,
                });
                reject(error);
            }
        });
    }
    hasVoted(proposalId, account) {
        const FathomGovernor = Web3Utils.getContractInstance(SmartContractFactory.FathomGovernor(this.chainId), this.provider);
        return FathomGovernor.methods.hasVoted(proposalId, account).call();
    }
    viewProposalState(proposalId, account) {
        const FathomGovernor = Web3Utils.getContractInstance(SmartContractFactory.FathomGovernor(this.chainId), this.provider);
        return FathomGovernor.methods.state(proposalId).call({ from: account });
    }
    nextAcceptableProposalTimestamp(account) {
        const FathomGovernor = Web3Utils.getContractInstance(SmartContractFactory.FathomGovernor(this.chainId), this.provider);
        return FathomGovernor.methods
            .nextAcceptableProposalTimestamp(account)
            .call();
    }
    getVBalance(account) {
        const VeFathom = Web3Utils.getContractInstance(SmartContractFactory.vFathom(this.chainId), this.provider);
        return VeFathom.methods.balanceOf(account).call();
    }
    quorum(blockNumber) {
        const FathomGovernor = Web3Utils.getContractInstance(SmartContractFactory.MainFathomGovernor(this.chainId), this.provider);
        return FathomGovernor.methods.quorum(blockNumber).call();
    }
    proposalVotes(proposalId) {
        const FathomGovernor = Web3Utils.getContractInstance(SmartContractFactory.MainFathomGovernor(this.chainId), this.provider);
        return FathomGovernor.methods.proposalVotes(proposalId).call();
    }
    proposalThreshold() {
        const FathomGovernor = Web3Utils.getContractInstance(SmartContractFactory.MainFathomGovernor(this.chainId), this.provider);
        return FathomGovernor.methods.proposalThreshold().call();
    }
    setProvider(provider) {
        this.provider = provider;
    }
    setChainId(chainId) {
        this.chainId = chainId;
    }
}
//# sourceMappingURL=ProposalService.js.map