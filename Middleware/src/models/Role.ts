import { getModelForClass, prop } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";

export class RoleClass {
    @prop()
    public label: string;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(RoleClass);
    const MongooseObject = composeMongoose(Model, { schemaComposer, name: "Role" });

    const queries = {
        roles: MongooseObject.mongooseResolvers.findMany(),
        roleById: MongooseObject.mongooseResolvers.findById(),
    };

    const mutations = {
        roleCreateOne: MongooseObject.mongooseResolvers.createOne(),
        roleUpdateById: MongooseObject.mongooseResolvers.updateById(),
        roleDeleteById: MongooseObject.mongooseResolvers.removeById(),
    };

    const relations = {};

    return { queries, mutations, relations, MongooseObject };
};

exports.generateQueriesMutations = generateQueriesMutations;