import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BaseScreenPadding } from "src/components/atoms/Common/Padding";
import { GroupListItem } from "src/components/atoms/ListItems/GroupListItem";
import { UserListItem } from "src/components/atoms/ListItems/UserListItem";
import { TextCaption } from "src/components/atoms/Typography/Typography";
import { ExpensePlayerInput } from "src/components/organisms/ExpensePlayerInput";
import { Group } from "src/models/Group";
import { User } from "src/models/user";
import { useSplitCreatorHelper } from "../../hooks/useSplitCreatorHelper";

export const FirstStepSplitCreator = () => {
  const {
    setGroup: setSelectedGroup,
    setUsers,
    users: selectedUsers,
    group: selectedGroup,
  } = useSplitCreatorHelper();

  const handleGroupSelect = (group: Group, isSelect = true) => {
    if (isSelect) {
      setSelectedGroup({ ...group });
    } else {
      setSelectedGroup(null);
    }
  };

  const handleUserSelect = (user: Partial<User>, isSelect = true) => {
    setSelectedGroup(null);
    if (isSelect) {
      setUsers([...(selectedUsers ?? []), user]);
    } else {
      const newusers = (selectedUsers ?? []).filter(
        (u) => u.phone_number !== user.phone_number
      );
      setUsers([...newusers]);
    }
  };
  return (
    <>
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

        {typeof selectedUsers !== "undefined" &&
          selectedUsers.length > 0 &&
          !selectedGroup && (
            <BaseScreenPadding>
              <TextCaption>Selected Users</TextCaption>
            </BaseScreenPadding>
          )}
        {!selectedGroup &&
          selectedUsers?.map((user, index) => (
            <UserListItem
              key={user.id ?? index}
              user={user}
              isLast={index === selectedUsers.length - 1}
              onSelect={() => {}}
              onDeleted={() => handleUserSelect(user, false)}
            />
          ))}
      </div>
    </>
  );
};
