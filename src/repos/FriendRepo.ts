import { Friend, friendDbInstance } from "src/models/Friend";
import { v4 as uuidv4 } from "uuid";

export class FriendRepo {
  private db: PouchDB.Database<Friend>;

  constructor() {
    this.db = friendDbInstance;
  }

  // Create a friend entry with the current logged-in user
  /**
   * only create a friend if it does not exist
   * @param currentUserId
   * @param currentUserName
   * @param newFriendId
   * @param newFriendName
   * @returns
   */
  async createFriend(
    currentUserId: string,
    currentUserName: string,
    newFriendId: string,
    newFriendName?: string
  ): Promise<Friend> {
    const friend: Friend = {
      id: uuidv4(),
      user_1: currentUserId,
      user_2: newFriendId,
      created_at: new Date(),
      user_1_name: currentUserName,
      user_2_name: newFriendName,
    };

    try {
      // Check if the friend already exists
      const existingFriend = await this.db.find({
        selector: {
          $or: [
            { user_1: currentUserId, user_2: newFriendId },
            { user_1: newFriendId, user_2: currentUserId },
          ],
        },
      });
      if (existingFriend.docs.length > 0) {
        return existingFriend.docs[0];
      }

      await this.db.put({ _id: friend.id, ...friend });
      return friend;
    } catch (error) {
      console.error("Error creating friend:", error);
      throw error;
    }
  }

  async getFriendsByString(
    userId: string,
    searchString: string
  ): Promise<Friend[]> {
    try {
      const result = await this.db.find({
        selector: {
          $or: [
            {
              user_1: userId,
              user_2_name: { $regex: searchString, Option: "i" },
            },
          ],
        },
      });

      return result.docs;
    } catch (error) {
      console.error("Error retrieving friends by string:", error);
      throw error;
    }
  }

  // Get a list of friends for a specific user
  async getFriendList(userId: string): Promise<Friend[]> {
    try {
      const result = await this.db.find({
        selector: {
          $or: [{ user_1: userId }, { user_2: userId }],
        },
      });

      return result.docs;
    } catch (error) {
      console.error("Error retrieving friend list:", error);
      throw error;
    }
  }
}
