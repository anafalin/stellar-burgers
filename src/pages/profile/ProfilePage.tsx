import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/auth';
import { FormEvent } from 'react';
import ProfilePrompt from '../../components/profile-prompt/ProfilePrompt';
import style from './style.module.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async (e: FormEvent<HTMLAnchorElement>): Promise<void> => {
    e.preventDefault();
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  return (
    <div className={style.profile}>
      <div className={style.col1}>
        <ul className={style.nav}>
          <li>
            <NavLink to={'/profile'} end className={({ isActive }) => (isActive ? style.activeNavLink : style.navLink)}>
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
            <NavLink to={'/logout'} className={style.navLink} onClick={handleLogout}>
              Выход
            </NavLink>
          </li>
        </ul>

        <ProfilePrompt text={'В этом разделе вы можете изменить свои персональные данные'} />
      </div>

      <div className={style.col2}>
        <Outlet />
      </div>
    </div>
  );
};

export default ProfilePage;
