import styled from 'styled-components';
import { FormEventHandler, useState, FormEvent, ChangeEvent, useEffect, useCallback } from 'react';
import { VscSettingsGear } from 'react-icons/vsc';
import SubmitBtn from 'components/atoms/SubmitBtn';
import Loading from 'components/atoms/Loading';
import Alert from 'components/atoms/Alert';
import resizeFn from 'utils/imageResize';
import useAuth from 'hooks/useAuth';
import useInput, { IInitValue } from 'hooks/useInput';
import { editProfile, getProfileData } from 'api/user';
import Input from '../../components/atoms/Input';
import ValidateInput from '../../components/organism/ValidateInput';
import { validatePhone, validateEmail } from '../../utils/validate';
import UserImage from '../../components/atoms/UserImage';
import Confirm from '../../components/atoms/Confirm';

function setFormData(id: string, profileData: IInitValue, profileImg: File | null) {
  const DEFAULT_PROFILE_URL = '/icons/default_profile.svg';
  const formData = new FormData();
  const userData = new Blob(
    [
      JSON.stringify({
        id,
        email: profileData.email,
        phoneNumber: profileData.phone,
        password: profileData.password,
      }),
    ],
    { type: 'application/json' },
  );

  formData.append('user', userData);
  if (profileData.previewImg === DEFAULT_PROFILE_URL) {
    // 프로필 이미지가 기본 이미지 그대로인 경우
    formData.append('profileImg', DEFAULT_PROFILE_URL);
  } else {
    // 프로필 이미지, 회원 정보 모두 수정 or 프로필 이미지 (기본 이미지 X) 변경 X + 회원 정보만 수정
    formData.append('profileImg', profileImg || '');
  }

  return formData;
}

function EditProfile() {
  const [profileData, onChange, setProfileData] = useInput({ phone: '', email: '', password: '', previewImg: '' });
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useAuth();

  // Confirm, Alert
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmResult, setConfirmResult] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState('');

  const getUserData = useCallback(async () => {
    try {
      const { data } = await getProfileData(state.id);
      setProfileData((prevData) => ({
        ...prevData,
        phone: data.phoneNumber,
        email: data.email,
        previewImg: data.profileImg,
        password: '',
      }));
    } catch (e: any) {
      console.error(e);
      throw new Error(e);
    }
  }, [state.id, setProfileData]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // 메모리 누수 방지를 위해 revokeObjectURL 메소드로 url을 무효화 시켜줌
    URL.revokeObjectURL(profileData.previewImg);
    const formData = setFormData(state.id, profileData, profileImg);

    try {
      await editProfile(formData);
      getUserData();
    } catch (error: any) {
      if (error.response.data.status === 401) {
        setAlertText('비밀번호가 일치하지 않습니다.');
        setAlertOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadImg = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;

      if (files) {
        if (files[0].size / 1024 / 1024 <= 1) {
          setProfileImg(files[0]);
          setProfileData((prevData) => ({
            ...prevData,
            previewImg: URL.createObjectURL(files[0]),
          }));
        } else {
          resizeFn(files[0]).then((file) => {
            setProfileImg(file);
            setProfileData((prevData) => ({
              ...prevData,
              previewImg: URL.createObjectURL(file),
            }));
          });
        }
      }
    },
    [setProfileData],
  );

  useEffect(() => {
    // 프로필사진 기본 이미지로 변경
    if (confirmResult) {
      setProfileData((prevData) => ({
        ...prevData,
        previewImg: '/icons/default_profile.svg',
      }));
      setProfileImg(null);
      setConfirmOpen(false);
    }
  }, [confirmResult, setProfileData]);

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <UserImage
          src={profileData.previewImg}
          alt={state.id ? state.id : '유저 이미지'}
          name={state.id ? state.id : '유저 id'}
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
          name="email"
          placeholder="이메일"
          label="이메일"
          type="email"
          value={profileData.email}
          onChange={onChange}
          validateValue="@포함(이메일 형식)"
          validationCheck={validateEmail(profileData.email)}
        />
        <ValidateInput
          id="userPhone"
          name="phone"
          placeholder="휴대전화"
          label="휴대전화"
          type="tel"
          value={profileData.phone}
          onChange={onChange}
          validateValue="(-) 포함"
          validationCheck={validatePhone(profileData.phone)}
        />
        <Input
          id="비밀번호"
          name="password"
          placeholder="비밀번호"
          label="비밀번호"
          type="password"
          value={profileData.password}
          onChange={onChange}
        />
        {isLoading ? (
          <LoadingWrapper>
            <Loading />
          </LoadingWrapper>
        ) : (
          <SubmitBtn value="수정하기" isDisabled={!profileData.password} />
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
