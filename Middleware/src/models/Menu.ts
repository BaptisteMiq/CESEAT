import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { ApolloError } from "apollo-server-express";
import { graphql } from "graphql";
import { composeMongoose } from "graphql-compose-mongoose";
import { valueBetween } from "../validators/IntValidator";
import { lengthBetween, maxLength } from "../validators/StringValidator";
import { ProductClass } from "./Product";

export class MenuClass {
    @prop({ required: true, validate: lengthBetween("name", 1, 255) })
    public name!: string;

    @prop({ validate: maxLength("description", 255) })
    public description?: string;

    @prop({ required: true, validate: valueBetween("price", 0.1, 1e9) })
    public price!: number;

    @prop({ validate: maxLength("picture", 1000) })
    public picture?: string;

    @prop({ default: new Date() })
    public createdAt!: string;

    @prop({ default: true })
    public available!: boolean;

    @prop({ ref: ProductClass, required: true })
    public products!: Ref<ProductClass>[];
}

const generateQueriesMutations = (schemaComposer: any) => {
    const MenuModel = getModelForClass(MenuClass);
    const Menu = composeMongoose(MenuModel, { schemaComposer, name: "Menu" });

    const queries = {
        menus: Menu.mongooseResolvers.findMany(),
        menuById: Menu.mongooseResolvers.findById(),
    };

    const mutations = {
        menuCreateOne: Menu.mongooseResolvers.createOne(),
        menuUpdateById: Menu.mongooseResolvers.updateById(),
        menuDeleteById: Menu.mongooseResolvers.removeById(),
        addMenuToMyRestaurant: schemaComposer.createResolver({
            name: "myRestaurantAddMenu",
            args: {
                record: "CreateOneMenuInput!",
            },
            type: "CreateOneMenuPayload",
            resolve: async (root: any) => {
                if (!root.args) {
                    throw new ApolloError("Il manque des paramètres.");
                }
                if (!root.args.record) {
                    throw new ApolloError("Il manque des paramètres.");
                }

                const schema = schemaComposer.buildSchema();
                const query = `mutation MenuCreateOne($menuCreateOneRecord2: CreateOneMenuInput!) {
                    menuCreateOne(record: $menuCreateOneRecord2) {
                        record {
                            _id
                        }
                    }
                  }`;
                const variables = {
                    menuCreateOneRecord2: {
                        products: root.args.record.products,
                        price: root.args.record.price,
                        picture: root.args.record.picture,
                        name: root.args.record.name,
                        description: root.args.record.description,
                        available: true,
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
                        menus {
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
                const menus = restaurant.data.myRestaurant.menus
                    .filter((menu: any) => menu !== null)
                    .map((menu: any) => menu._id);
                menus.push(result.data.menuCreateOne.record._id);

                // Add menu to restaurant
                const schema3 = schemaComposer.buildSchema();
                const query3 = `mutation($id: MongoID!, $restaurantUpdateByIdRecord2: UpdateByIdRestaurantInput!) {
                    restaurantUpdateById(_id: $id, record: $restaurantUpdateByIdRecord2) {
                      recordId
                    }
                  }`;
                const variables3 = {
                    id: restaurant.data.myRestaurant._id,
                    restaurantUpdateByIdRecord2: {
                        menus: menus,
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

                return result.data.menuCreateOne;
            },
        }),
        deleteMenuFromMyRestaurant: schemaComposer.createResolver({
            name: "myRestaurantDeleteMenu",
            args: {
                id: "MongoID!",
            },
            type: "RemoveByIdMenuPayload",
            resolve: async (root: any) => {
                if (!root.args) {
                    throw new ApolloError("Il manque des paramètres.");
                }
                if (!root.args.id) {
                    throw new ApolloError("Il manque des paramètres.");
                }

                const schema = schemaComposer.buildSchema();
                const query = `mutation MenuDeleteById($menuDeleteByIdId2: MongoID!) {
                    menuDeleteById(_id: $menuDeleteByIdId2) {
                        recordId
                        record {
                            _id
                        }
                    }
                  }`;
                const variables = {
                    menuDeleteByIdId2: root.args.id,
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
                if (!result.data.menuDeleteById || !result.data.menuDeleteById.record) {
                    throw new ApolloError("Ce menu n'existe pas.");
                }

                // Get my restaurant
                const schema2 = schemaComposer.buildSchema();
                const query2 = `query {
                    myRestaurant {
                        _id
                        menus {
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
                const menus = restaurant.data.myRestaurant.menus
                    .filter((menu: any) => menu !== null)
                    .map((menu: any) => menu._id);

                const menuIndex = menus.indexOf(root.args.id);
                if (menuIndex !== -1) {
                    menus.splice(menus.indexOf(menuIndex), 1);
                }

                // Remove menu from restaurant
                const schema3 = schemaComposer.buildSchema();
                const query3 = `mutation($id: MongoID!, $restaurantUpdateByIdRecord2: UpdateByIdRestaurantInput!) {
                    restaurantUpdateById(_id: $id, record: $restaurantUpdateByIdRecord2) {
                        recordId
                        }
                    }`;
                const variables3 = {
                    id: restaurant.data.myRestaurant._id,
                    restaurantUpdateByIdRecord2: {
                        menus: menus,
                    },
                };
                const result3 = <any>await graphql({
                    schema: schema3,
                    source: query3,
                    variableValues: variables3,
                    contextValue: root.context,
                });
                if (result3.errors) {
                    throw new ApolloError(result3.errors[0].message);
                }
                if (!result3.data.restaurantUpdateById || !result3.data.restaurantUpdateById.recordId) {
                    throw new ApolloError("Ce menu n'existe pas.");
                }

                // Remove menu from categories
                const schema6 = schemaComposer.buildSchema();
                const query6 = `query {
                    categories {
                        _id
                        menus {
                            _id
                        }
                    }
                    }`;
                const categories = <any>await graphql({
                    schema: schema6,
                    source: query6,
                    contextValue: root.context,
                });
                if (categories.errors) {
                    throw new ApolloError(categories.errors[0].message);
                }

                await Promise.all(
                    categories.data.categories.map(async (category: any) => {
                        // @ts-ignore
                        const menus3 = category.menus.filter((menu: any) => menu !== null).map((menu: any) => menu._id);

                        const menuIndex3 = menus3.indexOf(root.args.id);
                        if (menuIndex3 !== -1) {
                            menus3.splice(menuIndex3, 1);
                        }

                        const schema7 = schemaComposer.buildSchema();

                        const query7 = `mutation($id: MongoID!, $categoryUpdateByIdRecord2: UpdateByIdCategoryInput!) {
                    categoryUpdateById(_id: $id, record: $categoryUpdateByIdRecord2) {
                        recordId
                    }
                    }`;
                        const variables7 = {
                            id: category._id,
                            categoryUpdateByIdRecord2: {
                                menus: menus3,
                            },
                        };
                        const result7 = await graphql({
                            schema: schema7,
                            source: query7,
                            variableValues: variables7,
                            contextValue: root.context,
                        });
                        if (result7.errors) {
                            throw new ApolloError(result7.errors[0].message);
                        }
                    })
                );

                return result.data.menuDeleteById;
            },
        }),
    };

    const relations = {
        products: "Product",
    };

    return { queries, mutations, relations, MongooseObject: Menu };
};

exports.generateQueriesMutations = generateQueriesMutations;
