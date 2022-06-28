import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { ApolloError } from "apollo-server-express";
import { graphql } from "graphql";
import { composeMongoose } from "graphql-compose-mongoose";
import { lengthBetween, maxLength } from "../validators/StringValidator";
import { MenuClass } from "./Menu";
import { ProductClass } from "./Product";

export class CategoryClass {
    @prop({ required: true, validate: lengthBetween("name", 1, 255) })
    public name!: string;

    @prop({ ref: MenuClass, required: true })
    public menus!: Ref<MenuClass>[];

    @prop({ ref: ProductClass, required: true })
    public products!: Ref<ProductClass>[];

    @prop({ default: new Date() })
    public createdAt!: string;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(CategoryClass);
    const MongooseObject = composeMongoose(Model, { schemaComposer, name: "Category" });

    const queries = {
        categories: MongooseObject.mongooseResolvers.findMany(),
        categoryById: MongooseObject.mongooseResolvers.findById(),
    };

    const mutations = {
        categoryCreateOne: MongooseObject.mongooseResolvers.createOne(),
        categoryUpdateById: MongooseObject.mongooseResolvers.updateById(),
        categoryDeleteById: MongooseObject.mongooseResolvers.removeById(),
        addCategoryToMyRestaurant: schemaComposer.createResolver({
            name: "myRestaurantAddCategory",
            args: {
                record: "CreateOneCategoryInput!",
            },
            type: "CreateOneCategoryPayload",
            resolve: async (root: any) => {
                if (!root.args) {
                    throw new ApolloError("Il manque des paramètres.");
                }
                if (!root.args.record) {
                    throw new ApolloError("Il manque des paramètres.");
                }

                const schema = schemaComposer.buildSchema();
                const query = `mutation($record: CreateOneCategoryInput!) {
                    categoryCreateOne(record: $record) {
                        record {
                            _id
                        }
                    }
                  }`;
                const variables = {
                    record: {
                        products: root.args.record.products,
                        name: root.args.record.name,
                        menus: root.args.record.menus,
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
                        categories {
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
                if (!restaurant.data.myRestaurant) {
                    throw new ApolloError("Vous n'avez pas de restaurant.");
                }
                // @ts-ignore
                const categories = restaurant.data.myRestaurant.categories.map((cat: any) => cat._id);
                categories.push(result.data.categoryCreateOne.record._id);

                // Add category to restaurant
                const schema3 = schemaComposer.buildSchema();
                const query3 = `mutation($id: MongoID!, $restaurantUpdateByIdRecord2: UpdateByIdRestaurantInput!) {
                    restaurantUpdateById(_id: $id, record: $restaurantUpdateByIdRecord2) {
                      recordId
                    }
                  }`;
                const variables3 = {
                    id: restaurant.data.myRestaurant._id,
                    restaurantUpdateByIdRecord2: {
                        categories: categories,
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
                return result.data.categoryCreateOne;
            },
        }),
        deleteCategoryFromMyRestaurant: schemaComposer.createResolver({
            name: "myRestaurantDeleteCategory",
            args: {
                id: "MongoID!",
            },
            type: "RemoveByIdCategoryPayload",
            resolve: async (root: any) => {
                if (!root.args) {
                    throw new ApolloError("Il manque des paramètres.");
                }
                if (!root.args.id) {
                    throw new ApolloError("Il manque des paramètres.");
                }

                const schema = schemaComposer.buildSchema();
                const query = `mutation($id: MongoID!) {
                    categoryDeleteById(_id: $id) {
                        recordId
                        record {
                            _id
                        }
                    }
                  }`;
                const variables = {
                    id: root.args.id,
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
                if (!result.data.categoryDeleteById || !result.data.categoryDeleteById.recordId) {
                    throw new ApolloError("Cette catégorie n'existe pas.");
                }

                // Get my restaurant
                const schema2 = schemaComposer.buildSchema();
                const query2 = `query {
                    myRestaurant {
                        _id
                        categories {
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
                if (!restaurant.data.myRestaurant) {
                    throw new ApolloError("Vous n'avez pas de restaurant.");
                }
                // @ts-ignore
                const categories = restaurant.data.myRestaurant.categories
                    .filter((cat: any) => cat !== null)
                    .map((cat: any) => cat._id);

                const categoryIndex = categories.indexOf(root.args.id);
                if (categoryIndex !== -1) {
                    categories.splice(categoryIndex, 1);
                }

                // Remove category from restaurant
                const schema3 = schemaComposer.buildSchema();
                const query3 = `mutation($id: MongoID!, $restaurantUpdateByIdRecord2: UpdateByIdRestaurantInput!) {
                    restaurantUpdateById(_id: $id, record: $restaurantUpdateByIdRecord2) {
                      recordId
                    }
                  }`;
                const variables3 = {
                    id: restaurant.data.myRestaurant._id,
                    restaurantUpdateByIdRecord2: {
                        categories: categories,
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

                return result.data.categoryDeleteById;
            },
        }),
    };

    const relations = {
        menus: "Menu",
        products: "Product",
    };

    return { queries, mutations, relations, MongooseObject };
};

exports.generateQueriesMutations = generateQueriesMutations;
