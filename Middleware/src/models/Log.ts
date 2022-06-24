import { getModelForClass, prop } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { AuthMiddleware, RequireUser } from "../Auth";
import { userExists } from "../validators/UserValidator";

// Connection logs
export class LogClass {
    @prop({ required: true, validate: userExists() })
    public userId!: string;

    @prop({ default: new Date() })
    public timestamp?: string;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(LogClass);
    const MongooseObject = composeMongoose(Model, { schemaComposer, name: "Log" });

    const queries = {
        logs: MongooseObject.mongooseResolvers.findMany().withMiddlewares([RequireUser, AuthMiddleware]),
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
