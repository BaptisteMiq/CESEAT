import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { ProductClass } from "./Product";

export class MenuClass {
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
    public available: boolean;

    @prop({ ref: ProductClass })
    public products: Ref<ProductClass>[];
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
        products: "Product"
    };

    return { queries, mutations, relations, MongooseObject: Menu };
};

exports.generateQueriesMutations = generateQueriesMutations;
