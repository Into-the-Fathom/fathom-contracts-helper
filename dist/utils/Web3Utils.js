export class Web3Utils {
    static getContractInstance(contractMetaData, provider) {
        if (Web3Utils.contracts.has(contractMetaData.address)) {
            return Web3Utils.contracts.get(contractMetaData.address);
        }
        const contract = new provider.eth.Contract(contractMetaData.abi, contractMetaData.address);
        Web3Utils.contracts.set(contractMetaData.address, contract);
        return contract;
    }
    static getContractInstanceFrom(abi, address, provider) {
        if (Web3Utils.contracts.has(address)) {
            return Web3Utils.contracts.get(address);
        }
        const contract = new provider.eth.Contract(abi, address);
        Web3Utils.contracts.set(address, contract);
        return contract;
    }
    static clearContracts() {
        Web3Utils.contracts.clear();
    }
}
Web3Utils.contracts = new Map();
//# sourceMappingURL=Web3Utils.js.map