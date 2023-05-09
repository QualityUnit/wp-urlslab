import { u as useI18n, r as reactExports, d as useQuery, G as postFetch, R as React, T as Tooltip, g as Tag, h as hexToHSL } from "../main-i2quehqn9g.js";
import { u as useClickOutside, a as ReactTagsWithRef } from "./_ColumnsMenu-i2quehqn9g.js";
function TagsMenu({ defaultValue: tags, slug, onChange }) {
  const { __ } = useI18n();
  const tagsMenuWrap = reactExports.useRef();
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
    refetchOnWindowFocus: false,
    cacheTime: Infinity,
    staleTime: Infinity
  });
  const [selected, setSelected] = reactExports.useState(() => {
    let tagsArray = [];
    if ((assignedTagsArray == null ? void 0 : assignedTagsArray.length) && assignedTagsArray[0]) {
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
  useClickOutside(tagsMenuWrap, close);
  const openTagsMenu = reactExports.useCallback(() => {
    setTagsMenu(true);
    tagsMenu.current.listBox.expand();
  }, []);
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
  function CustomInput({ classNames, inputWidth, ...inputProps }) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("input", { className: classNames.input, style: { width: inputWidth }, ...inputProps }), (selected == null ? void 0 : selected.length) === 5 && /* @__PURE__ */ React.createElement("div", { className: "fs-s c-saturated-red bg-desaturated-red p-m" }, __("5 tags is max limit")));
  }
  function CustomTag({ classNames, tag, ...tagProps }) {
    const { label_id, className, bgcolor, label } = tag;
    return /* @__PURE__ */ React.createElement(Tag, { fullSize: tagsMenuActive, shape: !tagsMenuActive && "circle", onDelete: () => tagsMenuActive && onDelete(tag), key: label_id, className: `${classNames.tag} ${className}`, ...tagProps, style: { backgroundColor: bgcolor, cursor: tagsMenuActive ? "default" : "pointer" } }, tagsMenuActive ? label : label.charAt(0));
  }
  function CustomOption({ children, classNames, option, ...optionProps }) {
    const classes = [
      classNames.option,
      option.active ? "is-active" : "",
      option.selected ? "is-selected" : "",
      option.className ? option.className : ""
    ];
    if ((selected == null ? void 0 : selected.length) === 5) {
      optionProps["aria-disabled"] = true;
      delete optionProps.onClick;
      delete optionProps.onMouseDown;
    }
    return /* @__PURE__ */ React.createElement(Tag, { fullSize: true, className: classes.join(" "), style: { backgroundColor: option.bgcolor }, props: optionProps }, children);
  }
  return /* @__PURE__ */ React.createElement("div", { onClick: openTagsMenu, className: `urlslab-tagsmenu ${tagsMenuActive === true && "active"}`, ref: tagsMenuWrap }, !tagsMenuActive === true && /* @__PURE__ */ React.createElement(Tooltip, { className: "showOnHover" }, __("Click to Add/remove tags")), /* @__PURE__ */ React.createElement(
    ReactTagsWithRef,
    {
      ref: tagsMenu,
      activateFirstOption: true,
      selected,
      allowNew: true,
      placeholderText: "Search…",
      suggestions: availableTags,
      onDelete,
      onAdd,
      renderInput: CustomInput,
      renderTag: CustomTag,
      renderOption: CustomOption
    }
  ));
}
export {
  TagsMenu as T
};
