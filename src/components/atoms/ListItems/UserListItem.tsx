import React from "react";
import { MdOutlineDelete } from "react-icons/md";

import { useTheme } from "styled-components";
import { TextCaption, TextSmall } from "../Typography/Typography";
import { User } from "src/models/user";
import { OptionItem, UserAvatar } from "./common.styled";
import Checkbox from "../Checkbox";

export const UserListItem: React.FC<{
  user: Partial<User>;
  onSelect: () => void;
  onDeleted?: () => void;
  onDeSelected?: () => void;
  isLast?: boolean;
  showCheckbox?: boolean;
  preSelected?: boolean;
}> = ({
  isLast,
  user,
  onSelect,
  onDeleted,
  showCheckbox,
  onDeSelected,
  preSelected,
}) => {
  const { base, brand } = useTheme();

  return (
    <OptionItem
      last={isLast}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <UserAvatar>{user.name?.[0] ?? "+"}</UserAvatar>
      <div className="item">
        <TextSmall color={base.baseDarker1}>
          {user.id ? user.name ?? user.phone_number : `Add user`}
        </TextSmall>
        <div className="right">
          <TextCaption>{user.phone_number}</TextCaption>
          {showCheckbox && (
            <Checkbox
              val={!!preSelected}
              onChange={(val) => {
                console.log({ val });
                if (val) {
                  onSelect();
                } else {
                  onDeSelected?.();
                }
              }}
            />
          )}
          {onDeleted && (
            <MdOutlineDelete
              size={24}
              onClick={onDeleted}
              color={brand.primary}
            />
          )}
        </div>
      </div>
    </OptionItem>
  );
};
