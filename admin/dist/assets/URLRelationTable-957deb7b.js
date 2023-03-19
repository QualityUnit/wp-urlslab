import { r as reactExports, R as React, L as Loader } from "../settings.js";
import { u as useTableUpdater, a as useInfiniteFetch, h as handleSelected, T as Tooltip, S as SvgIconTrash, M as ModuleViewHeaderBottom, b as Table } from "./useTableUpdater-eb9e545c.js";
import { C as Checkbox } from "./datepicker-ff7dcd9b.js";
import { I as InputField } from "./InputField-36e1e240.js";
import { M as MenuInput } from "./MenuInput-e2b033a0.js";
import "./useMutation-6f0dd623.js";
function URLRelationTable({ slug }) {
  var _a;
  const { filters, currentFilters, addFilter, removeFilters, sortingColumn, sortBy, row, deleteRow, updateRow } = useTableUpdater({ slug });
  const url = reactExports.useMemo(() => `${filters}${sortingColumn}`, [filters, sortingColumn]);
  const pageId = "src_url_id";
  const {
    __,
    columnHelper,
    data,
    status,
    isSuccess,
    isFetchingNextPage,
    hasNextPage,
    ref
  } = useInfiniteFetch({ key: slug, url, pageId, currentFilters, sortingColumn });
  const header = {
    src_url_id: "",
    src_url_name: __("Source URL"),
    dest_url_name: __("Destination URL"),
    pos: __("Position")
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { checked: cell.row.getIsSelected(), onChange: (val) => {
        handleSelected(val, cell);
      } }),
      header: null
    }),
    columnHelper.accessor("src_url_name", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { href: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Enter Source URL Name", defaultValue: currentFilters.src_url_name, onChange: (val) => addFilter("src_url_name", val) }, header.src_url_name),
      size: 400
    }),
    columnHelper.accessor("dest_url_name", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { href: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Enter Destination URL Name", defaultValue: currentFilters.dest_url_name, onChange: (val) => addFilter("dest_url_name", val) }, header.dest_url_name),
      size: 400
    }),
    columnHelper.accessor("pos", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(
        InputField,
        {
          type: "number",
          defaultValue: cell.getValue(),
          onChange: (newVal) => updateRow({ data, newVal, url, slug, cell, rowSelector: pageId, optionalSelector: "dest_url_id" })
        }
      ),
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Filter by position", defaultValue: currentFilters.pos, onChange: (val) => addFilter("pos", val) }, header.pos),
      size: 80
    }),
    columnHelper.accessor("delete", {
      className: "deleteRow",
      cell: (cell) => /* @__PURE__ */ React.createElement(SvgIconTrash, { onClick: () => deleteRow({ data, url, slug, cell, rowSelector: pageId, optionalSelector: "dest_url_id" }) }),
      header: null
    })
  ];
  if (status === "loading") {
    return /* @__PURE__ */ React.createElement(Loader, null);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    ModuleViewHeaderBottom,
    {
      slug,
      currentFilters,
      header,
      removeFilters: (key) => removeFilters(key),
      onSort: (val) => sortBy(val),
      exportOptions: {
        url: slug,
        filters,
        fromId: `from_${pageId}`,
        pageId,
        deleteCSVCols: [pageId, "dest_url_id"]
      }
    }
  ), /* @__PURE__ */ React.createElement(
    Table,
    {
      className: "fadeInto",
      columns,
      data: isSuccess && ((_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page ?? []))
    },
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("URL has been deleted.")) : null,
    /* @__PURE__ */ React.createElement("button", { ref }, isFetchingNextPage ? "Loading more..." : hasNextPage)
  ));
}
export {
  URLRelationTable as default
};
