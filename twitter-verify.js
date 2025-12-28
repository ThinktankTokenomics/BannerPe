// twitter-verify.js - Twitter API Integration for Banner Verification

class TwitterVerifier {
    constructor() {
        this.apiKey = 'demo_key'; // In production: process.env.TWITTER_API_KEY
        this.baseURL = 'https://api.twitter.com/2';
        this.verificationInterval = 5 * 60 * 1000; // Check every 5 minutes
    }
    
    // Connect Twitter account (OAuth flow)
    async connectTwitter() {
        // For demo, we'll simulate. In real app, use Twitter OAuth 2.0
        return new Promise((resolve) => {
            setTimeout(() => {
                const handle = `@user${Math.floor(Math.random() * 10000)}`;
                localStorage.setItem('twitter_handle', handle);
                resolve({
                    success: true,
                    handle: handle,
                    userId: `user${Date.now()}`
                });
            }, 1000);
        });
    }
    
    // Verify banner is live on Twitter
    async verifyBanner(twitterHandle, expectedBannerHash) {
        console.log(`Verifying banner for ${twitterHandle}...`);
        
        // DEMO: Simulate API call
        // In real app: GET https://api.twitter.com/2/users/by/username/:username?user.fields=profile_banner_url
        
        return new Promise((resolve) => {
            setTimeout(() => {
                // 80% chance of success in demo
                const isVerified = Math.random() > 0.2;
                
                resolve({
                    verified: isVerified,
                    timestamp: new Date().toISOString(),
                    handle: twitterHandle,
                    currentBanner: isVerified 
                        ? 'https://pbs.twimg.com/profile_banners/...' 
                        : null,
                    message: isVerified 
                        ? '✅ Banner verified live on Twitter!' 
                        : '❌ Banner not found or mismatch'
                });
            }, 2000);
        });
    }
    
    // Start periodic verification for a rental
    startVerification(rentalId, twitterHandle, durationDays) {
        console.log(`Starting verification for rental ${rentalId}, ${twitterHandle}`);
        
        const endTime = Date.now() + (durationDays * 24 * 60 * 60 * 1000);
        let checkCount = 0;
        
        const checkInterval = setInterval(async () => {
            if (Date.now() > endTime) {
                clearInterval(checkInterval);
                console.log(`Verification completed for rental ${rentalId}`);
                return;
            }
            
            checkCount++;
            const result = await this.verifyBanner(twitterHandle);
            
            if (result.verified) {
                this.logVerification(rentalId, true, checkCount);
                
                // Update UI if function exists
                if (window.updateVerificationStatus) {
                    window.updateVerificationStatus(rentalId, {
                        check: checkCount,
                        status: 'verified',
                        lastChecked: new Date().toLocaleTimeString()
                    });
                }
            } else {
                this.logVerification(rentalId, false, checkCount);
                
                // Retry in 1 minute if failed
                setTimeout(async () => {
                    const retryResult = await this.verifyBanner(twitterHandle);
                    if (!retryResult.verified) {
                        console.warn(`Banner missing for ${twitterHandle}, rental ${rentalId} at risk`);
                    }
                }, 60000);
            }
        }, this.verificationInterval);
        
        return checkInterval;
    }
    
    logVerification(rentalId, success, checkNumber) {
        const log = {
            rentalId,
            success,
            checkNumber,
            timestamp: new Date().toISOString(),
            checkedAt: new Date().toLocaleTimeString()
        };
        
        // Save to localStorage
        const logs = JSON.parse(localStorage.getItem('verification_logs') || '[]');
        logs.push(log);
        localStorage.setItem('verification_logs', JSON.stringify(logs.slice(-100))); // Keep last 100
        
        console.log(`Verification ${checkNumber}:`, log);
    }
    
    // Get verification history
    getVerificationHistory(rentalId) {
        const logs = JSON.parse(localStorage.getItem('verification_logs') || '[]');
        return logs.filter(log => log.rentalId === rentalId);
    }
}

// Create global instance
window.twitterVerifier = new TwitterVerifier();
