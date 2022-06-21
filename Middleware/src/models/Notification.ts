import { getModelForClass, prop } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { lengthBetween } from "../validators/StringValidator";
import { userExists } from "../validators/UserValidator";
import { MenuClass } from "./Menu";

export class NotificationClass {
    @prop({ required: true, validate: lengthBetween("title", 1, 255) })
    public title!: string;

    @prop({ required: true, validate: lengthBetween("message", 1, 1000) })
    public message!: string;

    @prop({ default: new Date() })
    public createdAt!: string;

    @prop({ required: true, validate: userExists() })
    public userId!: string;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(NotificationClass);
    const MongooseObject = composeMongoose(Model, { schemaComposer, name: "Notification" });

    const queries = {
        notifications: MongooseObject.mongooseResolvers.findMany(),
        notificationById: MongooseObject.mongooseResolvers.findById(),
    };

    const mutations = {
        notificationCreateOne: MongooseObject.mongooseResolvers.createOne(),
        notificationUpdateById: MongooseObject.mongooseResolvers.updateById(),
        notificationDeleteById: MongooseObject.mongooseResolvers.removeById(),
    };

    const relations = {};

    return { queries, mutations, relations, MongooseObject };
};

exports.generateQueriesMutations = generateQueriesMutations;
