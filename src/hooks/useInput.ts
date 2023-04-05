import { ChangeEvent, useState } from 'react';

interface IInitValue {
  [key: string]: any;
}

type returnType = [IInitValue, (e: ChangeEvent<HTMLInputElement>) => void];

export default function useInput(initValue: IInitValue): returnType {
  const [value, setValue] = useState(initValue);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  return [value, onChange];
}
