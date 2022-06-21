// import { getModelForClass, prop } from "@typegoose/typegoose";
// import { ApolloError } from "apollo-server";
// import axios from "axios";
// import { composeMongoose } from "graphql-compose-mongoose";

// export class UserClass {
//     @prop()
//     public ID: string;

//     @prop()
//     public Firstname: string;

//     @prop()
//     public Lastname: string;

//     @prop()
//     public Password: string;

//     @prop()
//     public Mail: string;

//     @prop()
//     public PhoneNumber: string;

//     @prop()
//     public Avatar: string;

//     @prop()
//     public SponsorCode: string;

//     @prop()
//     public HasAcceptedGDPR: boolean;

//     @prop()
//     public BillingAddress_ID: string;

//     @prop()
//     public DeliveryAddress_ID: string;

//     @prop()
//     public Role_ID: string;

//     @prop()
//     public CreatedAt: string;
// }

// const generateQueriesMutations = (schemaComposer: any) => {
//     const Model = getModelForClass(UserClass);
//     const MongooseObject = composeMongoose(Model, { schemaComposer, name: "User" });

//     const getUsers = async () =>
//         axios
//             .get(`http://${process.env.MSC_HOST}:${process.env.MSC_PORT}/users`)
//             .then((res) => res.data)
//             .catch((err) => {
//                 throw new ApolloError(err.response.data);
//             });
//     const getUser = async (id: string) =>
//         axios
//             .get(`http://${process.env.MSC_HOST}:${process.env.MSC_PORT}/users/${id}`)
//             .then((res) => res.data)
//             .catch((err) => {
//                 throw new ApolloError(err.response.data);
//             });

//     const queries = {
//         users: {
//             type: [MongooseObject],
//             resolve: async (parent: any, args: any) => {
//                 const users = await getUsers();
//                 if (args.filter) {
//                     return users.filter((user: any) => {
//                         return Object.keys(args.filter).every((key) => {
//                             return user[key] === args.filter[key];
//                         });
//                     });
//                 }
//                 return users;
//             },
//         },
//         userById: {
//             type: MongooseObject,
//             args: {
//                 ID: "String",
//             },
//             resolve: async (parent: any, args: any) => {
//                 const user = await getUser(args.ID);
//                 return user;
//             },
//         }
//     };

//     const ResultUserPayload = schemaComposer.createObjectTC({
//         name: "CreateOneUserPayload",
//         fields: {
//             record: MongooseObject,
//         },
//     });

//     const UserCreateInput = schemaComposer.createInputTC({
//         name: "UserCreateInput",
//         fields: {
//             _id: "String",
//             Firstname: "String",
//             Lastname: "String",
//             Password: "String",
//             Mail: "String",
//             PhoneNumber: "String",
//             Avatar: "String",
//         },
//     });

//     const mutations = {
//         userCreateOne: {
//             type: ResultUserPayload,
//             args: {
//                 record: UserCreateInput,
//             },
//             resolve: async (root: any, { record }: any) => {
//                 return axios
//                     .post(`http://${process.env.MSC_HOST}:${process.env.MSC_PORT}/users/create`, record)
//                     .then((res) => {
//                         return {
//                             record: res.data,
//                         };
//                     })
//                     .catch((err) => {
//                         throw new ApolloError(err.response.data);
//                     });
//             },
//         },
//         userDeleteById: {
//             type: ResultUserPayload,
//             args: {
//                 ID: "String",
//             },
//             resolve: async (root: any, { ID }: any) => {
//                 return axios
//                     .post(`http://${process.env.MSC_HOST}:${process.env.MSC_PORT}/users/delete/`, { ID })
//                     .then((res) => {
//                         return {
//                             record: res.data,
//                         };
//                     })
//                     .catch((err) => {
//                         throw new ApolloError(err.response.data);
//                     });
//             },
//         },
//         userUpdateById: {
//             type: ResultUserPayload,
//             args: {
//                 ID: "String",
//                 record: UserCreateInput,
//             },
//             resolve: async (root: any, { ID, record }: any) => {
//                 return axios
//                     .post(`http://${process.env.MSC_HOST}:${process.env.MSC_PORT}/users/update/`, {
//                         ID,
//                         record,
//                     })
//                     .then((res) => {
//                         return {
//                             record: res.data,
//                         };
//                     })
//                     .catch((err) => {
//                         throw new ApolloError(err.response.data);
//                     });
//             },
//         },
//     };

//     const relations = {};

//     return { queries, mutations, relations, MongooseObject: MongooseObject };
// };

// exports.generateQueriesMutations = generateQueriesMutations;
