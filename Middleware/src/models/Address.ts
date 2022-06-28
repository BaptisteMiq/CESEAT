import { getModelForClass, prop } from "@typegoose/typegoose";
import { ApolloError } from "apollo-server-express";
import { graphql } from "graphql";
import { composeMongoose } from "graphql-compose-mongoose";
import {
    RequireComm,
    RequireTech,
    AuthMiddleware,
    RequireRest,
    RequireDriver,
    RequireUser,
    Require,
    U,
    decodeToken,
} from "../Auth";
import { lengthBetween, maxLength } from "../validators/StringValidator";

export class AddressClass {
    @prop({ required: true, validate: lengthBetween("line1", 1, 255) })
    public line1!: string;

    @prop({ validate: maxLength("line2", 255) })
    public line2?: string;

    @prop({ required: true, validate: lengthBetween("city", 1, 255) })
    public city!: string;

    @prop({ required: true, validate: lengthBetween("PC", 1, 255) })
    public PC!: string;

    @prop({ required: true, validate: lengthBetween("country", 1, 255) })
    public country!: string;

    @prop()
    public userId: string;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(AddressClass);
    const MongooseObject = composeMongoose(Model, { schemaComposer, name: "Address" });

    const queries = {
        addresses: MongooseObject.mongooseResolvers.findMany().withMiddlewares([RequireComm, AuthMiddleware]),
        myAddresses: MongooseObject.mongooseResolvers.findMany().withMiddlewares(Require([U.OWN])),
        addressById: MongooseObject.mongooseResolvers.findById(),
    };

    const mutations = {
        addressCreateOne: MongooseObject.mongooseResolvers
            .createOne()
            .withMiddlewares([RequireUser, RequireRest, RequireDriver, AuthMiddleware]),
        myAddressCreateOne: MongooseObject.mongooseResolvers
        .createOne()
            .withMiddlewares(Require([U.OWN])),
        addressUpdateById: MongooseObject.mongooseResolvers
            .updateById()
            .withMiddlewares([RequireUser, RequireRest, RequireDriver, AuthMiddleware]),
        addressDeleteById: MongooseObject.mongooseResolvers
            .removeById()
            .withMiddlewares([RequireUser, RequireRest, RequireDriver, AuthMiddleware]),
    };

    const relations = {};

    return { queries, mutations, relations, MongooseObject };
};

exports.generateQueriesMutations = generateQueriesMutations;
