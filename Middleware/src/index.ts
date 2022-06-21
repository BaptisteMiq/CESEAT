import { ApolloServer, UserInputError } from "apollo-server";
import { GraphQLError, GraphQLFormattedError, isLeafType } from "graphql";
import "graphql-import-node";
import { connect } from "mongoose";
import buildSchema from "./models";

(async () => {
    const schema = await buildSchema();
    const server = new ApolloServer({
        schema,
        csrfPrevention: true,
        formatError(err: GraphQLError) {
            console.log(err.message);
            if (err instanceof UserInputError) {
                // Variable "$record" got invalid value null at "record.products"; Expected non-nullable type "[MongoID]!" not to be null.
                // Retrieve the string products with regex
                let errorMessage = "";
                let regex = /\"record\.(.+?)\"/;
                let match = regex.exec(err.message);
                if (match) {
                    const fieldErrorName = match[1];
                    if (fieldErrorName) {
                        errorMessage = `Le champ '${fieldErrorName}' est requis.`;
                    }
                }
                // Variable "$id" of non-null type "MongoID!" must not be null.
                regex = /^Variable \"(.+?)\".+?must not be null/;
                match = regex.exec(err.message);
                if (match) {
                    const fieldErrorName = match[1];
                    if (fieldErrorName) {
                        errorMessage = `Le champ '${fieldErrorName}' est requis.`;
                    }
                }
                regex = /^Cast to .+? failed for value \"(.+?)\"/;
                match = regex.exec(err.message);
                if (match) {
                    const fieldErrorName = match[1];
                    if (fieldErrorName) {
                        errorMessage = `Le champ '${fieldErrorName}' n'est pas du bon type.`;
                    }
                }
                regex = /Variable \"(.+?)\" got invalid value/;
                match = regex.exec(err.message);
                if (match) {
                    const fieldErrorName = match[1];
                    if (fieldErrorName) {
                        errorMessage = `Le champ '${fieldErrorName}' n'est pas du bon type.`;
                    }
                }
                const error: GraphQLFormattedError = {
                    message: errorMessage,
                };
                return error;
            }
            return err;
        },
    });

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
