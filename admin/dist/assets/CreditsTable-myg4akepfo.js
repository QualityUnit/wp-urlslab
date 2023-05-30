<<<<<<<< HEAD:admin/dist/assets/CreditsTable-txs3jaim6w.js
import { R as React, l as Tooltip, L as Loader } from "../main-txs3jaim6w.js";
import { a as useTableUpdater, b as useInfiniteFetch, D as DateTimeFormat, M as ModuleViewHeaderBottom, T as Table } from "./ModuleViewHeaderBottom-txs3jaim6w.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-txs3jaim6w.js";
import "./MultiSelectMenu-txs3jaim6w.js";
import "./datepicker-txs3jaim6w.js";
========
import { R as React } from "./index-myg4akepfo.js";
import { a as useTableUpdater, b as useInfiniteFetch, d as SortBy, D as DateTimeFormat, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-myg4akepfo.js";
import { k as Tooltip, L as Loader } from "../main-myg4akepfo.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-myg4akepfo.js";
import "./MultiSelectMenu-myg4akepfo.js";
import "./datepicker-myg4akepfo.js";
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/CreditsTable-myg4akepfo.js
/* empty css                              */function CreditsTable({ slug }) {
  var _a;
  const paginationId = "id";
  const { table, setTable, filters, sorting, sortBy } = useTableUpdater({ slug });
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
  const header = {
    id: __("Transaction Id"),
    creditType: __("Type"),
    creditOperation: __("Operation"),
    operationDate: __("Timestamp"),
    url: __("URL")
  };
  const columns = [
    columnHelper.accessor("id", {
      header: (th) => header.id,
      size: 60
    }),
    columnHelper.accessor("operationDate", {
      cell: (val) => /* @__PURE__ */ React.createElement(DateTimeFormat, { datetime: val.getValue() }),
      header: (th) => header.operationDate,
      size: 100
    }),
    columnHelper.accessor("creditType", {
      header: (th) => header.creditType,
      size: 30
    }),
    columnHelper.accessor("creditOperation", {
      header: (th) => header.creditOperation,
      size: 30
    }),
    columnHelper.accessor("url", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { href: cell.getValue(), title: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: (th) => header.url,
      size: 200
    })
  ];
  if (status === "loading") {
    return /* @__PURE__ */ React.createElement(Loader, null);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    ModuleViewHeaderBottom,
    {
      table,
      noFiltering: true,
      noCount: true,
      noExport: true,
      noImport: true,
      noDelete: true,
      options: { header, slug, data, paginationId }
    }
  ), /* @__PURE__ */ React.createElement(
    Table,
    {
      className: "noHeightLimit fadeInto",
      slug,
      returnTable: (returnTable) => setTable(returnTable),
      columns,
      initialState: { columnVisibility: { id: false } },
      data: isSuccess && ((_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page ?? []))
    },
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sorting } })
  ));
}
export {
  CreditsTable as default
};
