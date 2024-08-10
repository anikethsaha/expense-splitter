import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";
import { seedUsersIfNeeded } from "src/seed";

PouchDB.plugin(PouchDBFind);

export type User = {
  id: string;
  name?: string;
  phone_number?: string;
  created_at: string;
};

export const USER_DB_NAME = "users";

export const userDbInstance = new PouchDB<User>(USER_DB_NAME);
userDbInstance.createIndex(
  {
    index: { fields: ["phone_number"] },
  },
  (err) => {
    if (err) {
      console.error("Error creating index:", err);
    }
  }
);

seedUsersIfNeeded();
