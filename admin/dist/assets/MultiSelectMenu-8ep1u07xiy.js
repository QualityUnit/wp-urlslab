import { S as Subscribable, o as shallowEqualObjects, q as getDefaultState, t as notifyManager, v as parseMutationArgs, a as useQueryClient, r as reactExports, w as useSyncExternalStore, x as shouldThrowError, R as React, u as useI18n } from "../main-8ep1u07xiy.js";
class MutationObserver extends Subscribable {
  constructor(client, options) {
    super();
    this.client = client;
    this.setOptions(options);
    this.bindMethods();
    this.updateResult();
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _this$currentMutation;
    const prevOptions = this.options;
    this.options = this.client.defaultMutationOptions(options);
    if (!shallowEqualObjects(prevOptions, this.options)) {
      this.client.getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: this.currentMutation,
        observer: this
      });
    }
    (_this$currentMutation = this.currentMutation) == null ? void 0 : _this$currentMutation.setOptions(this.options);
  }
  onUnsubscribe() {
    if (!this.listeners.length) {
      var _this$currentMutation2;
      (_this$currentMutation2 = this.currentMutation) == null ? void 0 : _this$currentMutation2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    this.updateResult();
    const notifyOptions = {
      listeners: true
    };
    if (action.type === "success") {
      notifyOptions.onSuccess = true;
    } else if (action.type === "error") {
      notifyOptions.onError = true;
    }
    this.notify(notifyOptions);
  }
  getCurrentResult() {
    return this.currentResult;
  }
  reset() {
    this.currentMutation = void 0;
    this.updateResult();
    this.notify({
      listeners: true
    });
  }
  mutate(variables, options) {
    this.mutateOptions = options;
    if (this.currentMutation) {
      this.currentMutation.removeObserver(this);
    }
    this.currentMutation = this.client.getMutationCache().build(this.client, {
      ...this.options,
      variables: typeof variables !== "undefined" ? variables : this.options.variables
    });
    this.currentMutation.addObserver(this);
    return this.currentMutation.execute();
  }
  updateResult() {
    const state = this.currentMutation ? this.currentMutation.state : getDefaultState();
    const result = {
      ...state,
      isLoading: state.status === "loading",
      isSuccess: state.status === "success",
      isError: state.status === "error",
      isIdle: state.status === "idle",
      mutate: this.mutate,
      reset: this.reset
    };
    this.currentResult = result;
  }
  notify(options) {
    notifyManager.batch(() => {
      if (this.mutateOptions && this.hasListeners()) {
        if (options.onSuccess) {
          var _this$mutateOptions$o, _this$mutateOptions, _this$mutateOptions$o2, _this$mutateOptions2;
          (_this$mutateOptions$o = (_this$mutateOptions = this.mutateOptions).onSuccess) == null ? void 0 : _this$mutateOptions$o.call(_this$mutateOptions, this.currentResult.data, this.currentResult.variables, this.currentResult.context);
          (_this$mutateOptions$o2 = (_this$mutateOptions2 = this.mutateOptions).onSettled) == null ? void 0 : _this$mutateOptions$o2.call(_this$mutateOptions2, this.currentResult.data, null, this.currentResult.variables, this.currentResult.context);
        } else if (options.onError) {
          var _this$mutateOptions$o3, _this$mutateOptions3, _this$mutateOptions$o4, _this$mutateOptions4;
          (_this$mutateOptions$o3 = (_this$mutateOptions3 = this.mutateOptions).onError) == null ? void 0 : _this$mutateOptions$o3.call(_this$mutateOptions3, this.currentResult.error, this.currentResult.variables, this.currentResult.context);
          (_this$mutateOptions$o4 = (_this$mutateOptions4 = this.mutateOptions).onSettled) == null ? void 0 : _this$mutateOptions$o4.call(_this$mutateOptions4, void 0, this.currentResult.error, this.currentResult.variables, this.currentResult.context);
        }
      }
      if (options.listeners) {
        this.listeners.forEach((listener) => {
          listener(this.currentResult);
        });
      }
    });
  }
}
function useMutation(arg1, arg2, arg3) {
  const options = parseMutationArgs(arg1, arg2, arg3);
  const queryClient = useQueryClient({
    context: options.context
  });
  const [observer] = reactExports.useState(() => new MutationObserver(queryClient, options));
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = useSyncExternalStore(reactExports.useCallback((onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)), [observer]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
  const mutate = reactExports.useCallback((variables, mutateOptions) => {
    observer.mutate(variables, mutateOptions).catch(noop);
  }, [observer]);
  if (result.error && shouldThrowError(observer.options.useErrorBoundary, [result.error])) {
    throw result.error;
  }
  return {
    ...result,
    mutate,
    mutateAsync: result.mutate
  };
}
function noop() {
}
const _Inputs = "";
const _Checkbox = "";
function Checkbox({ defaultValue, smallText, readOnly, radial, name, className, onChange, textBefore, children }) {
  const [isChecked, setChecked] = reactExports.useState(defaultValue ? true : false);
  const handleOnChange = () => {
    if (onChange && !readOnly) {
      onChange(!isChecked);
    }
    if (!readOnly) {
      setChecked((state) => !state);
    }
  };
  return /* @__PURE__ */ React.createElement("label", { className: `urlslab-checkbox ${className || ""} ${textBefore ? "textBefore" : ""} ${radial ? "radial" : ""}` }, /* @__PURE__ */ React.createElement(
    "input",
    {
      className: `urlslab-checkbox-input ${defaultValue ? "checked" : ""}`,
      type: name ? "radio" : "checkbox",
      name: name || "",
      defaultChecked: isChecked,
      onChange: (event) => handleOnChange()
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "urlslab-checkbox-box" }), /* @__PURE__ */ React.createElement("span", { className: `urlslab-checkbox-text ${smallText ? "fs-xm" : ""}`, dangerouslySetInnerHTML: { __html: children } }));
}
const _MultiSelectMenu = "";
function MultiSelectMenu({
  id,
  className,
  asTags,
  style,
  children,
  items,
  description,
  defaultValue,
  isFilter,
  onChange
}) {
  let checkedNow = defaultValue || [];
  if (defaultValue && typeof defaultValue === "string") {
    checkedNow = defaultValue.split(/[,\|]/);
  }
  const { __ } = useI18n();
  const [isActive, setActive] = reactExports.useState(false);
  const [isVisible, setVisible] = reactExports.useState(false);
  const [checked, setChecked] = reactExports.useState(checkedNow);
  const ref = reactExports.useRef(id || Math.floor(Math.random() * 1e4));
  const didMountRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    const handleClickOutside = (event) => {
      var _a, _b;
      if (!((_a = ref.current) == null ? void 0 : _a.contains(event.target)) && isActive && ((_b = ref.current) == null ? void 0 : _b.id) === id) {
        setActive(false);
        setVisible(false);
      }
    };
    if (onChange && didMountRef.current && !isActive && (checked == null ? void 0 : checked.filter((val) => !(checkedNow == null ? void 0 : checkedNow.includes(val))))) {
      onChange(checked);
    }
    didMountRef.current = true;
    document.addEventListener("click", handleClickOutside, false);
  }, [id, isActive]);
  const checkedCheckbox = (target, isChecked) => {
    if (isChecked) {
      const checkedList = [...checked, target];
      checkedNow = [...new Set(checkedList)];
      setChecked([...new Set(checkedList)]);
    }
    if (!isChecked) {
      checkedNow = checked == null ? void 0 : checked.filter((item) => item !== target);
      setChecked(checked == null ? void 0 : checked.filter((item) => item !== target));
    }
  };
  const handleMenu = () => {
    setActive(!isActive);
    setTimeout(() => {
      setVisible(!isVisible);
    }, 100);
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: `urlslab-MultiSelectMenu ${className || ""} ${isActive ? "active" : ""}`, style, ref, id }, !isFilter && children ? /* @__PURE__ */ React.createElement("div", { className: "urlslab-inputField-label", dangerouslySetInnerHTML: { __html: children } }) : null, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: `urlslab-MultiSelectMenu__title ${isFilter ? "isFilter" : ""} ${isActive ? "active" : ""}`,
      onClick: handleMenu,
      onKeyUp: (event) => handleMenu(),
      role: "button",
      tabIndex: 0
    },
    !isFilter ? /* @__PURE__ */ React.createElement("span", null, asTags ? checked == null ? void 0 : checked.map((itemId) => `${items[itemId]}, `) : `${checked == null ? void 0 : checked.length} ${__("items selected")}`) : null,
    /* @__PURE__ */ React.createElement("span", { dangerouslySetInnerHTML: { __html: isFilter ? children : items[checked] } })
  ), /* @__PURE__ */ React.createElement("div", { className: `urlslab-MultiSelectMenu__items ${isActive ? "active" : ""} ${isVisible ? "visible" : ""}` }, /* @__PURE__ */ React.createElement("div", { className: `urlslab-MultiSelectMenu__items--inn ${(items == null ? void 0 : items.length) > 8 ? "has-scrollbar" : ""}` }, Object.entries(items).map(([itemId, value]) => {
    return /* @__PURE__ */ React.createElement(
      Checkbox,
      {
        className: "urlslab-MultiSelectMenu__item",
        key: itemId,
        id: itemId,
        onChange: (isChecked) => checkedCheckbox(itemId, isChecked),
        defaultValue: checked == null ? void 0 : checked.includes(itemId)
      },
      value
    );
  })))), description && /* @__PURE__ */ React.createElement("p", { className: "urlslab-inputField-description" }, description));
}
export {
  Checkbox as C,
  MultiSelectMenu as M,
  useMutation as u
};
