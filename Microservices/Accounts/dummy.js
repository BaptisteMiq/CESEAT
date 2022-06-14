// Insert two roles in the table "Role": Utilisateur and Restaurateur
con.query(
    "INSERT INTO Role (Label) VALUES ('Utilisateur'), ('Restaurateur') ON DUPLICATE KEY UPDATE Label = Label",
    function (err, result) {
        if (err) throw err;
        console.log("Roles ajoutés dans la base de données MySQL!");
    }
);

// Insert a new address
con.query(
    "INSERT INTO Address (Line1, Line2, City, PostCode, Country) VALUES ('1 rue de la paix', '', 'Paris', '75001', 'France') ON DUPLICATE KEY UPDATE Line1 = Line1",
    function (err, result) {
        if (err) throw err;
        console.log("Adresse ajoutée dans la base de données MySQL!");
    }
);

// Insert a new user
con.query(
    "INSERT INTO User (FirstName, LastName, Password, Mail, PhoneNumber, Avatar, SponsorCode, HasAcceptedGDPR, BillingAddress_ID, DeliveryAddress_ID, Role_ID, CreatedAt) VALUES ('John', 'Doe', 'password', 'johndoe@ceseat.com', '0600000000', 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y', '', 0, 1, 1, 1, NOW()) ON DUPLICATE KEY UPDATE FirstName = FirstName",
    function (err, result) {
        if (err) throw err;
        console.log("Utilisateur ajouté dans la base de données MySQL!");
    }
);
