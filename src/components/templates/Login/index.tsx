import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import React from "react";
import Button from "src/components/atoms/Buttons";
import { Input } from "src/components/atoms/Input";
import { TitleMedium } from "src/components/atoms/Typography/Typography";
import { useAuth } from "src/hooks/useAuth";
import { User } from "src/models/user";
import styled from "styled-components";
import { AppContainer } from "src/components/organisms/Layout/AppContainer";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const LoginFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
  gap: 12px;
`;

export const LoginScreen = () => {
  const router = useRouter();
  const { authenticate } = useAuth();
  const [phoneNumber, setPhoneNumber] = React.useState("");

  const handleLogin = () => {
    authenticate(phoneNumber).then((user) => {
      if (user) {
        toast("Login successful", { icon: "🎉" });
        setTimeout(() => {
          router.replace("/");
        }, 500);
      } else {
        toast.error("Login failed", { icon: "🔒" });
      }
    });
  };

  return (
    <AppContainer>
      <Container>
        <LoginFormContainer>
          <TitleMedium>Please Login</TitleMedium>{" "}
          <Input
            type="number"
            maxLength={10}
            onChange={(val) => setPhoneNumber(val)}
          />
          <Button text={"Login"} onClick={handleLogin} />
        </LoginFormContainer>
        <Toaster />
      </Container>
    </AppContainer>
  );
};
