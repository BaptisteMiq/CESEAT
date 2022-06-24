import { ApolloError } from "apollo-server";
import axios from "axios";
import { ResolverMiddleware } from "graphql-compose";

export const Users = {
    USER: 1,
    REST: 2,
    DRIVER: 3,
    COMM: 4,
    DEV: 5,
    TECH: 6,
};

export const AuthMiddleware: ResolverMiddleware<any, any> = async (resolve, source, args, context, info) => {
    const token = context.req.cookies?.token;
    if (!token) {
        throw new ApolloError("Vous devez être connecté pour accéder à cette ressource.");
    }

    const TYPES = context.req.authorizedUsers.join("-");

    const verifyURL = `http://${process.env.MSC_HOST}:${process.env.MSC_PORT}/verify/${TYPES}`;
    console.log(verifyURL);

    const verify = await axios
        .get(verifyURL, {
            headers: {
                Authorization: token,
            },
        })
        .catch((err) => {
            throw new ApolloError(err.response.data);
        });
    context.user = verify.data.user;
    return resolve(source, args, context, info);
};

export const RequireUser: ResolverMiddleware<any, any> = async (resolve, source, args, context, info) => {
    if (!context.req.authorizedUsers) {
        context.req.authorizedUsers = [];
    }
    context.req.authorizedUsers.push(Users.USER);
    return resolve(source, args, context, info);
};
