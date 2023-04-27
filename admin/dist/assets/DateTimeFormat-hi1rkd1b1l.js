import { R as React } from "../main-hi1rkd1b1l.js";
import { f as date, g as getSettings } from "./useTableUpdater-hi1rkd1b1l.js";
function DateTimeFormat({ datetime }) {
  const dateFormatted = date(getSettings().formats.date, datetime);
  const time = date(getSettings().formats.time, datetime);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, dateFormatted, /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "c-grey-darker" }, time));
}
export {
  DateTimeFormat as D
};
