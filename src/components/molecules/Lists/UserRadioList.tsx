import React, { use, useEffect, useState } from "react";
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
}> = ({ users, onChange }) => {
  const [selectedUser, setSelectedUser] = useState<User>(users[0]);

  useEffect(() => {
    onChange(selectedUser);
  }, [selectedUser]);

  useEffect(() => {
    setSelectedUser(users[0]);
  }, [users]);

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
