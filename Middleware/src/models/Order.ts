import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { lengthBetween, maxLength } from "../validators/StringValidator";
import { userExists } from "../validators/UserValidator";
import { CartClass } from "./Cart";
import { OrderStatusClass } from "./OrderStatus";
import { RestaurantClass } from "./Restaurant";

export class OrderClass {
    @prop({ required: true, validate: userExists() })
    public userId!: string;

    @prop({ ref: RestaurantClass, required: true })
    public restaurant!: Ref<RestaurantClass>;

    @prop({ ref: CartClass, required: true })
    public cart!: Ref<CartClass>;

    @prop()
    public tag?: number;

    @prop({ default: new Date() })
    public createdAt!: string;

    @prop({ validate: maxLength("additionalInfo", 1000) })
    public additionalInfo!: string;

    @prop({ ref: OrderStatusClass, required: true })
    public status!: Ref<OrderStatusClass>;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(OrderClass);
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
