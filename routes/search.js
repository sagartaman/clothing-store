const express = require("express");
const router = express.Router();
const Product= require("../models/products.models");

// Search route
router.get('/search', async (req, res) => {
    const { q } = req.query; // Get the search term from the query string

    // If no query is provided, don't perform the search
    if (!q || q.trim() === "") {
        return res.render('./products/sResult.ejs', { 
            products: [], 
            message: "Please enter a search term." 
        });
    }

    try {
        const searchQuery = q.trim(); // Trim whitespace from the search query

        // Perform case-insensitive search in name and description fields
        const products = await Product.find({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search in the name field
                { description: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search in the description field
            ],
        });

        // Render the view with search results
        res.render('./products/sResult.ejs', { 
            products, 
            query: searchQuery, 
            message: products.length === 0 ? "No products found." : null 
        });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).render('./products/sResult.ejs', { 
            products: [], 
            message: "An error occurred while processing your request." 
        });
    }
});

module.exports = router;