import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

export interface IInitValue {
  [key: string]: any;
}

type returnType = [IInitValue, (e: ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<IInitValue>>];

export default function useInput(initValue: IInitValue): returnType {
  const [value, setValue] = useState(initValue);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  return [value, onChange, setValue];
}
