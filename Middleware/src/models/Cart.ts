import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { minSize } from "../validators/ArrayValidator";
import { userExists } from "../validators/UserValidator";
import { MenuClass } from "./Menu";
import { ProductClass } from "./Product";
import { RestaurantClass } from "./Restaurant";

export class CartClass {
    @prop({ required: true, validate: userExists() })
    public userId!: string;

    @prop({ ref: RestaurantClass, required: true })
    public restaurant!: Ref<RestaurantClass>;

    @prop({ ref: ProductClass, required: true })
    public products!: Ref<ProductClass>[];

    @prop({ ref: MenuClass, required: true })
    public menus!: Ref<MenuClass>[];
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(CartClass);
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

    // // Add success message
    // mutations.cartCreateOne.setExtension("success", "Le panier a été créé avec succès.");

    return { queries, mutations, relations, MongooseObject };
};

exports.generateQueriesMutations = generateQueriesMutations;
