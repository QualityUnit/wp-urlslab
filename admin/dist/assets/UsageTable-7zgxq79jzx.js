import { R as React, L as Loader } from "../main-7zgxq79jzx.js";
import { a as useTableUpdater, b as useInfiniteFetch, M as ModuleViewHeaderBottom, T as Table } from "./ModuleViewHeaderBottom-7zgxq79jzx.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-7zgxq79jzx.js";
import "./MultiSelectMenu-7zgxq79jzx.js";
import "./datepicker-7zgxq79jzx.js";
/* empty css                              */function UsageTable({ slug }) {
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
    groupBucketTitle: __("Date"),
    creditType: __("Type"),
    events: __("Count"),
    credits: __("Usage")
  };
  const columns = [
    columnHelper.accessor("groupBucketTitle", {
      header: (th) => header.groupBucketTitle,
      size: 80
    }),
    columnHelper.accessor("creditType", {
      header: (th) => header.creditType,
      size: 80
    }),
    columnHelper.accessor("events", {
      header: (th) => header.events,
      size: 60
    }),
    columnHelper.accessor("credits", {
      header: (th) => header.credits,
      size: 60
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
      noImport: true,
      noDelete: true
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
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sorting } })
  ));
}
export {
  UsageTable as default
};
