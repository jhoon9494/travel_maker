import { IPostData } from 'interface/post';

export function formatPostData(data: IPostData[]): IPostData[] {
  const result = data.map((postData) => ({
    idx: postData.idx,
    postImg: postData.postImg.split(',')[0],
    hashtags: postData.hashtags?.slice(0, 4),
    title: postData.title,
    content: postData.content,
    heart: postData.heart,
    userId: postData.userId,
    figures: postData.figures,
  }));
  return result;
}
