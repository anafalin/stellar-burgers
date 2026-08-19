import Form from '../../components/form/Form';
import { Button, Input, PasswordInput } from '@ya.praktikum/react-developer-burger-ui-components';
import { useState } from 'react';
import ProfilePromptContainer from '../../components/profile-prompt/ProfilePromptContainer';
import ProfilePrompt from '../../components/profile-prompt/ProfilePrompt';
import FormContainer from '../../components/form/FormContainer';
import { useAuth } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await resetPassword({ password: password, token: token });
      navigate('/login');
    } catch (err) {
      console.error('Ошибка:', err);
    }
  };

  return (
    <FormContainer>
      <Form title={'Восстановление пароля'} onSubmit={handleSubmit}>
        <PasswordInput
          placeholder={'Введите новый пароль'}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          name={'password'}
          extraClass="mb-2"
        />
        <Input
          type={'text'}
          placeholder={'Введите код из письма'}
          onChange={(e) => setToken(e.target.value)}
          value={token}
          name={'token'}
          error={false}
          errorText={'Ошибка'}
          size={'default'}
          extraClass="ml-1"
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
        <Button htmlType="submit" type="primary" size="medium">
          Сохранить
        </Button>
      </Form>

      <ProfilePromptContainer>
        <ProfilePrompt text={'Вспомнили пароль?'} linkTo={'/login'} linkText={'Войти'} />
      </ProfilePromptContainer>
    </FormContainer>
  );
};

export default ResetPasswordPage;
