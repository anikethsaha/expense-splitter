import React from "react";
import { HiOutlineUserGroup } from "react-icons/hi";
import { MdOutlineDelete } from "react-icons/md";
import { CgRadioCheck } from "react-icons/cg";

import { useTheme } from "styled-components";
import { TextCaption, TextSmall } from "../Typography/Typography";
import { PiRadioButtonDuotone } from "react-icons/pi";

import { OptionItem, UserAvatar } from "./common.styled";
import { Group } from "src/models/Group";
import { RadioButton } from "../RadioButton/RadioButton";

export const GroupListItem: React.FC<{
  group: Partial<Group>;
  onSelect?: () => void;
  onDeSelected?: () => void;
  onDeleted?: () => void;
  isLast?: boolean;
  showRadioButton?: boolean;
  preSelected?: boolean;
  onClick?: () => void;
}> = ({
  isLast,
  group,
  onSelect,
  onDeleted,
  onDeSelected,
  showRadioButton,
  preSelected,
  onClick,
}) => {
  const { base, brand } = useTheme();

  return (
    <OptionItem
      key={group.id}
      last={isLast}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
    >
      <HiOutlineUserGroup size={24} color={base.base2} />

      <div className="item">
        <TextSmall color={base.baseDarker1}>{group.name}</TextSmall>
        <div className="right">
          <TextCaption>{group.user_ids?.length ?? 0} Members</TextCaption>
          {showRadioButton && (
            <RadioButton
              preSelected={preSelected}
              onDeSelected={onDeSelected!}
              onSelect={onSelect!}
            />
          )}
          {onDeleted && <MdOutlineDelete size={24} color={brand.primary} />}
        </div>
      </div>
    </OptionItem>
  );
};
