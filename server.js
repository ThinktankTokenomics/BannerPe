// server.js - Simple Twitter Verification Server
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Twitter API configuration
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN || 'demo-token';

// Verify Twitter banner endpoint
app.post('/api/verify-banner', async (req, res) => {
    try {
        const { twitterHandle } = req.body;
        
        if (!twitterHandle) {
            return res.status(400).json({ error: 'Twitter handle required' });
        }
        
        // Remove @ if present
        const handle = twitterHandle.replace('@', '');
        
        console.log(`Verifying banner for: ${handle}`);
        
        // DEMO MODE - Use real API if token exists, otherwise simulate
        if (TWITTER_BEARER_TOKEN === 'demo-token') {
            // Simulate API response for demo
            const isVerified = Math.random() > 0.3; // 70% success rate
            
            return res.json({
                verified: isVerified,
                handle: `@${handle}`,
                banner_url: isVerified 
                    ? 'https://pbs.twimg.com/profile_banners/.../1500x500'
                    : null,
                message: isVerified 
                    ? '✅ Banner verified on Twitter!' 
                    : '❌ Banner not found. Please upload and try again.',
                demo_mode: true
            });
        }
        
        // REAL API CALL (uncomment when you have real token)
        /*
        const response = await axios.get(
            `https://api.twitter.com/2/users/by/username/${handle}`,
            {
                params: {
                    'user.fields': 'profile_banner_url'
                },
                headers: {
                    'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`
                }
            }
        );
        
        const hasBanner = response.data.data?.profile_banner_url;
        
        return res.json({
            verified: !!hasBanner,
            handle: `@${handle}`,
            banner_url: hasBanner || null,
            message: hasBanner 
                ? '✅ Banner verified on Twitter!' 
                : '❌ Banner not found. Please upload and try again.',
            demo_mode: false
        });
        */
        
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
            name: 'Twitter User',
            followers_count: Math.floor(Math.random() * 50000) + 1000,
            verified: Math.random() > 0.5,
            profile_image_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${handle}`
        });
    } catch (error) {
        console.error('User info error:', error);
        res.status(500).json({ error: 'Failed to get user info' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Twitter Verification Server running on port ${PORT}`);
    console.log(`📝 Endpoints:`);
    console.log(`   POST /api/verify-banner`);
    console.log(`   POST /api/user-info`);
});
