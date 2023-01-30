import styled from 'styled-components';
import axios from 'axios';
import { GlobalColor } from 'styles/GlobalColor';
import { useState } from 'react';

interface BtnProps {
  followStatus: boolean;
  userId: string;
}

function FollowBtn({ followStatus, userId }: BtnProps) {
  const [followState, setFollowState] = useState(followStatus);

  const handleFollow = async (id: string) => {
    try {
      await axios.get(`/api/follow/${id}`);
      setFollowState(true);
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleUnFollow = async (id: string) => {
    try {
      await axios.get(`/api/follow/cancel/${id}`);
      setFollowState(false);
    } catch (e: any) {
      console.error(e);
    }
  };
  return (
    <Button onClick={followState ? () => handleUnFollow(userId) : () => handleFollow(userId)} status={followState}>
      {followState ? '해제하기' : '팔로우'}
    </Button>
  );
}

export default FollowBtn;

const Button = styled.button<{ status: boolean }>`
  width: 80px;
  height: 40px;
  margin-left: 25px;
  color: white;
  font-size: 18px;
  border-radius: 5px;
  background-color: ${({ status }) => (status ? '#8e8e8e' : GlobalColor.mainColor)};
`;
