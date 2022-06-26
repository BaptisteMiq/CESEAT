import { ApolloError } from "apollo-server";
import axios from "axios";
import { ResolverMiddleware } from "graphql-compose";

export const decodeToken = async (token: string) => {
    const decodeURL = `http://${process.env.MSC_HOST}:${process.env.MSC_PORT}/decode`;
    const { data } = await axios
        .get(decodeURL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .catch((err) => {
            throw new ApolloError(err.message);
        });
    return data;
};

export const U = {
    OWN: 0,
    USER: 1,
    REST: 2,
    DRIVER: 3,
    COMM: 4,
    DEV: 5,
    TECH: 6,
};

export const AuthMiddleware: ResolverMiddleware<any, any> = async (resolve, source, args, context, info) => {
    const token = context.req.cookies?.token || context.req.headers?.authorization;
    if (!token) {
        throw new ApolloError("Vous devez être connecté pour accéder à cette ressource.");
    }

    const TYPES = context.req.authorizedUsers.join("-");

    const verifyURL = `http://${process.env.MSC_HOST}:${process.env.MSC_PORT}/verify/${TYPES}`;

    // First check if the specified user type can access the resource...
    const verify = await axios
        .get(verifyURL, {
            headers: {
                Authorization: token,
            },
        })
        .catch(async (err) => {
            // ... If not, check if the user owns the resource.
            // Add a filter to the query to only return the user that is logged in
            if (Array.isArray(context.req.authorizedUsers) && context.req.authorizedUsers.includes(U.OWN)) {
                const decodeURL = `http://${process.env.MSC_HOST}:${process.env.MSC_PORT}/decode`;
                const { data } = await axios
                    .get(decodeURL, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .catch((err) => {
                        throw new ApolloError(err.message);
                    });
                if (!args.filter) {
                    args.filter = {};
                }
                args.filter.userId = data.ID;
                if (!args.record) {
                    args.record = {};
                }
                args.record.userId = data.ID;
                context.user = data;
            } else {
                // If not, user is not authorized.
                throw new ApolloError(err.response.data);
            }
        });
    if (verify && verify.data) {
        context.user = verify.data.user;
    }
    return resolve(source, args, context, info);
};

export const Require = (types: number[]): ResolverMiddleware<any, any>[] => {
    const middlewares = types.map((type) => {
        return (resolve: any, source: any, args: any, context: any, info: any) => {
            if (!context.req.authorizedUsers) {
                context.req.authorizedUsers = [];
            }
            context.req.authorizedUsers.push(type);
            return resolve(source, args, context, info);
        };
    });
    middlewares.push(AuthMiddleware);
    return middlewares;
};

export const RequireUser: ResolverMiddleware<any, any> = async (resolve, source, args, context, info) => {
    if (!context.req.authorizedUsers) {
        context.req.authorizedUsers = [];
    }
    context.req.authorizedUsers.push(U.USER);
    return resolve(source, args, context, info);
};

export const RequireRest: ResolverMiddleware<any, any> = async (resolve, source, args, context, info) => {
    if (!context.req.authorizedUsers) {
        context.req.authorizedUsers = [];
    }
    context.req.authorizedUsers.push(U.REST);
    return resolve(source, args, context, info);
};

export const RequireDriver: ResolverMiddleware<any, any> = async (resolve, source, args, context, info) => {
    if (!context.req.authorizedUsers) {
        context.req.authorizedUsers = [];
    }
    context.req.authorizedUsers.push(U.DRIVER);
    return resolve(source, args, context, info);
};

export const RequireComm: ResolverMiddleware<any, any> = async (resolve, source, args, context, info) => {
    if (!context.req.authorizedUsers) {
        context.req.authorizedUsers = [];
    }
    context.req.authorizedUsers.push(U.COMM);
    return resolve(source, args, context, info);
};

export const RequireDev: ResolverMiddleware<any, any> = async (resolve, source, args, context, info) => {
    if (!context.req.authorizedUsers) {
        context.req.authorizedUsers = [];
    }
    context.req.authorizedUsers.push(U.DEV);
    return resolve(source, args, context, info);
};

export const RequireTech: ResolverMiddleware<any, any> = async (resolve, source, args, context, info) => {
    if (!context.req.authorizedUsers) {
        context.req.authorizedUsers = [];
    }
    context.req.authorizedUsers.push(U.TECH);
    return resolve(source, args, context, info);
};
