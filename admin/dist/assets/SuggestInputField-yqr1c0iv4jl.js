import { u as useI18n, r as reactExports, h as useQuery, R as React, d as delay, F as postFetch } from "../main-yqr1c0iv4jl.js";
import { I as InputField } from "./datepicker-yqr1c0iv4jl.js";
import "./ModuleViewHeaderBottom-yqr1c0iv4jl.js";
function SuggestInputField(props) {
  const { suggestInput, maxItems, domain, onChange } = props;
  const { __ } = useI18n();
  const disabledKeys = { 37: 1, 38: 1, 39: 1, 40: 1 };
  const ref = reactExports.useRef();
  const didMountRef = reactExports.useRef(false);
  const [index, setIndex] = reactExports.useState(0);
  const [input, setInput] = reactExports.useState(suggestInput.includes("http") ? replaceChars(suggestInput) : "");
  const [suggestion, setSuggestion] = reactExports.useState();
  const [suggestionsList, setSuggestionsList] = reactExports.useState([]);
  const [suggestionsVisible, showSuggestions] = reactExports.useState();
  const activeDomain = suggestInput.includes("http") ? suggestInput : "";
  let baseDomain = activeDomain.replace(/(https?:\/\/)?([^\.]+?\.)?([^\/]+?\..+?)\/.+$/, "$3");
  if (input == null ? void 0 : input.includes("http")) {
    baseDomain = input == null ? void 0 : input.replace(/(https?:\/\/)?(www\.)?(.+?)$/, "$3");
  }
  baseDomain = baseDomain.replace(".local", ".com");
  const suggestedDomains = reactExports.useMemo(() => [
    activeDomain.replace(/(https?:\/\/)([^\.]+?\.)?([^\/]+?\...+?\/).+$/, `$1${!activeDomain.includes(".local") ? "www." : ""}$3`),
    activeDomain.replace(/(https?:\/\/).+/, `$1${baseDomain}`)
  ], [activeDomain, baseDomain]);
  const handleTyping = (val, type) => {
    if (type) {
      delay(() => {
        if (val !== input) {
          setInput(val);
        }
      }, 1e3)();
      return false;
    }
    setSuggestion(val);
    onChange(val);
  };
  const { data, isLoading } = useQuery({
    queryKey: [input],
    queryFn: async () => {
      if (input) {
        const result = await postFetch("keyword/suggest", {
          count: maxItems || 10,
          keyword: !suggestInput.includes("http") ? replaceChars(suggestInput) : replaceChars(input),
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
    window.addEventListener("keydown", preventDefaultForScrollKeys, false);
  }
  reactExports.useEffect(() => {
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
    if (onChange && didMountRef.current && !suggestionsVisible) {
      onChange(suggestion);
    }
    didMountRef.current = true;
    document.addEventListener("click", handleClickOutside, true);
  }, [data, suggestion, suggestionsVisible]);
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-suggestInput pos-relative", key: suggestInput, ref }, /* @__PURE__ */ React.createElement(InputField, { ...props, key: suggestion ? suggestion : suggestionsList[0], defaultValue: suggestion ? suggestion : suggestionsList[0], isLoading, onChange: (event) => handleTyping(event, true), onFocus: () => {
    setIndex(0);
    showSuggestions(true);
  } }), suggestionsVisible && /* @__PURE__ */ React.createElement("div", { className: "urlslab-suggestInput-suggestions pos-absolute fadeInto" }, /* @__PURE__ */ React.createElement("strong", { className: "fs-s" }, __("Suggested"), ":"), /* @__PURE__ */ React.createElement("ul", { className: "urlslab-suggestInput-suggestions-inn fs-s" }, suggestionsList && suggestionsList.length > 0 && suggestionsList.map((suggest) => {
    return suggest && /* @__PURE__ */ React.createElement("li", { key: suggest }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setSuggestion(suggest);
      showSuggestions(false);
    } }, suggest));
  }))));
}
export {
  SuggestInputField as S
};
