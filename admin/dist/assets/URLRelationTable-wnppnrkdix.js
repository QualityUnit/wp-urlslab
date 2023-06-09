<<<<<<< HEAD:admin/dist/assets/URLRelationTable-6ohoyviu4u.js
<<<<<<< HEAD:admin/dist/assets/URLRelationTable-myg4akepfo.js
<<<<<<<< HEAD:admin/dist/assets/URLRelationTable-txs3jaim6w.js
import { R as React, l as Tooltip, L as Loader } from "../main-txs3jaim6w.js";
import { a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, d as useTablePanels, e as SortBy, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-txs3jaim6w.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-txs3jaim6w.js";
import { C as Checkbox } from "./MultiSelectMenu-txs3jaim6w.js";
import { I as InputField } from "./datepicker-txs3jaim6w.js";
========
import { R as React } from "./index-myg4akepfo.js";
import { a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, d as SortBy, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-myg4akepfo.js";
import { k as Tooltip, L as Loader } from "../main-myg4akepfo.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-myg4akepfo.js";
import { C as Checkbox } from "./MultiSelectMenu-myg4akepfo.js";
import { I as InputField } from "./datepicker-myg4akepfo.js";
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/URLRelationTable-myg4akepfo.js
=======
import { R as React, k as Tooltip, L as Loader } from "../main-6ohoyviu4u.js";
import { a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, d as SortBy, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-6ohoyviu4u.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-6ohoyviu4u.js";
import { C as Checkbox } from "./MultiSelectMenu-6ohoyviu4u.js";
import { I as InputField } from "./datepicker-6ohoyviu4u.js";
>>>>>>> 18bd270e (custom vite build & watch):admin/dist/assets/URLRelationTable-6ohoyviu4u.js
=======
import { R as React, k as Tooltip, L as Loader } from "../main-wnppnrkdix.js";
import { a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, d as SortBy, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-wnppnrkdix.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-wnppnrkdix.js";
import { C as Checkbox } from "./MultiSelectMenu-wnppnrkdix.js";
import { I as InputField } from "./datepicker-wnppnrkdix.js";
>>>>>>> 63c8f541 (feat: add popup content):admin/dist/assets/URLRelationTable-wnppnrkdix.js
function URLRelationTable({ slug }) {
  var _a;
  const paginationId = "src_url_id";
  const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater({ slug });
  const url = { filters, sorting };
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
  } = useInfiniteFetch({ key: slug, filters, sorting, paginationId });
  const { selectedRows, selectRow, deleteRow, deleteSelectedRows, updateRow } = useChangeRow({ data, url, slug, paginationId });
  const setRowToEdit = useTablePanels((state) => state.setRowToEdit);
  const rowToEdit = useTablePanels((state) => state.rowToEdit);
  const header = {
    src_url_name: __("Source URL"),
    dest_url_name: __("Destination URL"),
    pos: __("Position"),
    created_date: __("Updated")
  };
  const rowEditorCells = {
    src_url_name: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, type: "url", defaultValue: "", label: header.src_url_name, onChange: (val) => setRowToEdit({ ...rowToEdit, src_url_name: val }), required: true }),
    dest_url_name: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, type: "url", defaultValue: "", label: header.dest_url_name, onChange: (val) => setRowToEdit({ ...rowToEdit, dest_url_name: val }), required: true }),
    pos: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, type: "number", defaultValue: "0", min: "0", max: "255", label: header.pos, onChange: (val) => setRowToEdit({ ...rowToEdit, pos: val }), required: true })
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { defaultValue: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: null
    }),
    columnHelper.accessor("src_url_name", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { href: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.src_url_name),
      size: 200
    }),
    columnHelper.accessor("dest_url_name", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { href: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.dest_url_name),
      size: 200
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
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.pos),
      size: 30
    }),
    columnHelper.accessor("created_date", {
      className: "nolimit",
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.created_date),
      size: 30
    }),
    columnHelper.accessor("editRow", {
      className: "editRow",
      tooltip: () => /* @__PURE__ */ React.createElement(Tooltip, { className: "align-left xxxl" }, __("Delete item")),
      cell: (cell) => /* @__PURE__ */ React.createElement(SvgIconTrash, { onClick: () => deleteRow({ cell, optionalSelector: "dest_url_id", id: "src_url_name" }) }),
      header: null
    })
  ];
  if (status === "loading") {
    return /* @__PURE__ */ React.createElement(Loader, null);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    ModuleViewHeaderBottom,
    {
      table,
      selectedRows,
      onDeleteSelected: () => deleteSelectedRows({ optionalSelector: "dest_url_id", id: "src_url_name" }),
      onFilter: (filter) => setFilters(filter),
      options: {
        header,
        rowEditorCells,
        title: "Add New Related Article",
        data,
        slug,
        url,
        paginationId,
        rowToEdit,
        id: "src_url_name",
        deleteCSVCols: [paginationId, "dest_url_id"]
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
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sorting } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  URLRelationTable as default
};
