import { a as useQueryClient, r as reactExports, R as React, p as parseURL, B as Button, f as fetchData, c as setSettings, u as useI18n, d as useQuery, L as Loader, T as Tooltip, e as fetchSettings } from "../main-i2quehqn9g.js";
import { M as MultiSelectMenu, S as SortMenu, H as Ht, I as InputField } from "./InputField-i2quehqn9g.js";
import { S as Switch } from "./Switch-i2quehqn9g.js";
/* empty css                       */import { u as useMutation } from "./useMutation-i2quehqn9g.js";
function SettingsOption({ settingId, option, renderTooltip }) {
  const queryClient = useQueryClient();
  const { id, type, title, description, placeholder, value, possible_values } = option;
  const [date, setDate] = reactExports.useState(type !== "datetime" || new Date(value));
  const [status, setStatus] = reactExports.useState();
  const handleApiCall = async () => {
    renderTooltip({ status: "activeApiCall", message: "Job is running…" });
    const result = await fetchData(value);
    if (result) {
      renderTooltip({ status: "successApiCall", message: result });
      setTimeout(() => {
        renderTooltip();
      }, 3e3);
      return false;
    }
    renderTooltip({ status: "errorApiCall", message: "Error occured" });
    setTimeout(() => {
      renderTooltip();
    }, 3e3);
  };
  const handleChange = useMutation({
    mutationFn: async (changeValue) => {
      setStatus("active");
      renderTooltip("active");
      const response = await setSettings(`${settingId}/${id}`, {
        value: changeValue
      });
      return { response };
    },
    onSuccess: async ({ response }) => {
      const { ok } = response;
      if (ok) {
        setStatus("success");
        renderTooltip("success");
        setTimeout(() => {
          setStatus();
          renderTooltip();
        }, 3e3);
        return false;
      }
      queryClient.invalidateQueries(["settings", settingId]);
      setStatus("error");
      renderTooltip("error");
      setTimeout(() => {
        setStatus();
        renderTooltip();
      }, 3e3);
    }
  });
  const processDate = () => {
    const thisDate = new Date(date);
    const currentDate = new Date(thisDate.getTime() - thisDate.getTimezoneOffset() * 6e4);
    return currentDate;
  };
  const handleDate = useMutation({
    mutationFn: async () => {
      setStatus("active");
      renderTooltip("active");
      const response = await setSettings(`${settingId}/${id}`, {
        value: processDate().toISOString().replace(/^(.+?)T(.+?)\..+$/g, "$1 $2")
      });
      return { response };
    },
    onSuccess: async ({ response }) => {
      const { ok } = response;
      if (ok) {
        setStatus("success");
        renderTooltip("success");
        queryClient.invalidateQueries(["settings", settingId]);
        setTimeout(() => {
          setStatus();
          renderTooltip();
        }, 3e3);
        return false;
      }
      setStatus("error");
      renderTooltip("error");
      setTimeout(() => {
        setStatus();
        renderTooltip();
      }, 3e3);
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
      case "api_button":
        return /* @__PURE__ */ React.createElement(
          Button,
          {
            active: true,
            onClick: handleApiCall
          },
          title
        );
      case "checkbox":
        return /* @__PURE__ */ React.createElement(
          Switch,
          {
            className: "option flex",
            label: title,
            checked: value,
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
              handleDate.mutate();
            }
          }
        ));
      case "listbox":
        return /* @__PURE__ */ React.createElement(SortMenu, { key: id, className: "wide", name: id, items: possible_values, defaultValue: value, autoClose: true, onChange: (selectedId) => handleChange.mutate(selectedId) }, title);
      case "multicheck":
        return /* @__PURE__ */ React.createElement(
          MultiSelectMenu,
          {
            className: "wide",
            items: possible_values,
            defaultValue: value,
            key: id,
            id,
            asTags: true,
            onChange: (selectedItems) => handleChange.mutate(selectedItems)
          },
          title
        );
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-settingsPanel-option" }, status !== "error" && renderOption(), status === "error" && renderOption(), /* @__PURE__ */ React.createElement("p", { className: "urlslab-settingsPanel-option__desc", dangerouslySetInnerHTML: { __html: parseURL(description) } }));
}
const _Settings = "";
function Settings({ className, settingId }) {
  const { __ } = useI18n();
  const queryClient = useQueryClient();
  const [tooltipStatus, setTooltipStatus] = reactExports.useState();
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
  const renderStatus = () => {
    let currentStatus = tooltipStatus;
    let message;
    if (typeof tooltipStatus === "object") {
      currentStatus = tooltipStatus.status;
      message = tooltipStatus.message;
    }
    switch (currentStatus) {
      case "active":
        return /* @__PURE__ */ React.createElement(Tooltip, { className: "fixedBottom" }, __("Updating…"));
      case "success":
        return /* @__PURE__ */ React.createElement(Tooltip, { className: "fixedBottom successStatus" }, __("Setting updated"));
      case "error":
        return /* @__PURE__ */ React.createElement(Tooltip, { className: "fixedBottom errorStatus" }, __("Setting update failed"));
      case "activeApiCall":
        return /* @__PURE__ */ React.createElement(Tooltip, { className: "fixedBottom" }, message);
      case "successApiCall":
        return /* @__PURE__ */ React.createElement(Tooltip, { className: "fixedBottom successStatus" }, message);
      case "errorApiCall":
        return /* @__PURE__ */ React.createElement(Tooltip, { className: "fixedBottom errorStatus" }, message);
    }
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, renderStatus(), Object.values(settings).map((section) => {
    return section.options ? /* @__PURE__ */ React.createElement("section", { onClick: handleClick, className: `urlslab-settingsPanel-section ${className}`, key: section.id }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-settingsPanel urlslab-panel flex-tablet-landscape" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-settingsPanel-desc" }, /* @__PURE__ */ React.createElement("h4", null, section.title), /* @__PURE__ */ React.createElement("p", null, section.description)), /* @__PURE__ */ React.createElement("div", { className: "urlslab-settingsPanel-options" }, Object.values(section.options).map((option) => {
      return /* @__PURE__ */ React.createElement(SettingsOption, { settingId, option, key: option.id, renderTooltip: (tooltipstatus) => setTooltipStatus(tooltipstatus) });
    })))) : "";
  }));
}
export {
  Settings as default
};
