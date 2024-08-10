import { useCallback, useState } from "react";
import { useLoggedInUser } from "src/stores/User.store";
import { UserRepo } from "src/repos/UserRepo";
import { FriendRepo } from "src/repos/FriendRepo";
import { useRouter } from "next/navigation";

const friendRepo = new FriendRepo();
const userRepo = new UserRepo();

export const useFriend = (
  isLoading = false,
  onError?: (error: string) => void
) => {
  const [loading, setLoading] = useState<boolean>(isLoading);
  const router = useRouter();
  const currentUser = useLoggedInUser();

  // Create a new user if not exists
  const createUserIfNotExists = useCallback(
    async (phoneNumber: string, name?: string) => {
      setLoading(true);
      try {
        return await userRepo.createOrUpdateUser(phoneNumber, name);
      } catch (error) {
        onError?.("Error creating or updating user: " + error);
      } finally {
        setLoading(false);
      }
    },
    [onError]
  );

  // Create a new friend with the current logged-in user
  const createFriend = useCallback(
    async (newFriendPhone: string, newFriendName?: string) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setLoading(true);
      try {
        // Ensure the friend user exists
        const secondUser = await createUserIfNotExists(
          newFriendPhone,
          newFriendName
        );

        if (!secondUser) {
          onError?.("Error creating friend: User not found or created");
          return;
        }

        const friend = await friendRepo.createFriend(
          currentUser.id,
          currentUser.name ?? "",
          secondUser.id,
          newFriendName ?? secondUser.name
        );

        return friend;
      } catch (error) {
        onError?.("Error creating friend: " + error);
      } finally {
        setLoading(false);
      }
    },
    [currentUser, router, createUserIfNotExists, onError]
  );

  // Get the list of friends for the current logged-in user
  const getFriendList = useCallback(async () => {
    if (!currentUser) {
      throw new Error("No user is logged in");
    }

    setLoading(true);
    try {
      const friends = await friendRepo.getFriendList(currentUser.id);
      return friends;
    } catch (error) {
      onError?.("Error retrieving friend list: " + error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, onError]);

  return {
    createFriend,
    getFriendList,
    loading, // Provide the loading state to the consumers
  };
};
