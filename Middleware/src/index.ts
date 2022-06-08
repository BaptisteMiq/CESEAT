import "graphql-import-node";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { connect } from "mongoose";
import UserResolver from "./resolvers/UserResolver";
import { importSchema } from "graphql-import";
import path from "path";

const typeDefs = importSchema(path.resolve(__dirname, "../schemas/schema.graphql"));

// Construct a schema, using GraphQL schema language
const schema = buildSchema(typeDefs);

const app = express();
app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        rootValue: new UserResolver(),
        graphiql: true,
    })
);

connect("mongodb+srv://Admin:Admin@ceseat.omcvzez.mongodb.net/?retryWrites=true&w=majority").then(() => {
    // UserModel.CreateUser({
    //     name: "Test",
    //     email: "test@gmail.com",
    //     avatar: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
    // });
    app.listen(4000);
    console.log("Running a GraphQL API server at http://localhost:4000/graphql");
});
