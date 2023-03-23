export interface ITravelTips {
  placeName: string;
  tips: string;
}

export interface IFigures {
  recommend: number;
  emotion: number;
  revisit: number;
}

export interface IPostData {
  idx: string;
  postImg: string;
  recommendRoutes?: ITravelTips[];
  hashtags?: string[];
  title: string;
  content: string;
  figures: IFigures;
  heart: number;
  userId: string;
}

export interface IPreviewImg {
  src: string;
  alt: string;
}

export interface IPostImg {
  idx: string;
  postImg: string;
}
