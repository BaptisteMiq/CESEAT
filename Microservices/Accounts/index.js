const mysql = require("mysql");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

// Wait for DB to be loaded
const connectToDB = () => {
    con.connect(function (err) {
        if (err) {
            setTimeout(connectToDB, 1000);
        } else {
            console.log("Connecté à la base de données MySQL!");
        }
    });
};

// Express routes
app.get("/users", (req, res) => {
    con.query("SELECT * FROM User", function (err, result, fields) {
        if (err) res.status(400).send(err.sqlMessage);
        res.send(result);
    });
});

app.get("/", (req, res) => {
    let n = Math.floor(Math.random() * 10);
    console.log(n);
    res.send(`Hello World! ${n}`);
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
        res.status(400).send("Il manque des champs requis.");
        return;
    }
    // Check if user already exists
    con.query("SELECT * FROM User WHERE Mail = ?", [user.Mail], function (err, result, fields) {
        if (err) res.status(400).send(err.sqlMessage);
        if (result && result.length > 0) {
            res.status(400).send("Cet utilisateur existe déjà.");
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
                if (err) res.status(400).send(err.sqlMessage);
                // Return created user
                con.query("SELECT * FROM User WHERE ID = ?", [result.insertId], function (err, result, fields) {
                    if (err) res.status(400).send(err.sqlMessage);
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
        res.status(400).send("Il manque des champs requis: ID");
        return;
    }
    // Check if user exists
    con.query("SELECT * FROM User WHERE ID = ?", [user.ID], function (err, result, fields) {
        if (err) res.status(400).send(err.sqlMessage);
        if (result.length === 0) {
            res.status(400).send("Cet utilisateur n'existe pas.");
            return;
        }
        // Delete user
        con.query("DELETE FROM User WHERE ID = ?", [user.ID], function (err, result) {
            if (err) res.status(400).send(err.sqlMessage);
            res.send({ ID: user.ID });
        });
    });
});

// Update user form POST request body
app.post("/users/update", (req, res) => {
    const { ID, record: user } = req.body;
    // Check required fields
    if (!ID) {
        res.status(400).send("Il manque des champs requis: ID");
        return;
    }
    if (!user) {
        res.status(400).send("Il manque des champs requis: User");
        return;
    }
    // Check if user exists
    con.query("SELECT * FROM User WHERE ID = ?", [ID], function (err, result, fields) {
        if (err) res.status(400).send(err.sqlMessage);
        if (result.length === 0) {
            res.status(400).send("Cet utilisateur n'existe pas.");
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
                if (err) res.status(400).send(err.sqlMessage);
                // Return updated user
                con.query("SELECT * FROM User WHERE ID = ?", [ID], function (err, result, fields) {
                    if (err) res.status(400).send(err.sqlMessage);
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
        if (err) res.status(400).send(err.sqlMessage);
        if (result && result.length === 0) {
            res.status(400).send("Cet utilisateur n'existe pas.");
            return;
        }
        res.send(result[0]);
    });
});

// Register
app.post("/register", (req, res) => {
    const user = req.body;
    try {
        const { Firstname, Lastname, Password, Mail, PhoneNumber } = user;
        if (!Firstname || !Lastname || !Password || !Mail || !PhoneNumber) {
            res.status(400).send("Il manque des champs requis.");
            return;
        }
        con.query("SELECT * FROM User WHERE Mail = ?", [Mail], function (err, result, fields) {
            if (err) res.status(400).send(err.sqlMessage);
            if (result.length > 0) {
                res.status(400).send("Cet utilisateur existe déjà.");
                return;
            }

            const encryptedPassword = bcrypt.hashSync(Password, 10);

            const RoleID = user.Role_ID || 1;

            const values = [
                user.Firstname,
                user.Lastname,
                encryptedPassword,
                user.Mail,
                user.PhoneNumber,
                user.Avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
                generateSponsorCode(),
                false,
                null,
                null,
                RoleID,
                new Date(),
            ];

            con.query(
                "INSERT INTO User (FirstName, LastName, Password, Mail, PhoneNumber, Avatar, SponsorCode, HasAcceptedGDPR, BillingAddress_ID, DeliveryAddress_ID, Role_ID, CreatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                values,
                function (err, result) {
                    const token = jwt.sign(
                        {
                            Mail,
                            Firstname,
                            Lastname,
                            PhoneNumber,
                            Role_ID: RoleID,
                            ID: result.insertId,
                            Avatar: user.Avatar,
                        },
                        process.env.TOKEN_KEY,
                        {
                            expiresIn: "200h",
                        }
                    );
                    if (err) res.status(400).send(err.sqlMessage);
                    // Return created user with token
                    con.query("SELECT * FROM User WHERE ID = ?", [result.insertId], function (err, result, fields) {
                        if (err) res.status(400).send(err.sqlMessage);
                        const user = result[0];
                        console.log("User created", user, token);
                        res.send({ user, token });
                    });
                }
            );
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

// /verify/1
app.get("/verify/:authorizedUsers", (req, res) => {
    const authorizedUsers = req.params.authorizedUsers;

    if (!authorizedUsers) {
        return res.status(400).send("Le type d'utilisateur n'est pas spécifié.");
    }
    const authorizedUsersArray = authorizedUsers.split("-");

    const config = process.env;

    let token = req.headers["authorization"];

    if (!token) {
        return res.status(403).send("Un token d'autorisation est requis.");
    }

    token = token.replace("Bearer ", "");
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;

        if (decoded.Role_ID !== 6 && !authorizedUsersArray.includes(decoded.Role_ID.toString())) {
            return res.status(403).send("Vous n'avez pas les droits pour accéder à cette ressource.");
        }

        return res.send(decoded);
    } catch (err) {
        return res.status(401).send("Token invalide.");
    }
});

app.post("/login", (req, res) => {
    const user = req.body;
    try {
        const { Mail, Password } = user;
        if (!Mail || !Password) {
            res.status(400).send("Il manque des champs requis.");
            return;
        }
        con.query("SELECT * FROM User WHERE Mail = ?", [Mail], function (err, result, fields) {
            if (err) res.status(400).send(err.sqlMessage);
            if (result.length === 0) {
                res.status(400).send("Cet utilisateur n'existe pas.");
                return;
            }
            const user = result[0];
            if (!bcrypt.compareSync(Password, user.Password)) {
                res.status(400).send("Mot de passe incorrect.");
                return;
            }
            const token = jwt.sign(
                {
                    Mail: user.Mail,
                    Firstname: user.Firstname,
                    Lastname: user.Lastname,
                    PhoneNumber: user.PhoneNumber,
                    Role_ID: user.Role_ID,
                    Avatar: user.Avatar,
                    ID: user.ID,
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "200h",
                }
            );
            res.send({ user, token });
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get("/decode", (req, res) => {
    let token = req.headers["authorization"];
    if (!token) {
        return res.status(403).send("Un token d'autorisation est requis.");
    }
    token = token.replace("Bearer ", "");
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        res.send(decoded);
    } catch (err) {
        return res.status(401).send("Token invalide.");
    }
});

app.get("/refresh", (req, res) => {
    let token = req.headers["authorization"];
    if (!token) {
        return res.status(403).send("Un token d'autorisation est requis.");
    }
    token = token.replace("Bearer ", "");
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        // Query user in DB
        con.query("SELECT * FROM User WHERE ID = ?", [decoded.ID], function (err, result, fields) {
            if (err) res.status(400).send(err.sqlMessage);
            const user = result[0];
            const token = jwt.sign(
                {
                    Mail: user.Mail,
                    Firstname: user.Firstname,
                    Lastname: user.Lastname,
                    PhoneNumber: user.PhoneNumber,
                    Role_ID: user.Role_ID,
                    Avatar: user.Avatar,
                    ID: user.ID,
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "200h",
                }
            );
            res.send({ user, token });
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Start the server
app.listen(5000, function () {
    console.log("Server started at http://localhost:5000");
});
