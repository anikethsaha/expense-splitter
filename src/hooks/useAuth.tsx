import { useCallback } from "react";
import * as jose from "jose";
import { UserRepo } from "src/repos/UserRepo";
import { SECRET_KEY, TOKEN_LOCAL_STORAGE_KEY } from "src/constants/config";
import { useUserStore } from "src/stores/User.store";

const userRepo = new UserRepo();

export const useAuth = () => {
  const setUser = useUserStore((state) => state.setUser);

  const authenticate = useCallback(async (phone: string) => {
    let user = await userRepo.getUserByPhone(phone);

    if (!user) {
      user = await userRepo.createOrUpdateUser(phone);
    }

    if (!user) return false;

    const token = await new jose.SignJWT({ phone: user.phone_number })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(new TextEncoder().encode(SECRET_KEY));

    localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, token);
    setUser(user);

    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_LOCAL_STORAGE_KEY);
    setUser(null);
  }, []);

  return {
    authenticate,
    logout,
  };
};
