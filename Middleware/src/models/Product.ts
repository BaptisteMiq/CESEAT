import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { ApolloError } from "apollo-server-express";
import { graphql } from "graphql";
import { composeMongoose } from "graphql-compose-mongoose";
import { Types } from "mongoose";
import { decodeToken } from "../Auth";
import { valueBetween } from "../validators/IntValidator";
import { lengthBetween, maxLength } from "../validators/StringValidator";
import { RestaurantClass } from "./Restaurant";

export class ProductClass {
    @prop({ required: true, validate: lengthBetween("name", 1, 255) })
    public name!: string;

    @prop({ validate: maxLength("description", 1000) })
    public description!: string;

    @prop({ required: true, validate: valueBetween("price", 0.1, 1000000) })
    public price!: number;

    @prop({ validate: maxLength("image", 1000) })
    public picture?: string;

    @prop({ default: new Date() })
    public createdAt!: string;

    @prop({ validate: maxLength("allergenicIngredients", 1000) })
    public allergenicIngredients?: string;

    @prop({ default: true })
    public available!: boolean;

    // @prop({ ref: RestaurantClass, required: true })
    // public restaurant: Ref<RestaurantClass>;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const ProductModel = getModelForClass(ProductClass);
    const Product = composeMongoose(ProductModel, { schemaComposer, name: "Product" });

    const queries = {
        products: Product.mongooseResolvers.findMany(),
        productById: Product.mongooseResolvers.findById(),
    };

    const mutations = {
        productCreateOne: Product.mongooseResolvers.createOne(),
        productUpdateById: Product.mongooseResolvers.updateById(),
        productDeleteById: Product.mongooseResolvers.removeById(),
        addProductToMyRestaurant: schemaComposer.createResolver({
            name: "myRestaurantAddProduct",
            args: {
                record: "CreateOneProductInput!",
            },
            type: "CreateOneProductPayload",
            resolve: async (root: any) => {
                if (!root.args) {
                    throw new ApolloError("Il manque des paramètres.");
                }
                if (!root.args.record) {
                    throw new ApolloError("Il manque des paramètres.");
                }
                // const token = root.context.req.cookies?.token || root.context.req.headers?.authorization;
                // const user = decodeToken(token);

                const schema = schemaComposer.buildSchema();
                const query = `mutation($productCreateOneRecord2: CreateOneProductInput!) {
                    productCreateOne(record: $productCreateOneRecord2) {
                        record {
                            _id
                        }
                    }
                  }`;
                const variables = {
                    productCreateOneRecord2: {
                        price: root.args.record.price,
                        picture: root.args.record.picture,
                        name: root.args.record.name,
                        description: root.args.record.description,
                        available: true,
                        allergenicIngredients: root.args.record.allergenicIngredients || [],
                    },
                };
                const result = <any>await graphql({
                    schema,
                    source: query,
                    variableValues: variables,
                    contextValue: root.context,
                });
                if (result.errors) {
                    throw new ApolloError(result.errors[0].message);
                }

                // Get my restaurant
                const schema2 = schemaComposer.buildSchema();
                const query2 = `query {
                    myRestaurant {
                        _id
                        products {
                            _id
                        }
                    }
                    }`;
                const restaurant = <any>await graphql({
                    schema: schema2,
                    source: query2,
                    contextValue: root.context,
                });
                if (restaurant.errors) {
                    throw new ApolloError(restaurant.errors[0].message);
                }
                if(!restaurant.data.myRestaurant) {
                    throw new ApolloError("Vous n'avez pas de restaurant.");
                }
                // @ts-ignore
                const products = restaurant.data.myRestaurant.products.map((product: any) => product._id);
                products.push(result.data.productCreateOne.record._id);

                // Add product to restaurant
                const schema3 = schemaComposer.buildSchema();
                const query3 = `mutation($id: MongoID!, $restaurantUpdateByIdRecord2: UpdateByIdRestaurantInput!) {
                    restaurantUpdateById(_id: $id, record: $restaurantUpdateByIdRecord2) {
                      recordId
                    }
                  }`;
                const variables3 = {
                    id: restaurant.data.myRestaurant._id,
                    restaurantUpdateByIdRecord2: {
                        products
                    },
                };
                const result3 = await graphql({
                    schema: schema3,
                    source: query3,
                    variableValues: variables3,
                    contextValue: root.context,
                });
                if (result3.errors) {
                    throw new ApolloError(result3.errors[0].message);
                }

                return result.data.productCreateOne;
            },
        }),
    };

    const relations = {
        restaurant: "Restaurant",
    };

    return { queries, mutations, relations, MongooseObject: Product };
};

exports.generateQueriesMutations = generateQueriesMutations;
