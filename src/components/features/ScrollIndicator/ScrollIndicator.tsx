import Styles from "./ScrollIndicator.module.scss";

interface Props {}

const ScrollIndicator: React.FC<Props> = (props: Props) => {
  return (
    <div className={Styles.container}>
      <div className={Styles.bar}></div>
    </div>
  );
};

export default ScrollIndicator;
