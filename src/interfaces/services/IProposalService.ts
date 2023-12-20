import { ProposalVotes } from '../models/IProposal';
import EventEmitter from 'eventemitter3';
import { DefaultProvider } from '../../types';
import { BigNumber } from 'fathom-ethers';

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

  viewProposalState(proposalId: string, account: string): Promise<number>;

  nextAcceptableProposalTimestamp(account: string): Promise<BigNumber>;

  getVBalance(account: string): Promise<BigNumber>;

  hasVoted(proposalId: string, account: string): Promise<boolean>;

  quorum(blockNumber: string): Promise<BigNumber>;

  proposalVotes(proposalId: string): Promise<ProposalVotes>;

  proposalThreshold(): Promise<BigNumber>;

  setChainId(chainId: number): void;

  setProvider(provider: DefaultProvider): void;
}
