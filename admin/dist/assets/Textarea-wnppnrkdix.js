<<<<<<< HEAD:admin/dist/assets/Textarea-6ohoyviu4u.js
<<<<<<< HEAD:admin/dist/assets/Textarea-myg4akepfo.js
<<<<<<<< HEAD:admin/dist/assets/Textarea-txs3jaim6w.js
import { r as reactExports, R as React, d as delay } from "../main-txs3jaim6w.js";
import "./MultiSelectMenu-txs3jaim6w.js";
========
import { r as reactExports, R as React } from "./index-myg4akepfo.js";
import { d as delay } from "../main-myg4akepfo.js";
import "./MultiSelectMenu-myg4akepfo.js";
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/Textarea-myg4akepfo.js
=======
import { r as reactExports, R as React, d as delay } from "../main-6ohoyviu4u.js";
import "./MultiSelectMenu-6ohoyviu4u.js";
>>>>>>> 18bd270e (custom vite build & watch):admin/dist/assets/Textarea-6ohoyviu4u.js
=======
import { r as reactExports, R as React, d as delay } from "../main-wnppnrkdix.js";
import "./MultiSelectMenu-wnppnrkdix.js";
>>>>>>> 63c8f541 (feat: add popup content):admin/dist/assets/Textarea-wnppnrkdix.js
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
