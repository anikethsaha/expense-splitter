import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";
import { v4 as uuidv4 } from "uuid";

PouchDB.plugin(PouchDBFind);

export type Group = {
  id: string;
  name: string; // The name of the group
  user_ids: string[]; // An array of user IDs belonging to this group
  created_at: Date;
  updated_at: Date;
  created_by: string; // The ID of the user who created the group
  is_active: boolean; // A flag indicating whether the group is active
};

export const GROUP_DB_NAME = "groups";

export const groupDbInstance = new PouchDB<Group>(GROUP_DB_NAME);

groupDbInstance.createIndex(
  {
    index: { fields: ["created_by"] },
  },
  (err) => {
    if (err) {
      console.error("Error creating index:", err);
    }
  }
);
