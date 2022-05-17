// src/Button.tsx
import React from "react";
var Button = ({ text = "P\xFAlsame" }) => {
  return /* @__PURE__ */ React.createElement("button", {
    style: { background: "red" }
  }, text);
};
export {
  Button
};
