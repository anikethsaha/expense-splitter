import React, { ReactNode, memo, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { useReAuthenticate } from "src/hooks/useReAuthenticate";

type AuthLayerProps = {
  children: ReactNode;
};

const AuthLayer: React.FC<AuthLayerProps> = memo(({ children }) => {
  const status = useReAuthenticate();
  const router = useRouter();
  console.log("rendering auth layer");
  useEffect(() => {
    console.log("mounting auth layer");
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please login to continue", { icon: "🔒" });
      setTimeout(() => {
        router.push("/login");
      }, 500);
    }
  }, [status]);

  // If the status is loading, you might want to show a loading spinner or something similar
  if (status === "loading") {
    return <div>Loading...</div>; // Replace with your actual loading component
  }

  // If the user is authenticated, render the children
  if (status === "authenticated") {
    return <>{children}</>;
  }

  // If the user is not authenticated, they should be redirected already by useReAuthenticate
  if (status === "unauthenticated") {
    return (
      <div>
        <Toaster />
      </div>
    );
  }

  return null;
});

AuthLayer.displayName = "AuthLayer";

export { AuthLayer };
