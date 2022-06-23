import { getModelForClass, prop } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { lengthBetween } from "../validators/StringValidator";
import { CategoryClass } from "./Category";

export class RestaurantTypeClass {
    @prop({ required: true, validate: lengthBetween("label", 3, 255) })
    public label!: string;

    @prop({ validate: lengthBetween("description", 3, 1000) })
    public description?: string;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(RestaurantTypeClass);
    const MongooseObject = composeMongoose(Model, { schemaComposer, name: "RestaurantType" });

    const queries = {
        restaurantTypes: MongooseObject.mongooseResolvers.findMany(),
        restaurantTypeById: MongooseObject.mongooseResolvers.findById(),
    };

    const mutations = {
        restaurantTypeCreateOne: MongooseObject.mongooseResolvers.createOne(),
        restaurantTypeUpdateById: MongooseObject.mongooseResolvers.updateById(),
        restaurantTypeDeleteById: MongooseObject.mongooseResolvers.removeById(),
    };

    const relations = {};

    return { queries, mutations, relations, MongooseObject };
};

exports.generateQueriesMutations = generateQueriesMutations;
