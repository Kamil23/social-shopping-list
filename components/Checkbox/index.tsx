import styles from "./checkbox.module.css";

const Checkbox = ({
  isChecked = false,
  isDisabled,
  id,
  onChange,
}: {
  isChecked: boolean;
  isDisabled: boolean;
  id?: string;
  onChange?: () => void;
}) => (
  <div className={styles.round}>
    <input
      type="checkbox"
      checked={isChecked}
      id={id}
      disabled={isDisabled}
      onChange={onChange}
    />
    <label htmlFor={id}></label>
  </div>
);

export default Checkbox;
