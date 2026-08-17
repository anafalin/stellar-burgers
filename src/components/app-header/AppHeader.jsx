import { BurgerIcon, ListIcon, Logo, ProfileIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import style from './style.module.css';

const AppHeader = () => {
  return (
    <header className={style.header}>
      <div className={style.wrapperNav}>
        <nav>
          <div className={style.leftNav}>
            <a className={style.wrapperLink} href="#">
              <BurgerIcon type="primary" />
              <p>Конструктор</p>
            </a>
            <a className={`${style.wrapperLink} ${style.inactive}`} href="#">
              <ListIcon type="secondary" />
              <p>Лента заказов</p>
            </a>
          </div>
        </nav>

        <a className={style.wrapperLogo} href="#">
          <Logo />
        </a>

        <nav>
          <div className={style.rightNav}>
            <a className={`${style.wrapperLink} ${style.inactive}`} href="#">
              <ProfileIcon type="secondary" />
              <p>Личный кабинет</p>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;
