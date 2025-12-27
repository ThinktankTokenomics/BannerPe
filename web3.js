// web3.js - Real Blockchain Integration for BannerSpace

// IMPORTANT: Your contract address from Remix
const CONTRACT_ADDRESS = '0x985f92759205f2F8AeFE0b85c83Ad9BC73158Fb3';

// IMPORTANT: YOUR ACTUAL ABI from Remix (Updated)
const CONTRACT_ABI = [
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "rentalId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "verifier",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "proof",
				"type": "string"
			}
		],
		"name": "BannerVerified",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_rentalId",
				"type": "uint256"
			}
		],
		"name": "cancelRental",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_dailyPrice",
				"type": "uint256"
			}
		],
		"name": "createListing",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "emergencyWithdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "EmergencyWithdraw",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "listingId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "dailyPrice",
				"type": "uint256"
			}
		],
		"name": "ListingCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "listingId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newPrice",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			}
		],
		"name": "ListingUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "rentalId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "PaymentReleased",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "rentalId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "listingId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "advertiser",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "startTime",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "endTime",
				"type": "uint256"
			}
		],
		"name": "RentalStarted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_listingId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_days",
				"type": "uint256"
			}
		],
		"name": "rentBanner",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_listingId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_newPrice",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_isActive",
				"type": "bool"
			}
		],
		"name": "updateListing",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_rentalId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_proof",
				"type": "string"
			}
		],
		"name": "verifyBanner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [],
		"name": "getAllListings",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getContractBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_listingId",
				"type": "uint256"
			}
		],
		"name": "getListingDetails",
		"outputs": [
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "dailyPrice",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "totalEarned",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_rentalId",
				"type": "uint256"
			}
		],
		"name": "getRentalDetails",
		"outputs": [
			{
				"internalType": "address",
				"name": "advertiser",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "listingId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "startTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "endTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalAmount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "lastVerified",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "proof",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "listingCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "listings",
		"outputs": [
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "dailyPrice",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "totalEarned",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "platformFee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "rentalCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "rentals",
		"outputs": [
			{
				"internalType": "address",
				"name": "advertiser",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "listingId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "startTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "endTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalAmount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "lastVerified",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "verificationProof",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userListings",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userRentals",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "verifiedRentals",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

class BannerSpaceWeb3 {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.userAddress = null;
        this.contractAddress = CONTRACT_ADDRESS;
        this.contractABI = CONTRACT_ABI;
        this.isConnected = false;
        this.ethers = null;
    }
    
    // Initialize Web3
    async init() {
        // Check if MetaMask is installed
        if (typeof window.ethereum === 'undefined') {
            showToast('Please install MetaMask extension!', 'error');
            return false;
        }
        
        // Check if ethers is loaded
        if (typeof ethers === 'undefined') {
            showToast('Loading blockchain library...', 'warning');
            // Try to load ethers from CDN
            await this.loadEthers();
        }
        
        this.ethers = ethers;
        
        try {
            // Request account access
            this.provider = window.ethereum;
            await this.provider.request({ method: 'eth_requestAccounts' });
            
            // Get signer
            const ethersProvider = new ethers.providers.Web3Provider(this.provider);
            this.signer = ethersProvider.getSigner();
            this.userAddress = await this.signer.getAddress();
            
            // Check network (Sepolia chain ID: 11155111)
            const network = await ethersProvider.getNetwork();
            const sepoliaChainId = 11155111;
            
            if (network.chainId !== sepoliaChainId) {
                showToast('Please switch to Sepolia Testnet', 'warning');
                const switched = await this.switchToSepolia();
                if (!switched) {
                    showToast('Failed to switch network', 'error');
                    return false;
                }
                // Refresh provider after network switch
                await new Promise(resolve => setTimeout(resolve, 2000));
                return this.init(); // Re-initialize
            }
            
            // Create contract instance
            this.contract = new ethers.Contract(
                this.contractAddress,
                this.contractABI,
                this.signer
            );
            
            this.isConnected = true;
            console.log('✅ Connected to contract:', this.contractAddress);
            console.log('✅ User address:', this.userAddress);
            
            return true;
            
        } catch (error) {
            console.error('Web3 init error:', error);
            showToast('Failed to connect wallet: ' + error.message, 'error');
            return false;
        }
    }
    
    // Load ethers from CDN if not available
    async loadEthers() {
        return new Promise((resolve, reject) => {
            if (typeof ethers !== 'undefined') {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdn.ethers.io/lib/ethers-5.7.umd.min.js';
            script.type = 'text/javascript';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load ethers.js'));
            document.head.appendChild(script);
        });
    }
    
    // Switch to Sepolia network
    async switchToSepolia() {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID in hex
            });
            return true;
        } catch (error) {
            if (error.code === 4902) {
                // Chain not added, let's add it
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0xaa36a7',
                            chainName: 'Sepolia Test Network',
                            nativeCurrency: {
                                name: 'Sepolia ETH',
                                symbol: 'ETH',
                                decimals: 18
                            },
                            rpcUrls: ['https://rpc.sepolia.org'],
                            blockExplorerUrls: ['https://sepolia.etherscan.io']
                        }]
                    });
                    return true;
                } catch (addError) {
                    console.error('Add chain error:', addError);
                    return false;
                }
            }
            console.error('Switch chain error:', error);
            return false;
        }
    }
    
    // Create listing on blockchain
    async createListing(dailyPriceETH) {
        if (!this.isConnected) {
            throw new Error('Wallet not connected');
        }
        
        try {
            // Convert ETH to Wei (1 ETH = 10^18 wei)
            const priceWei = ethers.utils.parseEther(dailyPriceETH.toString());
            
            console.log('Creating listing with price:', dailyPriceETH, 'ETH =', priceWei.toString(), 'wei');
            
            // Call contract
            const tx = await this.contract.createListing(priceWei);
            console.log('Transaction sent:', tx.hash);
            
            // Show transaction link
            showToast(`Transaction sent: ${tx.hash.substring(0, 10)}...`, 'success');
            
            // Wait for transaction
            const receipt = await tx.wait();
            console.log('Transaction confirmed:', receipt.transactionHash);
            
            // Get listing ID from events
            const event = receipt.events?.find(e => e.event === 'ListingCreated');
            const listingId = event?.args?.listingId?.toNumber();
            
            console.log('Listing created with ID:', listingId);
            
            // Update transaction modal
            if (window.updateTransactionResult) {
                window.updateTransactionResult(
                    true,
                    `Listing #${listingId} created successfully!`,
                    receipt.transactionHash
                );
            }
            
            return listingId;
            
        } catch (error) {
            console.error('Create listing error:', error);
            
            if (window.updateTransactionResult) {
                window.updateTransactionResult(false, 'Failed: ' + error.message);
            }
            
            throw error;
        }
    }
    
    // Rent a banner
    async rentBanner(listingId, days) {
        if (!this.isConnected) {
            throw new Error('Wallet not connected');
        }
        
        try {
            // Get listing price first
            const listing = await this.contract.getListingDetails(listingId);
            const dailyPriceWei = listing.dailyPrice;
            const totalPriceWei = dailyPriceWei.mul(days);
            
            console.log('Renting listing:', listingId, 'for', days, 'days');
            console.log('Daily price:', ethers.utils.formatEther(dailyPriceWei), 'ETH');
            console.log('Total price:', ethers.utils.formatEther(totalPriceWei), 'ETH');
            
            // Call contract with ETH value
            const tx = await this.contract.rentBanner(listingId, days, {
                value: totalPriceWei
            });
            
            console.log('Rental transaction sent:', tx.hash);
            showToast(`Rental transaction sent: ${tx.hash.substring(0, 10)}...`, 'success');
            
            const receipt = await tx.wait();
            console.log('Rental transaction confirmed:', receipt.transactionHash);
            
            // Get rental ID from events
            const event = receipt.events?.find(e => e.event === 'RentalStarted');
            const rentalId = event?.args?.rentalId?.toNumber();
            
            console.log('Rental started with ID:', rentalId);
            
            if (window.updateTransactionResult) {
                window.updateTransactionResult(
                    true,
                    `Rental #${rentalId} started successfully!`,
                    receipt.transactionHash
                );
            }
            
            return rentalId;
            
        } catch (error) {
            console.error('Rent banner error:', error);
            
            if (window.updateTransactionResult) {
                window.updateTransactionResult(false, 'Failed: ' + error.message);
            }
            
            throw error;
        }
    }
    
    // Verify banner (simulate oracle)
    async verifyBanner(rentalId, proof) {
        if (!this.isConnected) {
            throw new Error('Wallet not connected');
        }
        
        try {
            console.log('Verifying rental:', rentalId, 'with proof:', proof);
            
            const tx = await this.contract.verifyBanner(rentalId, proof);
            console.log('Verification transaction sent:', tx.hash);
            
            showToast(`Verification sent: ${tx.hash.substring(0, 10)}...`, 'success');
            
            const receipt = await tx.wait();
            console.log('Verification confirmed:', receipt.transactionHash);
            
            if (window.updateTransactionResult) {
                window.updateTransactionResult(
                    true,
                    `Banner verified! Payment released.`,
                    receipt.transactionHash
                );
            }
            
            return true;
            
        } catch (error) {
            console.error('Verify banner error:', error);
            
            if (window.updateTransactionResult) {
                window.updateTransactionResult(false, 'Failed: ' + error.message);
            }
            
            throw error;
        }
    }
    
    // Get all active listings
    async getAllListings() {
        if (!this.isConnected) {
            console.warn('Wallet not connected, returning empty');
            return [];
        }
        
        try {
            const listingIds = await this.contract.getAllListings();
            const listings = [];
            
            console.log('Found', listingIds.length, 'listings');
            
            for (const id of listingIds) {
                try {
                    const listing = await this.contract.getListingDetails(id);
                    listings.push({
                        id: id.toNumber(),
                        creator: listing.creator,
                        dailyPrice: ethers.utils.formatEther(listing.dailyPrice),
                        isActive: listing.isActive,
                        totalEarned: ethers.utils.formatEther(listing.totalEarned),
                        createdAt: new Date(listing.createdAt.toNumber() * 1000).toLocaleDateString()
                    });
                } catch (err) {
                    console.warn('Failed to get listing', id, err);
                }
            }
            
            return listings;
            
        } catch (error) {
            console.error('Get all listings error:', error);
            return [];
        }
    }
    
    // Get contract balance
    async getContractBalance() {
        try {
            const balance = await this.contract.getContractBalance();
            return ethers.utils.formatEther(balance);
        } catch (error) {
            console.error('Get balance error:', error);
            return '0';
        }
    }
    
    // Get user's listings
    async getUserListings() {
        if (!this.isConnected) return [];
        
        try {
            const listingIds = await this.contract.userListings(this.userAddress);
            const listings = [];
            
            for (const id of listingIds) {
                const listing = await this.contract.getListingDetails(id);
                listings.push({
                    id: id.toNumber(),
                    creator: listing.creator,
                    dailyPrice: ethers.utils.formatEther(listing.dailyPrice),
                    isActive: listing.isActive,
                    totalEarned: ethers.utils.formatEther(listing.totalEarned)
                });
            }
            
            return listings;
            
        } catch (error) {
            console.error('Get user listings error:', error);
            return [];
        }
    }
    
    // Get user's rentals
    async getUserRentals() {
        if (!this.isConnected) return [];
        
        try {
            const rentalIds = await this.contract.userRentals(this.userAddress);
            const rentals = [];
            
            for (const id of rentalIds) {
                const rental = await this.contract.getRentalDetails(id);
                rentals.push({
                    id: id.toNumber(),
                    advertiser: rental.advertiser,
                    listingId: rental.listingId.toNumber(),
                    startTime: new Date(rental.startTime.toNumber() * 1000),
                    endTime: new Date(rental.endTime.toNumber() * 1000),
                    totalAmount: ethers.utils.formatEther(rental.totalAmount),
                    isActive: rental.isActive
                });
            }
            
            return rentals;
            
        } catch (error) {
            console.error('Get user rentals error:', error);
            return [];
        }
    }
    
    // Get user's ETH balance
    async getBalance() {
        if (!this.isConnected) return '0';
        
        try {
            const balance = await this.signer.getBalance();
            return ethers.utils.formatEther(balance);
        } catch (error) {
            console.error('Get user balance error:', error);
            return '0';
        }
    }
}

// Create global instance
window.BannerSpaceWeb3 = BannerSpaceWeb3;

// Helper function for HTML onclick
window.connectWalletConnect = function() {
    showToast('WalletConnect not implemented in demo', 'warning');
};

window.switchToSepolia = async function() {
    const web3 = new BannerSpaceWeb3();
    const switched = await web3.switchToSepolia();
    if (switched) {
        showToast('Switched to Sepolia! Please reconnect.', 'success');
        location.reload();
    }
};

// Auto-detect MetaMask connection changes
if (window.ethereum) {
    window.ethereum.on('accountsChanged', function(accounts) {
        console.log('Accounts changed:', accounts);
        location.reload();
    });
    
    window.ethereum.on('chainChanged', function(chainId) {
        console.log('Chain changed:', chainId);
        location.reload();
    });
}

console.log('✅ BannerSpace Web3 loaded successfully with correct ABI');
