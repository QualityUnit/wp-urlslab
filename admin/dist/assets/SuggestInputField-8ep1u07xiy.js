import { u as useI18n, r as reactExports, i as useQuery, R as React, d as delay, H as postFetch } from "../main-8ep1u07xiy.js";
import { I as InputField } from "./datepicker-8ep1u07xiy.js";
import "./ModuleViewHeaderBottom-8ep1u07xiy.js";
function SuggestInputField(props) {
  const { defaultValue, suggestInput, maxItems, description, onChange } = props;
  const { __ } = useI18n();
  const disabledKeys = { 38: 1, 40: 1 };
  const ref = reactExports.useRef();
  const inputRef = reactExports.useRef();
  const [index, setIndex] = reactExports.useState();
  const [input, setInput] = reactExports.useState(inputRef.current);
  const [suggestion, setSuggestion] = reactExports.useState(input ? input : defaultValue);
  const [suggestionsList, setSuggestionsList] = reactExports.useState([]);
  const [suggestionsVisible, showSuggestions] = reactExports.useState();
  const descriptionHeight = reactExports.useRef();
  let suggestionsPanel;
  const suggestedDomains = reactExports.useMemo(() => {
    if (input) {
      return [input];
    }
    return [];
  }, [input]);
  const scrollTo = () => {
    if (index || index === 0) {
      suggestionsPanel.scrollTop = suggestionsPanel.querySelectorAll("li")[index].offsetTop - suggestionsPanel.offsetTop;
    }
  };
  const handleTyping = (val, type) => {
    if (!type || !val) {
      return false;
    }
    if (val.keyCode === 38) {
      if (index > 0) {
        setIndex((i) => i - 1);
        scrollTo();
      }
      return false;
    } else if (val.keyCode === 40) {
      if (index < suggestionsList.length - 1) {
        setIndex((i) => i + 1);
      } else {
        setIndex(0);
      }
      scrollTo();
      return false;
    } else {
      inputRef.current = val;
      if (type === "onchange") {
        onChange(val);
      } else {
        delay(() => {
          setInput(val.target.value);
        }, 800)();
      }
      return false;
    }
  };
  const handleEnter = () => {
    showSuggestions(false);
    if (index >= 0 && suggestionsList.length) {
      setSuggestion(suggestionsList[index]);
      onChange(suggestionsList[index]);
    }
  };
  const { data, isLoading } = useQuery({
    queryKey: [input],
    queryFn: async () => {
      if (input) {
        const result = await postFetch("keyword/suggest", {
          count: maxItems || 15,
          keyword: suggestInput,
          url: input
        });
        if (result.ok) {
          showSuggestions(true);
          return result.json();
        }
        return [];
      }
    },
    refetchOnWindowFocus: false
  });
  if (suggestionsVisible) {
    let preventDefault = function(e) {
      e.preventDefault();
    }, preventDefaultForScrollKeys = function(e) {
      if (disabledKeys[e.keyCode]) {
        preventDefault(e);
        return false;
      }
    };
    suggestionsPanel = ref.current.querySelector(".urlslab-suggestInput-suggestions-inn");
    window.addEventListener("keydown", preventDefaultForScrollKeys, false);
  }
  reactExports.useEffect(() => {
    descriptionHeight.current = description && ref.current.querySelector(".urlslab-inputField-description").getBoundingClientRect().height;
    setSuggestionsList(() => {
      if (data == null ? void 0 : data.length) {
        return [...suggestedDomains, ...data];
      }
      return [...suggestedDomains];
    });
    const handleClickOutside = (event) => {
      var _a;
      if (!((_a = ref.current) == null ? void 0 : _a.contains(event.target)) && suggestionsVisible) {
        showSuggestions(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
  }, [data, index, suggestionsList, suggestedDomains, suggestionsVisible]);
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-suggestInput pos-relative", key: suggestInput, ref, style: { zIndex: suggestionsVisible ? "10" : "0" } }, /* @__PURE__ */ React.createElement(InputField, { ...props, key: suggestion, defaultValue: suggestion, isLoading, onChange: (event) => handleTyping(event, "onchange"), onKeyDown: (event) => {
    if (event.key === "Enter") {
      handleEnter();
    }
  }, onKeyUp: (event) => handleTyping(event, "keyup"), onFocus: () => {
    setIndex();
    showSuggestions(true);
  } }), suggestionsVisible && (suggestionsList == null ? void 0 : suggestionsList.length) > 0 && /* @__PURE__ */ React.createElement("div", { className: "urlslab-suggestInput-suggestions pos-absolute fadeInto", style: descriptionHeight.current && { top: `calc(100% - ${descriptionHeight.current + 3}px)` } }, /* @__PURE__ */ React.createElement("strong", { className: "fs-s" }, __("Suggested"), ":"), /* @__PURE__ */ React.createElement("ul", { className: "urlslab-suggestInput-suggestions-inn fs-s" }, suggestionsList.map((suggest, id) => {
    return suggest && /* @__PURE__ */ React.createElement("li", { key: suggest, className: id === index ? "active" : "" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          handleTyping(suggest, "onchange");
          setSuggestion(suggest);
          showSuggestions(false);
        }
      },
      suggest
    ));
  }))));
}
export {
  SuggestInputField as S
};
