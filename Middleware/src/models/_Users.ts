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
        BillingAddress_ID: "String",
        DeliveryAddress_ID: "String",
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
        },
    });
    const UserMutations = {
        userCreateOne: {
            type: ResultUserPayload,
            args: {
                record: UserCreateInput,
            },
            resolve: async (root: any, { record }: any) => {
                return axios
                    .post(`http://${process.env.MSC_HOST}:${process.env.MSC_PORT}/users/create`, record)
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
    };
    return UserMutations;
};
