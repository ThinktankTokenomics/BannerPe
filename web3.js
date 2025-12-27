// web3.js - Real Blockchain Integration
class BannerSpaceWeb3 {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.userAddress = null;
        this.contractAddress = 'YOUR_DEPLOYED_CONTRACT_ADDRESS'; // REPLACE THIS
        this.contractABI = []; // Will be filled from Remix
        this.isConnected = false;
    }
    
    // Initialize Web3
    async init() {
        if (typeof window.ethereum === 'undefined') {
            showToast('Please install MetaMask!', 'error');
            return false;
        }
        
        try {
            // Request account access
            this.provider = window.ethereum;
            await this.provider.request({ method: 'eth_requestAccounts' });
            
            // Get signer
            const ethersProvider = new ethers.providers.Web3Provider(this.provider);
            this.signer = ethersProvider.getSigner();
            this.userAddress = await this.signer.getAddress();
            
            // Check network
            const network = await ethersProvider.getNetwork();
            if (network.chainId !== 11155111) { // Sepolia chain ID
                showToast('Please switch to Sepolia Testnet', 'warning');
                await this.switchToSepolia();
                return false;
            }
            
            // Load contract ABI (you'll get this from Remix)
            await this.loadContractABI();
            
            // Create contract instance
            this.contract = new ethers.Contract(
                this.contractAddress,
                this.contractABI,
                this.signer
            );
            
            this.isConnected = true;
            showToast('Connected to Sepolia!', 'success');
            return true;
            
        } catch (error) {
            console.error('Web3 init error:', error);
            showToast('Failed to connect wallet', 'error');
            return false;
        }
    }
    
    // Switch to Sepolia network
    async switchToSepolia() {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID
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
    
    // Load contract ABI (paste from Remix)
    async loadContractABI() {
        // PASTE YOUR CONTRACT ABI HERE from Remix
        // Go to Remix -> Compile tab -> ABI button -> Copy
        this.contractABI = [
            // PASTE ENTIRE ABI ARRAY HERE
            // Example:
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            // ... rest of ABI
        ];
    }
    
    // Create listing on blockchain
    async createListing(dailyPriceETH) {
        if (!this.isConnected) {
            showToast('Please connect wallet first', 'error');
            return null;
        }
        
        try {
            showTransactionModal('Creating listing...');
            
            // Convert ETH to Wei
            const priceWei = ethers.utils.parseEther(dailyPriceETH.toString());
            
            // Call contract
            const tx = await this.contract.createListing(priceWei);
            showTransactionModal('Waiting for confirmation...');
            
            // Wait for transaction
            const receipt = await tx.wait();
            
            // Get listing ID from events
            const event = receipt.events?.find(e => e.event === 'ListingCreated');
            const listingId = event?.args?.listingId?.toNumber();
            
            closeTransactionModal();
            showToast(`Listing #${listingId} created!`, 'success');
            
            return listingId;
            
        } catch (error) {
            console.error('Create listing error:', error);
            showToast('Failed to create listing', 'error');
            return null;
        }
    }
    
    // Rent a banner
    async rentBanner(listingId, days) {
        if (!this.isConnected) {
            showToast('Please connect wallet first', 'error');
            return null;
        }
        
        try {
            showTransactionModal('Starting rental...');
            
            // Get listing price
            const listing = await this.contract.getListingDetails(listingId);
            const dailyPrice = listing.dailyPrice;
            const totalPrice = dailyPrice.mul(days);
            
            // Call contract with ETH value
            const tx = await this.contract.rentBanner(listingId, days, {
                value: totalPrice
            });
            
            showTransactionModal('Waiting for confirmation...');
            const receipt = await tx.wait();
            
            // Get rental ID from events
            const event = receipt.events?.find(e => e.event === 'RentalStarted');
            const rentalId = event?.args?.rentalId?.toNumber();
            
            closeTransactionModal();
            showToast(`Rental #${rentalId} started!`, 'success');
            
            return rentalId;
            
        } catch (error) {
            console.error('Rent banner error:', error);
            showToast('Failed to start rental', 'error');
            return null;
        }
    }
    
    // Verify banner (simulate oracle)
    async verifyBanner(rentalId, proof) {
        if (!this.isConnected) {
            showToast('Please connect wallet first', 'error');
            return false;
        }
        
        try {
            showTransactionModal('Verifying banner...');
            
            const tx = await this.contract.verifyBanner(rentalId, proof);
            showTransactionModal('Waiting for confirmation...');
            
            await tx.wait();
            
            closeTransactionModal();
            showToast(`Banner verified! Payment released.`, 'success');
            
            return true;
            
        } catch (error) {
            console.error('Verify banner error:', error);
            showToast('Failed to verify banner', 'error');
            return false;
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
            console.error('Get listings error:', error);
            return [];
        }
    }
    
    // Get all active listings
    async getAllListings() {
        try {
            const listingIds = await this.contract.getAllListings();
            const listings = [];
            
            for (const id of listingIds) {
                const listing = await this.contract.getListingDetails(id);
                listings.push({
                    id: id.toNumber(),
                    creator: listing.creator,
                    dailyPrice: ethers.utils.formatEther(listing.dailyPrice),
                    isActive: listing.isActive
                });
            }
            
            return listings;
            
        } catch (error) {
            console.error('Get all listings error:', error);
            return [];
        }
    }
}

// Global instance
const bannerSpaceWeb3 = new BannerSpaceWeb3();

// UI Functions
async function connectMetamask() {
    const connected = await bannerSpaceWeb3.init();
    if (connected) {
        updateUIForConnectedWallet();
        closeMetamaskModal();
    }
}

function updateUIForConnectedWallet() {
    const walletBtns = document.querySelectorAll('.btn-wallet');
    const address = bannerSpaceWeb3.userAddress;
    const shortAddress = address.substring(0, 6) + '...' + address.substring(address.length - 4);
    
    walletBtns.forEach(btn => {
        btn.innerHTML = `<i class="fas fa-wallet"></i>${shortAddress}`;
    });
    
    // Update network info
    const networkInfo = document.getElementById('networkInfo');
    if (networkInfo) {
        networkInfo.style.display = 'block';
        document.getElementById('currentNetwork').textContent = 'Sepolia Testnet';
    }
}

function openMetamaskModal() {
    document.getElementById('metamaskModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMetamaskModal() {
    document.getElementById('metamaskModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showTransactionModal(message) {
    const modal = document.getElementById('transactionModal');
    const txStatus = document.getElementById('txStatus');
    const txResult = document.getElementById('txResult');
    
    txStatus.innerHTML = `
        <div class="loading-spinner"></div>
        <p>${message}</p>
    `;
    txStatus.style.display = 'block';
    txResult.style.display = 'none';
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeTransactionModal() {
    document.getElementById('transactionModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function updateTransactionResult(success, message, txHash = '') {
    const txStatus = document.getElementById('txStatus');
    const txResult = document.getElementById('txResult');
    const txMessage = document.getElementById('txMessage');
    const txLink = document.getElementById('txLink');
    
    txStatus.style.display = 'none';
    txResult.style.display = 'block';
    
    if (success) {
        txResult.querySelector('.tx-success').innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>Transaction Successful!</h3>
            <p>${message}</p>
            ${txHash ? `<a href="https://sepolia.etherscan.io/tx/${txHash}" target="_blank" class="btn-outline">
                <i class="fas fa-external-link-alt"></i>
                View on Explorer
            </a>` : ''}
        `;
    } else {
        txResult.innerHTML = `
            <div class="tx-error">
                <i class="fas fa-times-circle"></i>
                <h3>Transaction Failed</h3>
                <p>${message}</p>
                <button class="btn-secondary" onclick="closeTransactionModal()">Close</button>
            </div>
        `;
    }
}
