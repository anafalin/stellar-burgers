import Form from '../../components/form/Form';
import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';
import FormContainer from '../../components/form/FormContainer';
import ProfilePromptContainer from '../../components/profile-prompt/ProfilePromptContainer';
import ProfilePrompt from '../../components/profile-prompt/ProfilePrompt';
import { useAuth } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { IUser } from '../../utils/types';

const RegisterPage = () => {
  const [user, setUser] = useState<IUser>({
    name: '',
    email: '',
    password: '',
  });

  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await register(user);
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Ошибка регистрации:', err);
    }
  };

  const handleChange = (e: any) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <FormContainer>
      <Form title={'Регистрация'} onSubmit={handleSubmit}>
        {error && (
          <p style={{ color: 'red', textAlign: 'center', marginBottom: '16px' }}>{error}</p>
        )}
        <Input
          type={'text'}
          placeholder={'Имя'}
          onChange={(e) => handleChange(e)}
          value={user.name}
          name={'name'}
          error={false}
          errorText={'Ошибка'}
          size={'default'}
          extraClass="ml-1"
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
        <EmailInput
          onChange={(e) => handleChange(e)}
          value={user.email}
          name={'email'}
          isIcon={false}
        />
        <PasswordInput
          onChange={(e) => handleChange(e)}
          value={user.password}
          name={'password'}
          extraClass="mb-2"
        />
        <Button htmlType="submit" type="primary" size="medium" disabled={loading}>
          {loading ? 'Загрузка...' : 'Зарегистрироваться'}
        </Button>
      </Form>

      <ProfilePromptContainer>
        <ProfilePrompt text={'Уже зарегистрированы?'} linkTo={'/login'} linkText={'Войти'} />
      </ProfilePromptContainer>
    </FormContainer>
  );
};

export default RegisterPage;
