import style from './style.module.css';

const FormContainer = ({ children }) => {
  return <div className={style.formContainer}>{children}</div>;
};

export default FormContainer;
