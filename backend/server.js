const express = require('express');
const cors = require('cors');
const { getChatbotResponse } = require('./chatbot');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Chatbot API is running' });
});

// Chatbot endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = getChatbotResponse(message);

        res.json({
            success: true,
            response: response,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({
            error: 'An error occurred while processing your request',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Chatbot API server is running on port ${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
});

module.exports = app;