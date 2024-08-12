import React, { use, useEffect, useRef, useState } from "react";
import { UserListItem } from "src/components/atoms/ListItems/UserListItem";
import { User } from "src/models/user";
import { styled } from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const UserRadioList: React.FC<{
  users: User[];
  onChange: (user: User) => void;
  preSelected?: string;
}> = ({ users, onChange, preSelected }) => {
  const [selectedUser, setSelectedUser] = useState<User>(users[0]);
  const defaultStoredFlag = useRef(null);

  useEffect(() => {
    onChange(selectedUser);
  }, [selectedUser]);

  useEffect(() => {
    if (preSelected && users && !defaultStoredFlag.current) {
      const preSelectedUser = users.find((user) => user.id === preSelected);
      if (preSelectedUser) {
        console.log({ preSelectedUser });
        setSelectedUser({ ...preSelectedUser });
        defaultStoredFlag.current = preSelectedUser;
        return;
      }
    }
  }, [users, preSelected]);

  return (
    <Container>
      {users.map((user, id) => (
        <UserListItem
          showRadiobox
          isLast
          key={user.id ?? user.phone_number}
          user={user}
          onSelect={() => setSelectedUser(user)}
          preSelected={
            selectedUser?.id === user.id ||
            selectedUser?.phone_number === user.phone_number
          }
          onDeSelected={() => {}}
        />
      ))}
    </Container>
  );
};
