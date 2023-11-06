export class Web3Utils {
    static getContractInstance(contractMetaData, library) {
        return new library.eth.Contract(contractMetaData.abi, contractMetaData.address);
    }
    static getContractInstanceFrom(abi, address, library) {
        return new library.eth.Contract(abi, address);
    }
}
//# sourceMappingURL=Web3Utils.js.map