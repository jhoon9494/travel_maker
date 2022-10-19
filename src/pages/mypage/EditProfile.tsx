import styled from 'styled-components';
import { FormEventHandler, useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { VscSettingsGear } from 'react-icons/vsc';
import SubmitBtn from 'components/atoms/SubmitBtn';
import { useOutletContext } from 'react-router-dom';
import Input from '../../components/atoms/Input';
import ValidateInput from '../../components/organism/ValidateInput';
import { validatePhone, validateEmail } from '../../utils/validate';
import UserImage from '../../components/atoms/UserImage';

interface UserDataProps {
  user_id: string;
  email: string;
  phone_number: string;
  user_img: string;
}

function EditProfile() {
  const userData = useOutletContext<UserDataProps>();
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [previewImg, setPreviewImg] = useState('');
  const [profileImg, setProfileImg] = useState<File | null>(null);

  useEffect(() => {
    setPhone(userData.phone_number);
    setEmail(userData.email);
    setPreviewImg(userData.user_img);
  }, [userData]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 메모리 누수 방지를 위해 revokeObjectURL 메소드로 url을 무효화 시켜줌
    URL.revokeObjectURL(previewImg);
    // TODO 이미지 추가하지않을경우 null값 전송
    // TODO try catch 사용하여 api 요청한 뒤 결과에 맞게 확인창 팝업시켜주기
    // api 요청이 정상적으로 이루어졌다면 해당 페이지로 리다이렉트
    console.log(profileImg, phone, email, password);
  };

  const loadImg = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files) {
      Array.from(files).forEach((file) => {
        setProfileImg(file);
        setPreviewImg(URL.createObjectURL(file));
      });
    }
  };
  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <UserImage src={previewImg} alt={userData.user_id} name={userData.user_id} />
        <Label htmlFor="imgFile" style={{ cursor: 'pointer' }}>
          <CustomGear />
          <input style={{ display: 'none' }} type="file" id="imgFile" accept="image/*" onChange={loadImg} />
        </Label>
        <ValidateInput
          id="userEmail"
          placeholder="이메일"
          label="이메일"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          validateValue="@포함(이메일 형식)"
          validationCheck={validateEmail(email)}
        />
        <ValidateInput
          id="userPhone"
          placeholder="휴대전화"
          label="휴대전화"
          type="tel"
          value={phone}
          onChange={(e) => {
            // 하이픈 자동입력
            const phoneNumber: string[] = [];
            phoneNumber.push(e.target.value);
            if (e.target.value.length === 3 || e.target.value.length === 8) {
              if (e.target.value.length > phone.length) {
                phoneNumber.push('-');
              }
            }
            setPhone(phoneNumber.join(''));
          }}
          validateValue="(-) 없이"
          validationCheck={validatePhone(phone)}
        />
        <Input
          id="비밀번호"
          placeholder="비밀번호"
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <SubmitBtn value="수정하기" />
      </Form>
    </Wrapper>
  );
}

export default EditProfile;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Form = styled.form<{ onSubmit: FormEventHandler<HTMLFormElement> }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40px 0;

  > img {
    width: 100px;
    height: 100px;
    margin-bottom: 10px;
  }

  > div {
    margin: 10px;
  }

  > button {
    margin-top: 30px;
  }
`;

const Label = styled.label`
  position: relative;
`;

const CustomGear = styled(VscSettingsGear)`
  position: absolute;
  top: -80px;
  right: -50px;
  font-size: 32px;
  transition: all ease 0.5s;

  :hover {
    transform: rotate(90deg);
  }
`;
