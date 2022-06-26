import { ApolloError } from "apollo-server";
import axios from "axios";
import { Require, U } from "./../Auth";
import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { lengthBetween, maxLength } from "../validators/StringValidator";
import { userExists } from "../validators/UserValidator";
import { CartClass } from "./Cart";
import { OrderStatusClass } from "./OrderStatus";
import { RestaurantClass } from "./Restaurant";
import { graphql } from "graphql";

const randomOrderId = (size: number) => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = size; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
};

export class OrderClass {
    @prop()
    public userId?: string;

    @prop({ ref: RestaurantClass, required: true })
    public restaurant!: Ref<RestaurantClass>;

    @prop({ ref: CartClass, required: true })
    public cart!: Ref<CartClass>;

    @prop({ default: randomOrderId(6) })
    public tag?: string;

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
        myOrders: MongooseObject.mongooseResolvers.findMany().withMiddlewares(Require([U.OWN])),
        orderById: MongooseObject.mongooseResolvers.findById(),
    };

    const mutations = {
        orderCreateOne: MongooseObject.mongooseResolvers.createOne(),
        // myOrderCreateOne: MongooseObject.mongooseResolvers.createOne().withMiddlewares(Require([U.OWN])),
        myOrderCreateOne: schemaComposer
            .createResolver({
                name: "myOrderCreateOne",
                args: {
                    record: "CreateOneOrderInput!",
                },
                type: "CreateOneOrderPayload",
                resolve: async (root: any) => {
                    const mutationAndVariables = await axios(`http://localhost:4500/makeOrder`, {
                        method: "POST",
                        data: {
                            additionalInfo: root.args.record.additionalInfo,
                            cart: root.args.record.cart,
                            restaurant: root.args.record.restaurant,
                            status: root.args.record.status,
                            userId: root.args.record.userId,
                        },
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    // Execute query using GraphQL
                    const schema = schemaComposer.buildSchema();

                    for (let i = 0; i < mutationAndVariables.data.queries.length; i++) {
                        const query = mutationAndVariables.data.queries[i];
                        const variables = mutationAndVariables.data.variables[i];
                        const result = await graphql({
                            schema,
                            source: query,
                            variableValues: variables,
                            contextValue: root.context,
                        });
                        if (result.errors) {
                            console.log(result.errors);
                            throw new ApolloError("Impossible de créer la commande.");
                        }
                    }
                    return {};
                },
            })
            .withMiddlewares(Require([U.OWN])),
        orderUpdateById: MongooseObject.mongooseResolvers.updateById(),
        orderDeleteById: MongooseObject.mongooseResolvers.removeById(),
    };

    const relations = {
        restaurant: "Restaurant",
        cart: "Cart",
        status: "OrderStatus"
    };

    return { queries, mutations, relations, MongooseObject };
};

exports.generateQueriesMutations = generateQueriesMutations;
