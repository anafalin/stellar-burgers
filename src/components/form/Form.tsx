import style from './style.module.css';
import React from 'react';

interface FormProps {
  title: string;
  children?: React.ReactNode[];
  onSubmit?: (e: any) => Promise<void>;
}

const Form = ({ title, children, onSubmit }: FormProps) => {
  return (
    <form className={style.formWrapper} onSubmit={onSubmit}>
      <p className={style.title}>{title}</p>
      {children}
    </form>
  );
};

export default Form;
