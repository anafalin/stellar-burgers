import style from './style.module.css';

const Form = ({title, children, onSubmit }) => {
  return (
    <form className={style.formWrapper} onSubmit={onSubmit}>
      <p className={style.title}>{title}</p>
      {children}
    </form>
  )
};

export default Form;