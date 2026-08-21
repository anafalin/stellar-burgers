import style from './style.module.css';
import { ReactNode } from 'react';

interface IProfilePromptContainerProps {
  children: ReactNode[] | ReactNode;
}
const ProfilePromptContainer = ({ children }: IProfilePromptContainerProps) => {
  return <div className={style.promptContainer}>{children}</div>;
};

export default ProfilePromptContainer;
