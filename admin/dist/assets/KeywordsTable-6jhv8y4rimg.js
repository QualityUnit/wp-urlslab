import { R as React, r as reactExports, u as useI18n, d as useQuery, i as postFetch, T as Tooltip, g as Tag$1, h as hexToHSL, L as Loader } from "../main-6jhv8y4rimg.js";
import { u as useTableUpdater, a as useInfiniteFetch, b as useChangeRow, L as LangMenu, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./useTableUpdater-6jhv8y4rimg.js";
import { u as useClickOutside, S as SortBy } from "./_ColumnsMenu-6jhv8y4rimg.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-6jhv8y4rimg.js";
/* empty css                        */import { I as InputField, S as SortMenu, C as Checkbox } from "./FilterMenu-6jhv8y4rimg.js";
import { S as SvgIconLink } from "./icon-link-6jhv8y4rimg.js";
import "./useMutation-6jhv8y4rimg.js";
const KeyNames = {
  Enter: "Enter",
  Escape: "Escape",
  Tab: "Tab",
  Backspace: "Backspace",
  UpArrow: "ArrowUp",
  UpArrowCompat: "Up",
  DownArrow: "ArrowDown",
  DownArrowCompat: "Down",
  PageDown: "PageDown",
  PageUp: "PageUp"
};
const NewOptionValue = Symbol("Create new tag");
const NoOptionsValue = Symbol("No options");
const VoidFn = () => void 0;
const GlobalContext = React.createContext(void 0);
function arrayDiff(a, b) {
  if (a === b) {
    return [];
  } else {
    return a.filter((item) => !b.includes(item));
  }
}
function isCaretAtStart(target) {
  return target.selectionStart === 0 && target.selectionEnd === 0;
}
function isCaretAtEnd(target) {
  const length = target.value.length;
  return target.selectionStart === length && target.selectionEnd === length;
}
function rootId(id) {
  return id;
}
function labelId(id) {
  return `${id}-label`;
}
function comboBoxId(id) {
  return `${id}-combobox`;
}
function inputId(id) {
  return `${id}-input`;
}
function listBoxId(id) {
  return `${id}-listbox`;
}
function optionId(id, tag) {
  return `${id}-option-${tagToId(tag)}`;
}
function getNewTag(option, value) {
  if ((option == null ? void 0 : option.value) === NewOptionValue && option.disabled === false) {
    return { value, label: value };
  }
}
function findSelectedOption(state) {
  const tag = getNewTag(state.activeOption, state.value) || state.activeOption || findSuggestionExact(state.value, state.options);
  return tag && !tag.disabled ? tag : void 0;
}
function loopOptionsIndex(next, size, min) {
  const max = size - 1;
  if (next > max) {
    return min;
  }
  if (next < min) {
    return max;
  }
  return next;
}
const ReplaceRegExp = /%value%/;
function replacePlaceholder(string, value) {
  return string.replace(ReplaceRegExp, value);
}
const Whitespace = /\s+/g;
function tagToKey(tag) {
  return `${String(tag.value)}-${tag.label}`;
}
function tagToId(tag) {
  return tagToKey(tag).replace(Whitespace, "_");
}
function findTagIndex(tag, tags) {
  return tags.findIndex(({ value }) => value === tag.value);
}
const EscapeRegExp = /[-\\^$*+?.()|[\]{}]/g;
function escapeForRegExp(string) {
  return string.replace(EscapeRegExp, "\\$&");
}
function partialRegExp(query) {
  return new RegExp(`${escapeForRegExp(query)}`, "i");
}
function exactRegExp(query) {
  return new RegExp(`^${escapeForRegExp(query)}$`, "i");
}
function matchPartial(query) {
  const regexp = partialRegExp(query);
  return (value) => regexp.test(value);
}
function matchExact(query) {
  const regexp = exactRegExp(query);
  return (value) => regexp.test(value);
}
function matchSuggestionsPartial(query, suggestions) {
  if (query === "") {
    return [].concat(suggestions);
  } else {
    const matcher = matchPartial(query);
    return suggestions.filter((item) => matcher(item.label));
  }
}
function findSuggestionExact(query, suggestions) {
  const matcher = matchExact(query);
  return suggestions.find((item) => matcher(item.label)) || null;
}
const DisableAutoCompleteAttrs = {
  autoComplete: "off",
  autoCorrect: "off",
  "data-form-type": "other",
  spellCheck: false
};
function useInput({
  allowBackspace,
  ariaDescribedBy,
  ariaErrorMessage,
  delimiterKeys
}) {
  const { id, comboBoxRef, inputRef, isDisabled, isInvalid, managerRef } = reactExports.useContext(GlobalContext);
  const events = reactExports.useMemo(() => {
    const onChange = (e) => {
      const value2 = e.currentTarget.value;
      managerRef.current.updateInputValue(value2);
      if (document.activeElement === inputRef.current) {
        managerRef.current.listBoxExpand();
      }
    };
    const onFocus = () => {
      managerRef.current.listBoxExpand();
    };
    const onBlur = (e) => {
      var _a;
      if (((_a = comboBoxRef.current) == null ? void 0 : _a.contains(e.relatedTarget)) === false) {
        managerRef.current.listBoxCollapse();
      }
    };
    const onClick = () => {
      managerRef.current.listBoxExpand();
    };
    const onDownArrowKey = (e) => {
      const { activeIndex, isExpanded: isExpanded2 } = managerRef.current.state;
      if (isExpanded2) {
        e.preventDefault();
        managerRef.current.updateActiveIndex(activeIndex + 1);
      } else if (isCaretAtEnd(e.currentTarget) || e.altKey) {
        e.preventDefault();
        managerRef.current.listBoxExpand();
      }
    };
    const onUpArrowKey = (e) => {
      const { activeIndex, isExpanded: isExpanded2 } = managerRef.current.state;
      if (isExpanded2) {
        e.preventDefault();
        managerRef.current.updateActiveIndex(activeIndex - 1);
      } else if (isCaretAtStart(e.currentTarget)) {
        e.preventDefault();
        managerRef.current.listBoxExpand();
      }
    };
    const onPageDownKey = (e) => {
      const { isExpanded: isExpanded2, options } = managerRef.current.state;
      if (isExpanded2) {
        e.preventDefault();
        managerRef.current.updateActiveIndex(options.length - 1);
      }
    };
    const onPageUpKey = (e) => {
      if (managerRef.current.state.isExpanded) {
        e.preventDefault();
        managerRef.current.updateActiveIndex(0);
      }
    };
    const onEscapeKey = () => {
      if (managerRef.current.state.isExpanded) {
        managerRef.current.listBoxCollapse();
      } else {
        managerRef.current.updateInputValue("");
      }
    };
    const onBackspaceKey = () => {
      if (allowBackspace) {
        const { value: value2, selected } = managerRef.current.state;
        const lastTag = selected[selected.length - 1];
        if (value2 === "" && lastTag) {
          managerRef.current.selectTag(lastTag);
        }
      }
    };
    const onDelimiterKey = (e) => {
      if (managerRef.current.state.isExpanded) {
        e.preventDefault();
        managerRef.current.selectTag();
      }
    };
    const onKeyDown = (e) => {
      if (e.key === KeyNames.UpArrow)
        return onUpArrowKey(e);
      if (e.key === KeyNames.DownArrow)
        return onDownArrowKey(e);
      if (e.key === KeyNames.PageUp)
        return onPageUpKey(e);
      if (e.key === KeyNames.PageDown)
        return onPageDownKey(e);
      if (e.key === KeyNames.Escape)
        return onEscapeKey();
      if (e.key === KeyNames.Backspace)
        return onBackspaceKey();
      if (delimiterKeys.includes(e.key))
        return onDelimiterKey(e);
    };
    return { onBlur, onChange, onClick, onFocus, onKeyDown };
  }, [allowBackspace, comboBoxRef, delimiterKeys, inputRef, managerRef]);
  const { activeOption, isExpanded, value } = managerRef.current.state;
  return {
    ...DisableAutoCompleteAttrs,
    "aria-autocomplete": "list",
    "aria-activedescendant": activeOption ? optionId(id, activeOption) : void 0,
    "aria-controls": listBoxId(id),
    "aria-describedby": ariaDescribedBy || void 0,
    "aria-disabled": isDisabled,
    "aria-errormessage": isInvalid && ariaErrorMessage || void 0,
    "aria-invalid": isInvalid,
    "aria-labelledby": labelId(id),
    "aria-expanded": isExpanded,
    id: inputId(id),
    onBlur: isDisabled ? VoidFn : events.onBlur,
    onChange: isDisabled ? VoidFn : events.onChange,
    onClick: isDisabled ? VoidFn : events.onClick,
    onFocus: isDisabled ? VoidFn : events.onFocus,
    onKeyDown: isDisabled ? VoidFn : events.onKeyDown,
    ref: inputRef,
    role: "combobox",
    type: "text",
    value
  };
}
const SizerStyles = {
  position: "absolute",
  width: 0,
  height: 0,
  visibility: "hidden",
  overflow: "scroll",
  whiteSpace: "pre"
};
const StyleProps = [
  "font-family",
  "font-size",
  "font-style",
  "font-weight",
  "letter-spacing",
  "text-transform"
];
function useInputSizer({ allowResize = true, text }) {
  const sizerRef = reactExports.useRef(null);
  const { inputRef } = reactExports.useContext(GlobalContext);
  const [width, setWidth] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (inputRef.current) {
      const inputStyle = window.getComputedStyle(inputRef.current);
      StyleProps.forEach((prop) => {
        var _a;
        const value = inputStyle.getPropertyValue(prop);
        (_a = sizerRef.current) == null ? void 0 : _a.style.setProperty(prop, value);
      });
    }
  }, [inputRef, sizerRef]);
  reactExports.useLayoutEffect(() => {
    var _a;
    if (allowResize) {
      const newWidth = Math.ceil(((_a = sizerRef.current) == null ? void 0 : _a.scrollWidth) ?? 0) + 2;
      if (width !== newWidth)
        setWidth(newWidth);
    }
  }, [allowResize, text, width]);
  return {
    width,
    sizerProps: {
      ref: sizerRef,
      style: SizerStyles
    }
  };
}
function useListBox() {
  const { id, inputRef, listBoxRef, managerRef } = reactExports.useContext(GlobalContext);
  const scrollToTop = managerRef.current.state.activeIndex === -1;
  const onFocus = reactExports.useCallback(
    (e) => {
      var _a;
      if (e.target !== inputRef.current) {
        (_a = inputRef.current) == null ? void 0 : _a.focus({ preventScroll: true });
      }
    },
    [inputRef]
  );
  reactExports.useEffect(() => {
    var _a;
    if (scrollToTop) {
      (_a = listBoxRef.current) == null ? void 0 : _a.scrollTo({ top: 0 });
    }
  }, [listBoxRef, scrollToTop]);
  return {
    "aria-labelledby": labelId(id),
    id: listBoxId(id),
    onFocus,
    ref: listBoxRef,
    role: "listbox",
    tabIndex: -1
  };
}
function useManager({
  activateFirstOption,
  allowNew,
  collapseOnSelect,
  newOptionText,
  noOptionsText,
  onAdd,
  onDelete,
  onCollapse,
  onExpand,
  onInput,
  onValidate,
  selected,
  suggestions,
  suggestionsTransform
}) {
  const ref = reactExports.useRef();
  const [lastActiveOption, setLastActiveOption] = reactExports.useState(null);
  const [isExpanded, setIsExpanded] = reactExports.useState(false);
  const [value, setValue] = reactExports.useState("");
  const options = reactExports.useMemo(() => {
    const opts = suggestionsTransform(value, suggestions);
    if (value) {
      if (allowNew) {
        opts.push({
          disabled: typeof onValidate === "function" ? !onValidate(value) : false,
          label: newOptionText,
          value: NewOptionValue
        });
      }
      if (opts.length === 0) {
        opts.push({
          disabled: true,
          label: noOptionsText,
          value: NoOptionsValue
        });
      }
    }
    return opts;
  }, [allowNew, newOptionText, noOptionsText, onValidate, suggestions, suggestionsTransform, value]);
  const optionIndex = lastActiveOption ? findTagIndex(lastActiveOption, options) : -1;
  const activeIndex = activateFirstOption ? Math.max(optionIndex, 0) : optionIndex;
  const activeOption = options[activeIndex];
  const state = {
    activeIndex,
    activeOption,
    isExpanded,
    options,
    selected,
    value
  };
  const flags = {
    tagsAdded: ref.current ? arrayDiff(selected, ref.current.state.selected) : [],
    tagsDeleted: ref.current ? arrayDiff(ref.current.state.selected, selected) : []
  };
  const api = {
    listBoxCollapse() {
      if (isExpanded) {
        setIsExpanded(false);
        setLastActiveOption(null);
        onCollapse == null ? void 0 : onCollapse();
      }
    },
    listBoxExpand() {
      if (!isExpanded) {
        setIsExpanded(true);
        setLastActiveOption(options[activeIndex]);
        onExpand == null ? void 0 : onExpand();
      }
    },
    updateActiveIndex(index) {
      const activeIndex2 = loopOptionsIndex(index, options.length, activateFirstOption ? 0 : -1);
      setLastActiveOption(options[activeIndex2]);
    },
    updateInputValue(newValue) {
      if (value !== newValue) {
        setValue(newValue);
        onInput == null ? void 0 : onInput(newValue);
      }
    },
    selectTag(tag) {
      tag ?? (tag = findSelectedOption(state));
      if (tag) {
        const tagIndex = findTagIndex(tag, state.selected);
        if (tagIndex > -1) {
          onDelete(tagIndex);
        } else {
          onAdd(tag);
        }
        if (collapseOnSelect) {
          this.listBoxCollapse();
        }
        this.updateInputValue("");
      }
    }
  };
  ref.current = { ...api, flags, state };
  return ref;
}
function useOption(index) {
  const { id, inputRef, managerRef } = reactExports.useContext(GlobalContext);
  const optionRef = reactExports.useRef(null);
  const option = managerRef.current.state.options[index];
  const active = index === managerRef.current.state.activeIndex;
  const disabled = option.disabled ?? false;
  const selected = findTagIndex(option, managerRef.current.state.selected) > -1;
  const onClick = reactExports.useCallback(() => {
    var _a;
    managerRef.current.selectTag();
    (_a = inputRef.current) == null ? void 0 : _a.focus();
  }, [inputRef, managerRef]);
  const onMouseDown = reactExports.useCallback(() => {
    if (index !== managerRef.current.state.activeIndex) {
      managerRef.current.updateActiveIndex(index);
    }
  }, [index, managerRef]);
  reactExports.useEffect(() => {
    var _a;
    if (active) {
      (_a = optionRef.current) == null ? void 0 : _a.scrollIntoView({ block: "nearest", inline: "start" });
    }
  }, [active, managerRef.current.state.options]);
  return {
    option: {
      ...option,
      active,
      disabled,
      index,
      selected
    },
    optionProps: {
      "aria-disabled": disabled,
      "aria-posinset": index + 1,
      "aria-selected": disabled ? void 0 : selected,
      "aria-setsize": managerRef.current.state.options.length,
      id: optionId(id, option),
      onClick,
      onMouseDown,
      ref: optionRef,
      role: "option",
      tabIndex: -1
    }
  };
}
function usePublicAPI({ inputRef, managerRef }) {
  const api = reactExports.useRef({
    input: {
      blur() {
        var _a;
        (_a = inputRef.current) == null ? void 0 : _a.blur();
      },
      focus() {
        var _a;
        (_a = inputRef.current) == null ? void 0 : _a.focus();
      },
      get value() {
        return managerRef.current.state.value;
      },
      set value(value) {
        if (typeof value !== "string") {
          value = String(value);
        }
        managerRef.current.updateInputValue(value);
      }
    },
    listBox: {
      collapse() {
        managerRef.current.listBoxCollapse();
      },
      expand() {
        managerRef.current.listBoxExpand();
      },
      get activeOption() {
        return managerRef.current.state.activeOption;
      },
      get isExpanded() {
        return managerRef.current.state.isExpanded;
      }
    },
    select(tag) {
      managerRef.current.selectTag(tag);
    }
  });
  return api.current;
}
function useRoot({ onBlur, onFocus }) {
  const [isActive, setIsActive] = reactExports.useState(false);
  const { id, inputRef } = reactExports.useContext(GlobalContext);
  const rootRef = reactExports.useRef(null);
  const rootProps = reactExports.useMemo(() => {
    return {
      "aria-describedby": labelId(id),
      id: rootId(id),
      onFocus() {
        setIsActive(true);
        onFocus == null ? void 0 : onFocus();
      },
      onBlur() {
        var _a;
        if (!((_a = rootRef.current) == null ? void 0 : _a.contains(document.activeElement))) {
          setIsActive(false);
          onBlur == null ? void 0 : onBlur();
        }
      },
      onClick() {
        var _a;
        if (document.activeElement === rootRef.current) {
          (_a = inputRef.current) == null ? void 0 : _a.focus();
        }
      },
      ref: rootRef,
      tabIndex: -1
    };
  }, [inputRef, id, onBlur, onFocus, rootRef]);
  return {
    isActive,
    rootProps
  };
}
function useSelectedTag(index, title) {
  const { isDisabled, managerRef } = reactExports.useContext(GlobalContext);
  const tag = managerRef.current.state.selected[index];
  const onClick = reactExports.useCallback(() => managerRef.current.selectTag(tag), [managerRef, tag]);
  return {
    tag,
    tagProps: {
      "aria-disabled": isDisabled,
      title: replacePlaceholder(title, tag.label),
      onClick: isDisabled ? VoidFn : onClick
    }
  };
}
function useTagList() {
  var _a;
  const { inputRef, managerRef } = reactExports.useContext(GlobalContext);
  const listRef = reactExports.useRef();
  const tagDeleted = managerRef.current.flags.tagsDeleted.length;
  const isFocusInList = (_a = listRef.current) == null ? void 0 : _a.contains(document.activeElement);
  reactExports.useLayoutEffect(() => {
    var _a2, _b;
    if (tagDeleted) {
      const isFocusInListNow = (_a2 = listRef.current) == null ? void 0 : _a2.contains(document.activeElement);
      if (isFocusInList && !isFocusInListNow) {
        (_b = inputRef.current) == null ? void 0 : _b.focus({ preventScroll: true });
      }
    }
  }, [inputRef, isFocusInList, listRef, tagDeleted]);
  return { listRef };
}
const VisuallyHiddenStyles = {
  position: "absolute",
  width: 1,
  height: 1,
  left: -9999,
  overflow: "hidden",
  clip: "rect(0 0 0 0)"
};
function Announcements({ ariaAddedText, ariaDeletedText }) {
  const { managerRef } = reactExports.useContext(GlobalContext);
  const logsRef = reactExports.useRef([]);
  managerRef.current.flags.tagsAdded.forEach((tag) => {
    logsRef.current.push(replacePlaceholder(ariaAddedText, tag.label));
  });
  managerRef.current.flags.tagsDeleted.forEach((tag) => {
    logsRef.current.push(replacePlaceholder(ariaDeletedText, tag.label));
  });
  return /* @__PURE__ */ React.createElement("div", { "aria-live": "polite", "aria-relevant": "additions", role: "status", style: VisuallyHiddenStyles }, logsRef.current.join("\n"));
}
function ComboBox({ children }) {
  const { classNames, comboBoxRef, id } = reactExports.useContext(GlobalContext);
  return /* @__PURE__ */ React.createElement("div", { className: classNames.comboBox, id: comboBoxId(id), ref: comboBoxRef }, children);
}
const DefaultInput = ({ classNames, inputWidth, ...inputProps }) => {
  return /* @__PURE__ */ React.createElement("input", { className: classNames.input, style: { width: inputWidth }, ...inputProps });
};
function Input({
  allowBackspace = true,
  allowResize = true,
  ariaDescribedBy,
  ariaErrorMessage,
  delimiterKeys,
  placeholderText,
  render = DefaultInput
}) {
  const { classNames } = reactExports.useContext(GlobalContext);
  const { value, ...inputProps } = useInput({
    allowBackspace,
    ariaDescribedBy,
    ariaErrorMessage,
    delimiterKeys
  });
  const text = value.length < placeholderText.length ? placeholderText : value;
  const { width, sizerProps } = useInputSizer({ allowResize, text });
  return /* @__PURE__ */ React.createElement(React.Fragment, null, render({
    classNames,
    inputWidth: width,
    placeholder: placeholderText,
    value,
    ...inputProps
  }), allowResize ? /* @__PURE__ */ React.createElement("div", { ...sizerProps }, text) : null);
}
const DefaultLabel = ({ children, classNames, id }) => {
  return /* @__PURE__ */ React.createElement("div", { className: classNames.label, id }, children);
};
function Label({ children, render = DefaultLabel }) {
  const { classNames, id } = reactExports.useContext(GlobalContext);
  return render({ children, classNames, id: labelId(id) });
}
function ListBox({ children }) {
  const { classNames, managerRef } = reactExports.useContext(GlobalContext);
  const listBoxProps = useListBox();
  if (!managerRef.current.state.isExpanded || React.Children.count(children) === 0)
    return null;
  return /* @__PURE__ */ React.createElement("div", { className: classNames.listBox, ...listBoxProps }, children);
}
const DefaultOption = ({ children, classNames, option, ...optionProps }) => {
  const classes = [classNames.option];
  if (option.active)
    classes.push(classNames.optionIsActive);
  return /* @__PURE__ */ React.createElement("div", { className: classes.join(" "), ...optionProps }, children);
};
function Option({ index, render = DefaultOption }) {
  const { classNames, managerRef } = reactExports.useContext(GlobalContext);
  const { option, optionProps } = useOption(index);
  const children = /* @__PURE__ */ React.createElement(MemoisedOptionText, { option, query: managerRef.current.state.value });
  return render({ classNames, children, option, ...optionProps });
}
function markText(name, value) {
  const regexp = partialRegExp(value);
  return name.replace(regexp, "<mark>$&</mark>");
}
function OptionText({ option, query }) {
  if (option.value === NewOptionValue || option.value === NoOptionsValue) {
    return /* @__PURE__ */ React.createElement("span", null, replacePlaceholder(option.label, query));
  } else {
    return /* @__PURE__ */ React.createElement("span", { dangerouslySetInnerHTML: { __html: markText(option.label, query) } });
  }
}
const MemoisedOptionText = React.memo(OptionText);
const DefaultRoot = ({
  children,
  classNames,
  isActive,
  isDisabled,
  isInvalid,
  ...rootProps
}) => {
  const classes = [classNames.root];
  if (isActive)
    classes.push(classNames.rootIsActive);
  if (isDisabled)
    classes.push(classNames.rootIsDisabled);
  if (isInvalid)
    classes.push(classNames.rootIsInvalid);
  return /* @__PURE__ */ React.createElement("div", { className: classes.join(" "), ...rootProps }, children);
};
function Root({ children, onBlur, onFocus, render = DefaultRoot }) {
  const { classNames, isDisabled, isInvalid } = reactExports.useContext(GlobalContext);
  const { isActive, rootProps } = useRoot({ onBlur, onFocus });
  return render({ children, classNames, isActive, isDisabled, isInvalid, ...rootProps });
}
const DefaultTag = ({ classNames, tag, ...tagProps }) => {
  return /* @__PURE__ */ React.createElement("button", { type: "button", className: classNames.tag, ...tagProps }, /* @__PURE__ */ React.createElement("span", { className: classNames.tagName }, tag.label));
};
function Tag({ render = DefaultTag, index, title }) {
  const { classNames } = reactExports.useContext(GlobalContext);
  const { tag, tagProps } = useSelectedTag(index, title);
  return render({ classNames, tag, ...tagProps });
}
function TagList({ children, label }) {
  const { classNames } = reactExports.useContext(GlobalContext);
  const { listRef } = useTagList();
  return /* @__PURE__ */ React.createElement("ul", { className: classNames.tagList, "aria-label": label, ref: listRef, role: "list" }, children.map((child) => /* @__PURE__ */ React.createElement("li", { className: classNames.tagListItem, key: child.key, role: "listitem" }, child)));
}
const DefaultClassNames = {
  root: "react-tags",
  rootIsActive: "is-active",
  rootIsDisabled: "is-disabled",
  rootIsInvalid: "is-invalid",
  label: "react-tags__label",
  tagList: "react-tags__list",
  tagListItem: "react-tags__list-item",
  tag: "react-tags__tag",
  tagName: "react-tags__tag-name",
  comboBox: "react-tags__combobox",
  input: "react-tags__combobox-input",
  listBox: "react-tags__listbox",
  option: "react-tags__listbox-option",
  optionIsActive: "is-active"
};
const DefaultDelimiterKeys = [KeyNames.Enter];
function ReactTags({
  activateFirstOption = false,
  allowBackspace = true,
  allowNew = false,
  allowResize = true,
  ariaAddedText = "Added tag %value%",
  ariaDescribedBy,
  ariaErrorMessage,
  ariaDeletedText = "Removed tag %value%",
  classNames = DefaultClassNames,
  collapseOnSelect = false,
  deleteButtonText = "Remove %value% from the list",
  delimiterKeys = DefaultDelimiterKeys,
  id = "react-tags",
  isDisabled = false,
  isInvalid = false,
  labelText = "Select tags",
  newOptionText = "Add %value%",
  noOptionsText = "No options found for %value%",
  onAdd,
  onBlur,
  onCollapse,
  onDelete,
  onExpand,
  onFocus,
  onInput,
  onValidate,
  placeholderText = "Add a tag",
  renderInput,
  renderLabel,
  renderOption,
  renderRoot,
  renderTag,
  selected = [],
  suggestions = [],
  suggestionsTransform = matchSuggestionsPartial,
  tagListLabelText = "Selected tags"
}, ref) {
  const comboBoxRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(null);
  const listBoxRef = reactExports.useRef(null);
  const managerRef = useManager({
    activateFirstOption,
    allowNew,
    collapseOnSelect,
    newOptionText,
    noOptionsText,
    onAdd,
    onDelete,
    onCollapse,
    onExpand,
    onInput,
    onValidate,
    selected,
    suggestions,
    suggestionsTransform
  });
  const publicAPI = usePublicAPI({ inputRef, managerRef });
  if (ref) {
    if (typeof ref === "function") {
      ref(publicAPI);
    } else {
      ref.current = publicAPI;
    }
  }
  return /* @__PURE__ */ React.createElement(
    GlobalContext.Provider,
    {
      value: {
        classNames,
        comboBoxRef,
        id,
        inputRef,
        isDisabled,
        isInvalid,
        listBoxRef,
        managerRef
      }
    },
    /* @__PURE__ */ React.createElement(Root, { onBlur, onFocus, render: renderRoot }, /* @__PURE__ */ React.createElement(Label, { render: renderLabel }, labelText), /* @__PURE__ */ React.createElement(TagList, { label: tagListLabelText }, managerRef.current.state.selected.map((tag, index) => /* @__PURE__ */ React.createElement(Tag, { key: tagToKey(tag), index, render: renderTag, title: deleteButtonText }))), /* @__PURE__ */ React.createElement(ComboBox, null, /* @__PURE__ */ React.createElement(
      Input,
      {
        allowBackspace,
        allowResize,
        ariaDescribedBy,
        ariaErrorMessage,
        delimiterKeys,
        placeholderText,
        render: renderInput
      }
    ), /* @__PURE__ */ React.createElement(ListBox, null, managerRef.current.state.options.map((tag, index) => /* @__PURE__ */ React.createElement(Option, { key: tagToKey(tag), index, render: renderOption })))), /* @__PURE__ */ React.createElement(Announcements, { ariaAddedText, ariaDeletedText }))
  );
}
const ReactTagsWithRef = React.forwardRef(ReactTags);
const _TagsMenu = "";
function TagsMenu({ tags, slug, onChange }) {
  const { __ } = useI18n();
  const tagsMenu = reactExports.useRef();
  const [tagsMenuActive, setTagsMenu] = reactExports.useState(false);
  const assignedTagsArray = tags == null ? void 0 : tags.replace(/^\|(.+)\|$/, "$1").split("|");
  const { data: tagsData } = useQuery({
    queryKey: ["label", "menu"],
    queryFn: async () => {
      const tagsFetch = await postFetch("label", { rows_per_page: 50 });
      const tagsArray = await tagsFetch.json();
      tagsArray == null ? void 0 : tagsArray.map((tag) => {
        const { lightness } = hexToHSL(tag.bgcolor);
        if (lightness < 70) {
          return tag.className = "dark";
        }
        return tag;
      });
      return tagsArray;
    },
    refetchOnWindowFocus: false
  });
  const [selected, setSelected] = reactExports.useState(() => {
    let tagsArray = [];
    if (assignedTagsArray.length && assignedTagsArray[0]) {
      assignedTagsArray == null ? void 0 : assignedTagsArray.map((id) => tagsData == null ? void 0 : tagsData.map((tag) => {
        if (tag.label_id === Number(id)) {
          tagsArray = [...tagsArray, tag];
        }
        return false;
      }));
    }
    return tagsArray;
  });
  const availableTags = reactExports.useMemo(() => {
    return tagsData == null ? void 0 : tagsData.filter((tag) => tag.modules.indexOf(slug) !== -1 || tag.modules.length || tag.modules.length === 1 && tag.modules[0] === "");
  }, [tagsData, slug]);
  const selectedToString = reactExports.useMemo(() => {
    const selectedIds = [];
    selected.map((tag) => selectedIds.push(tag.label_id));
    return selectedIds.join("|").replace(/^(.+)$/, "|$1|");
  }, [selected]);
  const close = reactExports.useCallback(() => {
    setTagsMenu(false);
    if (onChange && selectedToString !== tags) {
      onChange(selectedToString);
    }
  }, [onChange, selectedToString, tags]);
  useClickOutside(tagsMenu, close);
  const onAdd = reactExports.useCallback(
    async (newTag) => {
      if (newTag.label_id) {
        setSelected((selectedTags) => [...selectedTags, newTag]);
        return false;
      }
      const newTagToInsert = { name: newTag.label, bgcolor: "#EDEFF3" };
      const response = await postFetch(`label/create`, newTagToInsert);
      const { ok } = await response;
      if (ok) {
        let returnedTag = await response.json();
        returnedTag = { value: returnedTag.label_id, label: returnedTag.name, ...returnedTag };
        setSelected((selectedTags) => [...selectedTags, returnedTag]);
      }
      onChange(selectedToString);
    },
    []
  );
  const onDelete = reactExports.useCallback(
    (tag) => {
      setSelected(selected.filter((selectedTag) => selectedTag.label_id !== tag.label_id));
    },
    [selected]
  );
  function CustomTag({ classNames, tag, ...tagProps }) {
    const { label_id, className, bgcolor, label } = tag;
    return /* @__PURE__ */ React.createElement(Tag$1, { fullSize: tagsMenuActive, shape: !tagsMenuActive && "circle", onDelete: () => tagsMenuActive && onDelete(tag), key: label_id, className: `${classNames.tag} ${className}`, ...tagProps, style: { backgroundColor: bgcolor, cursor: tagsMenuActive ? "default" : "pointer" } }, tagsMenuActive ? label : label.charAt(0));
  }
  function CustomOption({ children, classNames, option, ...optionProps }) {
    const classes = [
      classNames.option,
      option.active ? "is-active" : "",
      option.selected ? "is-selected" : "",
      option.className ? option.className : ""
    ];
    return /* @__PURE__ */ React.createElement(Tag$1, { fullSize: true, className: classes.join(" "), style: { backgroundColor: option.bgcolor }, props: optionProps }, children);
  }
  return /* @__PURE__ */ React.createElement("div", { onClick: () => setTagsMenu(true), className: `urlslab-tagsmenu ${tagsMenuActive === true && "active"}`, ref: tagsMenu }, !tagsMenuActive === true && /* @__PURE__ */ React.createElement(Tooltip, { className: "showOnHover" }, __("Click to Add/remove tags")), /* @__PURE__ */ React.createElement(
    ReactTagsWithRef,
    {
      activateFirstOption: true,
      selected,
      allowNew: true,
      placeholderText: "Search…",
      suggestions: availableTags,
      onDelete,
      onAdd,
      renderTag: CustomTag,
      renderOption: CustomOption
    }
  ));
}
function KeywordsTable({ slug }) {
  var _a;
  const paginationId = "kw_id";
  const { table, setTable, rowToInsert, setInsertRow, filters, setFilters, sorting, sortBy } = useTableUpdater({ slug });
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
  const { row, selectedRows, selectRow, deleteRow, deleteSelectedRows, updateRow } = useChangeRow({ data, url, slug, paginationId });
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
  const inserterCells = {
    keyword: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.keyword, onChange: (val) => setInsertRow({ ...rowToInsert, keyword: val }), required: true }),
    urlLink: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, type: "url", defaultValue: "", label: header.urlLink, onChange: (val) => setInsertRow({ ...rowToInsert, urlLink: val }), required: true }),
    kwType: /* @__PURE__ */ React.createElement(SortMenu, { autoClose: true, items: keywordTypes, name: "kwType", checkedId: "M", onChange: (val) => setInsertRow({ ...rowToInsert, kwType: val }) }, header.kwType),
    kw_priority: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, type: "number", defaultValue: "0", min: "0", max: "255", label: header.kw_priority, onChange: (val) => setInsertRow({ ...rowToInsert, kw_priority: val }) }),
    lang: /* @__PURE__ */ React.createElement(LangMenu, { autoClose: true, checkedId: "all", onChange: (val) => setInsertRow({ ...rowToInsert, lang: val }) }, __("Language")),
    urlFilter: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.urlFilter, onChange: (val) => setInsertRow({ ...rowToInsert, urlFilter: val }) })
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { checked: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: () => /* @__PURE__ */ React.createElement(Checkbox, { onChange: () => console.log(data == null ? void 0 : data.pages) }),
      enableResizing: false
    }),
    columnHelper.accessor("keyword", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("strong", null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.keyword),
      minSize: 150
    }),
    columnHelper.accessor("urlLink", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { href: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.urlLink),
      enableResizing: false,
      size: 350
    }),
    columnHelper.accessor("kwType", {
      filterValMenu: keywordTypes,
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(SortMenu, { items: keywordTypes, name: cell.column.id, checkedId: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.kwType),
      size: 100
    }),
    columnHelper.accessor("labels", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(TagsMenu, { tags: cell.getValue(), slug, onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: header.labels,
      size: 180
    }),
    columnHelper.accessor("kw_length", {
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.kw_length),
      size: 80
    }),
    columnHelper.accessor("kw_priority", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(
        InputField,
        {
          type: "number",
          defaultValue: cell.getValue(),
          onChange: (newVal) => updateRow({ newVal, cell })
        }
      ),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.kw_priority),
      size: 80
    }),
    columnHelper.accessor("lang", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(
        LangMenu,
        {
          checkedId: cell == null ? void 0 : cell.getValue(),
          onChange: (newVal) => updateRow({ newVal, cell })
        }
      ),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.lang),
      size: 165
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
      size: 70
    }),
    columnHelper.accessor("urlFilter", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(
        InputField,
        {
          defaultValue: cell.renderValue(),
          onChange: (newVal) => updateRow({ newVal, cell })
        }
      ),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.urlFilter),
      size: 100
    }),
    columnHelper.accessor("delete", {
      className: "deleteRow",
      tooltip: () => /* @__PURE__ */ React.createElement(Tooltip, { className: "align-left xxxl" }, __("Delete item")),
      cell: (cell) => /* @__PURE__ */ React.createElement(SvgIconTrash, { onClick: () => deleteRow({ cell }) }),
      header: null
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
      onDeleteSelected: deleteSelectedRows,
      onFilter: (filter) => setFilters(filter),
      onClearRow: (clear) => {
        setInsertRow();
        if (clear === "rowInserted") {
          setInsertRow(clear);
          setTimeout(() => {
            setInsertRow();
          }, 3e3);
        }
      },
      detailsOptions,
      insertOptions: { inserterCells, title: "Add keyword", data, slug, url, paginationId, rowToInsert },
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
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, `${header.keyword} “${row.keyword}”`, " ", __("has been deleted.")) : null,
    rowToInsert === "rowInserted" ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("Keyword has been added.")) : null,
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sorting } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  KeywordsTable as default
};
