import { R as React } from "../main-0b0oq30ihj.js";
function DateTimeFormat({ datetime }) {
  const date = new Date(datetime);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, date.toLocaleDateString(window.navigator.language), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "c-grey-darker" }, date.toLocaleTimeString(window.navigator.language)));
}
export {
  DateTimeFormat as D
};
