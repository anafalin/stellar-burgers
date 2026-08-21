import style from './style.module.css';

interface ILoadingComponentProps {
  text: string;
}

const LoadingComponent = ({ text }: ILoadingComponentProps) => {
  return (
    <div className={style.orderWrapper}>
      <div className={style.spinnerWrapper}>
        <div className={style.spinner}></div>
        <p className={style.loadingText}>{text}</p>
      </div>
    </div>
  );
};

export default LoadingComponent;