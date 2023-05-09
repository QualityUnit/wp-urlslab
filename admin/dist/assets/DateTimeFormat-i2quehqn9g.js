import { R as React } from "../main-i2quehqn9g.js";
import { d as date, g as getSettings } from "./_ColumnsMenu-i2quehqn9g.js";
function DateTimeFormat({ datetime }) {
  const dateFormatted = date(getSettings().formats.date, datetime);
  const time = date(getSettings().formats.time, datetime);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, dateFormatted, /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "c-grey-darker" }, time));
}
export {
  DateTimeFormat as D
};
