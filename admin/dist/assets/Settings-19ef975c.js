import { u as useI18n, r as reactExports, R as React, a as useQueryClient, p as parseURL, b as setSettings, c as useQuery, L as Loader, f as fetchSettings } from "../settings.js";
import { H as Ht } from "./index-9c451914.js";
import { I as InputField } from "./InputField-36e1e240.js";
import { S as Switch } from "./Switch-3776180b.js";
import { C as Checkbox, S as SortMenu } from "./datepicker-ff7dcd9b.js";
import { u as useMutation } from "./useMutation-6f0dd623.js";
function FilterMenu({
  id,
  className,
  asTags,
  style,
  children,
  items,
  checkedItems,
  isFilter,
  onChange
}) {
  const { __ } = useI18n();
  const [isActive, setActive] = reactExports.useState(false);
  const [isVisible, setVisible] = reactExports.useState(false);
  const [checked, setChecked] = reactExports.useState(checkedItems);
  const ref = reactExports.useRef(id);
  const didMountRef = reactExports.useRef(false);
  let checkedNow = checkedItems;
  reactExports.useEffect(() => {
    const handleClickOutside = (event) => {
      var _a, _b;
      if (!((_a = ref.current) == null ? void 0 : _a.contains(event.target)) && isActive && ((_b = ref.current) == null ? void 0 : _b.id) === id) {
        setActive(false);
        setVisible(false);
      }
    };
    if (onChange && didMountRef.current && !isActive && checked.filter((val) => !checkedNow.includes(val))) {
      onChange(checked);
    }
    didMountRef.current = true;
    document.addEventListener("click", handleClickOutside, false);
  }, [checkedNow, checked, id, isActive]);
  const checkedCheckbox = (target, isChecked) => {
    if (isChecked) {
      const checkedList = [...checked, target];
      checkedNow = [...new Set(checkedList)];
      setChecked([...new Set(checkedList)]);
    }
    if (!isChecked) {
      checkedNow = checked.filter((item) => item !== target);
      setChecked(checked.filter((item) => item !== target));
    }
  };
  const handleMenu = () => {
    setActive(!isActive);
    setTimeout(() => {
      setVisible(!isVisible);
    }, 100);
  };
  return /* @__PURE__ */ React.createElement("div", { className: `urlslab-FilterMenu ${className || ""} ${isActive ? "active" : ""}`, style, ref, id }, children ? /* @__PURE__ */ React.createElement("div", { className: "urlslab-inputField-label", dangerouslySetInnerHTML: { __html: children } }) : null, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: `urlslab-FilterMenu__title ${isFilter ? "isFilter" : ""} ${isActive ? "active" : ""}`,
      onClick: handleMenu,
      onKeyUp: (event) => handleMenu(),
      role: "button",
      tabIndex: 0
    },
    asTags ? checked.toString().replaceAll(",", ", ") : `${checked.length} ${__("items selected")}`
  ), /* @__PURE__ */ React.createElement("div", { className: `urlslab-FilterMenu__items ${isActive ? "active" : ""} ${isVisible ? "visible" : ""}` }, /* @__PURE__ */ React.createElement("div", { className: `urlslab-FilterMenu__items--inn ${items.length > 8 ? "has-scrollbar" : ""}` }, Object.entries(items).map(([itemId, value]) => {
    return /* @__PURE__ */ React.createElement(
      Checkbox,
      {
        className: "urlslab-FilterMenu__item",
        key: itemId,
        id: itemId,
        onChange: (isChecked) => checkedCheckbox(itemId, isChecked),
        checked: checked.includes(itemId)
      },
      value
    );
  }))));
}
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
        return /* @__PURE__ */ React.createElement(SortMenu, { className: "wide", name: id, items: possible_values, checkedId: value, onChange: (selectedId) => handleChange.mutate(selectedId) }, title);
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
    return section.options ? /* @__PURE__ */ React.createElement("section", { className: `urlslab-settingsPanel-section ${className}`, key: section.id }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-settingsPanel urlslab-panel flex-tablet-landscape" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-settingsPanel-desc" }, /* @__PURE__ */ React.createElement("h4", null, section.title), /* @__PURE__ */ React.createElement("p", null, section.description)), /* @__PURE__ */ React.createElement("div", { className: "urlslab-settingsPanel-options" }, Object.values(section.options).map((option) => {
      return /* @__PURE__ */ React.createElement(SettingsOption, { settingId, option, key: option.id });
    })))) : "";
  });
}
export {
  Settings as default
};
