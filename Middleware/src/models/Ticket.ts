import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { MenuClass } from "./Menu";
import { TicketStatusClass } from "./TicketStatus";

export class TicketClass {
    @prop()
    public userId: string;

    @prop()
    public title: string;

    @prop()
    public message: string;

    @prop({ ref: TicketStatusClass })
    public status: Ref<TicketStatusClass>;

    @prop()
    public createdAt: string;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(MenuClass);
    const MongooseObject = composeMongoose(Model, { schemaComposer, name: "Ticket" });

    const queries = {
        tickets: MongooseObject.mongooseResolvers.findMany(),
        ticketById: MongooseObject.mongooseResolvers.findById(),
    };

    const mutations = {
        ticketCreateOne: MongooseObject.mongooseResolvers.createOne(),
        ticketUpdateById: MongooseObject.mongooseResolvers.updateById(),
        ticketDeleteById: MongooseObject.mongooseResolvers.removeById(),
    };

    const relations = {};

    return { queries, mutations, relations, MongooseObject };
};

exports.generateQueriesMutations = generateQueriesMutations;
