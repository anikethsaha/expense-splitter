import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { jwtVerify } from "jose";
import { UserRepo } from "src/repos/UserRepo";
import { SECRET_KEY, TOKEN_LOCAL_STORAGE_KEY } from "src/constants/config";
import { useUserStore } from "src/stores/User.store";

const userRepo = new UserRepo();

// Custom hook for re-authentication
export const useReAuthenticate = () => {
  const [status, setStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const router = useRouter();

  const reAuthenticate = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY);

    if (!token) {
      setStatus("unauthenticated");
      router.push("/login");
      return;
    }

    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(SECRET_KEY)
      );

      const phone = payload.phone as string;

      const user = await userRepo.getUserByPhone(phone);

      if (user) {
        setUser(user);
        setStatus("authenticated");
      } else {
        clearUser();
        setStatus("unauthenticated");
        router.push("/login");
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      clearUser();
      setStatus("unauthenticated");
      router.push("/login");
    }
  }, [setUser, clearUser, router]);

  useEffect(() => {
    reAuthenticate();
  }, [reAuthenticate]);

  return status;
};
