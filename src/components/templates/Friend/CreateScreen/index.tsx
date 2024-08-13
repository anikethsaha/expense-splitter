import React from "react";
import Button from "src/components/atoms/Buttons";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlinePlus } from "react-icons/ai";

import { BaseScreenPadding } from "src/components/atoms/Common/Padding";
import { Input } from "src/components/atoms/Input";
import { TitleMedium } from "src/components/atoms/Typography/Typography";
import { Navbar } from "src/components/organisms/Navbar";
import styled, { useTheme } from "styled-components";
import { useRouter } from "next/navigation";
import { useFriend } from "src/hooks/useFriend";
import { CustomLayout } from "src/components/organisms/Layout";
import { Container, InputWrapper } from "./FriendCreateScreen.styled";

export const CreateFriendScreenComponent = () => {
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
            type={"tel"}
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

export const CreateFriendScreen = () => {
  return (
    <CustomLayout>
      <CreateFriendScreenComponent />
    </CustomLayout>
  );
};
