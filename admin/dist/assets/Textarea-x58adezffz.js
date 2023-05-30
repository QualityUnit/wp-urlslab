import { r as reactExports, R as React, d as delay } from "../main-x58adezffz.js";
import "./MultiSelectMenu-x58adezffz.js";
function TextArea({ defaultValue, autoFocus, placeholder, liveUpdate, className, readonly, disabled, label, description, labelInline, onChange, children, style, rows }) {
  const [val, setVal] = reactExports.useState(defaultValue || "");
  const handleVal = reactExports.useCallback((event) => {
    if (onChange && (defaultValue !== val || !val)) {
      onChange(event.target.value);
    }
  }, [onChange, defaultValue, val]);
  const handleValLive = (event) => {
    if (liveUpdate) {
      delay(() => handleVal(event), 800)();
    }
  };
  return /* @__PURE__ */ React.createElement("label", { className: `urlslab-inputField-wrap ${className || ""} ${labelInline ? "inline" : ""} ${val ? "has-value" : ""}`, style }, label ? /* @__PURE__ */ React.createElement("span", { className: "urlslab-inputField-label" }, label) : null, /* @__PURE__ */ React.createElement("div", { className: `urlslab-inputField ${val ? "valid" : ""}` }, children, /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "urlslab-input input__text",
      defaultValue: val,
      autoFocus,
      onChange: (event) => {
        setVal(event.target.value);
        handleValLive(event);
      },
      onBlur: (event) => handleVal(event),
      placeholder,
      readOnly: readonly,
      disabled: disabled ? "disabled" : "",
      rows: rows || 3
    }
  )), description && /* @__PURE__ */ React.createElement("p", { className: "urlslab-inputField-description" }, description));
}
export {
  TextArea as T
};
