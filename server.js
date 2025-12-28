// server.js - Simple Twitter Verification Server
const express = require('express');
const cors = require('cors');
const axios = require('axios');
// REMOVED: require('dotenv').config(); // No .env needed!

const app = express();
app.use(cors());
app.use(express.json());

// Twitter API configuration - HARDCODED DEMO TOKEN
const TWITTER_BEARER_TOKEN = 'demo-token'; // Hardcoded, no .env needed!

// Verify Twitter banner endpoint
app.post('/api/verify-banner', async (req, res) => {
    try {
        const { twitterHandle } = req.body;
        
        if (!twitterHandle) {
            return res.status(400).json({ error: 'Twitter handle required' });
        }
        
        // Remove @ if present
        const handle = twitterHandle.replace('@', '');
        
        console.log(`🔍 Verifying banner for: ${handle}`);
        
        // DEMO MODE - Always use demo since token is 'demo-token'
        const isVerified = Math.random() > 0.3; // 70% success rate
        
        return res.json({
            verified: isVerified,
            handle: `@${handle}`,
            banner_url: isVerified 
                ? `https://pbs.twimg.com/profile_banners/${handle}/1500x500`
                : null,
            message: isVerified 
                ? `✅ @${handle} banner verified on Twitter!` 
                : `❌ @${handle} has no banner. Upload to Twitter.com`,
            demo_mode: true
        });
        
    } catch (error) {
        console.error('Verification error:', error);
        return res.status(500).json({ 
            error: 'Verification failed',
            message: error.message,
            demo_mode: true
        });
    }
});

// Get user info endpoint
app.post('/api/user-info', async (req, res) => {
    try {
        const { twitterHandle } = req.body;
        const handle = twitterHandle.replace('@', '');
        
        // Simulate user data
        return res.json({
            handle: `@${handle}`,
            name: handle.charAt(0).toUpperCase() + handle.slice(1) + ' User',
            followers_count: Math.floor(Math.random() * 50000) + 1000,
            verified: Math.random() > 0.5,
            profile_image_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${handle}`
        });
    } catch (error) {
        console.error('User info error:', error);
        res.status(500).json({ error: 'Failed to get user info' });
    }
});

const PORT = 3001; // Hardcoded port
app.listen(PORT, () => {
    console.log(`🚀 Twitter Verification Server running on port ${PORT}`);
    console.log(`📝 Endpoints:`);
    console.log(`   POST http://localhost:${PORT}/api/verify-banner`);
    console.log(`   POST http://localhost:${PORT}/api/user-info`);
    console.log(`\n💡 Test with:`);
    console.log(`   curl -X POST http://localhost:${PORT}/api/verify-banner \\`);
    console.log(`        -H "Content-Type: application/json" \\`);
    console.log(`        -d '{"twitterHandle":"@emenzs"}'`);
});
