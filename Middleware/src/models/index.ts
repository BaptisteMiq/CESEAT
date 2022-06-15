import { DocumentType } from "@typegoose/typegoose";
import { BeAnObject } from "@typegoose/typegoose/lib/types";
import axios from "axios";
import { readdirSync } from "fs";
import { SchemaComposer } from "graphql-compose";
import { ObjectTypeComposerWithMongooseResolvers } from "graphql-compose-mongoose";

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
            const { generateQueriesMutations } = require(`../models/${file}`);
            if (typeof generateQueriesMutations !== "function") return;
            const { queries, mutations, relations, MongooseObject } = await generateQueriesMutations(schemaComposer);
            if (queries) {
                allQueries = { ...allQueries, ...queries };
            }
            if (mutations) {
                allMutations = { ...allMutations, ...mutations };
            }
            if (relations) {
                allRelations.push({ doc: MongooseObject, relations });
            }
            if (MongooseObject) {
                allModels.push({ name: file.replace(".js", ""), doc: MongooseObject });
            }
        })
    );

    // Add relations to the schema
    allRelations.forEach((relation) => {
        const { doc, relations } = relation;
        Object.keys(relations).forEach((relationName: string) => {
            const ref = allModels.find((m: any) => m.name === relations[relationName]);
            if (ref) {
                console.log(`Adding relation ${relationName} from ${ref.name}`);
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
                            _id: (source: any) => source[relationName] || null,
                        },
                        projection: {
                            [relationName]: true,
                        },
                    });
                }
            }
        });
    });

    // Load Users from the Accounts Microservice
    const getUsers = async () => axios.get(`http://${process.env.MSC_HOST}:${process.env.MSC_PORT}/users`).then((res) => res.data);
    const UserQueries = {
        users: {
            type: "JSON",
            resolve: getUsers,
        },
    };
    allQueries = { ...allQueries, ...UserQueries };

    schemaComposer.Query.addFields(allQueries);
    schemaComposer.Mutation.addFields(allMutations);

    return schemaComposer.buildSchema();
};
