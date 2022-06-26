const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const randomOrderId = (size) => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = size; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
};

app.get("/", (req, res) => {
    res.send("Microservice Orders is running");
});

// Make order contains a body with GraphQL Queries and Mutations / Variables
app.post("/makeOrder", async (req, res) => {
    const gqlData = req.body;

    const queries = [
        `
        mutation orderCreateOne($record: CreateOneOrderInput!) {
            orderCreateOne(record: $record) {
                recordId
            }
        }
    `,
        `mutation cartUpdateById($id: MongoID!, $record: UpdateByIdCartInput!) {
        cartUpdateById(_id: $id, record: $record) {
            recordId
        }
    }`,
    ];

    const variables = [
        {
            record: {
                userId: gqlData.userId.toString(),
                cart: gqlData.cart,
                restaurant: gqlData.restaurant,
                additionalInfo: gqlData.additionalInfo,
                status: gqlData.status,
                tag: randomOrderId(8),
            },
        },
        {
            id: gqlData.cart,
            record: {
                isOrdered: true,
            },
        },
    ];

    res.send({ queries, variables });
});

app.listen(4500, () => {
    console.log("Microservice Orders is running on port 4500");
});
