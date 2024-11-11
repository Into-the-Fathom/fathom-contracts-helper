import { JsonRpcProvider, Provider } from '@into-the-fathom/providers';
import { Signer } from 'fathom-ethers';

export declare enum ChainId {
  XDC = 50,
  AXDC = 51,
}

export type DefaultProvider = JsonRpcProvider;
export type SignerOrProvider = Signer | Provider;
