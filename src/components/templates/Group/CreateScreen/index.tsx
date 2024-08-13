import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import toast from "react-hot-toast";
import Button from "src/components/atoms/Buttons";
import { BaseScreenPadding } from "src/components/atoms/Common/Padding";
import { Input } from "src/components/atoms/Input";
import { UserListItem } from "src/components/atoms/ListItems/UserListItem";
import {
  TextCaption,
  TextSmall,
  TitleSmall,
} from "src/components/atoms/Typography/Typography";
import { ExpensePlayerInput } from "src/components/organisms/ExpensePlayerInput";
import { CustomLayout } from "src/components/organisms/Layout";
import { Navbar } from "src/components/organisms/Navbar";
import { useGroup } from "src/hooks/useGroup";
import { User } from "src/models/user";
import { useTheme } from "styled-components";
import { Container, Wrapper, Footer } from "./CreateScreen.styled";

const CreateGroupComponent = () => {
  const router = useRouter();
  const { stroke } = useTheme();
  const errorCb = useCallback((err?: string) => {
    toast.error(err);
  }, []);
  const { createGroup, loading } = useGroup(false, errorCb);
  const [groupName, setGroupName] = React.useState("");
  const [users, setUsers] = React.useState<User[]>([]);
  const back = () => {
    router.back();
  };

  const createGroupHandler = () => {
    createGroup(groupName, users).then((response) => {
      if (response) {
        toast.success("Group created successfully");
        router.replace("/");
      }
    });
  };

  return (
    <Container>
      <Navbar onBack={back} />

      <BaseScreenPadding>
        <TextSmall style={{}}>Create group</TextSmall>
      </BaseScreenPadding>
      <Wrapper>
        <Input
          onChange={setGroupName}
          label="Group name"
          size={"small"}
          style={{
            borderColor: stroke.light,
          }}
        />
        <ExpensePlayerInput
          preselectSelectedUsers={users}
          inputProps={{
            size: "small",
            label: "Add members",
          }}
          noGroup
          onUserSelect={(user) => {
            setUsers([...users, user]);
          }}
          onUserDeSelect={(user) => {
            setUsers((prev) => prev.filter((u) => u.id !== user.id));
          }}
        />
      </Wrapper>
      <BaseScreenPadding style={{ paddingBottom: 0 }}>
        {users.length > 0 && <TextCaption>Selected Users</TextCaption>}
      </BaseScreenPadding>
      {users?.map((user, index) => (
        <UserListItem
          key={user.id ?? index}
          user={user}
          isLast
          onSelect={() => {}}
          onDeleted={() => {
            setUsers((prev) => prev.filter((u) => u.id !== user.id));
          }}
        />
      ))}
      <Footer>
        <Button
          onClick={createGroupHandler}
          text={loading ? "Loading ...." : "Create Group"}
          rightText={`${users.length} members`}
          style={{ borderRadius: 12 }}
        />
      </Footer>
    </Container>
  );
};

export const CreateGroup = () => {
  return (
    <CustomLayout>
      <CreateGroupComponent />
    </CustomLayout>
  );
};

export default CreateGroup;
