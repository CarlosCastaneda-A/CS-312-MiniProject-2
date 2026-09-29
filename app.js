const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files from the public folder
app.use(express.static("public"));

// Allow Express to read form data
app.use(express.urlencoded({ extended: true }));

// Home page
app.get("/", (req, res) => {
    res.render("index", {
        cocktail: null,
        error: null
    });
});

// Search for a cocktail
app.get("/search", async (req, res) => {
    const cocktailName = req.query.name;

    if (!cocktailName) {
        return res.render("index", {
            cocktail: null,
            error: "Please enter a cocktail name."
        });
    }

    try {
        const response = await axios.get(
            `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(cocktailName)}`
        );

        if (!response.data.drinks) {
            return res.render("index", {
                cocktail: null,
                error: "Cocktail not found. Please try another name."
            });
        }

        const cocktail = response.data.drinks[0];

        res.render("index", {
            cocktail: cocktail,
            error: null
        });

    } catch (error) {
        console.error(error);

        res.render("index", {
            cocktail: null,
            error: "There was a problem connecting to the cocktail API."
        });
    }
});

// Random cocktail
app.get("/random", async (req, res) => {
    try {
        const response = await axios.get(
            "https://www.thecocktaildb.com/api/json/v1/1/random.php"
        );

        const cocktail = response.data.drinks[0];

        res.render("index", {
            cocktail: cocktail,
            error: null
        });

    } catch (error) {
        console.error(error);

        res.render("index", {
            cocktail: null,
            error: "There was a problem connecting to the cocktail API."
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});