import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { CategoryClass } from "./Category";
import { MenuClass } from "./Menu";
import { ProductClass } from "./Product";
import { AddressClass } from "./Address";
import { RestaurantTypeClass } from "./RestaurantType";
import { email, lengthBetween, maxLength } from "../validators/StringValidator";
import { userExists } from "../validators/UserValidator";
import { ApolloError } from "apollo-server-express";
import { Require, U } from "../Auth";
import { graphql } from "graphql";

export class RestaurantClass {
    @prop({ required: true, validate: lengthBetween("name", 1, 255) })
    public name!: string;

    @prop({ validate: maxLength("description", 1000) })
    public description!: string;

    @prop({ validate: maxLength("picture", 1000) })
    public picture?: string;

    @prop({ default: new Date() })
    public createdAt!: string;

    @prop({ required: true, validate: userExists() })
    public ownerId!: string;

    @prop({ required: true, validate: lengthBetween("phoneNumber", 1, 255) })
    public phoneNumber!: string;

    @prop({ required: true, validate: email() })
    public mail!: string;

    @prop({ ref: RestaurantTypeClass, required: true })
    public type!: Ref<RestaurantTypeClass>;

    @prop({ ref: AddressClass, required: true })
    public address!: Ref<AddressClass>;

    @prop({ ref: ProductClass, default: [] })
    public products!: Ref<ProductClass>[];

    @prop({ ref: MenuClass, default: [] })
    public menus!: Ref<MenuClass>[];

    @prop({ ref: CategoryClass, default: [] })
    public categories!: Ref<CategoryClass>[];
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(RestaurantClass);
    const MongooseObject = composeMongoose(Model, { schemaComposer, name: "Restaurant" });

    const queries = {
        restaurants: MongooseObject.mongooseResolvers.findMany(),
        restaurantById: MongooseObject.mongooseResolvers.findById(),
        myRestaurant: MongooseObject.mongooseResolvers.findOne().withMiddlewares(
            Require([U.OWN]).concat([
                async (resolve: any, source: any, args: any, context: any, info: any) => {
                    if (!context || !context.user) {
                        throw new ApolloError("Vous devez être connecté pour accéder à votre restaurant.");
                    }

                    if (!args.filter) {
                        args.filter = {};
                    }
                    args.filter.ownerId = context.user.ID.toString();
                    return resolve(source, args, context, info);
                },
            ])
        ),
    };

    const mutations = {
        restaurantCreateOne: MongooseObject.mongooseResolvers.createOne(),
        restaurantUpdateById: MongooseObject.mongooseResolvers.updateById(),
        restaurantDeleteById: MongooseObject.mongooseResolvers.removeById(),
    };

    const relations = {
        type: "RestaurantType",
        address: "Address",
        menus: "Menu",
        products: "Product",
        categories: "Category",
    };

    return { queries, mutations, relations, MongooseObject };
};

exports.generateQueriesMutations = generateQueriesMutations;
