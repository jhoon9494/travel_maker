import { IPostData } from 'interface/post';
import { Link } from 'react-router-dom';

// 게시글의 본문 및 해시태그 생성 함수
export function generateContent(content?: string) {
  return content?.split(/(#[^\s#]+)/g).map((str, idx) => {
    if (str[0] === '#') {
      const hashtag = str.split('#')[1];
      return (
        <Link to={`/tag/${hashtag}`} key={`${hashtag}-${idx + 1}`}>
          {str}
        </Link>
      );
    }
    return str;
  });
}

export function generateImgList(data: IPostData) {
  return data.postImg.split(',').filter((src: string) => src.length !== 0);
}
