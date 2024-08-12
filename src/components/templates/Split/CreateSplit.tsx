import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";

import { Navbar } from "src/components/organisms/Navbar";
import styled, { useTheme } from "styled-components";
import { FirstStepSplitCreator } from "./components/Steps/First";
import { useSplitCreatorHelper } from "./hooks/useSplitCreatorHelper";
import Button from "src/components/atoms/Buttons";
import { SecondStepSplitCreator } from "./components/Steps/Second";
import { TextCaption } from "src/components/atoms/Typography/Typography";
import { ThirdStepSplitCreator } from "./components/Steps/Third";
import { CustomLayout } from "src/components/organisms/Layout";
import { Provider } from "react-redux";
import { store } from "src/stores/redux.store";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  width: 100%;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  justify-content: flex-end;
  padding: 12px;
  box-sizing: border-box;
`;

const RightElement = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: end;
  justify-content: center;
  width: 100%;
  position: relative;
  flex: 1;
`;

export const CreateSplit = () => {
  const errorCb = useCallback((err: string) => {
    toast.error(err);
  }, []);

  const {
    unFinishedStep,
    totalMembers,
    goNext,
    paidBy,
    amount,
    validateAndCreateSplit,
  } = useSplitCreatorHelper(errorCb);
  const router = useRouter();

  const { brand } = useTheme();
  const onBack = () => {
    router.back();
  };

  const onNext = () => {
    if (unFinishedStep === 3) {
      validateAndCreateSplit().then((res) => {
        if (res) {
          toast.success("Expense created successfully");
          setTimeout(() => {
            router.replace("/");
          }, 200);
        }
      });
    }

    goNext(unFinishedStep);
  };

  return (
    <Container>
      <Navbar progress={unFinishedStep * 33} hideActions onBack={onBack} />
      <Body>
        {unFinishedStep === 1 && <FirstStepSplitCreator />}

        {unFinishedStep === 2 && <SecondStepSplitCreator />}
        {unFinishedStep === 3 && <ThirdStepSplitCreator />}
      </Body>

      <Footer>
        <Button
          onClick={onNext}
          text={unFinishedStep === 3 ? "Create Expense" : "Next"}
          rightText={
            unFinishedStep === 1 ? `${totalMembers} members` : undefined
          }
          rightElement={
            unFinishedStep >= 2 ? (
              <RightElement>
                {paidBy && (
                  <>
                    <TextCaption>
                      Paid By{" "}
                      <strong
                        style={{ fontWeight: 800, color: brand.alternative }}
                      >
                        {paidBy.name ?? paidBy.phone_number}
                      </strong>
                    </TextCaption>
                  </>
                )}
                {amount && (
                  <>
                    <TextCaption>
                      Total:{" "}
                      <strong
                        style={{ fontWeight: 800, color: brand.alternative }}
                      >
                        {amount}
                      </strong>
                    </TextCaption>
                  </>
                )}
              </RightElement>
            ) : undefined
          }
          style={{ borderRadius: 12 }}
        />
      </Footer>
    </Container>
  );
};

export const CreateSplitScreen = () => {
  return (
    <CustomLayout>
      <Provider store={store}>
        <CreateSplit />
      </Provider>
    </CustomLayout>
  );
};
