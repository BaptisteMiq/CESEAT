import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { MenuClass } from "./Menu";
import { TicketStatusClass } from "./TicketStatus";

export class PromotionClass {
    @prop()
    public label: string;

    @prop()
    public description: string;
    
    @prop()
    public value: number;

    @prop()
    public minAmountToBeApplicable: number;

    @prop()
    public limitDate: string;

    @prop()
    public createdAt: string;
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
