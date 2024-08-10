import React, { use, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { styled } from "styled-components";
import { FriendSplitListItem } from "../Split/FriendSplitListItem";
import { useFriend } from "src/hooks/useFriend";
import { Friend } from "src/models/Friend";
import { FullSectionShimmer } from "src/components/atoms/Shimmer/FullScreen";
import { BaseScreenPadding } from "src/components/atoms/Common/Padding";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  box-sizing: border-box;
`;

export const FriendSplitList = () => {
  const [friends, setFriends] = React.useState<Friend[]>([]);
  const { loading, getFriendList } = useFriend(true, (err) => {
    toast.error(err);
  });

  useEffect(() => {
    getFriendList().then((friends) => {
      if (friends) setFriends([...friends]);
    });
  }, []);

  if (loading)
    return (
      <BaseScreenPadding
        style={{
          height: "70%",
          width: "100%",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <FullSectionShimmer />
      </BaseScreenPadding>
    );

  return (
    <Container>
      {friends.map((friend) => {
        return <FriendSplitListItem key={friend.id} friend={friend} />;
      })}
      <Toaster />
    </Container>
  );
};
