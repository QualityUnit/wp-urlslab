import { R as React, r as reactExports, u as useI18n, B as Button, a as useQueryClient, k as hexToHSL, T as Tag, L as Loader, i as Tooltip } from "../main-o7jxnz8jys.js";
import { u as useClickOutside, a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, I as IconButton, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table } from "./ModuleViewHeaderBottom-o7jxnz8jys.js";
import { M as MultiSelectMenu } from "./MultiSelectMenu-o7jxnz8jys.js";
import { C as Checkbox } from "./Checkbox-o7jxnz8jys.js";
import { I as InputField } from "./datepicker-o7jxnz8jys.js";
import { S as SvgIconEdit } from "./icon-edit-o7jxnz8jys.js";
/* empty css                              */function u() {
  return (u = Object.assign || function(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = arguments[r];
      for (var n in t)
        Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
    }
    return e;
  }).apply(this, arguments);
}
function c(e, r) {
  if (null == e)
    return {};
  var t, n, o = {}, a = Object.keys(e);
  for (n = 0; n < a.length; n++)
    r.indexOf(t = a[n]) >= 0 || (o[t] = e[t]);
  return o;
}
function i(e) {
  var t = reactExports.useRef(e), n = reactExports.useRef(function(e2) {
    t.current && t.current(e2);
  });
  return t.current = e, n.current;
}
var s = function(e, r, t) {
  return void 0 === r && (r = 0), void 0 === t && (t = 1), e > t ? t : e < r ? r : e;
}, f = function(e) {
  return "touches" in e;
}, v = function(e) {
  return e && e.ownerDocument.defaultView || self;
}, d = function(e, r, t) {
  var n = e.getBoundingClientRect(), o = f(r) ? function(e2, r2) {
    for (var t2 = 0; t2 < e2.length; t2++)
      if (e2[t2].identifier === r2)
        return e2[t2];
    return e2[0];
  }(r.touches, t) : r;
  return { left: s((o.pageX - (n.left + v(e).pageXOffset)) / n.width), top: s((o.pageY - (n.top + v(e).pageYOffset)) / n.height) };
}, h = function(e) {
  !f(e) && e.preventDefault();
}, m = React.memo(function(o) {
  var a = o.onMove, l = o.onKey, s2 = c(o, ["onMove", "onKey"]), m2 = reactExports.useRef(null), g2 = i(a), p2 = i(l), b2 = reactExports.useRef(null), _ = reactExports.useRef(false), x2 = reactExports.useMemo(function() {
    var e = function(e2) {
      h(e2), (f(e2) ? e2.touches.length > 0 : e2.buttons > 0) && m2.current ? g2(d(m2.current, e2, b2.current)) : t(false);
    }, r = function() {
      return t(false);
    };
    function t(t2) {
      var n = _.current, o2 = v(m2.current), a2 = t2 ? o2.addEventListener : o2.removeEventListener;
      a2(n ? "touchmove" : "mousemove", e), a2(n ? "touchend" : "mouseup", r);
    }
    return [function(e2) {
      var r2 = e2.nativeEvent, n = m2.current;
      if (n && (h(r2), !function(e3, r3) {
        return r3 && !f(e3);
      }(r2, _.current) && n)) {
        if (f(r2)) {
          _.current = true;
          var o2 = r2.changedTouches || [];
          o2.length && (b2.current = o2[0].identifier);
        }
        n.focus(), g2(d(n, r2, b2.current)), t(true);
      }
    }, function(e2) {
      var r2 = e2.which || e2.keyCode;
      r2 < 37 || r2 > 40 || (e2.preventDefault(), p2({ left: 39 === r2 ? 0.05 : 37 === r2 ? -0.05 : 0, top: 40 === r2 ? 0.05 : 38 === r2 ? -0.05 : 0 }));
    }, t];
  }, [p2, g2]), C2 = x2[0], E = x2[1], H = x2[2];
  return reactExports.useEffect(function() {
    return H;
  }, [H]), React.createElement("div", u({}, s2, { onTouchStart: C2, onMouseDown: C2, className: "react-colorful__interactive", ref: m2, onKeyDown: E, tabIndex: 0, role: "slider" }));
}), g = function(e) {
  return e.filter(Boolean).join(" ");
}, p = function(r) {
  var t = r.color, n = r.left, o = r.top, a = void 0 === o ? 0.5 : o, l = g(["react-colorful__pointer", r.className]);
  return React.createElement("div", { className: l, style: { top: 100 * a + "%", left: 100 * n + "%" } }, React.createElement("div", { className: "react-colorful__pointer-fill", style: { backgroundColor: t } }));
}, b = function(e, r, t) {
  return void 0 === r && (r = 0), void 0 === t && (t = Math.pow(10, r)), Math.round(t * e) / t;
}, x = function(e) {
  return L(C(e));
}, C = function(e) {
  return "#" === e[0] && (e = e.substring(1)), e.length < 6 ? { r: parseInt(e[0] + e[0], 16), g: parseInt(e[1] + e[1], 16), b: parseInt(e[2] + e[2], 16), a: 4 === e.length ? b(parseInt(e[3] + e[3], 16) / 255, 2) : 1 } : { r: parseInt(e.substring(0, 2), 16), g: parseInt(e.substring(2, 4), 16), b: parseInt(e.substring(4, 6), 16), a: 8 === e.length ? b(parseInt(e.substring(6, 8), 16) / 255, 2) : 1 };
}, w = function(e) {
  return K(I(e));
}, y = function(e) {
  var r = e.s, t = e.v, n = e.a, o = (200 - r) * t / 100;
  return { h: b(e.h), s: b(o > 0 && o < 200 ? r * t / 100 / (o <= 100 ? o : 200 - o) * 100 : 0), l: b(o / 2), a: b(n, 2) };
}, q = function(e) {
  var r = y(e);
  return "hsl(" + r.h + ", " + r.s + "%, " + r.l + "%)";
}, I = function(e) {
  var r = e.h, t = e.s, n = e.v, o = e.a;
  r = r / 360 * 6, t /= 100, n /= 100;
  var a = Math.floor(r), l = n * (1 - t), u2 = n * (1 - (r - a) * t), c2 = n * (1 - (1 - r + a) * t), i2 = a % 6;
  return { r: b(255 * [n, u2, l, l, c2, n][i2]), g: b(255 * [c2, n, n, u2, l, l][i2]), b: b(255 * [l, l, c2, n, n, u2][i2]), a: b(o, 2) };
}, D = function(e) {
  var r = e.toString(16);
  return r.length < 2 ? "0" + r : r;
}, K = function(e) {
  var r = e.r, t = e.g, n = e.b, o = e.a, a = o < 1 ? D(b(255 * o)) : "";
  return "#" + D(r) + D(t) + D(n) + a;
}, L = function(e) {
  var r = e.r, t = e.g, n = e.b, o = e.a, a = Math.max(r, t, n), l = a - Math.min(r, t, n), u2 = l ? a === r ? (t - n) / l : a === t ? 2 + (n - r) / l : 4 + (r - t) / l : 0;
  return { h: b(60 * (u2 < 0 ? u2 + 6 : u2)), s: b(a ? l / a * 100 : 0), v: b(a / 255 * 100), a: o };
}, S = React.memo(function(r) {
  var t = r.hue, n = r.onChange, o = g(["react-colorful__hue", r.className]);
  return React.createElement("div", { className: o }, React.createElement(m, { onMove: function(e) {
    n({ h: 360 * e.left });
  }, onKey: function(e) {
    n({ h: s(t + 360 * e.left, 0, 360) });
  }, "aria-label": "Hue", "aria-valuenow": b(t), "aria-valuemax": "360", "aria-valuemin": "0" }, React.createElement(p, { className: "react-colorful__hue-pointer", left: t / 360, color: q({ h: t, s: 100, v: 100, a: 1 }) })));
}), T = React.memo(function(r) {
  var t = r.hsva, n = r.onChange, o = { backgroundColor: q({ h: t.h, s: 100, v: 100, a: 1 }) };
  return React.createElement("div", { className: "react-colorful__saturation", style: o }, React.createElement(m, { onMove: function(e) {
    n({ s: 100 * e.left, v: 100 - 100 * e.top });
  }, onKey: function(e) {
    n({ s: s(t.s + 100 * e.left, 0, 100), v: s(t.v - 100 * e.top, 0, 100) });
  }, "aria-label": "Color", "aria-valuetext": "Saturation " + b(t.s) + "%, Brightness " + b(t.v) + "%" }, React.createElement(p, { className: "react-colorful__saturation-pointer", top: 1 - t.v / 100, left: t.s / 100, color: q(t) })));
}), F = function(e, r) {
  if (e === r)
    return true;
  for (var t in e)
    if (e[t] !== r[t])
      return false;
  return true;
}, X = function(e, r) {
  return e.toLowerCase() === r.toLowerCase() || F(C(e), C(r));
};
function Y(e, t, l) {
  var u2 = i(l), c2 = reactExports.useState(function() {
    return e.toHsva(t);
  }), s2 = c2[0], f2 = c2[1], v2 = reactExports.useRef({ color: t, hsva: s2 });
  reactExports.useEffect(function() {
    if (!e.equal(t, v2.current.color)) {
      var r = e.toHsva(t);
      v2.current = { hsva: r, color: t }, f2(r);
    }
  }, [t, e]), reactExports.useEffect(function() {
    var r;
    F(s2, v2.current.hsva) || e.equal(r = e.fromHsva(s2), v2.current.color) || (v2.current = { hsva: s2, color: r }, u2(r));
  }, [s2, e, u2]);
  var d2 = reactExports.useCallback(function(e2) {
    f2(function(r) {
      return Object.assign({}, r, e2);
    });
  }, []);
  return [s2, d2];
}
var V = "undefined" != typeof window ? reactExports.useLayoutEffect : reactExports.useEffect, $ = function() {
  return "undefined" != typeof __webpack_nonce__ ? __webpack_nonce__ : void 0;
}, J = /* @__PURE__ */ new Map(), Q = function(e) {
  V(function() {
    var r = e.current ? e.current.ownerDocument : document;
    if (void 0 !== r && !J.has(r)) {
      var t = r.createElement("style");
      t.innerHTML = `.react-colorful{position:relative;display:flex;flex-direction:column;width:200px;height:200px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:default}.react-colorful__saturation{position:relative;flex-grow:1;border-color:transparent;border-bottom:12px solid #000;border-radius:8px 8px 0 0;background-image:linear-gradient(0deg,#000,transparent),linear-gradient(90deg,#fff,hsla(0,0%,100%,0))}.react-colorful__alpha-gradient,.react-colorful__pointer-fill{content:"";position:absolute;left:0;top:0;right:0;bottom:0;pointer-events:none;border-radius:inherit}.react-colorful__alpha-gradient,.react-colorful__saturation{box-shadow:inset 0 0 0 1px rgba(0,0,0,.05)}.react-colorful__alpha,.react-colorful__hue{position:relative;height:24px}.react-colorful__hue{background:linear-gradient(90deg,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red)}.react-colorful__last-control{border-radius:0 0 8px 8px}.react-colorful__interactive{position:absolute;left:0;top:0;right:0;bottom:0;border-radius:inherit;outline:none;touch-action:none}.react-colorful__pointer{position:absolute;z-index:1;box-sizing:border-box;width:28px;height:28px;transform:translate(-50%,-50%);background-color:#fff;border:2px solid #fff;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,.2)}.react-colorful__interactive:focus .react-colorful__pointer{transform:translate(-50%,-50%) scale(1.1)}.react-colorful__alpha,.react-colorful__alpha-pointer{background-color:#fff;background-image:url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".05"><path d="M8 0h8v8H8zM0 8h8v8H0z"/></svg>')}.react-colorful__saturation-pointer{z-index:3}.react-colorful__hue-pointer{z-index:2}`, J.set(r, t);
      var n = $();
      n && t.setAttribute("nonce", n), r.head.appendChild(t);
    }
  }, []);
}, U = function(t) {
  var n = t.className, o = t.colorModel, a = t.color, l = void 0 === a ? o.defaultColor : a, i2 = t.onChange, s2 = c(t, ["className", "colorModel", "color", "onChange"]), f2 = reactExports.useRef(null);
  Q(f2);
  var v2 = Y(o, l, i2), d2 = v2[0], h2 = v2[1], m2 = g(["react-colorful", n]);
  return React.createElement("div", u({}, s2, { ref: f2, className: m2 }), React.createElement(T, { hsva: d2, onChange: h2 }), React.createElement(S, { hue: d2.h, onChange: h2, className: "react-colorful__last-control" }));
}, W = { defaultColor: "000", toHsva: x, fromHsva: function(e) {
  return w({ h: e.h, s: e.s, v: e.v, a: 1 });
}, equal: X }, Z = function(r) {
  return React.createElement(U, u({}, r, { colorModel: W }));
};
const _ColorPicker = "";
function ColorPicker({ defaultValue, label, className, onChange }) {
  const { __ } = useI18n();
  const defaultColors = ["#F44E3B", "#FE9200", "#FCDC00", "#DBDF00", "#A4DD00", "#68CCCA", "#73D8FF", "#AEA1FF", "#FDA1FF", "#D33115", "#E27300", "#FCC400", "#B0BC00", "#68BC00", "#16A5A5", "#009CE0", "#7B64FF", "#FA28FF", "#9F0500", "#C45100", "#FB9E00", "#808900", "#194D33", "#0C797D", "#0062B1", "#653294", "#AB149E"];
  const startColor = defaultValue || defaultColors[0];
  const [color, setColor] = reactExports.useState(startColor);
  const panelPopover = reactExports.useRef();
  const [isActive, setActive] = reactExports.useState(false);
  const close = reactExports.useCallback(() => {
    setColor(startColor);
    setActive(false);
  }, []);
  useClickOutside(panelPopover, close);
  const handleColor = (val) => {
    setColor(val);
  };
  const handleSave = () => {
    setActive(false);
    onChange(color);
  };
  return /* @__PURE__ */ React.createElement("div", { className: `urlslab-colorPicker ${className || ""}` }, label ? /* @__PURE__ */ React.createElement("span", { className: "urlslab-inputField-label" }, label) : null, /* @__PURE__ */ React.createElement("button", { className: "urlslab-colorPicker-activator", onClick: () => setActive(true) }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-colorPicker-swatch mr-m", style: { backgroundColor: color } }), color), isActive && /* @__PURE__ */ React.createElement("div", { className: "urlslab-colorPicker-panel urslab-floating-panel urlslab-panel fadeInto onBottom", ref: panelPopover }, /* @__PURE__ */ React.createElement(Z, { color, onChange: handleColor }), /* @__PURE__ */ React.createElement(InputField, { className: "mt-m mb-m", liveUpdate: true, key: color, autoFocus: true, defaultValue: color, onChange: handleColor }), /* @__PURE__ */ React.createElement("span", { className: "fs-s c-grey-darker" }, __("Predefined colors:")), /* @__PURE__ */ React.createElement("div", { className: "urlslab-colorPicker-swatches" }, defaultColors.map((colorVal) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: colorVal,
      className: `urlslab-colorPicker-swatch__btn ${colorVal === color ? "active" : ""}`,
      onClick: () => handleColor(colorVal)
    },
    /* @__PURE__ */ React.createElement("div", { className: "urlslab-colorPicker-swatch", style: { background: colorVal } })
  ))), /* @__PURE__ */ React.createElement("div", { className: "Buttons mt-m flex flex-align-center" }, /* @__PURE__ */ React.createElement(Button, { className: "ma-left simple wide", onClick: () => {
    setColor(startColor);
    setActive(false);
  } }, __("Cancel")), /* @__PURE__ */ React.createElement(Button, { active: true, className: "wide", onClick: handleSave }, __("Apply")))));
}
function TagsLabels() {
  var _a;
  const paginationId = "label_id";
  const slug = "label";
  const { table, setTable, filters, sorting } = useTableUpdater({ slug });
  const url = { filters, sorting };
  const queryClient = useQueryClient();
  const possibleModules = reactExports.useMemo(() => {
    return queryClient.getQueryData([slug, "modules"]);
  }, [queryClient]);
  const {
    __,
    columnHelper,
    data,
    status,
    isSuccess
  } = useInfiniteFetch({ key: slug, filters, sorting, paginationId }, 500);
  const { row, selectedRows, rowToEdit, setEditorRow, activePanel, setActivePanel, selectRow, deleteRow, deleteSelectedRows, updateRow } = useChangeRow({ data, url, slug, paginationId });
  const header = {
    name: "Name",
    modules: "Allowed"
  };
  const rowEditorCells = {
    name: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.name, onChange: (val) => setEditorRow({ ...rowToEdit, name: val }), required: true }),
    bgcolor: /* @__PURE__ */ React.createElement(ColorPicker, { defaultValue: "", label: "Background color", onChange: (val) => setEditorRow({ ...rowToEdit, bgcolor: val }) }),
    modules: /* @__PURE__ */ React.createElement(MultiSelectMenu, { liveUpdate: true, asTags: true, id: "modules", items: possibleModules, defaultValue: [], onChange: (val) => setEditorRow({ ...rowToEdit, modules: val }) }, header.modules)
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { defaultValue: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: () => /* @__PURE__ */ React.createElement(Checkbox, { onChange: () => console.log("") }),
      enableResizing: false
    }),
    columnHelper.accessor("name", {
      cell: (cell) => /* @__PURE__ */ React.createElement("strong", null, cell.getValue()),
      header: header.name,
      minSize: 150
    }),
    columnHelper.accessor("name", {
      className: "nolimit",
      cell: (cell) => {
        var _a2;
        const tag = (_a2 = cell == null ? void 0 : cell.row) == null ? void 0 : _a2.original;
        const { lightness } = tag && hexToHSL(tag.bgcolor);
        return /* @__PURE__ */ React.createElement(Tag, { fullSize: true, className: lightness < 70 ? "dark" : "", style: { backgroundColor: tag == null ? void 0 : tag.bgcolor } }, cell.getValue());
      },
      header: "Tag",
      size: 150
    }),
    columnHelper.accessor("modules", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(
        MultiSelectMenu,
        {
          items: possibleModules,
          asTags: true,
          id: "modules",
          defaultValue: cell.getValue() && cell.getValue()[0] || "",
          onChange: (newVal) => updateRow({ newVal, cell })
        }
      ),
      header: header.modules,
      size: 150
    }),
    columnHelper.accessor("editRow", {
      className: "editRow",
      cell: (cell) => {
        return /* @__PURE__ */ React.createElement("div", { className: "flex" }, /* @__PURE__ */ React.createElement(
          IconButton,
          {
            onClick: () => {
              setActivePanel("rowEditor");
              updateRow({ cell });
            },
            tooltipClass: "align-left xxxl",
            tooltip: __("Edit row")
          },
          /* @__PURE__ */ React.createElement(SvgIconEdit, null)
        ), /* @__PURE__ */ React.createElement(
          IconButton,
          {
            className: "ml-s",
            onClick: () => deleteRow({ cell }),
            tooltipClass: "align-left xxxl",
            tooltip: __("Delete row")
          },
          /* @__PURE__ */ React.createElement(SvgIconTrash, null)
        ));
      },
      header: null,
      size: 60
    })
  ];
  if (status === "loading") {
    return /* @__PURE__ */ React.createElement(Loader, null);
  }
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(
    ModuleViewHeaderBottom,
    {
      slug,
      header,
      table,
      selectedRows,
      onDeleteSelected: deleteSelectedRows,
      noColumnsMenu: true,
      noExport: true,
      noImport: true,
      noFiltering: true,
      noCount: true,
      onUpdateRows: (val) => {
        setActivePanel();
        setEditorRow();
        if (val === "rowInserted" || val === "rowChanged") {
          setEditorRow(val);
          setTimeout(() => {
            setEditorRow();
          }, 3e3);
        }
      },
      activatePanel: activePanel,
      rowEditorOptions: { rowEditorCells, notWide: true, title: "Create new tag", data, slug, url, paginationId, rowToEdit }
    }
  ), /* @__PURE__ */ React.createElement(
    Table,
    {
      className: "fadeInto",
      slug,
      returnTable: (returnTable) => setTable(returnTable),
      columns,
      data: isSuccess && ((_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page ?? []))
    },
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, `Tag “${row.name}”`, " ", __("has been deleted.")) : null,
    rowToEdit === "rowChanged" ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("Tag has been changed.")) : null,
    rowToEdit === "rowInserted" ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("Tag has been added.")) : null
  ));
}
export {
  TagsLabels as default
};
