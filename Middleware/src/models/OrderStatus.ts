import { getModelForClass, prop } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { lengthBetween, maxLength } from "../validators/StringValidator";

export class OrderStatusClass {
    @prop({ required: true, validate: lengthBetween("label", 1, 255) })
    public label!: string;

    @prop({ validate: maxLength("description", 1000) })
    public description?: string;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(OrderStatusClass);
    const MongooseObject = composeMongoose(Model, { schemaComposer, name: "OrderStatus" });

    const queries = {
        orderStatus: MongooseObject.mongooseResolvers.findMany(),
        orderStatusById: MongooseObject.mongooseResolvers.findById(),
    };

    const mutations = {
        orderStatusCreateOne: MongooseObject.mongooseResolvers.createOne(),
        orderStatusUpdateById: MongooseObject.mongooseResolvers.updateById(),
        orderStatusDeleteById: MongooseObject.mongooseResolvers.removeById(),
    };

    const relations = {};

    return { queries, mutations, relations, MongooseObject };
};

exports.generateQueriesMutations = generateQueriesMutations;
