import React from "react";
import { Sheet } from "react-modal-sheet";

type SheetProps = {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  rootId?: string;
  mountPoint?: Element;
  snapPoints?: number[];
};

export const BottomSheet: React.FC<SheetProps> = (props) => {
  return (
    <Sheet {...(props as SheetProps)}>
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>{props.children}</Sheet.Content>
      </Sheet.Container>

      <Sheet.Backdrop />
    </Sheet>
  );
};
