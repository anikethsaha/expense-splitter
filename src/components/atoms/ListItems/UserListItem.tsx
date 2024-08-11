import React from "react";
import { MdOutlineDelete } from "react-icons/md";

import { useTheme } from "styled-components";
import { TextCaption, TextSmall } from "../Typography/Typography";
import { User } from "src/models/user";
import { OptionItem, UserAvatar } from "./common.styled";
import Checkbox from "../Checkbox";
import { RadioButton } from "../RadioButton/RadioButton";
import { Input, InputProps } from "../Input";

export const UserListItem: React.FC<{
  user: Partial<User>;
  onSelect?: () => void;
  onDeleted?: () => void;
  onDeSelected?: () => void;
  isLast?: boolean;
  showCheckbox?: boolean;
  showRadiobox?: boolean;
  preSelected?: boolean;
  rightInputProps?: InputProps;
}> = ({
  isLast,
  user,
  onSelect,
  onDeleted,
  showCheckbox,
  onDeSelected,
  preSelected,
  showRadiobox,

  rightInputProps,
}) => {
  const { base, brand, gray } = useTheme();

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
        {!!rightInputProps ? (
          <div className="right">
            <Input
              size={"small"}
              style={{
                width: 70,
                background: gray.light,
                color: base.base1,
                border: 0,
              }}
              {...rightInputProps}
            />
          </div>
        ) : (
          <div className="right">
            <TextCaption>{user.phone_number}</TextCaption>
            {showCheckbox && (
              <Checkbox
                val={!!preSelected}
                onChange={(val) => {
                  console.log({ val });
                  if (val) {
                    onSelect?.();
                  } else {
                    onDeSelected?.();
                  }
                }}
              />
            )}
            {showRadiobox && (
              <RadioButton
                preSelected={preSelected}
                onDeSelected={onDeSelected!}
                onSelect={onSelect}
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
        )}
      </div>
    </OptionItem>
  );
};
