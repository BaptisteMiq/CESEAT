import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { userExists } from "../validators/UserValidator";
import { PromotionClass } from "./Promotion";

export class UserPromotionClass {
    @prop({ required: true, validate: userExists() })
    public userId!: string;

    @prop({ ref: PromotionClass, required: true })
    public promotion!: Ref<PromotionClass>;
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
