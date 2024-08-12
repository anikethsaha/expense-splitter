import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Group } from "src/models/Group";
import { User } from "src/models/user";
import { FriendRepo } from "src/repos/FriendRepo";
import { GroupRepo } from "src/repos/GroupRepo";
import { UserRepo } from "src/repos/UserRepo";
import { useLoggedInUser } from "src/stores/User.store";

const friendRepo = new FriendRepo();
const userRepo = new UserRepo();
const groupRepo = new GroupRepo();

const phoneNumberRegex = /^\d{10}$/;

export const useSplit = (
  defaultLoadingState = false,
  onError?: (error: string) => void
) => {
  const router = useRouter();
  const currentUser = useLoggedInUser();
  const [loading, setLoading] = useState(defaultLoadingState);

  const getAllPlayersByString = async (str: string) => {
    try {
      if (currentUser?.id === undefined) {
        router.replace("/login");
        return;
      }
      setLoading(true);
      let users: Partial<User>[] = [];
      let groups: Group[] = [];
      // individual users

      const allMyFriends = await friendRepo.getFriendList(currentUser.id);

      // search by name for friend
      if (allMyFriends?.length > 0) {
        const namedMatchedFriends = allMyFriends.filter((friend) =>
          friend.user_2_name?.toLowerCase().includes(str.toLowerCase())
        );

        const allUsers = await userRepo.getAllUsersByIds(
          namedMatchedFriends.map((friend) => friend.user_2)
        );

        if (allUsers.length > 0) {
          users = [...users, ...allUsers];
        }

        const allMyFriendsAsUsers = await userRepo.getAllUsersByIds(
          allMyFriends.map((friend) => friend.user_2)
        );

        if (allMyFriendsAsUsers.length > 0) {
          const phoneNumberMatchedUsers = allMyFriendsAsUsers.filter((user) =>
            user.phone_number?.includes(str)
          );

          if (phoneNumberMatchedUsers.length > 0) {
            users = [...users, ...phoneNumberMatchedUsers];
          }
        }
      }
      if (phoneNumberRegex.test(str)) {
        users = [...users, { phone_number: str }];
      }

      // get groups by name
      const allMyGroups = await groupRepo.getAllGroupByStringAndUserId(
        str,
        currentUser.id
      );

      console.log({ allMyGroups });
      if (allMyGroups?.length > 0) {
        groups = [...groups, ...allMyGroups];
      }
      setLoading(false);

      return {
        users,
        groups,
      };
    } catch (error) {
      setLoading(false);
      console.error("Error retrieving players:", error);
      onError?.("Error retrieving players: " + error.message);
    }
  };

  return {
    getAllPlayersByString,
    loading,
  };
};
