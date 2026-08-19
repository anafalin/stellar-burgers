import style from './style.module.css';
import { Link } from 'react-router-dom';

interface IProfilePromptProp {
  text: string;
  linkTo?: string | null;
  linkText?: string | null;
}

const ProfilePrompt = (props: IProfilePromptProp) => {
  const { text, linkTo, linkText } = props;
  return (
    <div className={style.prompt}>
      {text}&nbsp;
      {linkTo && linkText && (
        <Link to={linkTo} className={style.link}>
          {linkText}
        </Link>
      )}
    </div>
  );
};

export default ProfilePrompt;
