import { ProposalVotes } from '../models/IProposal';
import EventEmitter from 'eventemitter3';
import { DefaultProvider } from '../../types';

export default interface IProposalService {
  emitter: EventEmitter;
  provider: DefaultProvider;
  chainId: number;

  createProposal(
    targets: string[],
    values: number[],
    calldatas: string[],
    description: string,
    account: string,
  ): Promise<number | Error>;

  castVote(
    proposalId: string,
    account: string,
    support: string,
  ): Promise<number | Error>;

  executeProposal(
    targets: string[],
    values: number[],
    calldatas: string[],
    description: string,
    account: string,
  ): Promise<number | Error>;

  queueProposal(
    targets: string[],
    values: number[],
    calldatas: string[],
    description: string,
    account: string,
  ): Promise<number | Error>;

  viewProposalState(proposalId: string, account: string): Promise<string>;

  nextAcceptableProposalTimestamp(account: string): Promise<number>;

  getVBalance(account: string): Promise<number>;

  hasVoted(proposalId: string, account: string): Promise<boolean>;

  quorum(blockNumber: string): Promise<number>;

  proposalVotes(proposalId: string): Promise<ProposalVotes>;

  proposalThreshold(): Promise<number>;

  setChainId(chainId: number): void;

  setProvider(provider: DefaultProvider): void;
}
