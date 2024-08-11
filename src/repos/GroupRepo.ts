import { Group, groupDbInstance } from "src/models/Group";

export class GroupRepo {
  private db: PouchDB.Database<Group>;

  constructor() {
    this.db = groupDbInstance;
  }

  async getAllGroupByStringAndUserId(
    searchString: string,
    userId: string
  ): Promise<Group[]> {
    try {
      const result = await this.db.find({
        selector: {
          user_ids: { $in: [userId] },
          name: { $regex: searchString, $options: "i" },
        },
      });

      return result.docs;
    } catch (error) {
      console.error("Error fetching groups by string and user ID:", error);
      return [];
    }
  }

  getGroupById(groupId: string): Promise<Group> {
    return this.db.get(groupId);
  }

  async getAllGroupsByUserId(userId: string): Promise<Group[]> {
    try {
      const result = await this.db.find({
        selector: { user_ids: { $in: [userId] } },
      });

      return result.docs;
    } catch (error) {
      console.error("Error fetching groups by user ID:", error);
      return [];
    }
  }

  async createGroup(group: Group): Promise<PouchDB.Core.Response> {
    try {
      return new Promise((resolve, reject) => {
        this.db.put(
          {
            _id: group.id,
            ...group,
            created_at: new Date().toISOString(),
          },
          {},
          (err, response) => {
            if (err) {
              console.error("Error creating group:", err);
              reject(err);
            } else {
              resolve(response);
            }
          }
        );
      });
    } catch (error) {
      throw new Error("Failed to create group: " + error.message);
    }
  }
}
