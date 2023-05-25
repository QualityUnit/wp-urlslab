import { r as reactExports, R as React } from "../main-nsioqhovv8.js";
const _Checkbox = "";
function Checkbox({ defaultValue, smallText, readOnly, radial, name, className, onChange, textBefore, children }) {
  const [isChecked, setChecked] = reactExports.useState(defaultValue ? true : false);
  const handleOnChange = () => {
    if (onChange && !readOnly) {
      onChange(!isChecked);
    }
    if (!readOnly) {
      setChecked((state) => !state);
    }
  };
  return /* @__PURE__ */ React.createElement("label", { className: `urlslab-checkbox ${className || ""} ${textBefore ? "textBefore" : ""} ${radial ? "radial" : ""}` }, /* @__PURE__ */ React.createElement(
    "input",
    {
      className: `urlslab-checkbox-input ${defaultValue ? "checked" : ""}`,
      type: name ? "radio" : "checkbox",
      name: name || "",
      defaultChecked: isChecked,
      onChange: (event) => handleOnChange()
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "urlslab-checkbox-box" }), /* @__PURE__ */ React.createElement("span", { className: `urlslab-checkbox-text ${smallText ? "fs-xm" : ""}`, dangerouslySetInnerHTML: { __html: children } }));
}
export {
  Checkbox as C
};
