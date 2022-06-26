import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { userExists } from "../validators/UserValidator";
import { Require, U } from "./../Auth";
import { MenuClass } from "./Menu";
import { ProductClass } from "./Product";
import { RestaurantClass } from "./Restaurant";

export class CartClass {
    // @prop({ required: true, validate: userExists() })
    @prop()
    public userId?: string;

    @prop({ ref: RestaurantClass, required: true })
    public restaurant!: Ref<RestaurantClass>;

    @prop({ ref: ProductClass, required: true })
    public products!: Ref<ProductClass>[];

    @prop({ ref: MenuClass, required: true })
    public menus!: Ref<MenuClass>[];

    @prop({ default: false })
    public isOrdered!: boolean;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(CartClass);
    const MongooseObject = composeMongoose(Model, { schemaComposer, name: "Cart" });

    const queries = {
        carts: MongooseObject.mongooseResolvers.findMany().withMiddlewares(Require([U.REST, U.DRIVER])),
        myCarts: MongooseObject.mongooseResolvers.findMany().withMiddlewares(Require([U.OWN])),
        cartById: MongooseObject.mongooseResolvers.findById().withMiddlewares(Require([U.REST, U.DRIVER])),
    };

    const mutations = {
        cartCreateOne: MongooseObject.mongooseResolvers.createOne().withMiddlewares(Require([U.USER])),
        myCartCreateOne: MongooseObject.mongooseResolvers.createOne().withMiddlewares(Require([U.OWN])),
        cartUpdateById: MongooseObject.mongooseResolvers.updateById().withMiddlewares(Require([U.USER])),
        myCartUpdateById: MongooseObject.mongooseResolvers.updateById().withMiddlewares(Require([U.OWN])),
        cartDeleteById: MongooseObject.mongooseResolvers.removeById().withMiddlewares(Require([U.USER])),
    };

    const relations = {
        restaurant: "Restaurant",
        products: "Product",
        menus: "Menu",
    };

    return { queries, mutations, relations, MongooseObject };
};

exports.generateQueriesMutations = generateQueriesMutations;
