import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { valueBetween } from "../validators/IntValidator";
import { lengthBetween, maxLength } from "../validators/StringValidator";
import { ProductClass } from "./Product";

export class MenuClass {
    @prop({ required: true, validate: lengthBetween("name", 1, 255) })
    public name!: string;

    @prop({ validate: maxLength("description", 255) })
    public description?: string;

    @prop({ required: true, validate: valueBetween("price", 0.1, 1e9) })
    public price!: number;

    @prop({ validate: maxLength("picture", 1000) })
    public picture?: string;

    @prop({ default: new Date() })
    public createdAt!: string;

    @prop({ default: true })
    public available!: boolean;

    @prop({ ref: ProductClass, required: true })
    public products!: Ref<ProductClass>[];
}

const generateQueriesMutations = (schemaComposer: any) => {
    const MenuModel = getModelForClass(MenuClass);
    const Menu = composeMongoose(MenuModel, { schemaComposer, name: "Menu" });

    const queries = {
        menus: Menu.mongooseResolvers.findMany(),
        menuById: Menu.mongooseResolvers.findById(),
    };

    const mutations = {
        menuCreateOne: Menu.mongooseResolvers.createOne(),
        menuUpdateById: Menu.mongooseResolvers.updateById(),
        menuDeleteById: Menu.mongooseResolvers.removeById(),
    };

    const relations = {
        products: "Product",
    };

    return { queries, mutations, relations, MongooseObject: Menu };
};

exports.generateQueriesMutations = generateQueriesMutations;
