import { r as reactExports, R as React, i as Tooltip, L as Loader } from "../main-761stfiail.js";
import { E as Editor$1, a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, d as SortBy, D as DateTimeFormat, I as IconButton, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-761stfiail.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-761stfiail.js";
import { C as Checkbox } from "./MultiSelectMenu-761stfiail.js";
import { S as SortMenu, I as InputField } from "./datepicker-761stfiail.js";
import { T as TextArea } from "./Textarea-761stfiail.js";
import { S as SvgIconEdit } from "./icon-edit-761stfiail.js";
import { S as SvgIconActivate, a as SvgIconDisable } from "./icon-disable-761stfiail.js";
function Editor({ defaultValue, className, style, label, description, onChange }) {
  const editorRef = reactExports.useRef(null);
  const [val, setVal] = reactExports.useState(defaultValue ?? "");
  reactExports.useEffect(() => setVal(defaultValue ?? ""), [defaultValue]);
  const handleVal = reactExports.useCallback((input) => {
    if (onChange && (defaultValue !== input || !input)) {
      setVal(input);
      onChange(input);
    }
  }, [onChange, defaultValue]);
  return /* @__PURE__ */ React.createElement("div", { className: `urlslab-inputField-wrap ${className || ""}`, style }, label ? /* @__PURE__ */ React.createElement("span", { className: "urlslab-inputField-label" }, label) : null, /* @__PURE__ */ React.createElement(
    Editor$1,
    {
      onInit: (evt, editor) => editorRef.current = editor,
      value: val,
      onEditorChange: (input) => handleVal(input),
      init: {
        skin: false,
        content_css: false,
        height: 400,
        menubar: false,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "anchor",
          "media",
          "table",
          "code"
        ],
        toolbar: [
          "blocks | bold italic forecolor | alignleft aligncenter",
          "alignright alignjustify | bullist numlist outdent indent | code help"
        ],
        content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
      }
    }
  ), description && /* @__PURE__ */ React.createElement("p", { className: "urlslab-inputField-description" }, description));
}
function GeneratorShortcodeTable({ slug }) {
  var _a;
  const paginationId = "shortcode_id";
  const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater("generator/shortcode");
  const url = { filters, sorting };
  const ActionButton = ({ cell, onClick }) => {
    var _a2;
    const { status: status2 } = (_a2 = cell == null ? void 0 : cell.row) == null ? void 0 : _a2.original;
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-align-center flex-justify-end" }, status2 === "D" && /* @__PURE__ */ React.createElement(IconButton, { className: "mr-s c-saturated-green", tooltip: __("Activate"), tooltipClass: "align-left", onClick: () => onClick("A") }, /* @__PURE__ */ React.createElement(SvgIconActivate, null)), status2 === "A" && /* @__PURE__ */ React.createElement(IconButton, { className: "mr-s c-saturated-red", tooltip: __("Disable"), tooltipClass: "align-left", onClick: () => onClick("D") }, /* @__PURE__ */ React.createElement(SvgIconDisable, null)));
  };
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
  } = useInfiniteFetch({ key: slug, url, paginationId, filters, sorting });
  const { row, selectedRows, selectRow, rowToEdit, setEditorRow, activePanel, setActivePanel, deleteRow, deleteSelectedRows, updateRow } = useChangeRow({ data, url, slug, paginationId });
  const statusTypes = {
    A: __("Active"),
    D: __("Disabled")
  };
  const modelTypes = {
    "gpt-3.5-turbo": __("Gpt 3.5 Turbo"),
    "gpt-4": __("Gpt 4"),
    "text-davinci-003": __("Text Davinci 003")
  };
  const shortcodeTypeTypes = {
    S: __("Semantic search"),
    V: __("Video context")
  };
  const header = {
    shortcode_id: __("ID"),
    shortcode_type: __("Type"),
    prompt: __("Prompt"),
    semantic_context: __("Semantic context"),
    url_filter: __("URL filter"),
    default_value: __("Default value"),
    status: __("Status"),
    date_changed: __("Last change"),
    model: __("Model"),
    template: __("HTML template"),
    shortcode: __("Shortcode"),
    usage_count: __("Usage")
  };
  const supported_variables_description = __("Supported variables: {{page_title}}, {{page_url}}, {{domain}}, {{language_code}}, {{language}}. In case videoid attribute is set, following variables are available: {{video_captions}}, {{video_captions_text}}, {{video_title}}, {{video_description}}, {{video_published_at}}, {{video_duration}}, {{video_channel_title}}, {{video_tags}}. Custom attributes can be passed from shortcode as well in form {{your_custom_attribute_name}}");
  const rowEditorCells = {
    shortcode_type: /* @__PURE__ */ React.createElement(
      SortMenu,
      {
        autoClose: true,
        defaultAccept: true,
        description: __("In case of video context type, Semantic search query should contain YouTube videoid or YoutTube video url."),
        items: shortcodeTypeTypes,
        name: "shortcode_type",
        defaultValue: "S",
        onChange: (val) => setEditorRow({ ...rowToEdit, shortcode_type: val })
      },
      header.shortcode_type
    ),
    prompt: /* @__PURE__ */ React.createElement(
      TextArea,
      {
        rows: "5",
        description: supported_variables_description,
        liveUpdate: true,
        defaultValue: "",
        label: header.prompt,
        onChange: (val) => setEditorRow({ ...rowToEdit, prompt: val })
      }
    ),
    semantic_context: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        description: supported_variables_description + " " + __("In case of video context type, Semantic search query should contain youtube videoid: {{videoid}}."),
        defaultValue: "",
        label: header.semantic_context,
        onChange: (val) => setEditorRow({ ...rowToEdit, semantic_context: val }),
        hidden: (rowToEdit == null ? void 0 : rowToEdit.shortcode_type) === "V"
      }
    ),
    url_filter: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", description: __("Recommended variables: {{page_url}} if you need to generate data from current url. {{domain}} if you need to generate data from any semanticaly relevant page in your domain. Fixed url if you need to generate data from fixed url (e.g. http://wikipedia.com/anything). {{custom_url_attribute_name}} if you pass your custom attribute to shortcode in html template."), label: header.url_filter, onChange: (val) => setEditorRow({ ...rowToEdit, url_filter: val }), hidden: (rowToEdit == null ? void 0 : rowToEdit.shortcode_type) === "V" }),
    default_value: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, description: __("Put here the text, which shoould be displayed in shortcode until Urlslab generates text from your prompt. Leave empty if you do not want to display shortcode until the text is generated"), defaultValue: "", label: header.default_value, onChange: (val) => setEditorRow({ ...rowToEdit, default_value: val }) }),
    template: /* @__PURE__ */ React.createElement(Editor, { description: supported_variables_description + __(" Value of generated text can be accessed in template by variable {{value}} or if generator generated json {{json_value.attribute_name}}"), defaultValue: "{{value}}", label: header.template, onChange: (val) => setEditorRow({ ...rowToEdit, template: val }) }),
    model: /* @__PURE__ */ React.createElement(SortMenu, { defaultAccept: true, autoClose: true, items: modelTypes, name: "model", defaultValue: "gpt-3.5-turbo", onChange: (val) => setEditorRow({ ...rowToEdit, model: val }) }, header.model)
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { defaultValue: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: null
    }),
    columnHelper.accessor("shortcode_id", {
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.shortcode_id),
      size: 45
    }),
    columnHelper.accessor("shortcode_type", {
      filterValMenu: shortcodeTypeTypes,
      className: "nolimit",
      cell: (cell) => shortcodeTypeTypes[cell.getValue()],
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.shortcode_type),
      size: 115
    }),
    columnHelper.accessor("prompt", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.prompt),
      size: 200
    }),
    columnHelper.accessor("semantic_context", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.semantic_context),
      size: 150
    }),
    columnHelper.accessor("url_filter", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.url_filter),
      size: 150
    }),
    columnHelper.accessor("default_value", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.default_value),
      size: 150
    }),
    columnHelper.accessor("template", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.template),
      size: 200
    }),
    columnHelper.accessor("model", {
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.model),
      size: 80
    }),
    columnHelper.accessor("status", {
      filterValMenu: statusTypes,
      className: "nolimit",
      cell: (cell) => statusTypes[cell.getValue()],
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.status),
      size: 80
    }),
    columnHelper.accessor("date_changed", {
      cell: (val) => /* @__PURE__ */ React.createElement(DateTimeFormat, { datetime: val.getValue() }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.date_changed),
      size: 115
    }),
    columnHelper.accessor("shortcode", {
      header: header.shortcode,
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      size: 250
    }),
    columnHelper.accessor("usage_count", {
      header: header.usage_count,
      size: 60
    }),
    columnHelper.accessor("actions", {
      className: "actions hoverize nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(ActionButton, { cell, onClick: (val) => updateRow({ changeField: "status", newVal: val, cell }) }),
      header: null,
      size: 70
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
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    ModuleViewHeaderBottom,
    {
      slug,
      header,
      table,
      noImport: true,
      selectedRows,
      onDeleteSelected: deleteSelectedRows,
      onFilter: (filter) => setFilters(filter),
      onUpdate: (val) => {
        setActivePanel();
        setEditorRow();
        if (val === "rowInserted" || val === "rowChanged") {
          setActivePanel();
          setEditorRow(val);
          setTimeout(() => {
            setEditorRow();
          }, 3e3);
        }
      },
      activatePanel: activePanel,
      rowEditorOptions: { rowEditorCells, title: "Add New Shortcode", data, slug, url, paginationId, rowToEdit },
      exportOptions: {
        slug,
        url,
        paginationId,
        deleteCSVCols: [paginationId]
      }
    }
  ), /* @__PURE__ */ React.createElement(
    Table,
    {
      className: "fadeInto",
      slug,
      columns,
      returnTable: (returnTable) => setTable(returnTable),
      data: isSuccess && ((_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page ?? []))
    },
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("Item has been deleted.")) : null,
    rowToEdit === "rowChanged" ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("Shortcode has been changed.")) : null,
    rowToEdit === "rowInserted" ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("Shortcode has been added.")) : null,
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sorting } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  GeneratorShortcodeTable as default
};
