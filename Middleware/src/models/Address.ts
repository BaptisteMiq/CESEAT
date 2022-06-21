import { getModelForClass, prop } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { lengthBetween, maxLength } from "../validators/StringValidator";

export class AddressClass {
    @prop({ required: true, validate: lengthBetween("line1", 1, 255) })
    public line1!: string;

    @prop({ validate: maxLength("line2", 255) })
    public line2?: string;

    @prop({ required: true, validate: lengthBetween("city", 1, 255) })
    public city!: string;

    @prop({ required: true, validate: lengthBetween("PC", 1, 255) })
    public PC!: string;

    @prop({ required: true, validate: lengthBetween("country", 1, 255) })
    public country!: string;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(AddressClass);
    const MongooseObject = composeMongoose(Model, { schemaComposer, name: "Address" });

    const queries = {
        addresses: MongooseObject.mongooseResolvers.findMany(),
        addressById: MongooseObject.mongooseResolvers.findById(),
    };

    const mutations = {
        addressCreateOne: MongooseObject.mongooseResolvers.createOne(),
        addressUpdateById: MongooseObject.mongooseResolvers.updateById(),
        addressDeleteById: MongooseObject.mongooseResolvers.removeById(),
    };

    const relations = {};

    return { queries, mutations, relations, MongooseObject };
};

exports.generateQueriesMutations = generateQueriesMutations;
