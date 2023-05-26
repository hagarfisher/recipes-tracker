import { Client, Databases, Models } from "node-appwrite";
import ObjectID from "bson-objectid";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(".env.local") });

interface Attribute {
  key: string;
  type: AttributeType;
  required: boolean;
  default?: any;
}

interface StringAttribute extends Attribute {
  size: number;
}

const enum AttributeType {
  STRING = "String",
  URL = "Url",
  BOOLEAN = "Boolean",
  DATE_TIME = "Datetime",
}

const APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1";
const DB_NAME = "Recipes-Tracker";
const COLLECTIONS = {
  Tags: {
    attributes: [
      { key: "label", size: 40, type: AttributeType.STRING, required: true },
      {
        key: "isDeleted",
        type: AttributeType.BOOLEAN,
        default: false,
        required: false,
      },
    ],
  },
  Meals: {
    attributes: [
      {
        key: "name",
        size: 2 ** 16,
        type: AttributeType.STRING,
        required: true,
      },
      {
        key: "description",
        size: 2 ** 16,
        type: AttributeType.STRING,
        required: false,
      },
      {
        key: "recipeUrl",
        type: AttributeType.URL,
        required: false,
      },
      {
        key: "isDeleted",
        type: AttributeType.BOOLEAN,
        default: false,
        required: false,
      },
      {
        key: "imageUrl",
        size: 20,
        type: AttributeType.STRING,
        default: "646e5e3753d0e8528902",
        required: false,
      },
    ],
    relationships: [
      {
        key: "tags",
        relatedCollectionId: "",
        type: "manyToMany",
        twoWay: true,
        twoWayKey: "meals",
        onDelete: "setNull",
      },
    ],
  },
  ["Cooking Events"]: {
    attributes: [
      {
        key: "isDeleted",
        type: AttributeType.BOOLEAN,
        default: false,
        required: false,
      },
      {
        key: "cookingDate",
        type: AttributeType.DATE_TIME,
        required: true,
      },
    ],
    relationships: [
      {
        key: "meals",
        relatedCollectionId: "",
        type: "oneToOne",
        twoWay: true,
        twoWayKey: "cookingEvents",
      },
    ],
  },
};

async function syncDbEntity(databases: Databases) {
  const { databases: existingDatabases } = await databases.list();

  let relevantDatabase = existingDatabases.find(
    (database) => database.name === DB_NAME
  );

  if (!relevantDatabase) {
    relevantDatabase = await databases.create(
      ObjectID().toHexString(),
      DB_NAME
    );
  }
  return relevantDatabase;
}

async function syncCollections(
  databases: Databases,
  relevantDatabase: Models.Database
) {
  const { collections: existingCollections } = await databases.listCollections(
    relevantDatabase.$id
  );

  const nonExistingCollections = Object.keys(COLLECTIONS).filter(
    (collection) =>
      !existingCollections.find(
        (existingCollection) => existingCollection.name === collection
      )
  );

  for (let nonExistingCollection of nonExistingCollections) {
    console.log(`Creating collection ${nonExistingCollection}`);
    existingCollections.push(
      await databases.createCollection(
        relevantDatabase.$id,
        ObjectID().toHexString(),
        nonExistingCollection
      )
    );
  }
  return existingCollections;
}

async function syncAttributes(
  databases: Databases,
  relevantCollections: Models.Collection[]
) {
  // TODO: implement me
  for (let relevantCollection of relevantCollections) {
    const collectionAttributes =
      COLLECTIONS[relevantCollection.name as keyof typeof COLLECTIONS]
        .attributes;

    if (collectionAttributes) {
      for (let attribute of collectionAttributes) {
        createAttribute(attribute, relevantCollection, databases);
      }
    }
  }
}
async function createAttribute(
  attribute: StringAttribute | Attribute,
  relevantCollection: Models.Collection,
  databases: Databases
) {
  console.log(
    `Creating attribute ${JSON.stringify(attribute)} of type ${
      attribute.type
    } for collection ${relevantCollection.name}`
  );
  const { type, key, required, default: defaultValue } = attribute;
  const { size } = attribute as StringAttribute;
  try {
    switch (type) {
      case AttributeType.STRING:
        await databases.createStringAttribute(
          relevantCollection.databaseId,
          relevantCollection.$id,
          key,
          size,
          required,
          defaultValue
        );
        break;
      case AttributeType.URL:
        await databases.createUrlAttribute(
          relevantCollection.databaseId,
          relevantCollection.$id,
          key,
          required,
          defaultValue
        );
        break;
      case AttributeType.BOOLEAN:
        await databases.createBooleanAttribute(
          relevantCollection.databaseId,
          relevantCollection.$id,
          key,
          required,
          defaultValue
        );
        break;
      case AttributeType.DATE_TIME:
        await databases.createDatetimeAttribute(
          relevantCollection.databaseId,
          relevantCollection.$id,
          key,
          required,
          defaultValue
        );
        break;
      default:
        throw new Error(`Unknown attribute type ${type}`);
    }
  } catch (error) {
    // if attribute already exists, we can just ignore it here
    if ((error as any).code !== 409) {
      throw error;
    } else {
      console.warn(
        `Error creating attribute ${key} for collection ${relevantCollection.name}, it already exists`
      );
    }
  }
}

export async function syncDb() {
  if (!process.env.APPWRITE_PROJECT_ID || !process.env.APPWRITE_SECRET_KEY) {
    throw new Error("Missing AppWrite credentials");
  }

  const client = new Client();
  const databases = new Databases(client);

  client
    .setEndpoint(APPWRITE_ENDPOINT) // Your Appwrite Endpoint
    .setProject(process.env.APPWRITE_PROJECT_ID) // Your project ID
    .setKey(process.env.APPWRITE_SECRET_KEY); // Your secret API key

  const relevantDatabase = await syncDbEntity(databases);
  const relevantCollections = await syncCollections(
    databases,
    relevantDatabase
  );
  await syncAttributes(databases, relevantCollections);
  console.log("Done");
}

syncDb();
