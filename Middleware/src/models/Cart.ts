import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { MenuClass } from "./Menu";
import { ProductClass } from "./Product";
import { RestaurantClass } from "./Restaurant";

export class CartClass {
    @prop()
    public name: string;

    @prop()
    public userId: string;

    @prop({ ref: RestaurantClass })
    public restaurant: Ref<RestaurantClass>;

    @prop({ ref: ProductClass })
    public products: Ref<ProductClass>[];

    @prop({ ref: MenuClass })
    public menus: Ref<MenuClass>[];
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(MenuClass);
    const MongooseObject = composeMongoose(Model, { schemaComposer, name: "Cart" });

    const queries = {
        carts: MongooseObject.mongooseResolvers.findMany(),
        cartById: MongooseObject.mongooseResolvers.findById(),
    };

    const mutations = {
        cartCreateOne: MongooseObject.mongooseResolvers.createOne(),
        cartUpdateById: MongooseObject.mongooseResolvers.updateById(),
        cartDeleteById: MongooseObject.mongooseResolvers.removeById(),
    };

    const relations = {
        restaurant: "Restaurant",
        products: "Product",
        menus: "Menu",
    };

    return { queries, mutations, relations, MongooseObject };
};

exports.generateQueriesMutations = generateQueriesMutations;
