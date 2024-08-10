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
}
