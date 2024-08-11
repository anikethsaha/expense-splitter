import { User, userDbInstance } from "src/models/user";
import { v4 as uuidv4 } from "uuid";

export class UserRepo {
  private db: PouchDB.Database<User>;

  constructor() {
    this.db = userDbInstance;
  }

  // Create a new user
  private async createUser(user: User): Promise<PouchDB.Core.Response> {
    try {
      const response = await this.db.put({
        _id: user.id,
        ...user,
        created_at: new Date().toISOString(),
      });
      return response;
    } catch (error) {
      throw new Error("Failed to create user: " + error.message);
    }
  }

  /**
   * @risky this method is risky and it may return all users which we are not supposed to see,
   * filter the user ids carefully
   * @param ids
   * @returns
   */
  async getAllUsersByIds(ids: string[]): Promise<User[]> {
    try {
      const result = await this.db.find({
        selector: { id: { $in: ids } },
      });

      return result.docs;
    } catch (error) {
      console.error("Error fetching users by IDs:", error);
      return [];
    }
  }
  // Method to get a user by phone number
  async getUserByPhone(phone: string): Promise<User | null> {
    try {
      const result = await this.db.find({
        selector: { phone_number: phone },
        limit: 1,
      });

      if (result.docs.length > 0) {
        return result.docs[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user by phone:", error);
      return null;
    }
  }

  // Update an existing user
  async updateUser(user: User) {
    try {
      const id = user.id;
      const updateUser = { ...user };
      if (updateUser.id) delete updateUser["id"];
      if (updateUser._rev) delete updateUser["_id"];
      if (updateUser?._id) delete updateUser["_rev"];
      console.log("updateUser upsert", { updateUser });
      const response = await this.db.putIfNotExists(id, { ...updateUser });

      console.log("updateUser upsert", { response });
      return response;
    } catch (error) {
      console.log({ error });
      throw new Error("Failed to update user: " + error.message);
    }
  }

  // Delete a user by ID
  async deleteUser(id: string): Promise<PouchDB.Core.Response> {
    try {
      const user = await this.db.get(id);
      const response = await this.db.remove(user);
      return response;
    } catch (error) {
      throw new Error("Failed to delete user: " + error.message);
    }
  }

  // Create or update a user based on phone number
  async createOrUpdateUser(phone_number: string, name?: string): Promise<User> {
    try {
      const user = await this.getUserByPhone(phone_number);

      if (user) {
        // User exists, update the user details
        user.name = name || user.name;
        const response = await this.updateUser(user);
        return { ...user, ...response };
      } else {
        // User does not exist, create a new user
        const newUser: User = {
          id: uuidv4(), // Generate a new UUID for the user ID
          name: name || `User_${phone_number}`,
          phone_number,
          created_at: new Date().toISOString(),
        };
        const response = await this.createUser(newUser);
        return { ...newUser, ...response };
      }
    } catch (error) {
      throw new Error("Failed to create or update user: " + error.message);
    }
  }
}
