import Form from '../../components/form/Form';
import { Button, EmailInput } from '@ya.praktikum/react-developer-burger-ui-components';
import { useState } from 'react';
import ProfilePromptContainer from '../../components/profile-prompt/ProfilePromptContainer';
import ProfilePrompt from '../../components/profile-prompt/ProfilePrompt';
import FormContainer from '../../components/form/FormContainer';
import { useAuth } from '../../utils/auth';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState<string>('');

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
    } catch (err) {
      console.error('Ошибка:', err);
    }
  };

  return (
    <FormContainer>
      <Form title={'Восстановление пароля'} onSubmit={handleSubmit}>
        <EmailInput
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          name={'Укажите e-mail'}
          isIcon={false}
        />
        <Button htmlType="submit" type="primary" size="medium">
          Восстановить
        </Button>
      </Form>

      <ProfilePromptContainer>
        <ProfilePrompt text={'Вспомнили пароль?'} linkTo={'/login'} linkText={'Войти'} />
      </ProfilePromptContainer>
    </FormContainer>
  );
};

export default ForgotPasswordPage;
