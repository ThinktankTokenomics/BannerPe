// web3.js - Full Replacement for New Contract
const CONTRACT_ADDRESS = '0x5dF9a69659eAc8766F0789eD02bd18e0a85A0ff5';

const CONTRACT_ABI = [
    { "inputs": [{ "internalType": "string", "name": "_handle", "type": "string" }], "name": "addSpecialAccount", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "stateMutability": "payable", "type": "constructor" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "rentalId", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "verifier", "type": "address" }, { "indexed": false, "internalType": "string", "name": "proof", "type": "string" }], "name": "BannerVerified", "type": "event" },
    { "inputs": [{ "internalType": "string", "name": "_twitterHandle", "type": "string" }], "name": "createRental", "outputs": [], "stateMutability": "payable", "type": "function" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "rentalId", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "PaymentReleased", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "rentalId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "advertiser", "type": "address" }, { "indexed": false, "internalType": "string", "name": "twitterHandle", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" }], "name": "RentalCreated", "type": "event" },
    { "inputs": [{ "internalType": "uint256", "name": "_rentalId", "type": "uint256" }, { "internalType": "string", "name": "_proof", "type": "string" }], "name": "verifyBanner", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }], "name": "getUserRentals", "outputs": [{ "components": [{ "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "address", "name": "advertiser", "type": "address" }, { "internalType": "string", "name": "twitterHandle", "type": "string" }, { "internalType": "uint256", "name": "totalPrice", "type": "uint256" }, { "internalType": "enum BannerSpace.Status", "name": "status", "type": "uint8" }, { "internalType": "string", "name": "proof", "type": "string" }], "internalType": "struct BannerSpace.Rental[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "nextRentalId", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "rentals", "outputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "address", "name": "advertiser", "type": "address" }, { "internalType": "string", "name": "twitterHandle", "type": "string" }, { "internalType": "uint256", "name": "totalPrice", "type": "uint256" }, { "internalType": "enum BannerSpace.Status", "name": "status", "type": "uint8" }, { "internalType": "string", "name": "proof", "type": "string" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "string", "name": "", "type": "string" }], "name": "specialAccounts", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }
];

class BannerSpaceWeb3 {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.isConnected = false;
        this.userAddress = null;
    }

    async init() {
        if (typeof window.ethereum !== 'undefined') {
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            this.signer = this.provider.getSigner();
            this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
            try {
                const accounts = await this.provider.listAccounts();
                if (accounts.length > 0) {
                    this.userAddress = accounts[0];
                    this.isConnected = true;
                }
            } catch (e) { console.error("Init error:", e); }
        }
    }

    async createRental(handle, priceInEth) {
        if (!this.isConnected) await this.init();
        const tx = await this.contract.createRental(handle, {
            value: ethers.utils.parseEther(priceInEth.toString())
        });
        return await tx.wait();
    }

    async verifyBanner(rentalId, proof) {
        if (!this.isConnected) await this.init();
        const tx = await this.contract.verifyBanner(rentalId, proof);
        return await tx.wait();
    }

    async getUserRentals(address) {
        if (!this.isConnected) await this.init();
        return await this.contract.getUserRentals(address);
    }
}
window.BannerSpaceWeb3 = BannerSpaceWeb3;
