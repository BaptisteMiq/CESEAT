import { getModelForClass, prop } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { AuthMiddleware, RequireComm, RequireTech, RequireUser } from "../Auth";
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
        logs: MongooseObject.mongooseResolvers.findMany().withMiddlewares([RequireComm, RequireTech, AuthMiddleware]),
        logById: MongooseObject.mongooseResolvers.findById().withMiddlewares([RequireComm, RequireTech, AuthMiddleware]),
    };

    const mutations = {
        logCreateOne: MongooseObject.mongooseResolvers.createOne().withMiddlewares([RequireTech, AuthMiddleware]),
        logDeleteById: MongooseObject.mongooseResolvers.removeById().withMiddlewares([RequireTech, AuthMiddleware]),
    };  

    const relations = {};

    return { queries, mutations, relations, MongooseObject };
};

exports.generateQueriesMutations = generateQueriesMutations;
