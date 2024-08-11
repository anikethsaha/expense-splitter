import React from "react";
import { v4 as uuidv4 } from "uuid";
import { User } from "src/models/user";
import { FriendRepo } from "src/repos/FriendRepo";
import { GroupRepo } from "src/repos/GroupRepo";
import { UserRepo } from "src/repos/UserRepo";
import { useLoggedInUser } from "src/stores/User.store";
import { SplitRepo } from "src/repos/SplitRepo";

const userRepo = new UserRepo();
const groupRepo = new GroupRepo();
const friendRepo = new FriendRepo();
const splitRepo = new SplitRepo();

export const useGroup = (
  defaultLoading = false,
  onError: (err?: string) => void
) => {
  const [loading, setLoading] = React.useState(defaultLoading);
  const currentUser = useLoggedInUser();

  const createGroup = async (name: string, users: User[]) => {
    setLoading(true);
    try {
      // Step 1: Create or update the users who don't have an ID (new users)
      const userIds: string[] = [];
      for (const user of users) {
        if (!user.id) {
          // If user ID is null, create a new user
          const createdUser = await userRepo.createOrUpdateUser(
            user.phone_number,
            user.name
          );
          userIds.push(createdUser.id);
        } else {
          // If user ID exists, use it directly
          userIds.push(user.id);
        }
      }

      // Step 2: Make sure all group members are friends with the current user
      for (const userId of userIds) {
        if (userId !== currentUser?.id) {
          await friendRepo.createFriend(
            currentUser?.id!,
            currentUser?.name!,
            userId,
            users.find((u) => u.id === userId)?.name
          );
        }
      }

      const uniqueUserIds = Array.from(new Set([...userIds, currentUser?.id!]));
      // Step 3: Create the group
      const newGroup = {
        id: uuidv4(),
        name: name,
        user_ids: uniqueUserIds,
        created_at: new Date().toISOString(),
        created_by: currentUser?.id,
        is_active: true,
      };
      console.log({ newGroup });
      const groupResponse = await groupRepo.createGroup(newGroup);

      console.log("Group created successfully:", groupResponse);
      return groupResponse;
    } catch (err) {
      onError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getAllSplitsByGroupId = async (groupId: string) => {
    setLoading(true);
    try {
      const splits = await splitRepo.getAllSplitsByGroupId(groupId);
      return splits;
    } catch (err) {
      onError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getGroupInfo = async (groupId: string) => {
    setLoading(true);
    try {
      const group = await groupRepo.getGroupById(groupId);
      return group;
    } catch (err) {
      onError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getGroupList = async () => {
    setLoading(true);
    try {
      const groups = await groupRepo.getAllGroupsByUserId(currentUser?.id!);
      return groups;
    } catch (err) {
      onError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createGroup,
    getGroupList,
    getAllSplitsByGroupId,
    getGroupInfo,
  };
};
