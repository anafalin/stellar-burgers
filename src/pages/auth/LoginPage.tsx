import Form from '../../components/form/Form';
import {
  Button,
  EmailInput,
  PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfilePrompt from '../../components/profile-prompt/ProfilePrompt';
import FormContainer from '../../components/form/FormContainer';
import ProfilePromptContainer from '../../components/profile-prompt/ProfilePromptContainer';
import { useAuth } from '../../utils/auth';

const LoginPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // хуки для авторизации и навигации
  const { signIn, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Откуда пришел пользователь (чтобы вернуть его обратно)
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await signIn({ email, password });
      navigate(from, { replace: true }); // Перенаправляем на страницу, откуда пришли
    } catch (err) {
      console.error('Ошибка входа:', err);
    }
  };

  return (
    <FormContainer>
      <Form title={'Вход'} onSubmit={handleSubmit}>
        {error && (
          <p style={{ color: 'red', textAlign: 'center', marginBottom: '16px' }}>{error}</p>
        )}

        <EmailInput
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          name={'email'}
          isIcon={false}
          required
        />

        <PasswordInput
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          name={'password'}
          extraClass="mb-2"
          required
        />

        <Button htmlType="submit" type="primary" size="medium" disabled={loading}>
          {loading ? 'Загрузка...' : 'Войти'}
        </Button>
      </Form>

      <ProfilePromptContainer>
        <ProfilePrompt
          text={'Вы — новый пользователь?'}
          linkTo={'/register'}
          linkText={'Зарегистрироваться'}
        />
        <ProfilePrompt
          text={'Забыли пароль?'}
          linkTo={'/forgot-password'}
          linkText={'Восстановить пароль'}
        />
      </ProfilePromptContainer>
    </FormContainer>
  );
};

export default LoginPage;
