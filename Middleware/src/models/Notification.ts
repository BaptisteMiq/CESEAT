import { getModelForClass, prop } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { MenuClass } from "./Menu";

export class NotificationClass {
    @prop()
    public title: string;

    @prop()
    public message: string;

    @prop()
    public createdAt: string;

    @prop()
    public userId: string;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(MenuClass);
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
