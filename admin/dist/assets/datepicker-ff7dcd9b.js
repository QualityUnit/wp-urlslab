import { r as reactExports, R as React } from "../settings.js";
const _Inputs = "";
const _Checkbox = "";
function Checkbox({ checked, readOnly, radial, name, className, onChange, textBefore, children }) {
  const [isChecked, setChecked] = reactExports.useState(checked ? true : false);
  const handleOnChange = (event) => {
    if (onChange && !readOnly) {
      onChange(event.target.checked);
    }
    if (!readOnly) {
      setChecked(event.target.checked);
    }
  };
  return /* @__PURE__ */ React.createElement("label", { className: `urlslab-checkbox ${className || ""} ${textBefore ? "textBefore" : ""} ${radial ? "radial" : ""}` }, /* @__PURE__ */ React.createElement(
    "input",
    {
      className: `urlslab-checkbox-input ${checked ? "checked" : ""}`,
      type: name ? "radio" : "checkbox",
      name: name || "",
      defaultChecked: isChecked,
      onChange: (event) => handleOnChange(event)
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "urlslab-checkbox-box" }), /* @__PURE__ */ React.createElement("span", { className: "urlslab-checkbox-text", dangerouslySetInnerHTML: { __html: children } }));
}
const _FilterMenu = "";
function SortMenu({
  className,
  name,
  style,
  children,
  items,
  checkedId,
  isFilter,
  onChange
}) {
  const [isActive, setActive] = reactExports.useState(false);
  const [isVisible, setVisible] = reactExports.useState(false);
  const [checked, setChecked] = reactExports.useState(checkedId);
  const didMountRef = reactExports.useRef(false);
  const ref = reactExports.useRef(name);
  reactExports.useEffect(() => {
    const handleClickOutside = (event) => {
      var _a;
      if (!((_a = ref.current) == null ? void 0 : _a.contains(event.target)) && isActive) {
        setActive(false);
        setVisible(false);
      }
    };
    if (onChange && didMountRef.current && !isActive && checked !== checkedId) {
      onChange(checked);
    }
    didMountRef.current = true;
    document.addEventListener("click", handleClickOutside, true);
  }, [checked, isActive]);
  const checkedCheckbox = (targetId) => {
    setChecked(targetId);
  };
  const handleMenu = () => {
    setActive(!isActive);
    setTimeout(() => {
      setVisible(!isVisible);
    }, 100);
  };
  return /* @__PURE__ */ React.createElement("div", { className: `urlslab-FilterMenu urlslab-SortMenu ${className || ""} ${isActive ? "active" : ""}`, style, ref }, !isFilter && children ? /* @__PURE__ */ React.createElement("div", { className: "urlslab-inputField-label", dangerouslySetInnerHTML: { __html: children } }) : null, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: `urlslab-FilterMenu__title ${isFilter ? "isFilter" : ""} ${isActive ? "active" : ""}`,
      onClick: handleMenu,
      onKeyUp: (event) => handleMenu(),
      role: "button",
      tabIndex: 0,
      dangerouslySetInnerHTML: { __html: isFilter ? children : items[checked] }
    }
  ), /* @__PURE__ */ React.createElement("div", { className: `urlslab-FilterMenu__items ${isActive ? "active" : ""} ${isVisible ? "visible" : ""}` }, /* @__PURE__ */ React.createElement("div", { className: `urlslab-FilterMenu__items--inn ${Object.values(items).length > 8 ? "has-scrollbar" : ""}` }, Object.entries(items).map(([id, value]) => {
    return /* @__PURE__ */ React.createElement(
      Checkbox,
      {
        className: "urlslab-FilterMenu__item",
        key: id,
        id,
        onChange: () => checkedCheckbox(id),
        name,
        checked: id === checked,
        radial: true
      },
      value
    );
  }))));
}
const datepicker = "";
export {
  Checkbox as C,
  SortMenu as S
};
