import Xdc3 from 'xdc3';
import { Contract } from 'xdc3-eth-contract';
import { AbiItem } from 'xdc3-utils';
export interface XdcContractMetaData {
  address: string;
  abi: AbiItem[];
}

export class Web3Utils {
  static contracts = new Map<string, Contract>();
  public static getContractInstance(
    contractMetaData: XdcContractMetaData,
    provider: Xdc3,
  ): Contract {
    if (Web3Utils.contracts.has(contractMetaData.address)) {
      return Web3Utils.contracts.get(contractMetaData.address) as Contract;
    }

    const contract = new provider.eth.Contract(
      contractMetaData.abi as XdcContractMetaData['abi'],
      contractMetaData.address,
    );

    Web3Utils.contracts.set(contractMetaData.address, contract);

    return contract;
  }

  public static getContractInstanceFrom(
    abi: AbiItem[],
    address: string,
    provider: Xdc3,
  ): Contract {
    if (Web3Utils.contracts.has(address)) {
      return Web3Utils.contracts.get(address) as Contract;
    }

    const contract = new provider.eth.Contract(abi as AbiItem[], address);

    Web3Utils.contracts.set(address, contract);

    return contract;
  }

  public static clearContracts() {
    Web3Utils.contracts.clear();
  }
}
