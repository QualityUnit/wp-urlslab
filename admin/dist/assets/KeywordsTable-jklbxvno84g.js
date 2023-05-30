import { r as reactExports, R as React, k as Tooltip, L as Loader } from "../main-jklbxvno84g.js";
import { a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, L as LangMenu, d as SortBy, I as IconButton, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-jklbxvno84g.js";
import { T as TagsMenu } from "./TagsMenu-jklbxvno84g.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-jklbxvno84g.js";
import { C as Checkbox } from "./MultiSelectMenu-jklbxvno84g.js";
import { I as InputField, S as SortMenu } from "./datepicker-jklbxvno84g.js";
import { S as SuggestInputField } from "./SuggestInputField-jklbxvno84g.js";
import { S as SvgIconEdit } from "./icon-edit-jklbxvno84g.js";
import { S as SvgIconLink } from "./icon-link-jklbxvno84g.js";
function KeywordsTable({ slug }) {
  var _a;
  const paginationId = "kw_id";
  const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater({ slug });
  const url = { filters, sorting };
  const [detailsOptions, setDetailsOptions] = reactExports.useState(null);
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
  const { selectedRows, selectRow, rowToEdit, setEditorRow, activePanel, setActivePanel, deleteRow, deleteSelectedRows, updateRow } = useChangeRow({ data, url, slug, paginationId });
  const keywordTypes = {
    M: __("Manual"),
    I: __("Imported"),
    X: __("None")
  };
  const header = {
    keyword: __("Keyword"),
    urlLink: __("Link"),
    kwType: __("Type"),
    labels: __("Tags"),
    kw_length: __("Length"),
    kw_priority: __("Priority"),
    kw_usage_count: __("Usage"),
    lang: __("Language"),
    urlFilter: __("URL filter")
  };
  const rowEditorCells = {
    keyword: /* @__PURE__ */ React.createElement(
      InputField,
      {
        autoFocus: true,
        liveUpdate: true,
        defaultValue: "",
        label: header.keyword,
        onChange: (val) => setEditorRow({ ...rowToEdit, keyword: val }),
        description: __("Just exact match of keyword will be replaced with link")
      }
    ),
    urlLink: /* @__PURE__ */ React.createElement(
      SuggestInputField,
      {
        suggestInput: (rowToEdit == null ? void 0 : rowToEdit.keyword) || "",
        liveUpdate: true,
        defaultValue: (rowToEdit == null ? void 0 : rowToEdit.urlLink) ? rowToEdit == null ? void 0 : rowToEdit.urlLink : window.location.origin,
        label: header.urlLink,
        onChange: (val) => setEditorRow({ ...rowToEdit, urlLink: val }),
        required: true,
        description: __("Destination URL for link")
      }
    ),
    kwType: /* @__PURE__ */ React.createElement(
      SortMenu,
      {
        defaultAccept: true,
        autoClose: true,
        items: keywordTypes,
        name: "kwType",
        defaultValue: "M",
        description: __("Link type is used in case you decide to replace in HTML just some types of links (see Settings)"),
        onChange: (val) => setEditorRow({ ...rowToEdit, kwType: val })
      },
      header.kwType
    ),
    kw_priority: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        type: "number",
        defaultValue: "10",
        min: "0",
        max: "255",
        label: header.kw_priority,
        description: __("Lower number means higher priority. Enter value in range: 0 - 255"),
        onChange: (val) => setEditorRow({ ...rowToEdit, kw_priority: val })
      }
    ),
    lang: /* @__PURE__ */ React.createElement(
      LangMenu,
      {
        autoClose: true,
        defaultValue: "all",
        description: __("Keyword will be applied just on page with selected language. Useful just for multilingual websites."),
        onChange: (val) => setEditorRow({ ...rowToEdit, lang: val })
      },
      __("Language")
    ),
    urlFilter: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        defaultValue: ".*",
        description: __("Optionaly you can allow to place keyword just on some URLs matching regular expression. Use value.* to match all URLs"),
        label: header.urlFilter,
        onChange: (val) => setEditorRow({ ...rowToEdit, urlFilter: val })
      }
    ),
    labels: /* @__PURE__ */ React.createElement(TagsMenu, { hasActivator: true, label: __("Tags:"), slug, onChange: (val) => setEditorRow({ ...rowToEdit, labels: val }) })
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { defaultValue: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: () => /* @__PURE__ */ React.createElement(Checkbox, { onChange: () => console.log(data == null ? void 0 : data.pages) }),
      enableResizing: false
    }),
    columnHelper.accessor("keyword", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("strong", null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.keyword),
      minSize: 200
    }),
    columnHelper.accessor("urlLink", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { href: cell.getValue(), title: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.urlLink),
      enableResizing: false,
      size: 200
    }),
    columnHelper.accessor("lang", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(LangMenu, { defaultValue: cell == null ? void 0 : cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell, id: "keyword" }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.lang),
      size: 100
    }),
    columnHelper.accessor("kw_priority", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell, id: "keyword" }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.kw_priority),
      size: 80
    }),
    columnHelper.accessor("urlFilter", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell, id: "keyword" }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.urlFilter),
      size: 150
    }),
    columnHelper.accessor("kw_length", {
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.kw_length),
      size: 80
    }),
    columnHelper.accessor("kwType", {
      filterValMenu: keywordTypes,
      className: "nolimit",
      cell: (cell) => keywordTypes[cell.getValue()],
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.kwType),
      size: 80
    }),
    columnHelper.accessor("kw_usage_count", {
      cell: (cell) => /* @__PURE__ */ React.createElement("div", { className: "flex flex-align-center" }, cell == null ? void 0 : cell.getValue(), (cell == null ? void 0 : cell.getValue()) > 0 && /* @__PURE__ */ React.createElement("button", { className: "ml-s", onClick: () => setDetailsOptions({
        title: `Keyword “${cell.row.original.keyword}” used on these URLs`,
        slug,
        url: `${cell.row.original.kw_id}/${cell.row.original.dest_url_id}`,
        showKeys: ["link_type", "url_name"],
        listId: "url_id"
      }) }, /* @__PURE__ */ React.createElement(SvgIconLink, null), /* @__PURE__ */ React.createElement(Tooltip, null, __("Show URLs where used")))),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.kw_usage_count),
      size: 80
    }),
    columnHelper.accessor("labels", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(TagsMenu, { defaultValue: cell.getValue(), slug, onChange: (newVal) => updateRow({ newVal, cell, id: "keyword" }) }),
      header: header.labels,
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
              updateRow({ cell, id: "keyword" });
            },
            tooltipClass: "align-left xxxl",
            tooltip: __("Edit row")
          },
          /* @__PURE__ */ React.createElement(SvgIconEdit, null)
        ), /* @__PURE__ */ React.createElement(
          IconButton,
          {
            className: "ml-s",
            onClick: () => deleteRow({ cell, id: "keyword" }),
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
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    ModuleViewHeaderBottom,
    {
      slug,
      header,
      table,
      selectedRows,
      onDeleteSelected: () => deleteSelectedRows({ id: "keyword" }),
      onFilter: (filter) => setFilters(filter),
      onUpdate: () => {
        setEditorRow();
        setActivePanel();
        setDetailsOptions();
      },
      detailsOptions,
      activatePanel: activePanel,
      rowEditorOptions: { rowEditorCells, title: "Add New Keyword", data, slug, url, paginationId, rowToEdit, id: "keyword" },
      exportOptions: {
        slug,
        url,
        paginationId,
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
  KeywordsTable as default
};
