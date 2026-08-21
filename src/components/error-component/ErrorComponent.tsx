interface IErrorComponentProps {
  text: string;
}

const ErrorComponent = ({ text }: IErrorComponentProps) => {
  return <div>{text}</div>;
};

export default ErrorComponent;
