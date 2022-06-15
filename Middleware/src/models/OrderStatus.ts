import { getModelForClass, prop } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { MenuClass } from "./Menu";

export class OrderStatusClass {
    @prop()
    public label: string;

    @prop()
    public description: string;
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
