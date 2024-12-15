const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Test API endpoint
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Hello, this is your test API!',
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
