import { getModelForClass, prop } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { lengthBetween } from "../validators/StringValidator";

export class RoleClass {
    @prop({ required: true, validate: lengthBetween("label", 3, 255) })
    public label!: string;

    @prop({ required: true})
    public ID!: string;
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