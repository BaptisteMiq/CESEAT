import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { CartClass } from "./Cart";
import { MenuClass } from "./Menu";
import { RestaurantClass } from "./Restaurant";

export class OrderStatusClass {
    @prop()
    public userId: string;

    @prop({ ref: RestaurantClass })
    public restaurant: Ref<RestaurantClass>;

    @prop({ ref: CartClass })
    public cart: Ref<CartClass>;

    @prop()
    public tag: number;

    @prop()
    public createdAt: string;

    @prop()
    public additionalInfo: string;

    @prop({ ref: OrderStatusClass })
    public status: Ref<OrderStatusClass>;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(MenuClass);
    const MongooseObject = composeMongoose(Model, { schemaComposer, name: "Order" });

    const queries = {
        orders: MongooseObject.mongooseResolvers.findMany(),
        orderById: MongooseObject.mongooseResolvers.findById(),
    };

    const mutations = {
        orderCreateOne: MongooseObject.mongooseResolvers.createOne(),
        orderUpdateById: MongooseObject.mongooseResolvers.updateById(),
        orderDeleteById: MongooseObject.mongooseResolvers.removeById(),
    };

    const relations = {};

    return { queries, mutations, relations, MongooseObject };
};

exports.generateQueriesMutations = generateQueriesMutations;
