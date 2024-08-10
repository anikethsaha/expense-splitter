import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";
import { v4 as uuidv4 } from "uuid";

PouchDB.plugin(PouchDBFind);

export type Friend = {
  id: string;
  user_1: string; // The ID of the first user in the friendship
  user_2: string; // The ID of the second user in the friendship
  created_at: Date;
  user_1_name?: string; // Optional name for user 1, set by user 2
  user_2_name?: string; // Optional name for user 2, set by user 1
};

export const FRIEND_DB_NAME = "friends";

export const friendDbInstance = new PouchDB<Friend>(FRIEND_DB_NAME);

friendDbInstance.createIndex(
  {
    index: { fields: ["user_1", "user_2", "user_2_name"] },
  },
  (err) => {
    if (err) {
      console.error("Error creating index:", err);
    }
  }
);
