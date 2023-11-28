import { SignerOrProvider } from '../types';
import { Contract, ContractInterface } from 'ethers';

export interface ContractMetaData {
  address: string;
  abi: ContractInterface;
}

export class Web3Utils {
  static contracts = new Map<string, Contract>();
  public static getContractInstance(
    contractMetaData: ContractMetaData,
    provider: SignerOrProvider,
    type = 'provider',
  ): Contract {
    const key = type + contractMetaData.address;

    if (Web3Utils.contracts.has(key)) {
      return Web3Utils.contracts.get(key) as Contract;
    }

    const contract = new Contract(
      contractMetaData.address,
      contractMetaData.abi,
      provider,
    );

    Web3Utils.contracts.set(key, contract);
    return contract;
  }

  public static getContractInstanceFrom(
    abi: ContractInterface,
    address: string,
    provider: SignerOrProvider,
    type = 'provider',
  ): Contract {
    const key = type + address;

    if (Web3Utils.contracts.has(key)) {
      return Web3Utils.contracts.get(key) as Contract;
    }
    const contract = new Contract(address, abi, provider);

    Web3Utils.contracts.set(key, contract);
    return contract;
  }

  public static clearContracts() {
    Web3Utils.contracts.clear();
  }
}
