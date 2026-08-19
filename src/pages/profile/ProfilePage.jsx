import style from './style.module.css';
import {
  EmailInput,
  Input,
  PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';
import ProfilePrompt from '../../components/profile-prompt/ProfilePromt';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/auth';
import { useState } from 'react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [updUser, setUser] = useState({
    name: user.name,
    email: user.email,
    password: '',
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogout = async (e) => {
    e.preventDefault(); // Предотвращаем переход по ссылке
    try {
      await signOut();
      navigate('/login'); // Переадресация на страницу входа
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  return (
    <div className={style.profile}>
      <div className={style.col1}>
        <ul className={style.nav}>
          <li>
            <NavLink
              to={'/profile'}
              className={({ isActive }) => (isActive ? style.activeNavLink : style.navLink)}
            >
              Профиль
            </NavLink>
          </li>
          <li>
            <NavLink
              to={'/profile/orders'}
              className={({ isActive }) => (isActive ? style.activeNavLink : style.navLink)}
            >
              История заказов
            </NavLink>
          </li>
          <li>
            <NavLink className={style.navLink} onClick={handleLogout}>
              Выход
            </NavLink>
          </li>
        </ul>

        <ProfilePrompt text={'В этом разделе вы можете изменить свои персональные данные'} />
      </div>

      <div className={style.col2}>
        <Input
          type={'text'}
          placeholder={'Имя'}
          onChange={(e) => handleChange(e)}
          value={updUser.name}
          name={'name'}
          icon={'EditIcon'}
          error={false}
          errorText={'Ошибка'}
          size={'default'}
          extraClass="ml-1"
        />
        <EmailInput
          onChange={(e) => handleChange(e)}
          value={updUser.email}
          name={'email'}
          isIcon={true}
        />
        <PasswordInput
          onChange={(e) => handleChange(e)}
          value={updUser.password}
          name={'password'}
          extraClass="mb-2"
          icon={'EditIcon'}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
