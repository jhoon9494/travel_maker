import { ChangeEventHandler, Dispatch, MouseEventHandler, SetStateAction } from 'react';
import { ITravelTips } from './post.d';

export interface IHeartBtn {
  heart: number;
  getData: () => void;
}

export interface IAlert {
  text: string;
  open: Dispatch<SetStateAction<boolean>>;
}

export interface IConfirm extends IAlert {
  setResult: Dispatch<SetStateAction<boolean>>;
  yes: string;
  no: string;
}

export interface IClick {
  onClick: () => void;
}

export interface ICard extends ITravelTips {
  setPlace: Dispatch<SetStateAction<string>>;
}

export interface IFollowBtn {
  followStatus: boolean;
  userId: string;
  setText?: Dispatch<SetStateAction<string | null>>;
}

export interface IImgIndicator {
  count: number;
  selectedIndex: number;
}

export interface IInput {
  id: string;
  placeholder?: string;
  type: string;
  label?: string;
  size?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export interface ILazyImg {
  src: string;
  alt: string;
  onClick?: MouseEventHandler<HTMLImageElement>;
}

export interface IScoreBox {
  title: string;
  score: number;
}

export interface IScoreInput {
  id: string;
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
  text: string;
}

export interface IUserImg {
  src: string | undefined;
  alt: string;
  name?: string;
}

export interface ICheckBox {
  text: string;
  check: boolean;
}
