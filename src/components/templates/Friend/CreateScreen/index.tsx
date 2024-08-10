import React from "react";
import Button from "src/components/atoms/Buttons";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlinePlus } from "react-icons/ai";

import { BaseScreenPadding } from "src/components/atoms/Common/Padding";
import { Input } from "src/components/atoms/Input";
import {
  TitleLarge,
  TitleMedium,
  TitleSmall,
} from "src/components/atoms/Typography/Typography";
import { Navbar } from "src/components/organisms/Navbar";
import styled, { useTheme } from "styled-components";
import { useRouter } from "next/navigation";
import { useFriend } from "src/hooks/useFriend";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  box-sizing: border-box;
  height: 100%;
  width: 100%;
  justify-content: start;
  align-items: start;
  width: 100%;
  box-sizing: border-box;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;

  margin-top: 24px;
  width: 100%;
`;

export const CreateFriendScreen = () => {
  const { createFriend } = useFriend(false, (err) => {
    toast.error(err);
  });
  const router = useRouter();
  const { base } = useTheme();

  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [name, setName] = React.useState("");

  const onBack = () => {
    router.back();
  };

  const onAdd = () => {
    createFriend(phoneNumber, name).then((friend) => {
      if (!friend) return;
      toast.success("Friend added");
      setTimeout(() => {
        router.replace("/");
      }, 200);
    });
  };

  return (
    <Container>
      <Navbar onBack={onBack} hideActions />
      <BaseScreenPadding style={{ width: "100%" }}>
        <TitleMedium color={base.baseDarker1}>Add Friend</TitleMedium>
        <InputWrapper>
          <Input
            type={"number"}
            onChange={setPhoneNumber}
            label={"Phone number"}
          />
          <Input type={"text"} label={"Name"} onChange={setName} />
          <Button
            onClick={onAdd}
            text="Add"
            trailingIcon={(props) => <AiOutlinePlus {...props} />}
          />
        </InputWrapper>
      </BaseScreenPadding>
      <Toaster />
    </Container>
  );
};
