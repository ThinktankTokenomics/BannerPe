// Main JavaScript file for BannerSpace

// Mock data for listings (fallback)
const mockListings = [
    {
        id: 1,
        creator: {
            name: 'Sarah Chen',
            handle: '@web3builder',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=web3builder',
            followers: '15.2K',
            verified: true
        },
        stats: {
            followers: '15.2K',
            ctr: '3.2%',
            impressions: '12.5K'
        },
        price: 0.001,
        status: 'verified'
    },
    {
        id: 2,
        creator: {
            name: 'Alex Rivera',
            handle: '@cryptoguru',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cryptoguru',
            followers: '51.2K',
            verified: true
        },
        stats: {
            followers: '51.2K',
            ctr: '4.8%',
            impressions: '51.2K'
        },
        price: 0.0025,
        status: 'verified'
    },
    {
        id: 3,
        creator: {
            name: 'Maya Patel',
            handle: '@defidev',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=defidev',
            followers: '8.7K',
            verified: true
        },
        stats: {
            followers: '8.7K',
            ctr: '2.9%',
            impressions: '8.7K'
        },
        price: 0.00075,
        status: 'verified'
    },
    {
        id: 4,
        creator: {
            name: 'James Wilson',
            handle: '@techlead',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=techlead',
            followers: '23.4K',
            verified: true
        },
        stats: {
            followers: '23.4K',
            ctr: '3.5%',
            impressions: '23.4K'
        },
        price: 0.0015,
        status: 'verified'
    },
    {
        id: 5,
        creator: {
            name: 'Lisa Wang',
            handle: '@ai_researcher',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=airesearcher',
            followers: '12.8K',
            verified: true
        },
        stats: {
            followers: '12.8K',
            ctr: '4.2%',
            impressions: '12.8K'
        },
        price: 0.002,
        status: 'verified'
    },
    {
        id: 6,
        creator: {
            name: 'David Kim',
            handle: '@blockchain_dev',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=blockchaindev',
            followers: '6.9K',
            verified: false
        },
        stats: {
            followers: '6.9K',
            ctr: '2.1%',
            impressions: '6.9K'
        },
        price: 0.0005,
        status: 'pending'
    }
];


// Save wallet connection state
function saveWalletState(address) {
    localStorage.setItem('bannerSpace_walletConnected', 'true');
    localStorage.setItem('bannerSpace_walletAddress', address);
    localStorage.setItem('bannerSpace_lastConnection', Date.now());
}

// Clear wallet state
function clearWalletState() {
    localStorage.removeItem('bannerSpace_walletConnected');
    localStorage.removeItem('bannerSpace_walletAddress');
    localStorage.removeItem('bannerSpace_lastConnection');
}

// Check saved wallet state
function checkSavedWalletState() {
    const isConnected = localStorage.getItem('bannerSpace_walletConnected');
    const address = localStorage.getItem('bannerSpace_walletAddress');
    const lastConnection = localStorage.getItem('bannerSpace_lastConnection');
    
    // If connection was less than 5 minutes ago, try to reconnect
    if (isConnected === 'true' && address && lastConnection) {
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        if (parseInt(lastConnection) > fiveMinutesAgo) {
            return address;
        }
    }
    return null;
}

// Global Web3 instance (will be set by web3.js)
let bannerSpaceWeb3 = null;

// DOM Elements
let isWalletConnected = false;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            menuToggle.innerHTML = mobileMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }

    // Wallet connection (updated for Web3)
    const connectWalletBtn = document.getElementById('connectWallet');
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', openMetamaskModal);
    }

    // Load listings on marketplace page
    const listingsGrid = document.getElementById('listingsGrid');
    if (listingsGrid) {
        loadListings(listingsGrid);
        setupFilterChips();
        setupSearch();
    }

    // Load featured listings on homepage
    const featuredListings = document.getElementById('featuredListings');
    if (featuredListings) {
        loadFeaturedListings(featuredListings);
    }

    // Modal functionality
    setupModals();

    // Dashboard tabs
    setupDashboardTabs();

    // Toast notifications
    window.showToast = showToast;
    
    // Initialize Web3 integration
    initializeWeb3Integration();
    
    // Banner simulation
    initializeBannerSimulation();
}

// Web3 Integration Functions
function initializeWeb3Integration() {
    // Check if web3.js loaded successfully
    if (typeof window.bannerSpaceWeb3 !== 'undefined') {
        bannerSpaceWeb3 = window.bannerSpaceWeb3;
        console.log('Web3 loaded successfully');
    } else {
        console.warn('web3.js not loaded, using mock mode');
    }
    
    // Update wallet button to open MetaMask modal
    const walletBtns = document.querySelectorAll('.btn-wallet');
    walletBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (!btn.id || btn.id === 'connectWallet') {
                e.preventDefault();
                openMetamaskModal();
            }
        });
    });
    
    // Update listing creation to use blockchain
    const submitListingBtn = document.getElementById('submitListing');
    if (submitListingBtn) {
        submitListingBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const dailyPrice = document.getElementById('dailyPrice').value;
            const description = document.getElementById('description').value;
            
            if (!bannerSpaceWeb3 || !bannerSpaceWeb3.isConnected) {
                showToast('Please connect wallet first!', 'error');
                openMetamaskModal();
                return;
            }
            
            try {
                showTransactionModal('Creating listing on blockchain...');
                
                const listingId = await bannerSpaceWeb3.createListing(dailyPrice);
                
                if (listingId) {
                    showToast(`Listing #${listingId} created on blockchain!`, 'success');
                    
                    document.getElementById('createModal').classList.remove('active');
                    document.body.style.overflow = 'auto';
                    document.getElementById('listingForm').reset();
                    
                    // Refresh listings
                    setTimeout(() => {
                        refreshListingsFromBlockchain();
                    }, 3000);
                }
            } catch (error) {
                console.error('Listing creation error:', error);
                showToast('Failed to create listing', 'error');
            } finally {
                setTimeout(closeTransactionModal, 2000);
            }
        });
    }
    
    // Update rent buttons to use blockchain
    document.addEventListener('click', async function(e) {
        if (e.target.closest('.btn-primary') && 
            e.target.closest('.listing-card') && 
            !e.target.closest('.listing-actions .btn-primary')) {
            
            const listingCard = e.target.closest('.listing-card');
            const listingId = listingCard.dataset.id;
            const price = listingCard.dataset.price;
            
            if (!bannerSpaceWeb3 || !bannerSpaceWeb3.isConnected) {
                showToast('Please connect wallet first!', 'error');
                openMetamaskModal();
                return;
            }
            
            // Ask for days
            const days = prompt(`How many days would you like to rent? (1-30)\n\nPrice: ${price} ETH/day`, '3');
            if (!days || days < 1 || days > 30) {
                showToast('Please enter 1-30 days', 'error');
                return;
            }
            
            try {
                showTransactionModal('Starting rental on blockchain...');
                
                const rentalId = await bannerSpaceWeb3.rentBanner(listingId, parseInt(days));
                
                if (rentalId) {
                    showToast(`Rental #${rentalId} started! Verification in progress...`, 'success');
                    
                    // Simulate verification after 3 seconds
                    setTimeout(async () => {
                        showToast('Verifying banner on Twitter...', 'warning');
                        
                        setTimeout(async () => {
                            try {
                                const proof = `twitter-verification-${Date.now()}`;
                                const verified = await bannerSpaceWeb3.verifyBanner(rentalId, proof);
                                
                                if (verified) {
                                    showToast('✅ Banner verified! Payment released to creator.', 'success');
                                }
                            } catch (error) {
                                console.error('Verification error:', error);
                            }
                        }, 2000);
                    }, 3000);
                }
            } catch (error) {
                console.error('Rental error:', error);
                showToast('Failed to start rental: ' + error.message, 'error');
            } finally {
                setTimeout(closeTransactionModal, 2000);
            }
        }
    });
    
    // Try to load real listings from blockchain on page load
    setTimeout(() => {
        refreshListingsFromBlockchain();
    }, 1000);
}

async function refreshListingsFromBlockchain() {
    const listingsGrid = document.getElementById('listingsGrid');
    if (!listingsGrid) return;
    
    // Show loading
    listingsGrid.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p>Loading from blockchain...</p></div>';
    
    try {
        if (bannerSpaceWeb3 && bannerSpaceWeb3.isConnected) {
            const realListings = await bannerSpaceWeb3.getAllListings();
            
            if (realListings && realListings.length > 0) {
                // Clear and add real listings
                listingsGrid.innerHTML = '';
                
                realListings.forEach((listing, index) => {
                    const mockCreator = {
                        name: `Creator ${listing.id}`,
                        handle: `@creator${listing.id}`,
                        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${listing.creator}`,
                        followers: `${Math.floor(Math.random() * 50000) + 1000}`,
                        verified: true
                    };
                    
                    const listingCard = createListingCard({
                        id: listing.id,
                        creator: mockCreator,
                        stats: {
                            followers: `${Math.floor(Math.random() * 50000) + 1000}`,
                            ctr: `${(Math.random() * 3 + 1).toFixed(1)}%`,
                            impressions: `${Math.floor(Math.random() * 100000) + 10000}`
                        },
                        price: parseFloat(listing.dailyPrice),
                        status: 'verified'
                    });
                    
                    listingsGrid.appendChild(listingCard);
                });
                
                // Re-initialize banner simulation for new cards
                initializeBannerSimulation();
                return;
            }
        }
    } catch (error) {
        console.log('Using mock listings (blockchain not available):', error);
    }
    
    // Fallback to mock listings
    loadListings(listingsGrid);
}

function initializeBannerSimulation() {
    const bannerPreviews = document.querySelectorAll('.listing-banner');
    
    bannerPreviews.forEach(banner => {
        banner.addEventListener('mouseenter', function(e) {
            const card = this.closest('.listing-card');
            if (!card) return;
            
            const priceElement = card.querySelector('.price-value');
            const creatorElement = card.querySelector('.creator-handle');
            
            if (priceElement && creatorElement) {
                const price = priceElement.textContent;
                const creator = creatorElement.textContent;
                
                this.innerHTML = `
                    <div class="banner-text">
                        <div style="font-size: 2rem; font-weight: bold; margin-bottom: 10px;">🚀</div>
                        <h4 style="font-size: 1.2rem;">Your Ad Here!</h4>
                        <p style="font-size: 0.9rem; opacity: 0.9;">${price}/day • Live on ${creator}</p>
                    </div>
                    <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">
                        🔄 LIVE PREVIEW
                    </div>
                `;
            }
        });
        
        banner.addEventListener('mouseleave', function() {
            this.innerHTML = `
                <div class="banner-text">
                    <h4>Available Space</h4>
                    <p>1500×500 pixels</p>
                </div>
            `;
        });
    });
}

// Wallet connection
async function connectMetamask() {
    try {
        if (!bannerSpaceWeb3) {
            bannerSpaceWeb3 = new BannerSpaceWeb3();
            window.bannerSpaceWeb3 = bannerSpaceWeb3;
        }
        
        const connected = await bannerSpaceWeb3.init();
        if (connected) {
            updateUIForConnectedWallet();
            closeMetamaskModal();
            showToast('Connected to Sepolia!', 'success');
            
            // Refresh listings
            refreshListingsFromBlockchain();
        }
    } catch (error) {
        console.error('Connect error:', error);
        showToast('Failed to connect: ' + error.message, 'error');
    }
}

function updateUIForConnectedWallet() {
    if (!bannerSpaceWeb3 || !bannerSpaceWeb3.userAddress) return;
    
    const walletBtns = document.querySelectorAll('.btn-wallet');
    const address = bannerSpaceWeb3.userAddress;
    const shortAddress = address.substring(0, 6) + '...' + address.substring(address.length - 4);
    
    walletBtns.forEach(btn => {
        btn.innerHTML = `<i class="fas fa-wallet"></i>${shortAddress}`;
        btn.classList.add('connected');
    });
    
    isWalletConnected = true;
    
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
    
    if (!modal || !txStatus) return;
    
    txStatus.innerHTML = `
        <div class="loading-spinner"></div>
        <p>${message}</p>
    `;
    txStatus.style.display = 'block';
    if (txResult) txResult.style.display = 'none';
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeTransactionModal() {
    const modal = document.getElementById('transactionModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Load listings
function loadListings(container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    mockListings.forEach(listing => {
        const listingCard = createListingCard(listing);
        container.appendChild(listingCard);
    });
    
    // Initialize banner simulation
    setTimeout(initializeBannerSimulation, 100);
}

function loadFeaturedListings(container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    // Show only first 3 listings on homepage
    const featured = mockListings.slice(0, 3);
    
    featured.forEach(listing => {
        const listingCard = createListingCard(listing);
        container.appendChild(listingCard);
    });
    
    // Initialize banner simulation
    setTimeout(initializeBannerSimulation, 100);
}

function createListingCard(listing) {
    const card = document.createElement('div');
    card.className = 'listing-card fade-in';
    card.dataset.id = listing.id;
    card.dataset.price = listing.price;
    card.dataset.verified = listing.creator.verified;
    
    const badgeClass = listing.status === 'verified' ? 'verified-badge' : 'pending-badge';
    const badgeText = listing.status === 'verified' ? 'Verified' : 'Pending';
    
    card.innerHTML = `
        <div class="listing-header">
            <div class="listing-creator">
                <div class="creator-avatar">
                    <img src="${listing.creator.image}" alt="${listing.creator.name}">
                </div>
                <div class="creator-info">
                    <h4>${listing.creator.name}</h4>
                    <div class="creator-handle">${listing.creator.handle}</div>
                </div>
            </div>
            <div class="${badgeClass}">${badgeText}</div>
        </div>
        
        <div class="listing-stats">
            <div class="stat-item">
                <div class="stat-label-small">Followers</div>
                <div class="stat-value-small">${listing.stats.followers}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label-small">CTR</div>
                <div class="stat-value-small">${listing.stats.ctr}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label-small">Impressions</div>
                <div class="stat-value-small">${listing.stats.impressions}</div>
            </div>
        </div>
        
        <div class="listing-banner">
            <div class="banner-text">
                <h4>Available Space</h4>
                <p>1500×500 pixels</p>
            </div>
        </div>
        
        <div class="listing-footer">
            <div class="price-info">
                <div class="price-label">Daily Rate</div>
                <div class="price-value gradient-text">${listing.price} ETH</div>
            </div>
            <div class="listing-actions">
                <button class="btn-outline" onclick="previewListing(${listing.id})">
                    <i class="fas fa-external-link-alt"></i>
                    Preview
                </button>
                <button class="btn-primary">
                    <i class="fas fa-check-circle"></i>
                    Rent Now
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Filter functionality
function setupFilterChips() {
    const filterChips = document.querySelectorAll('.filter-chip');
    const listingsGrid = document.getElementById('listingsGrid');
    
    if (!listingsGrid) return;
    
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            // Remove active class from all chips
            filterChips.forEach(c => c.classList.remove('active'));
            // Add active class to clicked chip
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            filterListings(filter, listingsGrid);
        });
    });
}

function filterListings(filter, container) {
    let filteredListings = [...mockListings];
    
    switch(filter) {
        case 'verified':
            filteredListings = mockListings.filter(l => l.creator.verified);
            break;
        case 'affordable':
            filteredListings = mockListings.filter(l => l.price < 0.001);
            break;
        case 'premium':
            filteredListings = mockListings.filter(l => l.price >= 0.005);
            break;
        case 'available':
            filteredListings = mockListings.filter((_, index) => index % 2 === 0);
            break;
        // 'all' shows all listings
    }
    
    container.innerHTML = '';
    filteredListings.forEach(listing => {
        const listingCard = createListingCard(listing);
        container.appendChild(listingCard);
    });
    
    // Re-initialize banner simulation
    setTimeout(initializeBannerSimulation, 100);
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const listingsGrid = document.getElementById('listingsGrid');
    
    if (searchInput && listingsGrid) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            if (searchTerm.length === 0) {
                loadListings(listingsGrid);
                return;
            }
            
            const filteredListings = mockListings.filter(listing => 
                listing.creator.name.toLowerCase().includes(searchTerm) ||
                listing.creator.handle.toLowerCase().includes(searchTerm)
            );
            
            listingsGrid.innerHTML = '';
            filteredListings.forEach(listing => {
                const listingCard = createListingCard(listing);
                listingsGrid.appendChild(listingCard);
            });
            
            // Re-initialize banner simulation
            setTimeout(initializeBannerSimulation, 100);
        });
    }
}

// Modal functionality
function setupModals() {
    const createModal = document.getElementById('createModal');
    const createListingBtn = document.getElementById('createListingBtn');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelModalBtn = document.getElementById('cancelModal');
    const createAdBtn = document.getElementById('createAdBtn');
    
    // Create Listing Modal
    if (createListingBtn && createModal) {
        createListingBtn.addEventListener('click', function() {
            createModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeModalBtn && createModal) {
        closeModalBtn.addEventListener('click', function() {
            createModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    if (cancelModalBtn && createModal) {
        cancelModalBtn.addEventListener('click', function() {
            createModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Create Ad Modal (simulated)
    if (createAdBtn) {
        createAdBtn.addEventListener('click', function() {
            showToast('Redirecting to ad creation...', 'warning');
        });
    }
    
    // Close modal when clicking outside
    if (createModal) {
        createModal.addEventListener('click', function(e) {
            if (e.target === createModal) {
                createModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Close metamask modal when clicking outside
    const metamaskModal = document.getElementById('metamaskModal');
    if (metamaskModal) {
        metamaskModal.addEventListener('click', function(e) {
            if (e.target === metamaskModal) {
                closeMetamaskModal();
            }
        });
    }
    
    // Close transaction modal when clicking outside
    const transactionModal = document.getElementById('transactionModal');
    if (transactionModal) {
        transactionModal.addEventListener('click', function(e) {
            if (e.target === transactionModal) {
                closeTransactionModal();
            }
        });
    }
}

// Dashboard tabs
function setupDashboardTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            tabBtns.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            const tab = this.dataset.tab;
            switchDashboardTab(tab);
        });
    });
}

function switchDashboardTab(tab) {
    // In a real app, this would load different content
    // For demo, we'll just show a toast
    showToast(`Switched to ${tab} tab`, 'success');
}

// Listing actions
function previewListing(listingId) {
    const listing = mockListings.find(l => l.id === listingId);
    if (listing) {
        showToast(`Previewing ${listing.creator.handle}'s banner`, 'success');
    }
}

// Toast notification system
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    
    if (!toast) {
        // Create toast if doesn't exist
        const toastDiv = document.createElement('div');
        toastDiv.id = 'toast';
        toastDiv.className = 'toast';
        document.body.appendChild(toastDiv);
        return showToast(message, type); // Retry
    }
    
    // Set message and type
    toast.textContent = message;
    toast.className = 'toast';
    toast.classList.add(type);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Simulate live verification updates
function simulateVerificationUpdate() {
    if (Math.random() > 0.7) { // 30% chance to show update
        const messages = [
            'Banner verified: @web3builder is live!',
            'Payment released: 0.001 ETH to @cryptoguru',
            'New listing available: @defidev at 0.00075 ETH/day',
            'Verification complete: All banners active'
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        showToast(randomMessage, 'success');
    }
}

// Run verification updates every 10 seconds (for demo purposes)
setInterval(simulateVerificationUpdate, 10000);

// Global functions for HTML onclick
window.connectMetamask = connectMetamask;
window.openMetamaskModal = openMetamaskModal;
window.closeMetamaskModal = closeMetamaskModal;
window.showTransactionModal = showTransactionModal;
window.closeTransactionModal = closeTransactionModal;
window.previewListing = previewListing;

// Auto-initialize when web3.js loads
window.addEventListener('load', function() {
    if (typeof BannerSpaceWeb3 !== 'undefined' && !bannerSpaceWeb3) {
        bannerSpaceWeb3 = new BannerSpaceWeb3();
        window.bannerSpaceWeb3 = bannerSpaceWeb3;
        console.log('Web3 auto-initialized');
    }
});
