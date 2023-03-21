import { r as reactExports, R as React } from "../settings.js";
import { I as InputField } from "./InputField-36e1e240.js";
import "./datepicker-ff7dcd9b.js";
import "./useTableUpdater-afa37684.js";
function MenuInput({
  className,
  placeholder,
  style,
  onChange,
  defaultValue,
  children
}) {
  const [isActive, setActive] = reactExports.useState(false);
  const [isVisible, setVisible] = reactExports.useState(false);
  const [inputValue, setInputValue] = reactExports.useState(defaultValue);
  const didMountRef = reactExports.useRef(false);
  const ref = reactExports.useRef(null);
  const handleClickOutside = (event) => {
    var _a;
    if (!((_a = ref.current) == null ? void 0 : _a.contains(event.target)) && isActive) {
      setActive(false);
      setVisible(false);
    }
  };
  reactExports.useEffect(() => {
    if (onChange && didMountRef.current && !isActive && inputValue !== defaultValue) {
      onChange(inputValue);
    }
    didMountRef.current = true;
    document.addEventListener("click", handleClickOutside, true);
  }, [isActive]);
  const handleMenu = () => {
    setActive(!isActive);
    setTimeout(() => {
      setVisible(!isVisible);
    }, 100);
  };
  return /* @__PURE__ */ React.createElement("div", { className: `urlslab-FilterMenu ${className || ""}`, style, ref }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: `urlslab-FilterMenu__title ${isActive ? "active" : ""}`,
      onClick: handleMenu,
      onKeyUp: (event) => handleMenu(),
      role: "button",
      tabIndex: 0
    },
    children
  ), /* @__PURE__ */ React.createElement("div", { className: `urlslab-FilterMenu__items menuInput ${isActive ? "active" : ""} ${isVisible ? "visible" : ""}` }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-FilterMenu__items--inn" }, /* @__PURE__ */ React.createElement("div", { className: "label menuInput urlslab-FilterMenu__item" }, /* @__PURE__ */ React.createElement(InputField, { type: "search", defaultValue: inputValue, placeholder, onChange: (val) => {
    setInputValue(val);
    handleClickOutside(val);
  } })))));
}
export {
  MenuInput as M
};
