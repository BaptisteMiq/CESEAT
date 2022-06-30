/*
-- Query: SELECT * FROM mydb.User
LIMIT 0, 1000

-- Date: 2022-06-29 15:20
*/

USE `mydb` ;

INSERT INTO `mydb`.`User` (`ID`,`Firstname`,`Lastname`,`Password`,`Mail`,`PhoneNumber`,`Avatar`,`SponsorCode`,`HasAcceptedGDPR`,`BillingAddress_ID`,`DeliveryAddress_ID`,`Role_ID`,`CreatedAt`) VALUES (1,'Baptiste','Miquel','$2b$10$/MxybQX15V9ICPlolOU6M.f.KKIeZIj40TiP2413K88YKf/7tnTHC','user@test.com','06000000000','/baptiste.jpeg','WDBCX',0,NULL,NULL,1,'2022-06-29 14:45:26');
INSERT INTO `mydb`.`User` (`ID`,`Firstname`,`Lastname`,`Password`,`Mail`,`PhoneNumber`,`Avatar`,`SponsorCode`,`HasAcceptedGDPR`,`BillingAddress_ID`,`DeliveryAddress_ID`,`Role_ID`,`CreatedAt`) VALUES (2,'Florian','Rossi','$2b$10$SfHrB2AHEM.IUD8LtwV.FOEbopDfiuZ8GiRTpqo.BQ6iw6CqncWUe','restaurateur@test.com','06000000000','/florian.jpeg','EPOMS',0,NULL,NULL,2,'2022-06-29 15:17:06');
INSERT INTO `mydb`.`User` (`ID`,`Firstname`,`Lastname`,`Password`,`Mail`,`PhoneNumber`,`Avatar`,`SponsorCode`,`HasAcceptedGDPR`,`BillingAddress_ID`,`DeliveryAddress_ID`,`Role_ID`,`CreatedAt`) VALUES (3,'Lisa','Michelson','$2b$10$iW19kBygkqEdF/L0aCE0.et/3tP/KZU.Pv9DxdxEJMipZTEphLC4q','livreur@test.com','06000000000','/michelson.png','TAEZD',0,NULL,NULL,3,'2022-06-29 15:17:18');
INSERT INTO `mydb`.`User` (`ID`,`Firstname`,`Lastname`,`Password`,`Mail`,`PhoneNumber`,`Avatar`,`SponsorCode`,`HasAcceptedGDPR`,`BillingAddress_ID`,`DeliveryAddress_ID`,`Role_ID`,`CreatedAt`) VALUES (4,'Shinji','Ikari','$2b$10$iW19kBygkqEdF/L0aCE0.et/3tP/KZU.Pv9DxdxEJMipZTEphLC4q','commercial@test.com','06000000000','/evangelion.png','DDDAA',0,NULL,NULL,4,'2022-06-29 15:17:18');
