import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { GroupListItem } from "src/components/atoms/ListItems/GroupListItem";
import { useGroup } from "src/hooks/useGroup";
import { Group } from "src/models/Group";
import { styled, useTheme } from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
  height: 100%;
  position: relative;
  width: 100%;
  padding: 4px;
`;

export const GroupList = () => {
  const router = useRouter();
  const errorCb = useCallback((err?: string) => {
    toast.error(err);
  }, []);
  const { getGroupList, loading } = useGroup(false, errorCb);
  const [groups, setGroups] = React.useState<Group[]>([]);

  useEffect(() => {
    getGroupList().then((response) => {
      if (response) {
        setGroups([...response]);
      }
    });
  }, []);
  console.log({ groups });

  return (
    <Container>
      {groups.map((group) => (
        <GroupListItem
          isLast
          key={group.id}
          group={group}
          onClick={() => {
            router.push(`/groups/${group.id}`);
          }}
        />
      ))}
    </Container>
  );
};
