import { R as React, g as Tooltip, L as Loader } from "../main-cahlic561m.js";
import { u as useTableUpdater, a as useInfiniteFetch, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./useTableUpdater-cahlic561m.js";
import "./_ColumnsMenu-cahlic561m.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-cahlic561m.js";
/* empty css                    *//* empty css                       *//* empty css                              */import "./InputField-cahlic561m.js";
import "./MultiSelectMenu-cahlic561m.js";
function CreditsTable({ slug }) {
  var _a;
  const paginationId = "id";
  const { table, setTable, filters, sorting } = useTableUpdater({ slug });
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
      header: header.id,
      size: 60
    }),
    columnHelper.accessor("creditType", {
      header: header.creditType,
      size: 30
    }),
    columnHelper.accessor("creditOperation", {
      header: header.creditOperation,
      size: 30
    }),
    columnHelper.accessor("operationDate", {
      header: header.operationDate,
      size: 30
    }),
    columnHelper.accessor("url", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { href: cell.getValue(), title: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: (th) => {
        header.url;
      },
      size: 200
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
      noFiltering: true,
      noCount: true,
      noExport: true,
      noDelete: true
    }
  ), /* @__PURE__ */ React.createElement(
    Table,
    {
      className: "noHeightLimit fadeInto",
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
  CreditsTable as default
};
