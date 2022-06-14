import { getModelForClass, prop } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";

export class ProductClass {
    @prop()
    public name: string;

    @prop()
    public description: string;

    @prop()
    public price: number;

    @prop()
    public picture: string;

    @prop()
    public createdAt: string;

    @prop()
    public allergenicIngredients: string[];

    @prop()
    public available: boolean;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const ProductModel = getModelForClass(ProductClass);
    const Product = composeMongoose(ProductModel, { schemaComposer });

    const queries = {
        products: Product.mongooseResolvers.findMany(),
        productById: Product.mongooseResolvers.findById(),
    };

    const mutations = {
        productCreateOne: Product.mongooseResolvers.createOne(),
        productUpdateById: Product.mongooseResolvers.updateById(),
        productDeleteById: Product.mongooseResolvers.removeById(),
    };

    const relations = {};

    return { queries, mutations, relations, MongooseObject: Product };
};

exports.generateQueriesMutations = generateQueriesMutations;