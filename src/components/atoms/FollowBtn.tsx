import styled from 'styled-components';
import axios from 'axios';
import { GlobalColor } from 'styles/GlobalColor';
import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from 'react';

interface BtnProps {
  followStatus: boolean;
  userId: string;
  setText?: Dispatch<SetStateAction<string | null>>;
}

function FollowBtn({ followStatus, userId, setText }: BtnProps) {
  const [follow, setFollow] = useState(followStatus);

  useEffect(() => {
    setFollow(followStatus);
  }, [followStatus]);

  const handleFollow = async (event: MouseEvent, id: string) => {
    if (setText) setText(event.currentTarget.textContent);
    try {
      await axios.get(`/api/follow/${id}`);
      setFollow(true);
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleUnFollow = async (event: MouseEvent, id: string) => {
    if (setText) setText(event.currentTarget.textContent);
    try {
      await axios.get(`/api/follow/cancel/${id}`);
      setFollow(false);
    } catch (e: any) {
      console.error(e);
    }
  };
  return (
    <Button onClick={follow ? (e) => handleUnFollow(e, userId) : (e) => handleFollow(e, userId)} status={follow}>
      {follow ? '해제하기' : '팔로우'}
    </Button>
  );
}

export default FollowBtn;

FollowBtn.defaultProps = {
  setText: null,
};

const Button = styled.button<{ status: boolean }>`
  width: 80px;
  height: 40px;
  margin-left: 25px;
  color: white;
  font-size: 18px;
  border-radius: 5px;
  background-color: ${({ status }) => (status ? '#8e8e8e' : GlobalColor.mainColor)};
`;
