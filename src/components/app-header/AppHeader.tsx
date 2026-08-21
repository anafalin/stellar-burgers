import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import style from './style.module.css';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../utils/auth';

const AppHeader = () => {
  const { user } = useAuth();

  return (
    <header className={style.header}>
      <div className={style.wrapperNav}>
        <nav>
          <div className={style.leftNav}>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? style.activeWrapperLink : style.wrapperLink)}
            >
              {({ isActive }) => (
                <>
                  <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                  <p>Конструктор</p>
                </>
              )}
            </NavLink>

            <NavLink
              to="/ordres"
              className={({ isActive }) => (isActive ? style.activeWrapperLink : style.wrapperLink)}
            >
              {({ isActive }) => (
                <>
                  <ListIcon type={isActive ? 'primary' : 'secondary'} />
                  <p>Лента заказов</p>
                </>
              )}
            </NavLink>
          </div>
        </nav>

        <p className={style.wrapperLogo}>
          <Logo />
        </p>

        <nav>
          <div className={style.rightNav}>
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? style.activeWrapperLink : style.wrapperLink)}
            >
              {({ isActive }) => (
                <>
                  <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
                  {user !== null ? <p>{user.name}</p> : <p>Личный кабинет</p>}
                </>
              )}
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;
