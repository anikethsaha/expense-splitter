import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BaseScreenPadding } from "src/components/atoms/Common/Padding";
import { GroupListItem } from "src/components/atoms/ListItems/GroupListItem";
import { UserListItem } from "src/components/atoms/ListItems/UserListItem";
import { TextCaption } from "src/components/atoms/Typography/Typography";
import { ExpensePlayerInput } from "src/components/organisms/ExpensePlayerInput";
import { Navbar } from "src/components/organisms/Navbar";
import { Group } from "src/models/Group";
import { User } from "src/models/user";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const CreateSplit = () => {
  const router = useRouter();
  const [selectedUsers, setUsers] = useState<Partial<User>[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const onBack = () => {
    router.back();
  };

  const handleGroupSelect = (group: Group, isSelect = true) => {
    setUsers([]);
    if (isSelect) {
      setSelectedGroup({ ...group });
    } else {
      setSelectedGroup(null);
    }
  };

  const handleUserSelect = (user: Partial<User>, isSelect = true) => {
    setSelectedGroup(null);
    if (isSelect) {
      setUsers((prev) => [...prev, user]);
    } else {
      setUsers((prev) =>
        prev.filter((u) => u.phone_number !== user.phone_number)
      );
    }
  };

  return (
    <Container>
      <Navbar hideActions onBack={onBack} />
      <BaseScreenPadding style={{ marginTop: 24 }}>
        <ExpensePlayerInput
          onGroupSelect={handleGroupSelect}
          onUserSelect={handleUserSelect}
          onGroupDeSelect={(group) => handleGroupSelect(group, false)}
          onUserDeSelect={(user) => handleUserSelect(user, false)}
          preselectSelectedGroup={selectedGroup!}
          preselectSelectedUsers={selectedUsers}
        />
      </BaseScreenPadding>
      <div
        style={{
          marginTop: 12,
        }}
      >
        {selectedGroup && (
          <>
            <BaseScreenPadding>
              <TextCaption>Selected group</TextCaption>
            </BaseScreenPadding>
            <GroupListItem isLast group={selectedGroup} onDeleted={() => {}} />
          </>
        )}

        {selectedUsers.length > 0 && (
          <BaseScreenPadding>
            <TextCaption>Selected Users</TextCaption>
          </BaseScreenPadding>
        )}
        {selectedUsers?.map((user, index) => (
          <UserListItem
            key={user.id ?? index}
            user={user}
            isLast={index === selectedUsers.length - 1}
            onSelect={() => {}}
            onDeleted={() => {
              setUsers((prev) =>
                prev.filter((u) => u.phone_number !== user.phone_number)
              );
            }}
          />
        ))}
      </div>
    </Container>
  );
};
