import { u as useI18n, r as reactExports, h as useQuery, R as React, d as delay, F as postFetch } from "../main-nsioqhovv8.js";
import { I as InputField } from "./datepicker-nsioqhovv8.js";
import "./ModuleViewHeaderBottom-nsioqhovv8.js";
function SuggestInputField(props) {
  const { defaultValue, suggestInput, maxItems, description, onChange } = props;
  const { __ } = useI18n();
  const disabledKeys = { 38: 1, 40: 1 };
  const ref = reactExports.useRef();
  const inputRef = reactExports.useRef();
  const [index, setIndex] = reactExports.useState();
  const [input, setInput] = reactExports.useState(replaceChars(suggestInput));
  const [suggestion, setSuggestion] = reactExports.useState(defaultValue);
  const [suggestionsList, setSuggestionsList] = reactExports.useState([]);
  const [suggestionsVisible, showSuggestions] = reactExports.useState();
  const descriptionHeight = reactExports.useRef();
  let suggestionsPanel;
  const activeDomain = suggestInput.includes("http") ? suggestInput : "";
  let baseDomain = activeDomain == null ? void 0 : activeDomain.replace(/(https?:\/\/)?([^\.]+?\.)?([^\/]+?\..+?)\/.+$/, "$3");
  if (input == null ? void 0 : input.includes("http")) {
    baseDomain = input == null ? void 0 : input.replace(/(https?:\/\/)?(www\.)?(.+?)$/, "$3");
  }
  baseDomain = baseDomain == null ? void 0 : baseDomain.replace(".local", ".com");
  const suggestedDomains = reactExports.useMemo(() => {
    if (activeDomain) {
      return [
        activeDomain == null ? void 0 : activeDomain.replace(/(https?:\/\/)([^\.]+?\.)?([^\/]+?\...+?\/).+$/, `$1${!activeDomain.includes(".local") ? "www." : ""}$3`),
        activeDomain == null ? void 0 : activeDomain.replace(/(https?:\/\/).+/, `$1${baseDomain}`)
      ];
    }
    return [];
  }, [activeDomain, baseDomain]);
  const handleTyping = (val, type) => {
    inputRef.current = val;
    if (type !== "keyup") {
      onChange(val);
    }
    if (type === "keyup" && !disabledKeys[val.keyCode]) {
      const value = val.target.value;
      delay(() => {
        if (value === inputRef.current) {
          setInput(value);
        }
      }, 2e3)();
      return false;
    }
    const scrollTo = () => {
      suggestionsPanel.scrollTop = suggestionsPanel.querySelectorAll("li")[index].offsetTop - suggestionsPanel.offsetTop;
    };
    if (val.keyCode === 38 && index > 0) {
      setIndex((i) => i - 1);
      scrollTo();
    }
    if (val.keyCode === 40 && !index) {
      setIndex(0);
    }
    if (val.keyCode === 40 && index < suggestionsList.length - 1) {
      setIndex((i) => i + 1);
      scrollTo();
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
          count: maxItems || 10,
          keyword: !(suggestInput == null ? void 0 : suggestInput.includes("http")) ? suggestInput : replaceChars(input),
          domain: baseDomain
        });
        if (result.ok) {
          return result.json();
        }
        return [];
      }
    },
    refetchOnWindowFocus: false
  });
  function replaceChars(inputVal) {
    const valToReplace = inputVal.replace(/^(https?:\/\/)[^\/]+?\//, "");
    return valToReplace.replaceAll(/[\/\|\-_\*\+:\!,;&\?=\%]/g, " ");
  }
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
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-suggestInput pos-relative", key: suggestInput, ref, style: { zIndex: suggestionsVisible ? "10" : "0" } }, /* @__PURE__ */ React.createElement(InputField, { ...props, key: suggestion, defaultValue: suggestion, isLoading, onChange: (event) => handleTyping(event), onKeyDown: (event) => {
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
          handleTyping(suggest);
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
