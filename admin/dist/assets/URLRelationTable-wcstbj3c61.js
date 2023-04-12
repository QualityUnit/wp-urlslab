import { R as React, L as Loader } from "../main-wcstbj3c61.js";
import { u as useTableUpdater, a as useInfiniteFetch, b as useChangeRow, T as Tooltip, S as SvgIconTrash, M as ModuleViewHeaderBottom, c as Table, d as TooltipSortingFiltering, P as ProgressBar } from "./useTableUpdater-wcstbj3c61.js";
import { C as Checkbox, I as InputField } from "./datepicker-wcstbj3c61.js";
import "./useMutation-wcstbj3c61.js";
function URLRelationTable({ slug }) {
  var _a;
  const pageId = "src_url_id";
  const { table, setTable, rowToInsert, setInsertRow, filters, setFilters, sortingColumn, sortBy } = useTableUpdater({ slug });
  const url = `${filters}${sortingColumn}`;
  const {
    __,
    columnHelper,
    data,
    status,
    isSuccess,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    ref
  } = useInfiniteFetch({ key: slug, url, pageId });
  const { row, selectRow, deleteRow, updateRow } = useChangeRow({ data, url, slug, pageId });
  const header = {
    src_url_name: __("Source URL"),
    dest_url_name: __("Destination URL"),
    pos: __("Position")
  };
  const inserterCells = {
    src_url_name: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, type: "url", defaultValue: "", label: header.src_url_name, onChange: (val) => setInsertRow({ ...rowToInsert, src_url_name: val }), required: true }),
    dest_url_name: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, type: "url", defaultValue: "", label: header.dest_url_name, onChange: (val) => setInsertRow({ ...rowToInsert, dest_url_name: val }), required: true }),
    pos: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, type: "number", defaultValue: "0", min: "0", max: "255", label: header.pos, onChange: (val) => setInsertRow({ ...rowToInsert, pos: val }), required: true })
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { checked: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: null
    }),
    columnHelper.accessor("src_url_name", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { href: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: header.src_url_name,
      size: 400
    }),
    columnHelper.accessor("dest_url_name", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { href: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: header.dest_url_name,
      size: 400
    }),
    columnHelper.accessor("pos", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(
        InputField,
        {
          type: "number",
          defaultValue: cell.getValue(),
          onChange: (newVal) => updateRow({ newVal, cell, optionalSelector: "dest_url_id" })
        }
      ),
      header: header.pos,
      size: 80
    }),
    columnHelper.accessor("delete", {
      className: "deleteRow",
      tooltip: () => /* @__PURE__ */ React.createElement(Tooltip, { className: "align-left xxxl" }, __("Delete row")),
      cell: (cell) => /* @__PURE__ */ React.createElement(SvgIconTrash, { onClick: () => deleteRow({ cell, optionalSelector: "dest_url_id" }) }),
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
      header,
      table,
      onSort: (val) => sortBy(val),
      onFilter: (filter) => setFilters(filter),
      onClearRow: (clear) => {
        setInsertRow();
        if (clear === "rowInserted") {
          setInsertRow(clear);
          setTimeout(() => {
            setInsertRow();
          }, 3e3);
        }
      },
      insertOptions: { inserterCells, title: "Add related article", data, slug, url, pageId, rowToInsert },
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
      slug,
      returnTable: (returnTable) => setTable(returnTable),
      columns,
      data: isSuccess && ((_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page ?? []))
    },
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("URL has been deleted.")) : null,
    rowToInsert === "rowInserted" ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("URL Relation rule has been added.")) : null,
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sortingColumn } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  URLRelationTable as default
};
