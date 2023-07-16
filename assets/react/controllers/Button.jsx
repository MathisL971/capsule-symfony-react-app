import React from "react";

const Button = ({ text, styles, onSubmit, type }) => {
  return (
    <button type={type} className={styles} onSubmit={onSubmit}>
      {text}
    </button>
  );
};

export default Button;
