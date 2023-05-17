import { u as useI18n } from "../main-404k5a6epk.js";
function useRedirectTableMenus() {
  const { __ } = useI18n();
  const redirectTypes = Object.freeze({
    301: "301 Moved Permanently",
    302: "302 Found, Moved temporarily",
    303: "303 See Other",
    307: "307 Temporary Redirect",
    308: "308 Permanent Redirect"
  });
  const matchTypes = Object.freeze({
    E: "Exact match",
    S: "Contains",
    R: "Regexp"
  });
  const logginTypes = Object.freeze({
    Y: "Logged in",
    N: "Not logged",
    A: "Any"
  });
  const notFoundTypes = Object.freeze({
    Y: "Page Not Found",
    N: "Page Found",
    A: "Any"
  });
  const header = Object.freeze({
    match_type: __("Match type"),
    match_url: __("URL"),
    replace_url: __("Redirect to"),
    redirect_code: __("HTTP code"),
    is_logged: __("Is logged in"),
    labels: __("Tags"),
    capabilities: __("Capabilities"),
    roles: __("Roles"),
    browser: __("Browser"),
    cookie: __("Cookies"),
    headers: __("Request headers"),
    params: __("Request parameters"),
    ip: __("Visitor IP"),
    if_not_found: __("Page status"),
    cnt: __("Redirects count")
  });
  return { redirectTypes, matchTypes, logginTypes, notFoundTypes, header };
}
export {
  useRedirectTableMenus as u
};
