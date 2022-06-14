import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { MenuClass } from "./Menu";
import { ProductClass } from "./Product";

export class CategoryClass {
    @prop()
    public name: string;

    @prop({ ref: MenuClass })
    public menus: Ref<MenuClass>[];

    @prop({ ref: ProductClass })
    public products: Ref<ProductClass>[];

    @prop()
    public createdAt: string;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(CategoryClass);
    const MongooseObject = composeMongoose(Model, { schemaComposer, name: "Category" });

    const queries = {
        categories: MongooseObject.mongooseResolvers.findMany(),
        categoryById: MongooseObject.mongooseResolvers.findById(),
    };

    const mutations = {
        categoryCreateOne: MongooseObject.mongooseResolvers.createOne(),
        categoryUpdateById: MongooseObject.mongooseResolvers.updateById(),
        categoryDeleteById: MongooseObject.mongooseResolvers.removeById(),
    };

    const relations = {
        menus: "Menu",
        products: "Product",
    };

    return { queries, mutations, relations, MongooseObject };
};

exports.generateQueriesMutations = generateQueriesMutations;