import React from "react";

const Button = ({ id, text, type, style, onClick }) => {
  let styles = "";

  switch (style) {
    case "primary_1":
      styles =
        "hidden lg:flex text-white border-2 my-auto border-white hover:bg-teal-800 focus:ring-2 focus:outline-none focus:ring-teal-300 font-bold rounded-lg text-sm px-4 py-2.5 text-center dark:hover:bg-teal-700 dark:focus:ring-white";
      break;
    case "primary_2":
      styles =
        "hidden lg:flex text-white bg-teal-900 border-2 my-auto border-teal-900 hover:bg-teal-950 focus:ring-2 focus:outline-none focus:ring-teal-300 rounded-lg text-sm font-bold px-4 py-2.5 text-center dark:bg-teal-900 dark:hover:bg-teal-700 dark:focus:ring-teal-900";
      break;
    default:
      styles = style;
  }

  return (
    <button id={id} type={type} className={styles} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
