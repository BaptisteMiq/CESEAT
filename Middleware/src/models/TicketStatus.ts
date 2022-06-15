import { getModelForClass, prop } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { MenuClass } from "./Menu";

export class TicketStatusClass {
    @prop()
    public label: string;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(MenuClass);
    const MongooseObject = composeMongoose(Model, { schemaComposer, name: "TicketStatus" });

    const queries = {
        ticketStatus: MongooseObject.mongooseResolvers.findMany(),
        ticketStatusById: MongooseObject.mongooseResolvers.findById(),
    };

    const mutations = {
        ticketStatusCreateOne: MongooseObject.mongooseResolvers.createOne(),
        ticketStatusUpdateById: MongooseObject.mongooseResolvers.updateById(),
        ticketStatusDeleteById: MongooseObject.mongooseResolvers.removeById(),
    };

    const relations = {};

    return { queries, mutations, relations, MongooseObject };
};

exports.generateQueriesMutations = generateQueriesMutations;
