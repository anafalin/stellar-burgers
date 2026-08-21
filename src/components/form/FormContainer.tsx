import style from './style.module.css';
import { ReactNode } from 'react';

interface IFormContainerProps {
  children: ReactNode[];
}
const FormContainer = ({ children }: IFormContainerProps) => {
  return <div className={style.formContainer}>{children}</div>;
};

export default FormContainer;
