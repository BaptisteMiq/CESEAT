import { getModelForClass, prop } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { MenuClass } from "./Menu";

export class LogClass {
    @prop()
    public userId: string;

    @prop()
    public timestamp: string;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(MenuClass);
    const MongooseObject = composeMongoose(Model, { schemaComposer, name: "Log" });

    const queries = {
        logs: MongooseObject.mongooseResolvers.findMany(),
        logById: MongooseObject.mongooseResolvers.findById(),
    };

    const mutations = {
        logCreateOne: MongooseObject.mongooseResolvers.createOne(),
        logUpdateById: MongooseObject.mongooseResolvers.updateById(),
        logDeleteById: MongooseObject.mongooseResolvers.removeById(),
    };

    const relations = {};

    return { queries, mutations, relations, MongooseObject };
};

exports.generateQueriesMutations = generateQueriesMutations;
