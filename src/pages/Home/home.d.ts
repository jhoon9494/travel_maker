export interface IFigures {
  recommend: number;
  revisit: number;
  emotion: number;
}

export interface IPostData {
  idx: string;
  title: string;
  content: string;
  heart: number;
  userId: string;
  figures: IFigures;
  postImg: string;
  hashtags: string[];
}
