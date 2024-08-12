import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { MdOutlineClose } from "react-icons/md";

import { Input, InputProps } from "src/components/atoms/Input";
import { v4 as uuidv4 } from "uuid";
import { Group } from "src/models/Group";
import { User } from "src/models/user";
import { styled, useTheme } from "styled-components";
import { user1, user2, user3 } from "src/seed";
import {
  TextCaption,
  TextSmall,
} from "src/components/atoms/Typography/Typography";
import { useSplit } from "src/hooks/useSplit";

import { UserListItem } from "src/components/atoms/ListItems/UserListItem";
import { GroupListItem } from "src/components/atoms/ListItems/GroupListItem";

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const OptionDropdownContainer = styled.div`
  position: absolute;
  width: 100%;
  z-index: 1;
  background-color: ${(props) => props.theme.brand.brandOpposite};

  border-radius: 8px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  box-shadow: -1px 4px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e0e0;
  border-top: 0;
  box-sizing: border-box;
`;

/**
 * this is the component that returns all players that can be involved in the expense
 * this shows a dropdown of all players
 * @returns
 */
export const ExpensePlayerInput: React.FC<{
  onUserSelect: (user: Partial<User>) => void;
  onGroupSelect: (group: Group) => void;
  onGroupDeSelect?: (group: Group) => void;
  onUserDeSelect?: (user: Partial<User>) => void;
  preselectSelectedUsers?: Partial<User>[];
  preselectSelectedGroup?: Group;
  noGroup?: boolean;
  inputProps?: InputProps;
}> = ({
  onGroupSelect,
  onUserSelect,
  onUserDeSelect,
  onGroupDeSelect,
  preselectSelectedUsers,
  preselectSelectedGroup,
  inputProps,
  noGroup = false,
}) => {
  const { brand } = useTheme();
  const { loading, getAllPlayersByString } = useSplit(false, (err) => {
    toast.error(err);
  });

  const [userOptions, setUserOptions] = React.useState<Array<Partial<User>>>(
    []
  );

  const [groupOptions, setGroupOptions] = React.useState<Group[]>([]);

  /**
   * @param val this can be either phone number, or user name (friend) or group name
   */
  const onInputChange = (val: string) => {
    if (val.length === 0) {
      setUserOptions([]);
      setGroupOptions([]);
      return;
    }
    getAllPlayersByString(val).then((res) => {
      if (res) {
        setUserOptions(res.users);
        setGroupOptions(res.groups);
      } else {
        setUserOptions([]);
        setGroupOptions([]);
      }
    });
  };

  const handleUserSelect = (user: Partial<User>) => {
    onUserSelect(user);
  };

  const handleGroupSelect = (group: Group) => {
    onGroupSelect(group);
  };

  const handleUserDeSelect = (user: Partial<User>) => {
    onUserDeSelect?.(user);
  };
  const handleGroupDeSelect = (group: Group) => {
    onGroupDeSelect?.(group);
  };

  const dropdownOpened =
    userOptions.length > 0 || loading || groupOptions?.length > 0;

  return (
    <Container>
      <Input
        {...inputProps}
        style={{
          borderColor: "#e1e0e0",
          ...(dropdownOpened
            ? {
                bordeBbottom: 0,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }
            : {}),
        }}
        label={inputProps?.label ?? "With you and "}
        placeholder={`Enter phone number or name ${
          noGroup ? "" : "or group name"
        }`}
        type="text"
        onChange={onInputChange}
        rightElement={
          userOptions.length > 0 || groupOptions?.length > 0 ? (
            <MdOutlineClose
              onClick={() => {
                setUserOptions([]);
                setGroupOptions([]);
              }}
              size={20}
              color={brand.primary}
            />
          ) : undefined
        }
      />

      {(userOptions.length > 0 || loading || groupOptions?.length > 0) && (
        <OptionDropdownContainer>
          {userOptions?.map((option, i) => (
            <UserListItem
              showCheckbox
              isLast={i === userOptions.length - 1}
              user={option}
              key={`${option.id}-${option.phone_number}`}
              onSelect={() => handleUserSelect(option!)}
              onDeSelected={() => handleUserDeSelect(option)}
              preSelected={
                preselectSelectedUsers?.find(
                  (user) =>
                    user.phone_number === option.phone_number ||
                    (typeof option.id !== "undefined" && user.id === option.id)
                )
                  ? true
                  : false
              }
            />
          ))}
          {!noGroup &&
            groupOptions?.map((group, i) => (
              <GroupListItem
                showRadioButton
                isLast={i === groupOptions.length - 1}
                group={group}
                key={group.id}
                onSelect={() => handleGroupSelect(group)}
                preSelected={
                  preselectSelectedGroup?.id === group.id ? true : false
                }
                onDeSelected={() => handleGroupDeSelect(group)}
              />
            ))}
        </OptionDropdownContainer>
      )}
      <Toaster />
    </Container>
  );
};
