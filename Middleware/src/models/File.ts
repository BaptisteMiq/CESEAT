import { getModelForClass, prop } from "@typegoose/typegoose";
import { GraphQLScalarType } from "graphql";
import { composeMongoose } from "graphql-compose-mongoose";

export class FileClass {
    @prop()
    public filename: string;

    @prop()
    public mimetype: string;

    @prop()
    public encoding: string;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(FileClass);
    const MongooseObject = composeMongoose(Model, { schemaComposer, name: "File" });

    const queries = {};

    const Upload = new GraphQLScalarType({
        name: "Upload",
    });

    const mutations = {
        singleUpload: {
            type: Upload,
            args: {
                file: Upload,
            },
            resolve: async (parent: any, { file }: any) => {
                console.log(file);
            },
        },
    };

    const relations = {
        restaurant: "Restaurant",
        products: "Product",
        menus: "Menu",
    };

    return { queries, mutations, relations, MongooseObject };
};

exports.generateQueriesMutations = generateQueriesMutations;
