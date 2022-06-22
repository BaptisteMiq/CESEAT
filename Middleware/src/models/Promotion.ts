import { getModelForClass, prop } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { valueBetween } from "../validators/IntValidator";
import { lengthBetween } from "../validators/StringValidator";

export class PromotionClass {
    @prop({ required: true, validate: lengthBetween("name", 1, 255) })
    public label!: string;

    @prop({ required: true, validate: lengthBetween("description", 1, 1000) })
    public description!: string;

    @prop({ required: true, validate: valueBetween("value", 0, 100) })
    public value!: number;

    @prop({ validate: valueBetween("minAmountToBeApplicable", 0, 1e9) })
    public minAmountToBeApplicable: number;

    @prop()
    public limitDate?: string;

    @prop({ default: new Date() })
    public createdAt!: string;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(PromotionClass);
    const MongooseObject = composeMongoose(Model, { schemaComposer, name: "Promotion" });

    const queries = {
        promotions: MongooseObject.mongooseResolvers.findMany(),
        promotionById: MongooseObject.mongooseResolvers.findById(),
    };

    const mutations = {
        promotionCreateOne: MongooseObject.mongooseResolvers.createOne(),
        promotionUpdateById: MongooseObject.mongooseResolvers.updateById(),
        promotionDeleteById: MongooseObject.mongooseResolvers.removeById(),
    };

    const relations = {};

    return { queries, mutations, relations, MongooseObject };
};

exports.generateQueriesMutations = generateQueriesMutations;
