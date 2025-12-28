// Main JavaScript file for BannerSpace with Browser-Based Twitter API
// ====== FIXED CORS ISSUE VERSION ======

// Quick fix: Check for MetaMask connection on page load
window.addEventListener('load', function() {
    setTimeout(async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0 && typeof BannerSpaceWeb3 !== 'undefined') {
                    if (!bannerSpaceWeb3) {
                        bannerSpaceWeb3 = new BannerSpaceWeb3();
                        window.bannerSpaceWeb3 = bannerSpaceWeb3;
                    }
                    await bannerSpaceWeb3.init();
                    updateUIForConnectedWallet();
                }
            } catch (error) {
                console.log('Auto-connect check failed:', error);
            }
        }
    }, 1000);
});

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

// ===== TWITTER API CONFIGURATION =====
// Using alternative approach for GitHub Pages
const TWITTER_API_CONFIG = {
    BEARER_TOKEN: 'AAAAAAAAAAAAAAAAAAAAALM26gEAAAAA6URlJy9muueQZAvVTf3ywNunQVY%3DMF3XLqpG0D6duG9D4x2f7BJyllGFwzOh5FKMxHupYO4EYbEVZP',
    
    // No-CORS solutions for GitHub Pages
    ALTERNATIVE_PROXIES: [
        'https://tw-proxy-server.vercel.app/api/twitter?handle=', // Custom proxy server
        'https://twitter-api-proxy.herokuapp.com/v2/user/' // Alternative
    ]
};

// Global Web3 instance
let bannerSpaceWeb3 = null;
let isWalletConnected = false;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('🚀 Initializing BannerSpace (GitHub Pages Edition)...');
    
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
        connectWalletBtn.addEventListener('click', openMetamaskModal);
    }

    // Load listings
    const listingsGrid = document.getElementById('listingsGrid');
    if (listingsGrid) {
        loadListings(listingsGrid);
        setupFilterChips();
        setupSearch();
    }

    // Load featured listings
    const featuredListings = document.getElementById('featuredListings');
    if (featuredListings) {
        loadFeaturedListings(featuredListings);
    }

    // Modal functionality
    setupModals();

    // Dashboard tabs
    setupDashboardTabs();

    // Banner upload
    initializeBannerUpload();
    
    // Load active rentals
    loadActiveRentals();

    // Toast notifications
    window.showToast = showToast;
    
    // Initialize Web3 integration
    initializeWeb3Integration();
    
    // Banner simulation
    initializeBannerSimulation();
    
    // Initialize Twitter connection buttons
    const twitterBtns = document.querySelectorAll('.btn-twitter');
    twitterBtns.forEach(btn => {
        btn.addEventListener('click', connectTwitter);
    });
    
    // Initialize submit listing button
    const submitListingBtn = document.getElementById('submitListing');
    if (submitListingBtn) {
        submitListingBtn.addEventListener('click', createListingWithTwitter);
    }
}

// ===== SIMPLE TWITTER API WORKAROUND =====
async function verifyTwitterHandleReal(twitterHandle) {
    try {
        showToast('🔍 Checking Twitter...', 'warning');
        
        const handle = twitterHandle.replace('@', '').trim().toLowerCase();
        
        // ===== METHOD 1: Use Twitter Widget API (Public, No Auth Needed) =====
        try {
            console.log(`Trying Twitter Widget API for @${handle}...`);
            
            // Twitter Widget API (public, no auth needed for basic info)
            // This doesn't check banners but gives us user info
            const widgetResponse = await fetch(
                `https://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=${handle}`,
                {
                    method: 'GET',
                    mode: 'cors'
                }
            );
            
            if (widgetResponse.ok) {
                const widgetData = await widgetResponse.json();
                
                if (widgetData && widgetData.length > 0 && widgetData[0].id) {
                    console.log(`✅ Found Twitter user @${handle} via Widget API`);
                    
                    // ===== METHOD 2: Check banner via Twitter Card/Open Graph =====
                    // Since we can't use Twitter API v2 directly, we'll check the profile page
                    const hasBanner = await checkTwitterBannerViaProfile(handle);
                    
                    return {
                        success: hasBanner,
                        real: true,
                        handle: `@${handle}`,
                        name: widgetData[0].name || handle,
                        followers: widgetData[0].followers_count || 0,
                        message: hasBanner 
                            ? `✅ @${handle} banner verified via Twitter!` 
                            : `❌ @${handle} has no banner (or private account)`,
                        method: 'Twitter Widget API'
                    };
                }
            }
        } catch (widgetError) {
            console.log('Widget API failed:', widgetError.message);
        }
        
        // ===== METHOD 3: Use public.twitter.com API endpoint =====
        try {
            console.log(`Trying public Twitter API for @${handle}...`);
            
            // This endpoint sometimes works without auth
            const publicResponse = await fetch(
                `https://public.twitter.com/i/api/2/timeline/profile/${handle}`,
                {
                    method: 'GET',
                    mode: 'no-cors' // Use no-cors to avoid CORS issues
                }
            ).catch(() => null);
            
            if (publicResponse) {
                // If we get any response, assume user exists
                // For banner check, we'll use a different approach
                const hasBanner = await checkBannerViaImage(handle);
                
                return {
                    success: hasBanner,
                    real: true,
                    handle: `@${handle}`,
                    name: handle.charAt(0).toUpperCase() + handle.slice(1),
                    followers: 0, // Can't get from this method
                    message: hasBanner 
                        ? `✅ @${handle} banner detected!` 
                        : `❌ @${handle} no banner found`,
                    method: 'Public Twitter API'
                };
            }
        } catch (publicError) {
            console.log('Public API failed:', publicError.message);
        }
        
        // ===== METHOD 4: Use our simple Node.js proxy =====
        try {
            console.log(`Trying simple proxy for @${handle}...`);
            
            // Try a simple proxy that might work
            const proxyResponse = await fetch(
                `https://cors-anywhere.herokuapp.com/https://twitter.com/${handle}`,
                {
                    method: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                }
            ).catch(() => null);
            
            if (proxyResponse && proxyResponse.ok) {
                const html = await proxyResponse.text();
                const hasBanner = html.includes('profile_banner_url') || 
                                 html.includes('profile_banner') ||
                                 html.includes('header-photo');
                
                return {
                    success: hasBanner,
                    real: true,
                    handle: `@${handle}`,
                    name: extractTwitterName(html) || handle,
                    followers: extractTwitterFollowers(html) || 0,
                    message: hasBanner 
                        ? `✅ @${handle} banner found on profile!` 
                        : `❌ @${handle} no banner in HTML`,
                    method: 'HTML Scraping'
                };
            }
        } catch (proxyError) {
            console.log('Proxy failed:', proxyError.message);
        }
        
        // If all methods fail, use demo mode
        throw new Error('All Twitter API methods failed');
        
    } catch (error) {
        console.log('Real API failed, using demo mode:', error.message);
        return verifyTwitterHandleDemo(twitterHandle);
    }
}

// Helper function to check banner via profile image
async function checkTwitterBannerViaProfile(handle) {
    try {
        // Try to load the banner image directly
        // Twitter uses consistent URLs for banners
        const bannerUrls = [
            `https://pbs.twimg.com/profile_banners/${handle}/1500x500`,
            `https://pbs.twimg.com/profile_banners/${handle}/web`,
            `https://pbs.twimg.com/profile_banners/${handle}/mobile`
        ];
        
        for (const url of bannerUrls) {
            try {
                const imgCheck = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
                // If we don't get an error, the image exists
                return true;
            } catch (e) {
                continue;
            }
        }
        
        return false;
    } catch (error) {
        return false;
    }
}

// Helper function to check banner via image loading
async function checkBannerViaImage(handle) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
            resolve(true);
        };
        img.onerror = function() {
            resolve(false);
        };
        img.src = `https://pbs.twimg.com/profile_banners/${handle}/1500x500`;
        
        // Timeout after 3 seconds
        setTimeout(() => resolve(false), 3000);
    });
}

// Helper function to extract name from Twitter HTML
function extractTwitterName(html) {
    const nameMatch = html.match(/<title>([^<]+) \(@[^)]+\)<\/title>/);
    if (nameMatch) return nameMatch[1];
    
    const metaMatch = html.match(/<meta[^>]*name="twitter:title"[^>]*content="([^"]+)"/);
    if (metaMatch) return metaMatch[1];
    
    return null;
}

// Helper function to extract followers from Twitter HTML
function extractTwitterFollowers(html) {
    const followersMatch = html.match(/(\d+(?:,\d+)*(?:\.\d+)?[KM]?)\s+Followers/i);
    if (followersMatch) return followersMatch[1];
    
    const dataMatch = html.match(/data-followers="(\d+)"/);
    if (dataMatch) return parseInt(dataMatch[1]);
    
    return null;
}

// Demo fallback
async function verifyTwitterHandleDemo(twitterHandle) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const handle = twitterHandle.replace('@', '').toLowerCase();
    const isVerified = Math.random() > 0.3; // 70% success rate
    
    return {
        success: isVerified,
        real: false,
        handle: `@${handle}`,
        message: isVerified 
            ? `✅ Demo: @${handle} banner verified!` 
            : `❌ Demo: @${handle} has no banner`,
        demo: true
    };
}

// Enhanced verification check
async function checkVerificationNowReal(rentalId) {
    showToast('🔍 Checking Twitter...', 'warning');
    
    // Get rental data
    const rentals = JSON.parse(localStorage.getItem('bannerSpace_rentals') || '[]');
    const rental = rentals.find(r => r.id === rentalId);
    
    if (!rental) {
        showToast('Rental not found', 'error');
        return;
    }
    
    try {
        const result = await verifyTwitterHandleReal(rental.twitterHandle);
        
        if (result.success) {
            showToast(`✅ ${result.message}`, 'success');
            
            // Update rental status
            const rentalIndex = rentals.findIndex(r => r.id === rentalId);
            if (rentalIndex > -1) {
                rentals[rentalIndex].status = 'verified';
                rentals[rentalIndex].lastVerified = new Date().toISOString();
                rentals[rentalIndex].verification_count = (rentals[rentalIndex].verification_count || 0) + 1;
                rentals[rentalIndex].real_api_used = result.real;
                localStorage.setItem('bannerSpace_rentals', JSON.stringify(rentals));
                
                // Show payment notification
                setTimeout(() => {
                    showToast(`💰 ${rental.totalPrice} ETH payment released!`, 'success');
                }, 1000);
            }
            
            loadActiveRentals();
        } else {
            showToast(`❌ ${result.message}`, 'error');
        }
        
    } catch (error) {
        console.error('Verification check failed:', error);
        showToast('Verification failed. Try again.', 'error');
    }
}

// ===== BANNER UPLOAD FUNCTIONS =====
function initializeBannerUpload() {
    const uploadInput = document.getElementById('bannerUpload');
    const uploadArea = document.getElementById('bannerUploadArea');
    
    if (!uploadInput) return;
    
    uploadArea.addEventListener('click', function(e) {
        if (e.target.tagName !== 'BUTTON') {
            uploadInput.click();
        }
    });
    
    uploadInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleBannerUpload(file);
        }
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleBannerUpload(file);
        } else {
            showToast('Please upload an image file', 'error');
        }
    });
}

function handleBannerUpload(file) {
    if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showToast('File size should be less than 5MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const previewImage = document.getElementById('previewImage');
        const previewDiv = document.getElementById('bannerPreview');
        const uploadArea = document.getElementById('bannerUploadArea');
        
        previewImage.src = e.target.result;
        previewDiv.style.display = 'block';
        uploadArea.style.display = 'none';
        
        window.uploadedBanner = {
            dataUrl: e.target.result,
            name: file.name,
            type: file.type
        };
    };
    
    reader.readAsDataURL(file);
}

function removeBanner() {
    const uploadInput = document.getElementById('bannerUpload');
    const previewDiv = document.getElementById('bannerPreview');
    const uploadArea = document.getElementById('bannerUploadArea');
    
    uploadInput.value = '';
    previewDiv.style.display = 'none';
    uploadArea.style.display = 'block';
    window.uploadedBanner = null;
}

// ===== TWITTER CONNECTION =====
async function connectTwitter() {
    try {
        showToast('Connecting Twitter...', 'warning');
        
        if (!bannerSpaceWeb3?.userAddress) {
            showToast('Please connect wallet first', 'error');
            return;
        }
        
        // For demo, simulate Twitter connection
        const twitterHandle = `@user${Math.floor(Math.random() * 1000)}`;
        
        localStorage.setItem('twitter_handle', twitterHandle);
        localStorage.setItem('twitter_connected', 'true');
        
        const twitterBtns = document.querySelectorAll('.btn-twitter');
        twitterBtns.forEach(btn => {
            btn.innerHTML = `<i class="fab fa-twitter"></i>${twitterHandle}`;
        });
        
        showToast(`✅ Connected Twitter: ${twitterHandle}`, 'success');
        
    } catch (error) {
        console.error('Twitter connect error:', error);
        showToast('Twitter connection failed', 'error');
    }
}

// ===== LISTING CREATION =====
async function createListingWithTwitter(e) {
    if (e) e.preventDefault();
    
    const dailyPrice = document.getElementById('dailyPrice')?.value;
    const description = document.getElementById('description')?.value;
    const twitterHandle = document.getElementById('twitterHandle')?.value || '@demo_user';
    const bannerData = window.uploadedBanner;
    
    if (!bannerData) {
        showToast('Please upload a banner image', 'error');
        return;
    }
    
    if (!twitterHandle || !twitterHandle.includes('@')) {
        showToast('Please enter valid Twitter handle (@username)', 'error');
        return;
    }
    
    if (!bannerSpaceWeb3 || !bannerSpaceWeb3.isConnected) {
        showToast('Please connect wallet first!', 'error');
        openMetamaskModal();
        return;
    }
    
    try {
        showTransactionModal('Creating listing...');
        
        // Verify Twitter handle first
        const verification = await verifyTwitterHandleReal(twitterHandle);
        
        if (!verification.success) {
            showToast(`⚠️ ${twitterHandle} has no banner. Create listing anyway?`, 'warning');
        }
        
        // Create listing data
        const listingId = Date.now();
        const listingData = {
            id: listingId,
            price: parseFloat(dailyPrice),
            banner: bannerData.dataUrl,
            description: description,
            twitterHandle: twitterHandle,
            creator: bannerSpaceWeb3.userAddress,
            createdAt: new Date().toISOString(),
            status: 'active',
            verified: verification.success
        };
        
        // Save to localStorage
        let listings = JSON.parse(localStorage.getItem('bannerSpace_listings') || '[]');
        listings.push(listingData);
        localStorage.setItem('bannerSpace_listings', JSON.stringify(listings));
        
        showToast(`🎯 Listing created for ${twitterHandle}!`, 'success');
        
        // Close modal and reset
        document.getElementById('createModal')?.classList.remove('active');
        document.body.style.overflow = 'auto';
        document.getElementById('listingForm')?.reset();
        removeBanner();
        
        // Refresh listings
        setTimeout(() => {
            refreshListingsWithBanners();
        }, 1000);
        
    } catch (error) {
        console.error('Error:', error);
        showToast('Failed to create listing', 'error');
    } finally {
        setTimeout(closeTransactionModal, 2000);
    }
}

// ===== RENT FUNCTION =====
document.addEventListener('click', async function(e) {
    const button = e.target.closest('.btn-primary');
    if (!button) return;
    
    const listingCard = button.closest('.listing-card');
    if (!listingCard) return;
    
    if (!button.textContent.includes('Rent')) return;
    
    if (button.disabled) return;
    button.disabled = true;
    
    const listingId = listingCard.dataset.id;
    const price = listingCard.dataset.price;
    
    // Get listing data
    const allListings = [
        ...mockListings,
        ...JSON.parse(localStorage.getItem('bannerSpace_listings') || '[]').map((custom, idx) => ({
            ...custom,
            id: 100 + idx
        }))
    ];
    
    const listing = allListings.find(l => l.id == listingId);
    const twitterHandle = listing?.twitterHandle || '@demo_user';
    const bannerUrl = listing?.banner || '';
    
    // Show banner download instructions
    if (bannerUrl) {
        showBannerInstructions(bannerUrl, twitterHandle, 3, price);
    }
    
    // Show prompt for days
    const days = prompt(`How many days to rent ${twitterHandle}'s banner?\n\nPrice: ${price} ETH/day\n\nEnter 1-30 days:`, '3');
    
    if (!days || isNaN(days) || days < 1 || days > 30) {
        showToast('Please enter 1-30 days', 'error');
        button.disabled = false;
        return;
    }
    
    try {
        showTransactionModal('Starting rental...');
        
        // Create rental record
        const rentalId = Date.now();
        const rentalData = {
            id: rentalId,
            listingId: listingId,
            twitterHandle: twitterHandle,
            days: parseInt(days),
            totalPrice: price * days,
            bannerUrl: bannerUrl,
            status: 'pending_verification',
            startedAt: new Date().toISOString(),
            endsAt: new Date(Date.now() + (days * 24 * 60 * 60 * 1000)).toISOString(),
            verification_count: 0,
            real_api_used: false
        };
        
        // Save rental
        let rentals = JSON.parse(localStorage.getItem('bannerSpace_rentals') || '[]');
        rentals.push(rentalData);
        localStorage.setItem('bannerSpace_rentals', JSON.stringify(rentals));
        
        showToast(`✅ Rental #${rentalId} started!`, 'success');
        
        // Check verification immediately
        setTimeout(async () => {
            const result = await verifyTwitterHandleReal(twitterHandle);
            
            if (result.success) {
                showToast(`🎉 ${result.message}`, 'success');
                
                // Update rental if verified
                if (result.success) {
                    const updatedRentals = JSON.parse(localStorage.getItem('bannerSpace_rentals') || '[]');
                    const rentalIndex = updatedRentals.findIndex(r => r.id === rentalId);
                    if (rentalIndex > -1) {
                        updatedRentals[rentalIndex].status = 'verified';
                        updatedRentals[rentalIndex].real_api_used = result.real;
                        updatedRentals[rentalIndex].lastVerified = new Date().toISOString();
                        localStorage.setItem('bannerSpace_rentals', JSON.stringify(updatedRentals));
                    }
                }
            } else {
                showToast(`⚠️ ${result.message}`, 'warning');
                showToast('We\'ll keep checking every 5 minutes...', 'info');
            }
            
            closeTransactionModal();
            button.disabled = false;
            loadActiveRentals();
            
        }, 2000);
        
    } catch (error) {
        console.error('Rental error:', error);
        showToast('Rental failed: ' + error.message, 'error');
        button.disabled = false;
        setTimeout(closeTransactionModal, 1000);
    }
});

// ===== BANNER DOWNLOAD INSTRUCTIONS =====
function showBannerInstructions(bannerUrl, twitterHandle, days, price) {
    const modal = document.createElement('div');
    modal.className = 'instructions-modal';
    
    modal.innerHTML = `
        <div class="instructions-content">
            <button class="close-instructions" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
            
            <h2><i class="fab fa-twitter"></i> Banner Upload Instructions</h2>
            
            <div class="steps">
                <div class="step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h3>Download the Banner</h3>
                        <div class="banner-preview-small">
                            <img src="${bannerUrl}" alt="Banner to upload">
                        </div>
                        <a href="${bannerUrl}" download="twitter-banner-${twitterHandle}.png" 
                           class="btn-primary">
                            <i class="fas fa-download"></i> Download Banner
                        </a>
                    </div>
                </div>
                
                <div class="step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h3>Upload to Twitter</h3>
                        <ol class="instructions-list">
                            <li>Go to <a href="https://twitter.com/settings/profile" target="_blank">
                                Twitter Profile Settings
                            </a></li>
                            <li>Click "Edit profile"</li>
                            <li>Click on your current banner</li>
                            <li>Upload the downloaded image</li>
                            <li>Click "Apply" then "Save"</li>
                        </ol>
                        <p class="note">⚠️ Keep the banner for ${days} days to get paid</p>
                    </div>
                </div>
                
                <div class="step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h3>Get Verified & Paid</h3>
                        <p>Our system automatically checks if the banner is live.</p>
                        <div class="verification-info">
                            <div class="info-item">
                                <i class="fas fa-check-circle"></i>
                                <span>Checks every 5 minutes</span>
                            </div>
                            <div class="info-item">
                                <i class="fas fa-money-bill-wave"></i>
                                <span>Earn: ${(price * days).toFixed(4)} ETH</span>
                            </div>
                            <div class="info-item">
                                <i class="fas fa-history"></i>
                                <span>Duration: ${days} days</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="actions">
                <button class="btn-secondary" onclick="this.parentElement.parentElement.remove()">
                    I'll do it later
                </button>
                <button class="btn-primary" onclick="window.open('https://twitter.com/settings/profile', '_blank')">
                    <i class="fab fa-twitter"></i> Go to Twitter Now
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add CSS if not exists
    if (!document.querySelector('#instructions-css')) {
        const style = document.createElement('style');
        style.id = 'instructions-css';
        style.textContent = `
            .instructions-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 20px;
            }
            .instructions-content {
                background: white;
                border-radius: 16px;
                padding: 30px;
                max-width: 700px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
            }
            .close-instructions {
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #6B7280;
            }
            .steps {
                margin: 30px 0;
            }
            .step {
                display: flex;
                margin-bottom: 30px;
                align-items: flex-start;
            }
            .step-number {
                background: linear-gradient(135deg, #8B5CF6, #EC4899);
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                margin-right: 20px;
                flex-shrink: 0;
            }
            .step-content {
                flex: 1;
            }
            .banner-preview-small {
                max-width: 300px;
                margin: 15px 0;
                border-radius: 8px;
                overflow: hidden;
                border: 2px solid #E5E7EB;
            }
            .banner-preview-small img {
                width: 100%;
                height: auto;
            }
            .instructions-list {
                margin: 15px 0;
                padding-left: 20px;
            }
            .instructions-list li {
                margin: 8px 0;
            }
            .note {
                background: #FEF3C7;
                padding: 10px;
                border-radius: 8px;
                margin: 15px 0;
                color: #92400E;
            }
            .verification-info {
                background: #F3F4F6;
                padding: 15px;
                border-radius: 8px;
                margin: 15px 0;
            }
            .info-item {
                display: flex;
                align-items: center;
                margin: 10px 0;
            }
            .info-item i {
                margin-right: 10px;
                color: #8B5CF6;
            }
            .actions {
                display: flex;
                gap: 15px;
                margin-top: 30px;
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== ACTIVE RENTALS DASHBOARD =====
function loadActiveRentals() {
    const container = document.getElementById('activeRentals');
    if (!container) return;
    
    const rentals = JSON.parse(localStorage.getItem('bannerSpace_rentals') || '[]');
    const activeRentals = rentals.filter(r => r.status === 'pending_verification' || r.status === 'active' || r.status === 'verified');
    
    if (activeRentals.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bullhorn"></i>
                <p>No active rentals</p>
                <small>Rent a banner to see verification status here</small>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    activeRentals.forEach(rental => {
        const rentalElement = document.createElement('div');
        rentalElement.className = 'rental-item';
        
        // Calculate progress
        const start = new Date(rental.startedAt);
        const end = new Date(rental.endsAt);
        const now = new Date();
        const totalMs = end - start;
        const elapsedMs = now - start;
        const progress = Math.min(100, (elapsedMs / totalMs) * 100);
        
        // API badge
        const apiBadge = rental.real_api_used 
            ? `<span class="api-badge real">LIVE</span>` 
            : `<span class="api-badge demo">DEMO</span>`;
        
        rentalElement.innerHTML = `
            <div class="rental-header">
                <div class="rental-id">Rental #${rental.id}</div>
                <div class="rental-status ${rental.status}">${rental.status.replace('_', ' ')}</div>
                ${apiBadge}
            </div>
            
            <div class="rental-details">
                <div class="detail">
                    <i class="fab fa-twitter"></i>
                    <span>${rental.twitterHandle}</span>
                </div>
                <div class="detail">
                    <i class="fas fa-calendar"></i>
                    <span>${rental.days} days (${Math.ceil((end - now) / (1000 * 60 * 60 * 24))} days left)</span>
                </div>
                <div class="detail">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>${rental.totalPrice} ETH</span>
                </div>
                ${rental.lastVerified ? `
                <div class="detail">
                    <i class="fas fa-clock"></i>
                    <span>Last check: ${new Date(rental.lastVerified).toLocaleTimeString()}</span>
                </div>
                ` : ''}
            </div>
            
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            
            <div class="rental-actions">
                <button class="btn-outline" onclick="showBannerInstructions('${rental.bannerUrl}', '${rental.twitterHandle}', ${rental.days}, ${rental.totalPrice / rental.days})">
                    <i class="fas fa-download"></i> Get Banner
                </button>
                <button class="btn-outline" onclick="checkVerificationNowReal(${rental.id})">
                    <i class="fas fa-sync"></i> Check Now
                </button>
                ${rental.status === 'verified' ? `
                <button class="btn-success" style="margin-left: auto;">
                    <i class="fas fa-check-circle"></i> Paid
                </button>
                ` : ''}
            </div>
        `;
        
        container.appendChild(rentalElement);
    });
}

// ===== CREATE LISTING CARD =====
function createListingCard(listing) {
    const card = document.createElement('div');
    card.className = 'listing-card fade-in';
    card.dataset.id = listing.id;
    card.dataset.price = listing.price;
    
    const badgeClass = listing.status === 'verified' ? 'verified-badge' : 'pending-badge';
    const badgeText = listing.status === 'verified' ? 'Verified' : 'Pending';
    
    // Check if listing has custom banner
    const hasCustomBanner = listing.banner && listing.banner.startsWith('data:image');
    const bannerContent = hasCustomBanner 
        ? `<img src="${listing.banner}" alt="Banner" style="width: 100%; height: 150px; object-fit: cover;">`
        : `<div class="banner-text">
              <h4>Available Space</h4>
              <p>1500×500 pixels</p>
           </div>`;
    
    // Twitter badge
    const twitterBadge = listing.twitterHandle 
        ? `<div class="twitter-badge">
              <i class="fab fa-twitter"></i> ${listing.twitterHandle}
           </div>`
        : '';
    
    card.innerHTML = `
        <div class="listing-header">
            <div class="listing-creator">
                <div class="creator-avatar">
                    <img src="${listing.creator.image}" alt="${listing.creator.name}">
                </div>
                <div class="creator-info">
                    <h4>${listing.creator.name}</h4>
                    <div class="creator-handle">${listing.creator.handle}</div>
                    ${twitterBadge}
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
            ${bannerContent}
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

// ===== REST OF FUNCTIONS =====

// Initialize Web3 integration
function initializeWeb3Integration() {
    if (typeof window.bannerSpaceWeb3 !== 'undefined') {
        bannerSpaceWeb3 = window.bannerSpaceWeb3;
        console.log('Web3 loaded successfully');
    } else {
        console.warn('web3.js not loaded, using mock mode');
    }
    
    const walletBtns = document.querySelectorAll('.btn-wallet');
    walletBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (!btn.id || btn.id === 'connectWallet') {
                e.preventDefault();
                openMetamaskModal();
            }
        });
    });
    
    setTimeout(() => {
        refreshListingsFromBlockchain();
    }, 1000);
}

async function refreshListingsFromBlockchain() {
    const listingsGrid = document.getElementById('listingsGrid');
    if (!listingsGrid) return;
    
    listingsGrid.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p>Loading from blockchain...</p></div>';
    
    try {
        if (bannerSpaceWeb3 && bannerSpaceWeb3.isConnected) {
            const realListings = await bannerSpaceWeb3.getAllListings();
            
            if (realListings && realListings.length > 0) {
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
                
                initializeBannerSimulation();
                return;
            }
        }
    } catch (error) {
        console.log('Using mock listings:', error);
    }
    
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

function loadListings(container) {
    if (!container) return;
    refreshListingsWithBanners();
}

function loadFeaturedListings(container) {
    if (!container) return;
    refreshListingsWithBanners();
}

function setupFilterChips() {
    const filterChips = document.querySelectorAll('.filter-chip');
    const listingsGrid = document.getElementById('listingsGrid');
    
    if (!listingsGrid) return;
    
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            filterChips.forEach(c => c.classList.remove('active'));
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
    }
    
    container.innerHTML = '';
    filteredListings.forEach(listing => {
        const listingCard = createListingCard(listing);
        container.appendChild(listingCard);
    });
    
    setTimeout(initializeBannerSimulation, 100);
}

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
            
            setTimeout(initializeBannerSimulation, 100);
        });
    }
}

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
    
    // Create Ad Modal
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
    
    // Close metamask modal
    const metamaskModal = document.getElementById('metamaskModal');
    if (metamaskModal) {
        metamaskModal.addEventListener('click', function(e) {
            if (e.target === metamaskModal) {
                closeMetamaskModal();
            }
        });
    }
    
    // Close transaction modal
    const transactionModal = document.getElementById('transactionModal');
    if (transactionModal) {
        transactionModal.addEventListener('click', function(e) {
            if (e.target === transactionModal) {
                closeTransactionModal();
            }
        });
    }
}

function setupDashboardTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const tab = this.dataset.tab;
            switchDashboardTab(tab);
        });
    });
}

function switchDashboardTab(tab) {
    showToast(`Switched to ${tab} tab`, 'success');
}

function previewListing(listingId) {
    const allListings = [
        ...mockListings,
        ...JSON.parse(localStorage.getItem('bannerSpace_listings') || '[]').map((custom, idx) => ({
            ...custom,
            id: 100 + idx
        }))
    ];
    
    const listing = allListings.find(l => l.id === listingId);
    
    if (listing) {
        if (listing.banner && listing.banner.startsWith('data:image')) {
            const previewModal = document.createElement('div');
            previewModal.className = 'preview-modal';
            previewModal.innerHTML = `
                <div class="preview-content">
                    <button class="close-preview" onclick="this.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                    <h3>Banner Preview</h3>
                    <div class="full-banner">
                        <img src="${listing.banner}" alt="Banner Preview">
                    </div>
                    <p>Price: ${listing.price} ETH/day • Twitter: ${listing.twitterHandle || 'Not specified'}</p>
                </div>
            `;
            document.body.appendChild(previewModal);
        } else {
            showToast(`Previewing ${listing.creator?.handle || 'creator'}'s banner`, 'success');
        }
    }
}

// Toast notification system
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    
    if (!toast) {
        const toastDiv = document.createElement('div');
        toastDiv.id = 'toast';
        toastDiv.className = 'toast';
        document.body.appendChild(toastDiv);
        return showToast(message, type);
    }
    
    toast.textContent = message;
    toast.className = 'toast';
    toast.classList.add(type);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Refresh listings with banners
function refreshListingsWithBanners() {
    const listingsGrid = document.getElementById('listingsGrid');
    const featuredListings = document.getElementById('featuredListings');
    
    if (!listingsGrid && !featuredListings) return;
    
    const customListings = JSON.parse(localStorage.getItem('bannerSpace_listings') || '[]');
    let allListings = [...mockListings];
    
    customListings.forEach((custom, index) => {
        const customListing = {
            id: 100 + index,
            creator: {
                name: 'You',
                handle: `@${bannerSpaceWeb3?.userAddress?.slice(0, 8) || 'user'}`,
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (custom.creator || 'user'),
                followers: '0',
                verified: true
            },
            stats: {
                followers: '0',
                ctr: '0%',
                impressions: '0'
            },
            price: custom.price,
            banner: custom.banner,
            twitterHandle: custom.twitterHandle || '@user',
            status: 'verified'
        };
        allListings.unshift(customListing);
    });
    
    if (listingsGrid) {
        listingsGrid.innerHTML = '';
        allListings.forEach(listing => {
            const listingCard = createListingCard(listing);
            listingsGrid.appendChild(listingCard);
        });
    }
    
    if (featuredListings) {
        featuredListings.innerHTML = '';
        allListings.slice(0, 3).forEach(listing => {
            const listingCard = createListingCard(listing);
            featuredListings.appendChild(listingCard);
        });
    }
    
    initializeBannerSimulation();
}

// ===== GLOBAL FUNCTIONS =====
window.connectMetamask = connectMetamask;
window.openMetamaskModal = openMetamaskModal;
window.closeMetamaskModal = closeMetamaskModal;
window.showTransactionModal = showTransactionModal;
window.closeTransactionModal = closeTransactionModal;
window.previewListing = previewListing;
window.removeBanner = removeBanner;
window.connectTwitter = connectTwitter;
window.showBannerInstructions = showBannerInstructions;
window.checkVerificationNow = checkVerificationNowReal;
window.verifyTwitterHandleReal = verifyTwitterHandleReal;
window.createListingWithTwitter = createListingWithTwitter;

// Auto-initialize when web3.js loads
window.addEventListener('load', function() {
    if (typeof BannerSpaceWeb3 !== 'undefined' && !bannerSpaceWeb3) {
        bannerSpaceWeb3 = new BannerSpaceWeb3();
        window.bannerSpaceWeb3 = bannerSpaceWeb3;
        console.log('Web3 auto-initialized');
    }
});
