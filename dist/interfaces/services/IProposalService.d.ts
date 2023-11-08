import Xdc3 from 'xdc3';
import { ProposalVotes } from '../models/IProposal';
export default interface IProposalService {
    createProposal(targets: string[], values: number[], calldatas: string[], description: string, account: string): Promise<number | Error>;
    castVote(proposalId: string, account: string, support: string): Promise<number | Error>;
    executeProposal(targets: string[], values: number[], calldatas: string[], description: string, account: string): Promise<number | Error>;
    queueProposal(targets: string[], values: number[], calldatas: string[], description: string, account: string): Promise<number | Error>;
    viewProposalState(proposalId: string, account: string): Promise<string>;
    nextAcceptableProposalTimestamp(account: string): Promise<number>;
    getVBalance(account: string): Promise<number>;
    hasVoted(proposalId: string, account: string): Promise<boolean>;
    quorum(blockNumber: string): Promise<number>;
    proposalVotes(proposalId: string): Promise<ProposalVotes>;
    proposalThreshold(): Promise<number>;
    setChainId(chainId: number): void;
    setProvider(provider: Xdc3): void;
}
//# sourceMappingURL=IProposalService.d.ts.map