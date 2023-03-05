export interface IUserData {
  userId: string;
  profileImg: string;
}

export interface IFollow extends IUserData {
  followStatus: boolean;
}
