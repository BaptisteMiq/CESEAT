import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { Types } from "mongoose";
import { valueBetween } from "../validators/IntValidator";
import { lengthBetween, maxLength } from "../validators/StringValidator";
import { RestaurantClass } from "./Restaurant";

export class ProductClass {
    @prop({ required: true, validate: lengthBetween("name", 1, 255) })
    public name!: string;

    @prop({ validate: maxLength("description", 1000) })
    public description!: string;

    @prop({ required: true, validate: valueBetween("price", 0.1, 1000000) })
    public price!: number;

    @prop({ validate: maxLength("image", 1000) })
    public picture?: string;

    @prop({ default: new Date() })
    public createdAt!: string;

    @prop({ validate: maxLength("allergenicIngredients", 1000) })
    public allergenicIngredients?: string;

    @prop({ default: true })
    public available!: boolean;

    // @prop({ ref: RestaurantClass, required: true })
    // public restaurant: Ref<RestaurantClass>;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const ProductModel = getModelForClass(ProductClass);
    const Product = composeMongoose(ProductModel, { schemaComposer, name: "Product" });

    const queries = {
        products: Product.mongooseResolvers.findMany(),
        productById: Product.mongooseResolvers.findById(),
    };

    const mutations = {
        productCreateOne: Product.mongooseResolvers.createOne(),
        productUpdateById: Product.mongooseResolvers.updateById(),
        productDeleteById: Product.mongooseResolvers.removeById(),
    };

    const relations = {
        restaurant: "Restaurant",
    };

    return { queries, mutations, relations, MongooseObject: Product };
};

exports.generateQueriesMutations = generateQueriesMutations;
