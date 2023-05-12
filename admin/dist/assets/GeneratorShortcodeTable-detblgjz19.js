import { r as reactExports, R as React, i as delay, T as Tooltip, L as Loader } from "../main-detblgjz19.js";
import { u as useTableUpdater, a as useInfiniteFetch, b as useChangeRow, D as DateTimeFormat, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./useTableUpdater-detblgjz19.js";
import { E as Editor$1, S as SortBy, I as IconButton } from "./_ColumnsMenu-detblgjz19.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-detblgjz19.js";
/* empty css                       */import { S as SortMenu, I as InputField, C as Checkbox } from "./InputField-detblgjz19.js";
import { S as SvgIconEdit } from "./icon-edit-detblgjz19.js";
import { S as SvgIconActivate, a as SvgIconDisable } from "./icon-disable-detblgjz19.js";
import "./useMutation-detblgjz19.js";
function TextArea({ defaultValue, autoFocus, placeholder, liveUpdate, className, readonly, disabled, label, description, labelInline, onChange, children, style, rows }) {
  const [val, setVal] = reactExports.useState(defaultValue || "");
  const handleVal = reactExports.useCallback((event) => {
    if (onChange && (defaultValue !== val || !val)) {
      onChange(event.target.value);
    }
  }, [onChange, defaultValue, val]);
  const handleValLive = (event) => {
    if (liveUpdate) {
      delay(() => handleVal(event), 800)();
    }
  };
  return /* @__PURE__ */ React.createElement("label", { className: `urlslab-inputField-wrap ${className || ""} ${labelInline ? "inline" : ""} ${val ? "has-value" : ""}`, style }, label ? /* @__PURE__ */ React.createElement("span", { className: "urlslab-inputField-label" }, label) : null, /* @__PURE__ */ React.createElement("div", { className: `urlslab-inputField ${val ? "valid" : ""}` }, children, /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "urlslab-input input__text",
      defaultValue: val,
      autoFocus,
      onChange: (event) => {
        setVal(event.target.value);
        handleValLive(event);
      },
      onBlur: (event) => handleVal(event),
      placeholder,
      readOnly: readonly,
      disabled: disabled ? "disabled" : "",
      rows: rows || 3
    }
  )), description && /* @__PURE__ */ React.createElement("p", { className: "urlslab-inputField-description" }, description));
}
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
  const { row, selectedRows, selectRow, rowToEdit, setEditorRow, activePanel, deleteRow, deleteSelectedRows, updateRow } = useChangeRow({ data, url, slug, paginationId });
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
    shortcode_id: __("Id"),
    shortcode_type: __("Generator Type"),
    prompt: __("Prompt"),
    semantic_context: __("Semantic search query"),
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
        onChange: (val) => setEditorRow({ ...rowToEdit, prompt: val }),
        required: true
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
    template: /* @__PURE__ */ React.createElement(Editor, { description: supported_variables_description + __(" Value of generated text can be accessed in template by variable {{value}} or if generator generated json {{json_value.attribute_name}}"), defaultValue: "{{value}}", label: header.template, onChange: (val) => setEditorRow({ ...rowToEdit, template: val }), required: true }),
    model: /* @__PURE__ */ React.createElement(SortMenu, { defaultAccept: true, autoClose: true, items: modelTypes, name: "model", defaultValue: "gpt-3.5-turbo", onChange: (val) => setEditorRow({ ...rowToEdit, model: val }) }, header.model)
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { checked: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: null
    }),
    columnHelper.accessor("shortcode_id", {
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.shortcode_id),
      size: 20
    }),
    columnHelper.accessor("shortcode_type", {
      filterValMenu: shortcodeTypeTypes,
      className: "nolimit",
      cell: (cell) => shortcodeTypeTypes[cell.getValue()],
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.shortcode_type),
      size: 150
    }),
    columnHelper.accessor("prompt", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.prompt),
      size: 180
    }),
    columnHelper.accessor("semantic_context", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.semantic_context),
      size: 180
    }),
    columnHelper.accessor("default_value", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.default_value),
      size: 180
    }),
    columnHelper.accessor("url_filter", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.url_filter),
      size: 180
    }),
    columnHelper.accessor("template", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.template),
      size: 180
    }),
    columnHelper.accessor("model", {
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.model),
      size: 180
    }),
    columnHelper.accessor("status", {
      filterValMenu: statusTypes,
      className: "nolimit",
      cell: (cell) => statusTypes[cell.getValue()],
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.status),
      size: 150
    }),
    columnHelper.accessor("date_changed", {
      cell: (val) => /* @__PURE__ */ React.createElement(DateTimeFormat, { datetime: val.getValue() }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.date_changed),
      size: 100
    }),
    columnHelper.accessor("usage_count", {
      header: header.usage_count,
      size: 100
    }),
    columnHelper.accessor("shortcode", {
      header: header.shortcode,
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      size: 100
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
            onClick: () => updateRow({ cell }),
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
      onUpdateRow: (val) => {
        setEditorRow();
        if (val === "rowInserted" || val === "rowChanged") {
          setEditorRow(val);
          setTimeout(() => {
            setEditorRow();
          }, 3e3);
        }
      },
      activatePanel: activePanel,
      rowEditorOptions: { rowEditorCells, title: "Add generator", data, slug, url, paginationId, rowToEdit },
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
