import style from './style.module.css';
import { Link } from 'react-router-dom';

const ProfilePrompt = ({ text, linkTo = null, linkText = null }) => {
  return (
    <div className={style.prompt}>
      {text}&nbsp;
      {linkTo &&
        linkText && (
          <Link to={linkTo} className={style.link}>
            {linkText}
          </Link>
        )}
    </div>
  );
};

export default ProfilePrompt;
