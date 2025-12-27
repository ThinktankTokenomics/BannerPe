// Main JavaScript file for BannerSpace

// Mock data for listings
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
        price: 100,
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
        price: 250,
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
        price: 75,
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
        price: 150,
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
        price: 200,
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
        price: 50,
        status: 'pending'
    }
];

// DOM Elements
let isWalletConnected = false;
const mockWalletAddress = '0x742d35Cc6634C0532925a3b844Bc9e7f8E';

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

    // Wallet connection
    const connectWalletBtn = document.getElementById('connectWallet');
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', toggleWalletConnection);
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
}

// Wallet connection
function toggleWalletConnection() {
    const walletBtn = document.getElementById('connectWallet');
    const walletText = document.getElementById('walletText');
    
    if (!isWalletConnected) {
        // Simulate wallet connection
        isWalletConnected = true;
        walletBtn.innerHTML = '<i class="fas fa-wallet"></i><span id="walletText">' + 
                            mockWalletAddress.substring(0, 6) + '...' + 
                            mockWalletAddress.substring(mockWalletAddress.length - 4) + 
                            '</span>';
        
        showToast('Wallet connected successfully!', 'success');
        
        // Update all wallet buttons on page
        const allWalletBtns = document.querySelectorAll('.btn-wallet');
        allWalletBtns.forEach(btn => {
            if (btn.id !== 'connectWallet') {
                btn.innerHTML = '<i class="fas fa-wallet"></i>' + 
                              mockWalletAddress.substring(0, 6) + '...' + 
                              mockWalletAddress.substring(mockWalletAddress.length - 4);
            }
        });
    } else {
        // Disconnect wallet
        isWalletConnected = false;
        walletBtn.innerHTML = '<i class="fas fa-wallet"></i><span id="walletText">Connect Wallet</span>';
        showToast('Wallet disconnected', 'warning');
    }
}

// Load listings
function loadListings(container) {
    container.innerHTML = '';
    
    mockListings.forEach(listing => {
        const listingCard = createListingCard(listing);
        container.appendChild(listingCard);
    });
}

function loadFeaturedListings(container) {
    container.innerHTML = '';
    
    // Show only first 3 listings on homepage
    const featured = mockListings.slice(0, 3);
    
    featured.forEach(listing => {
        const listingCard = createListingCard(listing);
        container.appendChild(listingCard);
    });
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
                <div class="price-value gradient-text">$${listing.price}</div>
            </div>
            <div class="listing-actions">
                <button class="btn-outline" onclick="previewListing(${listing.id})">
                    <i class="fas fa-external-link-alt"></i>
                    Preview
                </button>
                <button class="btn-primary" onclick="rentListing(${listing.id})">
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
            filteredListings = mockListings.filter(l => l.price < 100);
            break;
        case 'premium':
            filteredListings = mockListings.filter(l => l.price >= 500);
            break;
        case 'available':
            // Simulate availability filter
            filteredListings = mockListings.filter((_, index) => index % 2 === 0);
            break;
        // 'all' shows all listings
    }
    
    container.innerHTML = '';
    filteredListings.forEach(listing => {
        const listingCard = createListingCard(listing);
        container.appendChild(listingCard);
    });
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const listingsGrid = document.getElementById('listingsGrid');
    
    if (searchInput) {
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
        });
    }
}

// Modal functionality
function setupModals() {
    const createModal = document.getElementById('createModal');
    const createListingBtn = document.getElementById('createListingBtn');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelModalBtn = document.getElementById('cancelModal');
    const submitListingBtn = document.getElementById('submitListing');
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
    
    if (submitListingBtn) {
        submitListingBtn.addEventListener('click', function() {
            const dailyPrice = document.getElementById('dailyPrice').value;
            
            // Simulate listing creation
            showToast(`Listing created successfully at $${dailyPrice}/day!`, 'success');
            
            createModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Reset form
            document.getElementById('listingForm').reset();
        });
    }
    
    // Create Ad Modal (simulated)
    if (createAdBtn) {
        createAdBtn.addEventListener('click', function() {
            showToast('Redirecting to ad creation...', 'warning');
            // In a real app, this would open the ad creation modal
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

function rentListing(listingId) {
    const listing = mockListings.find(l => l.id === listingId);
    if (listing) {
        if (!isWalletConnected) {
            showToast('Please connect your wallet first!', 'error');
            return;
        }
        
        // Simulate payment modal
        const confirmRent = confirm(`Rent ${listing.creator.handle}'s banner for $${listing.price}/day?\n\nThis will initiate a smart contract with automatic payments.`);
        
        if (confirmRent) {
            showToast(`Successfully rented ${listing.creator.handle}'s banner! Payment processed.`, 'success');
        }
    }
}

// Toast notification system
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    
    if (!toast) return;
    
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
            'Payment released: $100 to @cryptoguru',
            'New listing available: @defidev at $75/day',
            'Verification complete: All banners active'
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        showToast(randomMessage, 'success');
    }
}

// Run verification updates every 10 seconds (for demo purposes)
setInterval(simulateVerificationUpdate, 10000);
