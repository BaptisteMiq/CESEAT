import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { CategoryClass } from "./Category";
import { MenuClass } from "./Menu";
import { ProductClass } from "./Product";
import { RestaurantAddressClass } from "./RestaurantAddress";
import { RestaurantTypeClass } from "./RestaurantType";

export class RestaurantClass {
    @prop()
    public name: string;

    @prop()
    public description: string;

    @prop()
    public picture: string;

    @prop()
    public createdAt: string;

    @prop()
    public ownerId: string;

    @prop()
    public phoneNumber: string;

    @prop()
    public mail: string;

    @prop({ ref: RestaurantTypeClass })
    public type: Ref<RestaurantTypeClass>;

    @prop({ ref: RestaurantAddressClass })
    public address: Ref<RestaurantAddressClass>;

    @prop({ ref: ProductClass })
    public products: Ref<ProductClass>[];

    @prop({ ref: MenuClass })
    public menus: Ref<MenuClass>[];

    @prop({ ref: CategoryClass })
    public categories: Ref<CategoryClass>[];
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(RestaurantClass);
    const MongooseObject = composeMongoose(Model, { schemaComposer, name: "Restaurant" });

    const queries = {
        restaurants: MongooseObject.mongooseResolvers.findMany(),
        restaurantById: MongooseObject.mongooseResolvers.findById(),
    };

    const mutations = {
        restaurantCreateOne: MongooseObject.mongooseResolvers.createOne(),
        restaurantUpdateById: MongooseObject.mongooseResolvers.updateById(),
        restaurantDeleteById: MongooseObject.mongooseResolvers.removeById(),
    };

    const relations = {
        type: "RestaurantType",
        address: "RestaurantAddress",
        menus: "Menu",
        products: "Product",
        categories: "Category",
    };

    return { queries, mutations, relations, MongooseObject };
};

exports.generateQueriesMutations = generateQueriesMutations;
