import { r as reactExports, R as React } from "../settings.js";
import "./datepicker-ff7dcd9b.js";
function InputField({ defaultValue, placeholder, message, className, type, disabled, label, labelInline, onChange, children, style }) {
  const [val, setVal] = reactExports.useState(defaultValue || "");
  reactExports.useState(false);
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const handleVal = (event) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };
  const valueStatus = () => {
    if (val) {
      if (type === "email" && emailRegex.test(val)) {
        return "has-value success";
      }
      if (type !== "email") {
        return "has-value";
      }
      return "has-value error";
    }
    return "";
  };
  return /* @__PURE__ */ React.createElement("label", { className: `urlslab-inputField-wrap ${className || ""} ${labelInline ? "inline" : ""} ${valueStatus()}`, style }, label ? /* @__PURE__ */ React.createElement("span", { className: "urlslab-inputField-label" }, label) : null, /* @__PURE__ */ React.createElement("div", { className: `urlslab-inputField ${children ? "has-svg" : ""}` }, children, /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "urlslab-input input__text",
      type: type || "text",
      defaultValue: val,
      onChange: (event) => setVal(event.target.value),
      onBlur: (event) => handleVal(event),
      onKeyDown: (event) => {
        if (event.key === "Enter" || event.keyCode === 9) {
          event.target.blur();
        }
      },
      placeholder,
      disabled: disabled ? "disabled" : ""
    }
  )), (message == null ? void 0 : message.length) && valueStatus().length ? /* @__PURE__ */ React.createElement("div", { className: "urlslab-inputField-message" }, message) : null);
}
export {
  InputField as I
};
