import Xdc3 from 'xdc3';
import EventEmitter from 'eventemitter3';
import IProposalService from '../interfaces/services/IProposalService';
export default class ProposalService implements IProposalService {
    provider: Xdc3;
    chainId: number;
    emitter: EventEmitter;
    constructor(provider: Xdc3, chainId: number);
    createProposal(targets: string[], values: number[], callData: string[], description: string, account: string): Promise<number | Error>;
    executeProposal(targets: string[], values: number[], callData: string[], description: string, account: string): Promise<number | Error>;
    queueProposal(targets: string[], values: number[], callData: string[], description: string, account: string): Promise<number | Error>;
    castVote(proposalId: string, account: string, support: string): Promise<number | Error>;
    hasVoted(proposalId: string, account: string): any;
    viewProposalState(proposalId: string, account: string): any;
    nextAcceptableProposalTimestamp(account: string): any;
    getVBalance(account: string): any;
    quorum(blockNumber: string): any;
    proposalVotes(proposalId: string): any;
    proposalThreshold(): any;
    setProvider(provider: Xdc3): void;
    setChainId(chainId: number): void;
}
//# sourceMappingURL=ProposalService.d.ts.map