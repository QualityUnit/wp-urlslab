import { R as React, l as Tooltip, L as Loader } from "../main-gb6hdirjui.js";
import { a as useTableUpdater, b as useInfiniteFetch, e as SortBy, D as DateTimeFormat, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-gb6hdirjui.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-gb6hdirjui.js";
import "./MultiSelectMenu-gb6hdirjui.js";
import "./datepicker-gb6hdirjui.js";
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
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.id),
      size: 60
    }),
    columnHelper.accessor("creditType", {
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.creditType),
      size: 30
    }),
    columnHelper.accessor("creditOperation", {
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.creditOperation),
      size: 30
    }),
    columnHelper.accessor("operationDate", {
      cell: (val) => /* @__PURE__ */ React.createElement(DateTimeFormat, { datetime: val.getValue() }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.operationDate),
      size: 60
    }),
    columnHelper.accessor("url", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { href: cell.getValue(), title: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.url),
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
      data: isSuccess && ((_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page ?? []))
    },
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sorting } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  CreditsTable as default
};
