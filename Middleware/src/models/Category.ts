import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { lengthBetween, maxLength } from "../validators/StringValidator";
import { MenuClass } from "./Menu";
import { ProductClass } from "./Product";

export class CategoryClass {
    @prop({ required: true, validate: lengthBetween("name", 1, 255) })
    public name!: string;

    @prop({ ref: MenuClass, required: true })
    public menus!: Ref<MenuClass>[];

    @prop({ ref: ProductClass, required: true })
    public products!: Ref<ProductClass>[];

    @prop({ default: new Date() })
    public createdAt!: string;
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