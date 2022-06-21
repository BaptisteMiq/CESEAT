import { DocumentType } from "@typegoose/typegoose";
import { BeAnObject } from "@typegoose/typegoose/lib/types";
import { ApolloError } from "apollo-server";
import axios from "axios";
import { readdirSync } from "fs";
import { SchemaComposer } from "graphql-compose";
import { composeMongoose, ObjectTypeComposerWithMongooseResolvers } from "graphql-compose-mongoose";
import mongoose, { model } from "mongoose";
import { getUsersMutations, getUsersQueries } from "./_Users";

type ModelType = ObjectTypeComposerWithMongooseResolvers<DocumentType<any, BeAnObject>, any>;

type Model = {
    name: string;
    doc: ModelType;
};

type Relation = {
    doc: ModelType;
    relations: {
        [key: string]: string;
    };
    areRelationsFromSQL: {
        [key: string]: boolean;
    };
};

export default async () => {
    const schemaComposer = new SchemaComposer();

    let allQueries: any = {};
    let allMutations: any = {};
    let allRelations: Relation[] = [];
    let allModels: Model[] = [];

    // Import all queries and mutations from every file in the models folder
    await Promise.all(
        readdirSync(__dirname).map(async (file) => {
            if (file.startsWith("_")) return;
            const { generateQueriesMutations } = require(`../models/${file}`);
            if (typeof generateQueriesMutations !== "function") return;
            const { queries, mutations, relations, MongooseObject, areRelationsFromSQL } =
                await generateQueriesMutations(schemaComposer);
            let relationsFromSQL = areRelationsFromSQL ?? {};
            if (queries) {
                allQueries = { ...allQueries, ...queries };
            }
            if (mutations) {
                allMutations = { ...allMutations, ...mutations };
            }
            if (relations) {
                allRelations.push({ doc: MongooseObject, relations, areRelationsFromSQL: relationsFromSQL });
            }
            if (MongooseObject) {
                allModels.push({ name: file.replace(".js", ""), doc: MongooseObject });
            }
        })
    );

    // Add Users types and queries
    // These are specials because they are loaded from the Accounts Microservice (querrying the MySQL DB)
    allQueries = { ...allQueries, ...getUsersQueries(schemaComposer) };
    allMutations = { ...allMutations, ...getUsersMutations(schemaComposer) };

    // Add relations to the schema
    allRelations.forEach((relation) => {
        const { doc, relations } = relation;
        const isFromSQL = relation.areRelationsFromSQL ?? {};
        Object.keys(relations).forEach((relationName: string) => {
            const ref = allModels.find((m: any) => m.name === relations[relationName]);
            if (ref) {
                // console.log(`Adding relation ${relationName} from ${ref.name}`);
                const isArray = relationName.endsWith("s");
                if (isArray) {
                    doc.addRelation(relationName, {
                        resolver: () => ref.doc.mongooseResolvers.dataLoaderMany(),
                        prepareArgs: {
                            _ids: (source: any) => source[relationName] || [],
                        },
                        projection: {
                            [relationName]: true,
                        },
                    });
                } else {
                    doc.addRelation(relationName, {
                        resolver: () => ref.doc.mongooseResolvers.dataLoader(),
                        prepareArgs: {
                            // [isFromSQL[relationName] ? "ID" : "_id"]: (source: any) => source[relationName] || null,
                            // _id: (source: any) => source[relationName] || null,
                            _id: (source: any) =>
                                schemaComposer
                                    .getOTC(ref.name)
                                    .getResolver("userById")
                                    .addArgs({ ID: source[relationName] || null }),
                        },
                        projection: {
                            [relationName]: true,
                        },
                    });
                }
            }
        });
    });

    schemaComposer.Query.addFields(allQueries);
    schemaComposer.Mutation.addFields(allMutations);

    return schemaComposer.buildSchema();
};
