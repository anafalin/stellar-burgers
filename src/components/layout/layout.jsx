import style from './style.module.css';
import { Outlet } from 'react-router-dom';
import AppHeader from '../app-header/AppHeader';

const Layout = () => {
  return (
    <div className={style.app}>
      <AppHeader />
      <main className={style.mainWrapper}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
