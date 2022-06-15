import { getModelForClass, prop } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { CategoryClass } from "./Category";

export class RestaurantAddressClass {
    @prop()
    public line1: string;

    @prop()
    public line2: string;

    @prop()
    public city: string;

    @prop()
    public PC: string;

    @prop()
    public country: string;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(CategoryClass);
    const MongooseObject = composeMongoose(Model, { schemaComposer, name: "RestaurantAddress" });

    const queries = {
        restaurantAddresses: MongooseObject.mongooseResolvers.findMany(),
        restaurantAddressById: MongooseObject.mongooseResolvers.findById(),
    };

    const mutations = {
        restaurantAddressCreateOne: MongooseObject.mongooseResolvers.createOne(),
        restaurantAddressUpdateById: MongooseObject.mongooseResolvers.updateById(),
        restaurantAddressDeleteById: MongooseObject.mongooseResolvers.removeById(),
    };

    const relations = {};

    return { queries, mutations, relations, MongooseObject };
};

exports.generateQueriesMutations = generateQueriesMutations;
