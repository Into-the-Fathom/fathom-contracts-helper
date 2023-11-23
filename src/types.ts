import { JsonRpcProvider, Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';

export declare enum ChainId {
  XDC = 50,
  AXDC = 51,
}

export type DefaultProvider = JsonRpcProvider;
export type SignerOrProvider = Signer | Provider;
