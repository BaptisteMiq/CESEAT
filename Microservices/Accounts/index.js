const mysql = require("mysql");
const express = require("express");
const app = express();

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Configure express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
Role:
    - Label

Address:
    - Line1
    - Line2
    - City
    - PostCode
    - Country

User:
    - FirstName
    - LastName
    - Password
    - Mail
    - PhoneNumber
    - Avatar
    - SponsorCode
    - HasAcceptedGDPR
    - BillingAddress_ID
    - DeliveryAddress_ID
    - Role_ID
    - CreatedAt
*/

con.connect(function (err) {
    if (err) throw err;
    console.log("Connecté à la base de données MySQL!");
});

// Express routes
app.get("/users", (req, res) => {
    con.query("SELECT * FROM User", function (err, result, fields) {
        if (err) throw err;
        res.send(result);
    });
});

// Start the server
app.listen(5000, function () {
    console.log("Server started at http://localhost:5000");
});