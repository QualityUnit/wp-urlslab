import { a as useQueryClient, r as reactExports, R as React, p as parseURL, b as setSettings, c as useQuery, L as Loader, f as fetchSettings } from "../main-m8te22fausi.js";
import { F as FilterMenu, S as SortMenu, H as Ht, I as InputField } from "./datepicker-m8te22fausi.js";
import { S as Switch } from "./Switch-m8te22fausi.js";
import { u as useMutation } from "./useMutation-m8te22fausi.js";
function SettingsOption({ settingId, option }) {
  const queryClient = useQueryClient();
  const { id, type, title, description, placeholder, value, possible_values } = option;
  const [date, setDate] = reactExports.useState(type !== "datetime" || new Date(value));
  const handleChange = useMutation({
    mutationFn: (changeValue) => {
      return setSettings(`${settingId}/${id}`, {
        value: changeValue
      });
    },
    onError: (changeValue) => {
      return setSettings(`${settingId}/${id}`, {
        value: changeValue
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["settings", settingId]);
    }
  });
  const handleDate = useMutation({
    mutationFn: (newDate) => {
      return setSettings(`${settingId}/${id}`, {
        value: new Date(newDate).toISOString().replace(/^(.+?)T(.+?)\..+$/g, "$1 $2")
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["settings", settingId]);
    }
  });
  const renderOption = () => {
    switch (type) {
      case "text":
      case "password":
      case "number":
        return /* @__PURE__ */ React.createElement(
          InputField,
          {
            type,
            label: title,
            placeholder: placeholder && !value,
            defaultValue: value,
            onChange: (inputValue) => handleChange.mutate(inputValue)
          }
        );
      case "checkbox":
        return /* @__PURE__ */ React.createElement(
          Switch,
          {
            className: "option flex",
            label: title,
            checked: value === "1" || value === true,
            onChange: (inputValue) => handleChange.mutate(inputValue)
          }
        );
      case "datetime":
        return /* @__PURE__ */ React.createElement("div", { className: "urlslab-inputField-datetime" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-inputField-label" }, title), /* @__PURE__ */ React.createElement(
          Ht,
          {
            className: "urlslab-input xl",
            selected: date,
            dateFormat: "dd. MMMM yyyy, HH:mm",
            timeFormat: "HH:mm",
            showTimeSelect: true,
            onChange: (newDate) => {
              setDate(newDate);
              handleDate.mutate(newDate);
            }
          }
        ));
      case "listbox":
        return /* @__PURE__ */ React.createElement(SortMenu, { className: "wide", name: id, items: possible_values, checkedId: value, autoClose: true, onChange: (selectedId) => handleChange.mutate(selectedId) }, title);
      case "multicheck":
        return /* @__PURE__ */ React.createElement(
          FilterMenu,
          {
            className: "wide",
            items: possible_values,
            checkedItems: value,
            id,
            asTags: true,
            onChange: (selectedItems) => handleChange.mutate(selectedItems)
          },
          title
        );
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-settingsPanel-option" }, renderOption(), /* @__PURE__ */ React.createElement("p", { className: "urlslab-settingsPanel-option__desc", dangerouslySetInnerHTML: { __html: parseURL(description) } }));
}
const _Settings = "";
function Settings({ className, settingId }) {
  const queryClient = useQueryClient();
  const handleClick = (event) => {
    var _a;
    document.querySelectorAll(".urlslab-settingsPanel-section").forEach((section) => section.classList.remove("active"));
    (_a = event.target) == null ? void 0 : _a.closest(".urlslab-settingsPanel-section").classList.add("active");
  };
  const { data, status } = useQuery({
    queryKey: ["settings", settingId],
    queryFn: () => fetchSettings(settingId),
    initialData: () => {
      if (settingId === "general") {
        return queryClient.getQueryData(["settings", "general"]);
      }
    },
    refetchOnWindowFocus: false
  });
  let settings = reactExports.useMemo(() => {
    return data;
  }, [data]);
  if (status === "loading") {
    return /* @__PURE__ */ React.createElement(Loader, null);
  }
  settings = Object.values(data);
  return Object.values(settings).map((section) => {
    return section.options ? /* @__PURE__ */ React.createElement("section", { onClick: handleClick, className: `urlslab-settingsPanel-section ${className}`, key: section.id }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-settingsPanel urlslab-panel flex-tablet-landscape" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-settingsPanel-desc" }, /* @__PURE__ */ React.createElement("h4", null, section.title), /* @__PURE__ */ React.createElement("p", null, section.description)), /* @__PURE__ */ React.createElement("div", { className: "urlslab-settingsPanel-options" }, Object.values(section.options).map((option) => {
      return /* @__PURE__ */ React.createElement(SettingsOption, { settingId, option, key: option.id });
    })))) : "";
  });
}
export {
  Settings as default
};
