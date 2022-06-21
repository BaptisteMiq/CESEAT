import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { userExists } from "../validators/UserValidator";

export class FriendsClass {
    @prop({ required: true, validate: userExists() })
    public hostId!: string;

    @prop({ required: true, validate: userExists() })
    public invitedId!: string;
}

const generateQueriesMutations = (schemaComposer: any) => {
    const Model = getModelForClass(FriendsClass);
    const MongooseObject = composeMongoose(Model, { schemaComposer, name: "Friends" });

    const queries = {
        friends: MongooseObject.mongooseResolvers.findMany(),
        friendById: MongooseObject.mongooseResolvers.findById(),
    };

    const mutations = {
        friendCreateOne: MongooseObject.mongooseResolvers.createOne(),
        friendUpdateById: MongooseObject.mongooseResolvers.updateById(),
        friendDeleteById: MongooseObject.mongooseResolvers.removeById(),
    };

    const relations = {
        host: "User",
    };

    const areRelationsFromSQL = {
        host: true,
    };

    return { queries, mutations, relations, MongooseObject, areRelationsFromSQL };
};

exports.generateQueriesMutations = generateQueriesMutations;
