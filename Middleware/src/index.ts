// import { ApolloServer, UserInputError } from "apollo-server";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import "graphql-import-node";
import { connect } from "mongoose";
import buildSchema from "./models";

import express from "express";
import { ApolloServer, UserInputError } from "apollo-server-express";

import cookieParser from "cookie-parser";
import cors from "cors";

// Socket.IO
import http from "http";
import { Server } from "socket.io";

(async () => {
    const schema = await buildSchema();
    const server = new ApolloServer({
        schema,
        csrfPrevention: true,
        formatError(err: GraphQLError) {
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
        context: ({ req, res }) => {
            return { req, res };
        },
    });

    connect("mongodb+srv://Admin:Admin@ceseat.omcvzez.mongodb.net/?retryWrites=true&w=majority").then(async () => {
        const app = express();
        app.use(cors());
        app.use(cookieParser());
        await server.start();
        server.applyMiddleware({ app });

        // app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
        const socketAndGQLServer = http.createServer(app);

        console.log("Running a GraphQL API server at http://localhost:4000/graphql");

        // Socket.IO
        const io = new Server(socketAndGQLServer, {
            cors: {
                origin: "https://baptistemiq-ceseat-57vjjjpqh7549-3000.githubpreview.dev",
            },
            path: '/socket.io',
            transports: ['websocket'],
        });
        io.engine.on("connection_error", (err: any) => {
            console.log(err);
          });

        io.on("connection", (socket: any) => {
            console.log("New socket client connected");
            socket.on("orderStatus", (message: any) => {
                console.log("Received message: ", message);
                io.emit("orderStatus", message);
            });
        });

        socketAndGQLServer.listen(4000, () => {
            console.log("Server is running");
        });
    });
})();
