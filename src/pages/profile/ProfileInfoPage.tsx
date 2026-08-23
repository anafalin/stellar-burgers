import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { EmailInput, Input, PasswordInput, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { useAuth } from '../../utils/auth';
import { IUser } from '../../utils/types';
import style from './style.module.css';

interface UpdateUserForm extends IUser {
  password: string;
}

type InputChangeEvent = ChangeEvent<HTMLInputElement>;

const ProfileInfoPage = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateUserForm>({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });
  const [isDirty, setIsDirty] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
      });
    }
  }, [user]);

  const handleChange = (e: InputChangeEvent): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsDirty(true);
    setSuccessMessage('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');

    try {
      const updateData: Partial<IUser> = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await updateUser(updateData);
      setIsDirty(false);
      setSuccessMessage('Данные успешно обновлены!');

      // Очищаем поле пароля после успешного обновления
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      setSuccessMessage('Ошибка при обновлении данных');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = (): void => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      password: '',
    });
    setIsDirty(false);
    setSuccessMessage('');
  };

  return (
    <form className={style.profileForm} onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Имя"
        name="name"
        value={formData.name}
        onChange={handleChange}
        icon="EditIcon"
        size="default"
        extraClass="mb-6"
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />

      <EmailInput name="email" value={formData.email} onChange={handleChange} isIcon={true} extraClass="mb-6" />

      <PasswordInput
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Пароль"
        icon="EditIcon"
        extraClass="mb-6"
      />

      {successMessage && <p className={`${style.message} ${style.success}`}>{successMessage}</p>}

      {isDirty && (
        <div className={style.buttons}>
          <Button htmlType="button" size="medium" onClick={handleCancel} extraClass="mr-2">
            Отмена
          </Button>
          <Button htmlType="submit" size="medium" disabled={isLoading}>
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      )}
    </form>
  );
};

export default ProfileInfoPage;
