import style from './style.module.css';

const ProfilePromptContainer = ({ children }) => {
  return <div className={style.promptContainer}>{children}</div>;
};

export default ProfilePromptContainer;
