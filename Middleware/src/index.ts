import { ApolloServer } from "apollo-server";
import "graphql-import-node";
import { connect } from "mongoose";
import buildSchema from "./models";

(async () => {
    const schema = await buildSchema();
    const server = new ApolloServer({ schema });

    // const typeDefs = importSchema(path.resolve(__dirname, "../schemas/schema.graphql"));

    // Construct a schema, using GraphQL schema language
    // const schema = buildSchema(typeDefs);

    connect("mongodb+srv://Admin:Admin@ceseat.omcvzez.mongodb.net/?retryWrites=true&w=majority").then(() => {
        // UserModel.CreateUser({
        //     name: "Test",
        //     email: "test@gmail.com",
        //     avatar: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
        // });

        server.listen().then(({ url }) => {
            console.log(`🚀 Server ready at ${url}`);
        });

        console.log("Running a GraphQL API server at http://localhost:4000/graphql");
    });
})();
