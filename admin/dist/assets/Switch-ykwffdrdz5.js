import { r as reactExports, R as React } from "../main-ykwffdrdz5.js";
const SvgIconCheckmark = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "100%", height: "100%", viewBox: "0 0 10 10", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", xmlSpace: "preserve", "xmlns:serif": "http://www.serif.com/", style: {
  fillRule: "evenodd",
  clipRule: "evenodd",
  strokeLinejoin: "round",
  strokeMiterlimit: 2
}, ...props }, /* @__PURE__ */ reactExports.createElement("g", { id: "Artboard1", transform: "matrix(1,0,0,1.25138,0,0.222088)" }, /* @__PURE__ */ reactExports.createElement("rect", { x: 0, y: -0.177, width: 10, height: 7.991, style: {
  fill: "none"
} }), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(1,0,0,0.799115,-0.000187458,1.02112)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M8.327,0.26L3.5,4.649C3.5,4.649 1.673,2.987 1.673,2.987C1.264,2.616 0.631,2.646 0.26,3.055C-0.111,3.463 -0.081,4.096 0.327,4.467L2.827,6.74C3.209,7.087 3.791,7.087 4.173,6.74L9.673,1.74C10.081,1.369 10.111,0.736 9.74,0.327C9.369,-0.081 8.736,-0.111 8.327,0.26Z" }))));
const SvgIconMinus = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "100%", height: "100%", viewBox: "0 0 10 10", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", xmlSpace: "preserve", "xmlns:serif": "http://www.serif.com/", style: {
  fillRule: "evenodd",
  clipRule: "evenodd",
  strokeLinejoin: "round",
  strokeMiterlimit: 2
}, ...props }, /* @__PURE__ */ reactExports.createElement("g", { id: "Artboard1", transform: "matrix(1.09364,0,0,1.69636,0,1.71473)" }, /* @__PURE__ */ reactExports.createElement("rect", { x: 0, y: -1.011, width: 9.144, height: 5.895, style: {
  fill: "none"
} }), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(0.914374,0,0,0.589498,0.457187,1.05242)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M1,2.5L8,2.5C8.552,2.5 9,2.052 9,1.5C9,0.948 8.552,0.5 8,0.5L1,0.5C0.448,0.5 0,0.948 0,1.5C-0,2.052 0.448,2.5 1,2.5Z" }))));
const _Switch = "";
function Switch({ id, textAfter, className, style, secondary, onChange, group, defaultValue, label, labelOff }) {
  const [isChecked, setChecked] = reactExports.useState(defaultValue ? true : false);
  const handleOnChange = (event) => {
    if (onChange) {
      onChange(event.target.checked);
    }
    setChecked(event.target.checked);
  };
  return /* @__PURE__ */ React.createElement(
    "label",
    {
      className: `urlslab-switch ${className || ""} ${secondary ? "secondary" : ""} ${textAfter ? "textAfter" : ""}`,
      style: { style }
    },
    /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "urlslab-switch-input",
        type: "checkbox",
        id,
        name: group,
        defaultChecked: isChecked,
        onChange: (event) => handleOnChange(event)
      }
    ),
    /* @__PURE__ */ React.createElement("div", { className: "urlslab-switch-switcher" }, /* @__PURE__ */ React.createElement("span", { className: "urlslab-switch-switcher-button" }, /* @__PURE__ */ React.createElement(SvgIconMinus, { className: "off" }), /* @__PURE__ */ React.createElement(SvgIconCheckmark, { className: "on" }))),
    /* @__PURE__ */ React.createElement("span", { className: "urlslab-switch-text" }, !isChecked ? label : labelOff || label)
  );
}
export {
  Switch as S
};
