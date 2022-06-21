import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { PromotionClass } from "./Promotion";

export class UserPromotionClass {
    @prop()
    public userId: string;

    @prop({ ref: PromotionClass })
    public promotion: Ref<PromotionClass>;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(UserPromotionClass);
    const MongooseObject = composeMongoose(Model, { schemaComposer, name: "UserPromotion" });

    const queries = {
        userPromotions: MongooseObject.mongooseResolvers.findMany(),
        userPromotionById: MongooseObject.mongooseResolvers.findById(),
    };

    const mutations = {
        userPromotionCreateOne: MongooseObject.mongooseResolvers.createOne(),
        userPromotionUpdateById: MongooseObject.mongooseResolvers.updateById(),
        userPromotionDeleteById: MongooseObject.mongooseResolvers.removeById(),
    };

    const relations = {};

    return { queries, mutations, relations, MongooseObject };
};

exports.generateQueriesMutations = generateQueriesMutations;
