const mysql = require("mysql");
const express = require("express");
const app = express();

// Connection from url
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
    - Firstname*
    - Lastname*
    - Password*
    - Mail*
    - PhoneNumber*
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

    con.query(
        "INSERT INTO Role (Label) VALUES ('Utilisateur'), ('Restaurateur') ON DUPLICATE KEY UPDATE Label = Label",
        function (err, result) {
            if (err) throw err;
            console.log("Roles ajoutés dans la base de données MySQL!");
        }
    );
});

// Express routes
app.get("/users", (req, res) => {
    con.query("SELECT * FROM User", function (err, result, fields) {
        if (err) throw err;
        res.send(result);
    });
});

const generateSponsorCode = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";
    for (let i = 0; i < 5; i++) {
        code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return code;
};

// Create new user form POST request body
app.post("/users/create", (req, res) => {
    const user = req.body;
    // Check required fields
    if (!user.Firstname || !user.Lastname || !user.Password || !user.Mail || !user.PhoneNumber) {
        console.log("Missing required fields", user);
        res.status(400).send("Missing required fields");
        return;
    }
    // Check if user already exists
    con.query("SELECT * FROM User WHERE Mail = ?", [user.Mail], function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            console.log("User already exists", user);
            res.status(400).send("User already exists");
            return;
        }
        // Insert user
        const values = [
            user.Firstname,
            user.Lastname,
            user.Password,
            user.Mail,
            user.PhoneNumber,
            user.Avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
            generateSponsorCode(),
            false,
            null,
            null,
            1,
            new Date(),
        ];

        con.query(
            "INSERT INTO User (FirstName, LastName, Password, Mail, PhoneNumber, Avatar, SponsorCode, HasAcceptedGDPR, BillingAddress_ID, DeliveryAddress_ID, Role_ID, CreatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            values,
            function (err, result) {
                if (err) throw err;
                // Return created user
                con.query("SELECT * FROM User WHERE ID = ?", [result.insertId], function (err, result, fields) {
                    if (err) throw err;
                    res.send(result[0]);
                });
            }
        );
    });
});

// Delete user form POST request body
app.post("/users/delete", (req, res) => {
    const user = req.body;
    // Check required fields
    if (!user.ID) {
        console.log("Missing User ID", user);
        res.status(400).send("Missing User ID");
        return;
    }
    // Check if user exists
    con.query("SELECT * FROM User WHERE ID = ?", [user.ID], function (err, result, fields) {
        if (err) throw err;
        if (result.length === 0) {
            console.log("User does not exist", user);
            res.status(400).send("User does not exist");
            return;
        }
        // Delete user
        con.query("DELETE FROM User WHERE ID = ?", [user.ID], function (err, result) {
            if (err) throw err;
            res.send({ ID: user.ID });
        });
    });
});

// Update user form POST request body
app.post("/users/update", (req, res) => {
    const { ID, record: user } = req.body;
    // Check required fields
    if (!ID) {
        console.log("Missing User ID", user);
        res.status(400).send("Missing User ID");
        return;
    }
    if (!user) {
        console.log("Missing User");
        res.status(400).send("Missing User");
        return;
    }
    // Check if user exists
    con.query("SELECT * FROM User WHERE ID = ?", [ID], function (err, result, fields) {
        if (err) throw err;
        if (result.length === 0) {
            console.log("User does not exist", user);
            res.status(400).send("User does not exist");
            return;
        }
        // Update user
        con.query(
            "UPDATE User SET FirstName = ?, LastName = ?, Password = ?, Mail = ?, PhoneNumber = ?, Avatar = ?, HasAcceptedGDPR = ?, BillingAddress_ID = ?, DeliveryAddress_ID = ?, Role_ID = ? WHERE ID = ?",
            [
                user.Firstname ?? result[0].Firstname,
                user.Lastname ?? result[0].Lastname,
                user.Password ?? result[0].Password,
                user.Mail ?? result[0].Mail,
                user.PhoneNumber ?? result[0].PhoneNumber,
                user.Avatar ?? result[0].Avatar,
                user.HasAcceptedGDPR ?? result[0].HasAcceptedGDPR,
                user.BillingAddress_ID ?? result[0].BillingAddress_ID,
                user.DeliveryAddress_ID ?? result[0].DeliveryAddress_ID,
                user.Role_ID ?? result[0].Role_ID,
                ID,
            ],
            function (err, result) {
                if (err) throw err;
                // Return updated user
                con.query("SELECT * FROM User WHERE ID = ?", [ID], function (err, result, fields) {
                    if (err) throw err;
                    res.send(result[0]);
                });
            }
        );
    });
});

// Get user by ID
app.get("/users/:id", (req, res) => {
    const id = req.params.id;
    con.query("SELECT * FROM User WHERE ID = ?", [id], function (err, result, fields) {
        if (err) throw err;
        if (result.length === 0) {
            console.log("User does not exist", id);
            res.status(400).send("User does not exist");
            return;
        }
        res.send(result[0]);
    });
});

// Start the server
app.listen(5000, function () {
    console.log("Server started at http://localhost:5000");
});
