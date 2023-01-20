import styled from 'styled-components';
import { FormEventHandler, useState, FormEvent, ChangeEvent, useEffect, useContext, useCallback } from 'react';
import { VscSettingsGear } from 'react-icons/vsc';
import SubmitBtn from 'components/atoms/SubmitBtn';
import userContext from 'context/userContext';
import axios from 'axios';
import Loading from 'components/atoms/Loading';
import Alert from 'components/atoms/Alert';
import resizeFn from 'utils/imageResize';
import Input from '../../components/atoms/Input';
import ValidateInput from '../../components/organism/ValidateInput';
import { validatePhone, validateEmail } from '../../utils/validate';
import UserImage from '../../components/atoms/UserImage';
import Confirm from '../../components/atoms/Confirm';

function EditProfile() {
  const DEFAULT_PROFILE_URL = '/icons/default_profile.svg';

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [previewImg, setPreviewImg] = useState('');
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Confirm, Alert
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmResult, setConfirmResult] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState('');

  const loggedUser = useContext(userContext);

  const getUserData = useCallback(async () => {
    try {
      if (loggedUser.id) {
        const res = await axios.get(`/api/info/${loggedUser.id}`);
        setPhone(res.data.phoneNumber);
        setEmail(res.data.email);
        setPreviewImg(res.data.profileImg);
      }
    } catch (e: any) {
      console.error(e);
    }
  }, [loggedUser.id]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // 메모리 누수 방지를 위해 revokeObjectURL 메소드로 url을 무효화 시켜줌
    URL.revokeObjectURL(previewImg);

    const formData = new FormData();
    const userData = new Blob(
      [
        JSON.stringify({
          id: loggedUser.id,
          email,
          phoneNumber: phone,
          password,
        }),
      ],
      { type: 'application/json' },
    );

    formData.append('user', userData);
    if (previewImg === DEFAULT_PROFILE_URL) {
      // 프로필 이미지가 기본 이미지 그대로인 경우
      formData.append('profileImg', DEFAULT_PROFILE_URL);
    } else {
      // 프로필 이미지, 회원 정보 모두 수정 or 프로필 이미지 (기본 이미지 X) 변경 X + 회원 정보만 수정
      formData.append('profileImg', profileImg || '');
    }
    try {
      const res = await axios.post('/api/user', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data === 'OK') {
        getUserData();
        setPassword('');
        setIsLoading(false);
      }
    } catch (error: any) {
      if (error.response.data.status === 401) {
        setAlertText('비밀번호가 일치하지 않습니다.');
        setAlertOpen(true);
      }
      setIsLoading(false);
    }
  };

  const loadImg = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files) {
      resizeFn(files[0]).then((file) => {
        setProfileImg(file);
        setPreviewImg(URL.createObjectURL(file));
      });
    }
  };

  useEffect(() => {
    if (confirmResult) {
      setPreviewImg('/icons/default_profile.svg');
      setProfileImg(null);
      setConfirmOpen(false);
    }
  }, [confirmResult]);

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <UserImage
          src={previewImg}
          alt={loggedUser.id ? loggedUser.id : '유저 이미지'}
          name={loggedUser.id ? loggedUser.id : '유저 id'}
        />
        <ImgDeleteBtn type="button" onClick={() => setConfirmOpen(true)}>
          프로필 이미지 삭제
        </ImgDeleteBtn>
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
        {isLoading ? (
          <LoadingWrapper>
            <Loading />
          </LoadingWrapper>
        ) : (
          <SubmitBtn value="수정하기" />
        )}
      </Form>
      {confirmOpen && (
        <Confirm
          text="이미지를 삭제하시겠습니까?"
          open={setConfirmOpen}
          setResult={setConfirmResult}
          yes="삭제하기"
          no="취소"
        />
      )}
      {alertOpen && <Alert text={alertText} open={setAlertOpen} />}
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
`;

const Label = styled.label`
  position: relative;
`;

const CustomGear = styled(VscSettingsGear)`
  position: absolute;
  top: -95px;
  right: -60px;
  font-size: 32px;
  color: gray;
  transition: all ease 0.5s;

  :hover {
    transform: rotate(90deg);
  }
`;

const ImgDeleteBtn = styled.button`
  color: #4dabf7;
`;

const LoadingWrapper = styled.div`
  > div {
    margin-top: 20px;
    > span {
      display: none;
    }
  }
`;
