import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { lengthBetween } from "../validators/StringValidator";
import { userExists } from "../validators/UserValidator";
import { TicketStatusClass } from "./TicketStatus";

export class TicketClass {
    @prop({ required: true, validate: userExists() })
    public userId!: string;

    @prop({ required: true, validate: lengthBetween("title", 3, 255) })
    public title!: string;

    @prop({ required: true, validate: lengthBetween("message", 3, 1000) })
    public message!: string;

    @prop({ ref: TicketStatusClass, required: true })
    public status!: Ref<TicketStatusClass>;

    @prop({ default: new Date() })
    public createdAt!: string;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(TicketClass);
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
