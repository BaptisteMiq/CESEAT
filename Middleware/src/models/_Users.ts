import { ApolloError } from "apollo-server";
import axios from "axios";
import { SchemaComposer } from "graphql-compose";

export const getUsersQueries = (schemaComposer: SchemaComposer) => {
    // Load Users from the Accounts Microservice
    const getUsers = async () =>
        axios
            .get(`http://${process.env.MSC_HOST}:${process.env.MSC_PORT}/users`)
            .then((res) => res.data)
            .catch((err) => {
                throw new ApolloError(err.response.data);
            });
    const getUser = async (id: string) =>
        axios
            .get(`http://${process.env.MSC_HOST}:${process.env.MSC_PORT}/users/${id}`)
            .then((res) => res.data)
            .catch((err) => {
                throw new ApolloError(err.response.data);
            });
    const fields = {
        ID: "String",
        Firstname: "String",
        Lastname: "String",
        Password: "String",
        Mail: "String",
        PhoneNumber: "String",
        Avatar: "String",
        SponsorCode: "String",
        HasAcceptedGDPR: "Boolean",
        Role_ID: "String",
        CreatedAt: "String",
    };
    const UserType = schemaComposer.createObjectTC({
        name: "User",
        fields,
    });
    const UserFilterType = schemaComposer.createInputTC({
        name: "UserFilter",
        fields,
    });
    const UserQueries = {
        users: {
            type: [UserType],
            args: {
                filter: UserFilterType,
            },
            resolve: async (parent: any, args: any) => {
                const users = await getUsers();
                if (args.filter) {
                    return users.filter((user: any) => {
                        return Object.keys(args.filter).every((key) => {
                            return user[key] === args.filter[key];
                        });
                    });
                }
                return users;
            },
        },
        userById: {
            type: UserType,
            args: {
                ID: "String",
            },
            resolve: async (parent: any, args: any) => {
                const user = await getUser(args.ID);
                return user;
            },
        },
    };
    return UserQueries;
};

export const getUsersMutations = (schemaComposer: SchemaComposer) => {
    const UserType = schemaComposer.getOTC("User");

    const ResultUserPayload = schemaComposer.createObjectTC({
        name: "CreateOneUserPayload",
        fields: {
            record: UserType,
            token: "String",
        },
    });

    const UserCreateInput = schemaComposer.createInputTC({
        name: "UserCreateInput",
        fields: {
            Firstname: "String",
            Lastname: "String",
            Password: "String",
            Mail: "String",
            PhoneNumber: "String",
            Avatar: "String",
            Role_ID: "String",
        },
    });
    const UserMutations = {
        userCreateOne: {
            type: ResultUserPayload,
            args: {
                record: UserCreateInput,
            },
            resolve: async (root: any, { record }: any, context: any) => {
                return axios
                    .post(`http://${process.env.MSC_HOST}:${process.env.MSC_PORT}/register/`, record)
                    .then((res) => {
                        context.res.cookie("token", res.data.token, {
                            httpOnly: true,
                        });
                        return {
                            record: res.data.user,
                            token: res.data.token,
                        };
                    })
                    .catch((err) => {
                        throw new ApolloError(err.response.data);
                    });
            },
        },
        userDeleteById: {
            type: ResultUserPayload,
            args: {
                ID: "String",
            },
            resolve: async (root: any, { ID }: any) => {
                return axios
                    .post(`http://${process.env.MSC_HOST}:${process.env.MSC_PORT}/users/delete/`, { ID })
                    .then((res) => {
                        return {
                            record: res.data,
                        };
                    })
                    .catch((err) => {
                        throw new ApolloError(err.response.data);
                    });
            },
        },
        userUpdateById: {
            type: ResultUserPayload,
            args: {
                ID: "String",
                record: UserCreateInput,
            },
            resolve: async (root: any, { ID, record }: any) => {
                return axios
                    .post(`http://${process.env.MSC_HOST}:${process.env.MSC_PORT}/users/update/`, {
                        ID,
                        record,
                    })
                    .then((res) => {
                        return {
                            record: res.data,
                        };
                    })
                    .catch((err) => {
                        throw new ApolloError(err.response.data);
                    });
            },
        },
        userLogin: {
            type: ResultUserPayload,
            args: {
                Mail: "String",
                Password: "String",
            },
            resolve: async (root: any, { Mail, Password }: any, context: any) => {
                return axios
                    .post(`http://${process.env.MSC_HOST}:${process.env.MSC_PORT}/login/`, {
                        Mail,
                        Password,
                    })
                    .then((res) => {
                        // context.res.cookie("token", res.data.token, {
                        //     httpOnly: true,
                        // });
                        return {
                            record: res.data.user,
                            token: res.data.token,
                        };
                    })
                    .catch((err) => {
                        throw new ApolloError(err.response.data);
                    });
            },
        },
        userLogout: {
            type: ResultUserPayload,
            resolve: async (root: any, args: any, context: any) => {
                // context.res.clearCookie("token");
                return {
                    record: null,
                    token: null,
                };
            },
        },
        isLoggedIn: {
            type: ResultUserPayload,
            resolve: async (root: any, args: any, context: any) => {
                const token = context.req.cookies?.token || context.req.headers?.authorization;
                if (!token) {
                    throw new ApolloError("Vous n'êtes pas connecté.");
                }
                return axios
                    .get(`http://${process.env.MSC_HOST}:${process.env.MSC_PORT}/decode/`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((res) => {
                        return {
                            record: res.data,
                            token: token,
                        };
                    })
                    .catch((err) => {
                        throw new ApolloError(err.response.data);
                    });
            },
        },
        refreshToken: {
            type: ResultUserPayload,
            resolve: async (root: any, args: any, context: any) => {
                const token = context.req.cookies?.token || context.req.headers?.authorization;
                if (!token) {
                    throw new ApolloError("Vous n'êtes pas connecté.");
                }
                return axios
                    .get(`http://${process.env.MSC_HOST}:${process.env.MSC_PORT}/refresh/`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((res) => {
                        return {
                            record: res.data,
                            token: res.data.token,
                        };
                    })
                    .catch((err) => {
                        throw new ApolloError(err.response.data);
                    });
            },
        },
    };
    return UserMutations;
};
