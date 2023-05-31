import { R as React, L as Loader } from "../main-yv7e1z8gbu.js";
import { a as useTableUpdater, b as useInfiniteFetch, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-yv7e1z8gbu.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-yv7e1z8gbu.js";
import "./MultiSelectMenu-yv7e1z8gbu.js";
import "./datepicker-yv7e1z8gbu.js";
/* empty css                              */function UsageTable({ slug }) {
  var _a;
  const paginationId = "id";
  const { table, setTable, filters, sorting, sortBy } = useTableUpdater({ slug });
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
  const header = {
    groupBucketTitle: __("Date"),
    creditType: __("Type"),
    events: __("Count"),
    credits: __("Usage")
  };
  const columns = [
    columnHelper.accessor("groupBucketTitle", {
      header: (th) => header.groupBucketTitle,
      size: 200
    }),
    columnHelper.accessor("creditType", {
      header: (th) => header.creditType,
      size: 100
    }),
    columnHelper.accessor("events", {
      header: (th) => header.events,
      size: 100
    }),
    columnHelper.accessor("credits", {
      header: (th) => header.credits,
      size: 100
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
      options: { header, data, slug, paginationId, url }
    }
  ), /* @__PURE__ */ React.createElement(
    Table,
    {
      className: "noHeightLimit fadeInto",
      slug,
      returnTable: (returnTable) => setTable(returnTable),
      columns,
      data: isSuccess && ((_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page ?? [])),
      initialState: { columnVisibility: { events: false } }
    },
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sorting } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  UsageTable as default
};
