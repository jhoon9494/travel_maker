import { Dispatch, SetStateAction } from 'react';
import { IInput } from './atoms.d';
import { IPreviewImg, ITravelTips } from './post.d';

export interface ICardList {
  list: ITravelTips[];
  setList: Dispatch<SetStateAction<ITravelTips[]>>;
}

export interface IImgPreviewList {
  selectImg: Dispatch<SetStateAction<IPreviewImg | null>>;
  setImgFiles: Dispatch<SetStateAction<File[]>>;
  previewImgs: IPreviewImg[];
  setPreviewImgs: Dispatch<SetStateAction<IPreviewImg[]>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export interface IPostBox {
  isRef?: boolean;
  setPageCount?: Dispatch<SetStateAction<number>>;
  id: string;
  img: string;
  edit?: boolean;
  setDeleteIndex?: Dispatch<SetStateAction<string>>;
}

export interface ISideBar {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export interface IValidateInput extends IInput {
  placeholder?: string;
  validateValue: string;
  validationCheck: boolean;
}
