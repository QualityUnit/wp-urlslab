import { n as commonjsGlobal, R as React, r as reactExports, i as Tooltip, L as Loader } from "../main-wr0uobcc1sl.js";
import { a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, d as SortBy, f as SvgIconPlus, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-wr0uobcc1sl.js";
import { T as TagsMenu } from "./TagsMenu-wr0uobcc1sl.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-wr0uobcc1sl.js";
import "./MultiSelectMenu-wr0uobcc1sl.js";
import { S as SortMenu, I as InputField } from "./datepicker-wr0uobcc1sl.js";
import { C as Checkbox } from "./Checkbox-wr0uobcc1sl.js";
import { u as useRedirectTableMenus } from "./useRedirectTableMenus-wr0uobcc1sl.js";
var uaParserExports = {};
var uaParser = {
  get exports() {
    return uaParserExports;
  },
  set exports(v) {
    uaParserExports = v;
  }
};
(function(module, exports) {
  (function(window2, undefined$1) {
    var LIBVERSION = "1.0.35", EMPTY = "", UNKNOWN = "?", FUNC_TYPE = "function", UNDEF_TYPE = "undefined", OBJ_TYPE = "object", STR_TYPE = "string", MAJOR = "major", MODEL = "model", NAME = "name", TYPE = "type", VENDOR = "vendor", VERSION = "version", ARCHITECTURE = "architecture", CONSOLE = "console", MOBILE = "mobile", TABLET = "tablet", SMARTTV = "smarttv", WEARABLE = "wearable", EMBEDDED = "embedded", UA_MAX_LENGTH = 350;
    var AMAZON = "Amazon", APPLE = "Apple", ASUS = "ASUS", BLACKBERRY = "BlackBerry", BROWSER = "Browser", CHROME = "Chrome", EDGE = "Edge", FIREFOX = "Firefox", GOOGLE = "Google", HUAWEI = "Huawei", LG = "LG", MICROSOFT = "Microsoft", MOTOROLA = "Motorola", OPERA = "Opera", SAMSUNG = "Samsung", SHARP = "Sharp", SONY = "Sony", XIAOMI = "Xiaomi", ZEBRA = "Zebra", FACEBOOK = "Facebook", CHROMIUM_OS = "Chromium OS", MAC_OS = "Mac OS";
    var extend = function(regexes2, extensions) {
      var mergedRegexes = {};
      for (var i in regexes2) {
        if (extensions[i] && extensions[i].length % 2 === 0) {
          mergedRegexes[i] = extensions[i].concat(regexes2[i]);
        } else {
          mergedRegexes[i] = regexes2[i];
        }
      }
      return mergedRegexes;
    }, enumerize = function(arr) {
      var enums = {};
      for (var i = 0; i < arr.length; i++) {
        enums[arr[i].toUpperCase()] = arr[i];
      }
      return enums;
    }, has = function(str1, str2) {
      return typeof str1 === STR_TYPE ? lowerize(str2).indexOf(lowerize(str1)) !== -1 : false;
    }, lowerize = function(str) {
      return str.toLowerCase();
    }, majorize = function(version) {
      return typeof version === STR_TYPE ? version.replace(/[^\d\.]/g, EMPTY).split(".")[0] : undefined$1;
    }, trim = function(str, len) {
      if (typeof str === STR_TYPE) {
        str = str.replace(/^\s\s*/, EMPTY);
        return typeof len === UNDEF_TYPE ? str : str.substring(0, UA_MAX_LENGTH);
      }
    };
    var rgxMapper = function(ua, arrays) {
      var i = 0, j, k, p, q, matches, match;
      while (i < arrays.length && !matches) {
        var regex = arrays[i], props = arrays[i + 1];
        j = k = 0;
        while (j < regex.length && !matches) {
          if (!regex[j]) {
            break;
          }
          matches = regex[j++].exec(ua);
          if (!!matches) {
            for (p = 0; p < props.length; p++) {
              match = matches[++k];
              q = props[p];
              if (typeof q === OBJ_TYPE && q.length > 0) {
                if (q.length === 2) {
                  if (typeof q[1] == FUNC_TYPE) {
                    this[q[0]] = q[1].call(this, match);
                  } else {
                    this[q[0]] = q[1];
                  }
                } else if (q.length === 3) {
                  if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                    this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined$1;
                  } else {
                    this[q[0]] = match ? match.replace(q[1], q[2]) : undefined$1;
                  }
                } else if (q.length === 4) {
                  this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined$1;
                }
              } else {
                this[q] = match ? match : undefined$1;
              }
            }
          }
        }
        i += 2;
      }
    }, strMapper = function(str, map) {
      for (var i in map) {
        if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
          for (var j = 0; j < map[i].length; j++) {
            if (has(map[i][j], str)) {
              return i === UNKNOWN ? undefined$1 : i;
            }
          }
        } else if (has(map[i], str)) {
          return i === UNKNOWN ? undefined$1 : i;
        }
      }
      return str;
    };
    var oldSafariMap = {
      "1.0": "/8",
      "1.2": "/1",
      "1.3": "/3",
      "2.0": "/412",
      "2.0.2": "/416",
      "2.0.3": "/417",
      "2.0.4": "/419",
      "?": "/"
    }, windowsVersionMap = {
      "ME": "4.90",
      "NT 3.11": "NT3.51",
      "NT 4.0": "NT4.0",
      "2000": "NT 5.0",
      "XP": ["NT 5.1", "NT 5.2"],
      "Vista": "NT 6.0",
      "7": "NT 6.1",
      "8": "NT 6.2",
      "8.1": "NT 6.3",
      "10": ["NT 6.4", "NT 10.0"],
      "RT": "ARM"
    };
    var regexes = {
      browser: [
        [
          /\b(?:crmo|crios)\/([\w\.]+)/i
          // Chrome for Android/iOS
        ],
        [VERSION, [NAME, "Chrome"]],
        [
          /edg(?:e|ios|a)?\/([\w\.]+)/i
          // Microsoft Edge
        ],
        [VERSION, [NAME, "Edge"]],
        [
          // Presto based
          /(opera mini)\/([-\w\.]+)/i,
          // Opera Mini
          /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
          // Opera Mobi/Tablet
          /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i
          // Opera
        ],
        [NAME, VERSION],
        [
          /opios[\/ ]+([\w\.]+)/i
          // Opera mini on iphone >= 8.0
        ],
        [VERSION, [NAME, OPERA + " Mini"]],
        [
          /\bopr\/([\w\.]+)/i
          // Opera Webkit
        ],
        [VERSION, [NAME, OPERA]],
        [
          // Mixed
          /(kindle)\/([\w\.]+)/i,
          // Kindle
          /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,
          // Lunascape/Maxthon/Netfront/Jasmine/Blazer
          // Trident based
          /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i,
          // Avant/IEMobile/SlimBrowser
          /(ba?idubrowser)[\/ ]?([\w\.]+)/i,
          // Baidu Browser
          /(?:ms|\()(ie) ([\w\.]+)/i,
          // Internet Explorer
          // Webkit/KHTML based                                               // Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
          /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i,
          // Rekonq/Puffin/Brave/Whale/QQBrowserLite/QQ, aka ShouQ
          /(heytap|ovi)browser\/([\d\.]+)/i,
          // Heytap/Ovi
          /(weibo)__([\d\.]+)/i
          // Weibo
        ],
        [NAME, VERSION],
        [
          /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i
          // UCBrowser
        ],
        [VERSION, [NAME, "UC" + BROWSER]],
        [
          /microm.+\bqbcore\/([\w\.]+)/i,
          // WeChat Desktop for Windows Built-in Browser
          /\bqbcore\/([\w\.]+).+microm/i
        ],
        [VERSION, [NAME, "WeChat(Win) Desktop"]],
        [
          /micromessenger\/([\w\.]+)/i
          // WeChat
        ],
        [VERSION, [NAME, "WeChat"]],
        [
          /konqueror\/([\w\.]+)/i
          // Konqueror
        ],
        [VERSION, [NAME, "Konqueror"]],
        [
          /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i
          // IE11
        ],
        [VERSION, [NAME, "IE"]],
        [
          /ya(?:search)?browser\/([\w\.]+)/i
          // Yandex
        ],
        [VERSION, [NAME, "Yandex"]],
        [
          /(avast|avg)\/([\w\.]+)/i
          // Avast/AVG Secure Browser
        ],
        [[NAME, /(.+)/, "$1 Secure " + BROWSER], VERSION],
        [
          /\bfocus\/([\w\.]+)/i
          // Firefox Focus
        ],
        [VERSION, [NAME, FIREFOX + " Focus"]],
        [
          /\bopt\/([\w\.]+)/i
          // Opera Touch
        ],
        [VERSION, [NAME, OPERA + " Touch"]],
        [
          /coc_coc\w+\/([\w\.]+)/i
          // Coc Coc Browser
        ],
        [VERSION, [NAME, "Coc Coc"]],
        [
          /dolfin\/([\w\.]+)/i
          // Dolphin
        ],
        [VERSION, [NAME, "Dolphin"]],
        [
          /coast\/([\w\.]+)/i
          // Opera Coast
        ],
        [VERSION, [NAME, OPERA + " Coast"]],
        [
          /miuibrowser\/([\w\.]+)/i
          // MIUI Browser
        ],
        [VERSION, [NAME, "MIUI " + BROWSER]],
        [
          /fxios\/([-\w\.]+)/i
          // Firefox for iOS
        ],
        [VERSION, [NAME, FIREFOX]],
        [
          /\bqihu|(qi?ho?o?|360)browser/i
          // 360
        ],
        [[NAME, "360 " + BROWSER]],
        [
          /(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i
        ],
        [[NAME, /(.+)/, "$1 " + BROWSER], VERSION],
        [
          // Oculus/Samsung/Sailfish/Huawei Browser
          /(comodo_dragon)\/([\w\.]+)/i
          // Comodo Dragon
        ],
        [[NAME, /_/g, " "], VERSION],
        [
          /(electron)\/([\w\.]+) safari/i,
          // Electron-based App
          /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
          // Tesla
          /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i
          // QQBrowser/Baidu App/2345 Browser
        ],
        [NAME, VERSION],
        [
          /(metasr)[\/ ]?([\w\.]+)/i,
          // SouGouBrowser
          /(lbbrowser)/i,
          // LieBao Browser
          /\[(linkedin)app\]/i
          // LinkedIn App for iOS & Android
        ],
        [NAME],
        [
          // WebView
          /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i
          // Facebook App for iOS & Android
        ],
        [[NAME, FACEBOOK], VERSION],
        [
          /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,
          // Kakao App
          /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,
          // Naver InApp
          /safari (line)\/([\w\.]+)/i,
          // Line App for iOS
          /\b(line)\/([\w\.]+)\/iab/i,
          // Line App for Android
          /(chromium|instagram)[\/ ]([-\w\.]+)/i
          // Chromium/Instagram
        ],
        [NAME, VERSION],
        [
          /\bgsa\/([\w\.]+) .*safari\//i
          // Google Search Appliance on iOS
        ],
        [VERSION, [NAME, "GSA"]],
        [
          /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i
          // TikTok
        ],
        [VERSION, [NAME, "TikTok"]],
        [
          /headlesschrome(?:\/([\w\.]+)| )/i
          // Chrome Headless
        ],
        [VERSION, [NAME, CHROME + " Headless"]],
        [
          / wv\).+(chrome)\/([\w\.]+)/i
          // Chrome WebView
        ],
        [[NAME, CHROME + " WebView"], VERSION],
        [
          /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i
          // Android Browser
        ],
        [VERSION, [NAME, "Android " + BROWSER]],
        [
          /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i
          // Chrome/OmniWeb/Arora/Tizen/Nokia
        ],
        [NAME, VERSION],
        [
          /version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i
          // Mobile Safari
        ],
        [VERSION, [NAME, "Mobile Safari"]],
        [
          /version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i
          // Safari & Safari Mobile
        ],
        [VERSION, NAME],
        [
          /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i
          // Safari < 3.0
        ],
        [NAME, [VERSION, strMapper, oldSafariMap]],
        [
          /(webkit|khtml)\/([\w\.]+)/i
        ],
        [NAME, VERSION],
        [
          // Gecko based
          /(navigator|netscape\d?)\/([-\w\.]+)/i
          // Netscape
        ],
        [[NAME, "Netscape"], VERSION],
        [
          /mobile vr; rv:([\w\.]+)\).+firefox/i
          // Firefox Reality
        ],
        [VERSION, [NAME, FIREFOX + " Reality"]],
        [
          /ekiohf.+(flow)\/([\w\.]+)/i,
          // Flow
          /(swiftfox)/i,
          // Swiftfox
          /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,
          // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror/Klar
          /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
          // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
          /(firefox)\/([\w\.]+)/i,
          // Other Firefox-based
          /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,
          // Mozilla
          // Other
          /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
          // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir/Obigo/Mosaic/Go/ICE/UP.Browser
          /(links) \(([\w\.]+)/i,
          // Links
          /panasonic;(viera)/i
          // Panasonic Viera
        ],
        [NAME, VERSION],
        [
          /(cobalt)\/([\w\.]+)/i
          // Cobalt
        ],
        [NAME, [VERSION, /master.|lts./, ""]]
      ],
      cpu: [
        [
          /(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i
          // AMD64 (x64)
        ],
        [[ARCHITECTURE, "amd64"]],
        [
          /(ia32(?=;))/i
          // IA32 (quicktime)
        ],
        [[ARCHITECTURE, lowerize]],
        [
          /((?:i[346]|x)86)[;\)]/i
          // IA32 (x86)
        ],
        [[ARCHITECTURE, "ia32"]],
        [
          /\b(aarch64|arm(v?8e?l?|_?64))\b/i
          // ARM64
        ],
        [[ARCHITECTURE, "arm64"]],
        [
          /\b(arm(?:v[67])?ht?n?[fl]p?)\b/i
          // ARMHF
        ],
        [[ARCHITECTURE, "armhf"]],
        [
          // PocketPC mistakenly identified as PowerPC
          /windows (ce|mobile); ppc;/i
        ],
        [[ARCHITECTURE, "arm"]],
        [
          /((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i
          // PowerPC
        ],
        [[ARCHITECTURE, /ower/, EMPTY, lowerize]],
        [
          /(sun4\w)[;\)]/i
          // SPARC
        ],
        [[ARCHITECTURE, "sparc"]],
        [
          /((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i
          // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
        ],
        [[ARCHITECTURE, lowerize]]
      ],
      device: [
        [
          //////////////////////////
          // MOBILES & TABLETS
          /////////////////////////
          // Samsung
          /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
        ],
        [MODEL, [VENDOR, SAMSUNG], [TYPE, TABLET]],
        [
          /\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
          /samsung[- ]([-\w]+)/i,
          /sec-(sgh\w+)/i
        ],
        [MODEL, [VENDOR, SAMSUNG], [TYPE, MOBILE]],
        [
          // Apple
          /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i
          // iPod/iPhone
        ],
        [MODEL, [VENDOR, APPLE], [TYPE, MOBILE]],
        [
          /\((ipad);[-\w\),; ]+apple/i,
          // iPad
          /applecoremedia\/[\w\.]+ \((ipad)/i,
          /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
        ],
        [MODEL, [VENDOR, APPLE], [TYPE, TABLET]],
        [
          /(macintosh);/i
        ],
        [MODEL, [VENDOR, APPLE]],
        [
          // Sharp
          /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
        ],
        [MODEL, [VENDOR, SHARP], [TYPE, MOBILE]],
        [
          // Huawei
          /\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i
        ],
        [MODEL, [VENDOR, HUAWEI], [TYPE, TABLET]],
        [
          /(?:huawei|honor)([-\w ]+)[;\)]/i,
          /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
        ],
        [MODEL, [VENDOR, HUAWEI], [TYPE, MOBILE]],
        [
          // Xiaomi
          /\b(poco[\w ]+)(?: bui|\))/i,
          // Xiaomi POCO
          /\b; (\w+) build\/hm\1/i,
          // Xiaomi Hongmi 'numeric' models
          /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,
          // Xiaomi Hongmi
          /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,
          // Xiaomi Redmi
          /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i
          // Xiaomi Mi
        ],
        [[MODEL, /_/g, " "], [VENDOR, XIAOMI], [TYPE, MOBILE]],
        [
          /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i
          // Mi Pad tablets
        ],
        [[MODEL, /_/g, " "], [VENDOR, XIAOMI], [TYPE, TABLET]],
        [
          // OPPO
          /; (\w+) bui.+ oppo/i,
          /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
        ],
        [MODEL, [VENDOR, "OPPO"], [TYPE, MOBILE]],
        [
          // Vivo
          /vivo (\w+)(?: bui|\))/i,
          /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
        ],
        [MODEL, [VENDOR, "Vivo"], [TYPE, MOBILE]],
        [
          // Realme
          /\b(rmx[12]\d{3})(?: bui|;|\))/i
        ],
        [MODEL, [VENDOR, "Realme"], [TYPE, MOBILE]],
        [
          // Motorola
          /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
          /\bmot(?:orola)?[- ](\w*)/i,
          /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i
        ],
        [MODEL, [VENDOR, MOTOROLA], [TYPE, MOBILE]],
        [
          /\b(mz60\d|xoom[2 ]{0,2}) build\//i
        ],
        [MODEL, [VENDOR, MOTOROLA], [TYPE, TABLET]],
        [
          // LG
          /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
        ],
        [MODEL, [VENDOR, LG], [TYPE, TABLET]],
        [
          /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
          /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
          /\blg-?([\d\w]+) bui/i
        ],
        [MODEL, [VENDOR, LG], [TYPE, MOBILE]],
        [
          // Lenovo
          /(ideatab[-\w ]+)/i,
          /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i
        ],
        [MODEL, [VENDOR, "Lenovo"], [TYPE, TABLET]],
        [
          // Nokia
          /(?:maemo|nokia).*(n900|lumia \d+)/i,
          /nokia[-_ ]?([-\w\.]*)/i
        ],
        [[MODEL, /_/g, " "], [VENDOR, "Nokia"], [TYPE, MOBILE]],
        [
          // Google
          /(pixel c)\b/i
          // Google Pixel C
        ],
        [MODEL, [VENDOR, GOOGLE], [TYPE, TABLET]],
        [
          /droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i
          // Google Pixel
        ],
        [MODEL, [VENDOR, GOOGLE], [TYPE, MOBILE]],
        [
          // Sony
          /droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
        ],
        [MODEL, [VENDOR, SONY], [TYPE, MOBILE]],
        [
          /sony tablet [ps]/i,
          /\b(?:sony)?sgp\w+(?: bui|\))/i
        ],
        [[MODEL, "Xperia Tablet"], [VENDOR, SONY], [TYPE, TABLET]],
        [
          // OnePlus
          / (kb2005|in20[12]5|be20[12][59])\b/i,
          /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
        ],
        [MODEL, [VENDOR, "OnePlus"], [TYPE, MOBILE]],
        [
          // Amazon
          /(alexa)webm/i,
          /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i,
          // Kindle Fire without Silk / Echo Show
          /(kf[a-z]+)( bui|\)).+silk\//i
          // Kindle Fire HD
        ],
        [MODEL, [VENDOR, AMAZON], [TYPE, TABLET]],
        [
          /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i
          // Fire Phone
        ],
        [[MODEL, /(.+)/g, "Fire Phone $1"], [VENDOR, AMAZON], [TYPE, MOBILE]],
        [
          // BlackBerry
          /(playbook);[-\w\),; ]+(rim)/i
          // BlackBerry PlayBook
        ],
        [MODEL, VENDOR, [TYPE, TABLET]],
        [
          /\b((?:bb[a-f]|st[hv])100-\d)/i,
          /\(bb10; (\w+)/i
          // BlackBerry 10
        ],
        [MODEL, [VENDOR, BLACKBERRY], [TYPE, MOBILE]],
        [
          // Asus
          /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
        ],
        [MODEL, [VENDOR, ASUS], [TYPE, TABLET]],
        [
          / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
        ],
        [MODEL, [VENDOR, ASUS], [TYPE, MOBILE]],
        [
          // HTC
          /(nexus 9)/i
          // HTC Nexus 9
        ],
        [MODEL, [VENDOR, "HTC"], [TYPE, TABLET]],
        [
          /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
          // HTC
          // ZTE
          /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
          /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i
          // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
        ],
        [VENDOR, [MODEL, /_/g, " "], [TYPE, MOBILE]],
        [
          // Acer
          /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
        ],
        [MODEL, [VENDOR, "Acer"], [TYPE, TABLET]],
        [
          // Meizu
          /droid.+; (m[1-5] note) bui/i,
          /\bmz-([-\w]{2,})/i
        ],
        [MODEL, [VENDOR, "Meizu"], [TYPE, MOBILE]],
        [
          // MIXED
          /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i,
          // BlackBerry/BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
          /(hp) ([\w ]+\w)/i,
          // HP iPAQ
          /(asus)-?(\w+)/i,
          // Asus
          /(microsoft); (lumia[\w ]+)/i,
          // Microsoft Lumia
          /(lenovo)[-_ ]?([-\w]+)/i,
          // Lenovo
          /(jolla)/i,
          // Jolla
          /(oppo) ?([\w ]+) bui/i
          // OPPO
        ],
        [VENDOR, MODEL, [TYPE, MOBILE]],
        [
          /(kobo)\s(ereader|touch)/i,
          // Kobo
          /(archos) (gamepad2?)/i,
          // Archos
          /(hp).+(touchpad(?!.+tablet)|tablet)/i,
          // HP TouchPad
          /(kindle)\/([\w\.]+)/i,
          // Kindle
          /(nook)[\w ]+build\/(\w+)/i,
          // Nook
          /(dell) (strea[kpr\d ]*[\dko])/i,
          // Dell Streak
          /(le[- ]+pan)[- ]+(\w{1,9}) bui/i,
          // Le Pan Tablets
          /(trinity)[- ]*(t\d{3}) bui/i,
          // Trinity Tablets
          /(gigaset)[- ]+(q\w{1,9}) bui/i,
          // Gigaset Tablets
          /(vodafone) ([\w ]+)(?:\)| bui)/i
          // Vodafone
        ],
        [VENDOR, MODEL, [TYPE, TABLET]],
        [
          /(surface duo)/i
          // Surface Duo
        ],
        [MODEL, [VENDOR, MICROSOFT], [TYPE, TABLET]],
        [
          /droid [\d\.]+; (fp\du?)(?: b|\))/i
          // Fairphone
        ],
        [MODEL, [VENDOR, "Fairphone"], [TYPE, MOBILE]],
        [
          /(u304aa)/i
          // AT&T
        ],
        [MODEL, [VENDOR, "AT&T"], [TYPE, MOBILE]],
        [
          /\bsie-(\w*)/i
          // Siemens
        ],
        [MODEL, [VENDOR, "Siemens"], [TYPE, MOBILE]],
        [
          /\b(rct\w+) b/i
          // RCA Tablets
        ],
        [MODEL, [VENDOR, "RCA"], [TYPE, TABLET]],
        [
          /\b(venue[\d ]{2,7}) b/i
          // Dell Venue Tablets
        ],
        [MODEL, [VENDOR, "Dell"], [TYPE, TABLET]],
        [
          /\b(q(?:mv|ta)\w+) b/i
          // Verizon Tablet
        ],
        [MODEL, [VENDOR, "Verizon"], [TYPE, TABLET]],
        [
          /\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i
          // Barnes & Noble Tablet
        ],
        [MODEL, [VENDOR, "Barnes & Noble"], [TYPE, TABLET]],
        [
          /\b(tm\d{3}\w+) b/i
        ],
        [MODEL, [VENDOR, "NuVision"], [TYPE, TABLET]],
        [
          /\b(k88) b/i
          // ZTE K Series Tablet
        ],
        [MODEL, [VENDOR, "ZTE"], [TYPE, TABLET]],
        [
          /\b(nx\d{3}j) b/i
          // ZTE Nubia
        ],
        [MODEL, [VENDOR, "ZTE"], [TYPE, MOBILE]],
        [
          /\b(gen\d{3}) b.+49h/i
          // Swiss GEN Mobile
        ],
        [MODEL, [VENDOR, "Swiss"], [TYPE, MOBILE]],
        [
          /\b(zur\d{3}) b/i
          // Swiss ZUR Tablet
        ],
        [MODEL, [VENDOR, "Swiss"], [TYPE, TABLET]],
        [
          /\b((zeki)?tb.*\b) b/i
          // Zeki Tablets
        ],
        [MODEL, [VENDOR, "Zeki"], [TYPE, TABLET]],
        [
          /\b([yr]\d{2}) b/i,
          /\b(dragon[- ]+touch |dt)(\w{5}) b/i
          // Dragon Touch Tablet
        ],
        [[VENDOR, "Dragon Touch"], MODEL, [TYPE, TABLET]],
        [
          /\b(ns-?\w{0,9}) b/i
          // Insignia Tablets
        ],
        [MODEL, [VENDOR, "Insignia"], [TYPE, TABLET]],
        [
          /\b((nxa|next)-?\w{0,9}) b/i
          // NextBook Tablets
        ],
        [MODEL, [VENDOR, "NextBook"], [TYPE, TABLET]],
        [
          /\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i
          // Voice Xtreme Phones
        ],
        [[VENDOR, "Voice"], MODEL, [TYPE, MOBILE]],
        [
          /\b(lvtel\-)?(v1[12]) b/i
          // LvTel Phones
        ],
        [[VENDOR, "LvTel"], MODEL, [TYPE, MOBILE]],
        [
          /\b(ph-1) /i
          // Essential PH-1
        ],
        [MODEL, [VENDOR, "Essential"], [TYPE, MOBILE]],
        [
          /\b(v(100md|700na|7011|917g).*\b) b/i
          // Envizen Tablets
        ],
        [MODEL, [VENDOR, "Envizen"], [TYPE, TABLET]],
        [
          /\b(trio[-\w\. ]+) b/i
          // MachSpeed Tablets
        ],
        [MODEL, [VENDOR, "MachSpeed"], [TYPE, TABLET]],
        [
          /\btu_(1491) b/i
          // Rotor Tablets
        ],
        [MODEL, [VENDOR, "Rotor"], [TYPE, TABLET]],
        [
          /(shield[\w ]+) b/i
          // Nvidia Shield Tablets
        ],
        [MODEL, [VENDOR, "Nvidia"], [TYPE, TABLET]],
        [
          /(sprint) (\w+)/i
          // Sprint Phones
        ],
        [VENDOR, MODEL, [TYPE, MOBILE]],
        [
          /(kin\.[onetw]{3})/i
          // Microsoft Kin
        ],
        [[MODEL, /\./g, " "], [VENDOR, MICROSOFT], [TYPE, MOBILE]],
        [
          /droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i
          // Zebra
        ],
        [MODEL, [VENDOR, ZEBRA], [TYPE, TABLET]],
        [
          /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
        ],
        [MODEL, [VENDOR, ZEBRA], [TYPE, MOBILE]],
        [
          ///////////////////
          // SMARTTVS
          ///////////////////
          /smart-tv.+(samsung)/i
          // Samsung
        ],
        [VENDOR, [TYPE, SMARTTV]],
        [
          /hbbtv.+maple;(\d+)/i
        ],
        [[MODEL, /^/, "SmartTV"], [VENDOR, SAMSUNG], [TYPE, SMARTTV]],
        [
          /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i
          // LG SmartTV
        ],
        [[VENDOR, LG], [TYPE, SMARTTV]],
        [
          /(apple) ?tv/i
          // Apple TV
        ],
        [VENDOR, [MODEL, APPLE + " TV"], [TYPE, SMARTTV]],
        [
          /crkey/i
          // Google Chromecast
        ],
        [[MODEL, CHROME + "cast"], [VENDOR, GOOGLE], [TYPE, SMARTTV]],
        [
          /droid.+aft(\w)( bui|\))/i
          // Fire TV
        ],
        [MODEL, [VENDOR, AMAZON], [TYPE, SMARTTV]],
        [
          /\(dtv[\);].+(aquos)/i,
          /(aquos-tv[\w ]+)\)/i
          // Sharp
        ],
        [MODEL, [VENDOR, SHARP], [TYPE, SMARTTV]],
        [
          /(bravia[\w ]+)( bui|\))/i
          // Sony
        ],
        [MODEL, [VENDOR, SONY], [TYPE, SMARTTV]],
        [
          /(mitv-\w{5}) bui/i
          // Xiaomi
        ],
        [MODEL, [VENDOR, XIAOMI], [TYPE, SMARTTV]],
        [
          /Hbbtv.*(technisat) (.*);/i
          // TechniSAT
        ],
        [VENDOR, MODEL, [TYPE, SMARTTV]],
        [
          /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
          // Roku
          /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i
          // HbbTV devices
        ],
        [[VENDOR, trim], [MODEL, trim], [TYPE, SMARTTV]],
        [
          /\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i
          // SmartTV from Unidentified Vendors
        ],
        [[TYPE, SMARTTV]],
        [
          ///////////////////
          // CONSOLES
          ///////////////////
          /(ouya)/i,
          // Ouya
          /(nintendo) ([wids3utch]+)/i
          // Nintendo
        ],
        [VENDOR, MODEL, [TYPE, CONSOLE]],
        [
          /droid.+; (shield) bui/i
          // Nvidia
        ],
        [MODEL, [VENDOR, "Nvidia"], [TYPE, CONSOLE]],
        [
          /(playstation [345portablevi]+)/i
          // Playstation
        ],
        [MODEL, [VENDOR, SONY], [TYPE, CONSOLE]],
        [
          /\b(xbox(?: one)?(?!; xbox))[\); ]/i
          // Microsoft Xbox
        ],
        [MODEL, [VENDOR, MICROSOFT], [TYPE, CONSOLE]],
        [
          ///////////////////
          // WEARABLES
          ///////////////////
          /((pebble))app/i
          // Pebble
        ],
        [VENDOR, MODEL, [TYPE, WEARABLE]],
        [
          /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i
          // Apple Watch
        ],
        [MODEL, [VENDOR, APPLE], [TYPE, WEARABLE]],
        [
          /droid.+; (glass) \d/i
          // Google Glass
        ],
        [MODEL, [VENDOR, GOOGLE], [TYPE, WEARABLE]],
        [
          /droid.+; (wt63?0{2,3})\)/i
        ],
        [MODEL, [VENDOR, ZEBRA], [TYPE, WEARABLE]],
        [
          /(quest( 2| pro)?)/i
          // Oculus Quest
        ],
        [MODEL, [VENDOR, FACEBOOK], [TYPE, WEARABLE]],
        [
          ///////////////////
          // EMBEDDED
          ///////////////////
          /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i
          // Tesla
        ],
        [VENDOR, [TYPE, EMBEDDED]],
        [
          /(aeobc)\b/i
          // Echo Dot
        ],
        [MODEL, [VENDOR, AMAZON], [TYPE, EMBEDDED]],
        [
          ////////////////////
          // MIXED (GENERIC)
          ///////////////////
          /droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i
          // Android Phones from Unidentified Vendors
        ],
        [MODEL, [TYPE, MOBILE]],
        [
          /droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i
          // Android Tablets from Unidentified Vendors
        ],
        [MODEL, [TYPE, TABLET]],
        [
          /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i
          // Unidentifiable Tablet
        ],
        [[TYPE, TABLET]],
        [
          /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i
          // Unidentifiable Mobile
        ],
        [[TYPE, MOBILE]],
        [
          /(android[-\w\. ]{0,9});.+buil/i
          // Generic Android Device
        ],
        [MODEL, [VENDOR, "Generic"]]
      ],
      engine: [
        [
          /windows.+ edge\/([\w\.]+)/i
          // EdgeHTML
        ],
        [VERSION, [NAME, EDGE + "HTML"]],
        [
          /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i
          // Blink
        ],
        [VERSION, [NAME, "Blink"]],
        [
          /(presto)\/([\w\.]+)/i,
          // Presto
          /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,
          // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna
          /ekioh(flow)\/([\w\.]+)/i,
          // Flow
          /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,
          // KHTML/Tasman/Links
          /(icab)[\/ ]([23]\.[\d\.]+)/i,
          // iCab
          /\b(libweb)/i
        ],
        [NAME, VERSION],
        [
          /rv\:([\w\.]{1,9})\b.+(gecko)/i
          // Gecko
        ],
        [VERSION, NAME]
      ],
      os: [
        [
          // Windows
          /microsoft (windows) (vista|xp)/i
          // Windows (iTunes)
        ],
        [NAME, VERSION],
        [
          /(windows) nt 6\.2; (arm)/i,
          // Windows RT
          /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i,
          // Windows Phone
          /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i
        ],
        [NAME, [VERSION, strMapper, windowsVersionMap]],
        [
          /(win(?=3|9|n)|win 9x )([nt\d\.]+)/i
        ],
        [[NAME, "Windows"], [VERSION, strMapper, windowsVersionMap]],
        [
          // iOS/macOS
          /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,
          // iOS
          /ios;fbsv\/([\d\.]+)/i,
          /cfnetwork\/.+darwin/i
        ],
        [[VERSION, /_/g, "."], [NAME, "iOS"]],
        [
          /(mac os x) ?([\w\. ]*)/i,
          /(macintosh|mac_powerpc\b)(?!.+haiku)/i
          // Mac OS
        ],
        [[NAME, MAC_OS], [VERSION, /_/g, "."]],
        [
          // Mobile OSes
          /droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i
          // Android-x86/HarmonyOS
        ],
        [VERSION, NAME],
        [
          // Android/WebOS/QNX/Bada/RIM/Maemo/MeeGo/Sailfish OS
          /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,
          /(blackberry)\w*\/([\w\.]*)/i,
          // Blackberry
          /(tizen|kaios)[\/ ]([\w\.]+)/i,
          // Tizen/KaiOS
          /\((series40);/i
          // Series 40
        ],
        [NAME, VERSION],
        [
          /\(bb(10);/i
          // BlackBerry 10
        ],
        [VERSION, [NAME, BLACKBERRY]],
        [
          /(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i
          // Symbian
        ],
        [VERSION, [NAME, "Symbian"]],
        [
          /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i
          // Firefox OS
        ],
        [VERSION, [NAME, FIREFOX + " OS"]],
        [
          /web0s;.+rt(tv)/i,
          /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i
          // WebOS
        ],
        [VERSION, [NAME, "webOS"]],
        [
          /watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i
          // watchOS
        ],
        [VERSION, [NAME, "watchOS"]],
        [
          // Google Chromecast
          /crkey\/([\d\.]+)/i
          // Google Chromecast
        ],
        [VERSION, [NAME, CHROME + "cast"]],
        [
          /(cros) [\w]+(?:\)| ([\w\.]+)\b)/i
          // Chromium OS
        ],
        [[NAME, CHROMIUM_OS], VERSION],
        [
          // Smart TVs
          /panasonic;(viera)/i,
          // Panasonic Viera
          /(netrange)mmh/i,
          // Netrange
          /(nettv)\/(\d+\.[\w\.]+)/i,
          // NetTV
          // Console
          /(nintendo|playstation) ([wids345portablevuch]+)/i,
          // Nintendo/Playstation
          /(xbox); +xbox ([^\);]+)/i,
          // Microsoft Xbox (360, One, X, S, Series X, Series S)
          // Other
          /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,
          // Joli/Palm
          /(mint)[\/\(\) ]?(\w*)/i,
          // Mint
          /(mageia|vectorlinux)[; ]/i,
          // Mageia/VectorLinux
          /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
          // Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware/Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus/Raspbian/Plan9/Minix/RISCOS/Contiki/Deepin/Manjaro/elementary/Sabayon/Linspire
          /(hurd|linux) ?([\w\.]*)/i,
          // Hurd/Linux
          /(gnu) ?([\w\.]*)/i,
          // GNU
          /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,
          // FreeBSD/NetBSD/OpenBSD/PC-BSD/GhostBSD/DragonFly
          /(haiku) (\w+)/i
          // Haiku
        ],
        [NAME, VERSION],
        [
          /(sunos) ?([\w\.\d]*)/i
          // Solaris
        ],
        [[NAME, "Solaris"], VERSION],
        [
          /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,
          // Solaris
          /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,
          // AIX
          /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i,
          // BeOS/OS2/AmigaOS/MorphOS/OpenVMS/Fuchsia/HP-UX/SerenityOS
          /(unix) ?([\w\.]*)/i
          // UNIX
        ],
        [NAME, VERSION]
      ]
    };
    var UAParser = function(ua, extensions) {
      if (typeof ua === OBJ_TYPE) {
        extensions = ua;
        ua = undefined$1;
      }
      if (!(this instanceof UAParser)) {
        return new UAParser(ua, extensions).getResult();
      }
      var _navigator = typeof window2 !== UNDEF_TYPE && window2.navigator ? window2.navigator : undefined$1;
      var _ua = ua || (_navigator && _navigator.userAgent ? _navigator.userAgent : EMPTY);
      var _uach = _navigator && _navigator.userAgentData ? _navigator.userAgentData : undefined$1;
      var _rgxmap = extensions ? extend(regexes, extensions) : regexes;
      var _isSelfNav = _navigator && _navigator.userAgent == _ua;
      this.getBrowser = function() {
        var _browser = {};
        _browser[NAME] = undefined$1;
        _browser[VERSION] = undefined$1;
        rgxMapper.call(_browser, _ua, _rgxmap.browser);
        _browser[MAJOR] = majorize(_browser[VERSION]);
        if (_isSelfNav && _navigator && _navigator.brave && typeof _navigator.brave.isBrave == FUNC_TYPE) {
          _browser[NAME] = "Brave";
        }
        return _browser;
      };
      this.getCPU = function() {
        var _cpu = {};
        _cpu[ARCHITECTURE] = undefined$1;
        rgxMapper.call(_cpu, _ua, _rgxmap.cpu);
        return _cpu;
      };
      this.getDevice = function() {
        var _device = {};
        _device[VENDOR] = undefined$1;
        _device[MODEL] = undefined$1;
        _device[TYPE] = undefined$1;
        rgxMapper.call(_device, _ua, _rgxmap.device);
        if (_isSelfNav && !_device[TYPE] && _uach && _uach.mobile) {
          _device[TYPE] = MOBILE;
        }
        if (_isSelfNav && _device[MODEL] == "Macintosh" && _navigator && typeof _navigator.standalone !== UNDEF_TYPE && _navigator.maxTouchPoints && _navigator.maxTouchPoints > 2) {
          _device[MODEL] = "iPad";
          _device[TYPE] = TABLET;
        }
        return _device;
      };
      this.getEngine = function() {
        var _engine = {};
        _engine[NAME] = undefined$1;
        _engine[VERSION] = undefined$1;
        rgxMapper.call(_engine, _ua, _rgxmap.engine);
        return _engine;
      };
      this.getOS = function() {
        var _os = {};
        _os[NAME] = undefined$1;
        _os[VERSION] = undefined$1;
        rgxMapper.call(_os, _ua, _rgxmap.os);
        if (_isSelfNav && !_os[NAME] && _uach && _uach.platform != "Unknown") {
          _os[NAME] = _uach.platform.replace(/chrome os/i, CHROMIUM_OS).replace(/macos/i, MAC_OS);
        }
        return _os;
      };
      this.getResult = function() {
        return {
          ua: this.getUA(),
          browser: this.getBrowser(),
          engine: this.getEngine(),
          os: this.getOS(),
          device: this.getDevice(),
          cpu: this.getCPU()
        };
      };
      this.getUA = function() {
        return _ua;
      };
      this.setUA = function(ua2) {
        _ua = typeof ua2 === STR_TYPE && ua2.length > UA_MAX_LENGTH ? trim(ua2, UA_MAX_LENGTH) : ua2;
        return this;
      };
      this.setUA(_ua);
      return this;
    };
    UAParser.VERSION = LIBVERSION;
    UAParser.BROWSER = enumerize([NAME, VERSION, MAJOR]);
    UAParser.CPU = enumerize([ARCHITECTURE]);
    UAParser.DEVICE = enumerize([MODEL, VENDOR, TYPE, CONSOLE, MOBILE, SMARTTV, TABLET, WEARABLE, EMBEDDED]);
    UAParser.ENGINE = UAParser.OS = enumerize([NAME, VERSION]);
    {
      if (module.exports) {
        exports = module.exports = UAParser;
      }
      exports.UAParser = UAParser;
    }
    var $ = typeof window2 !== UNDEF_TYPE && (window2.jQuery || window2.Zepto);
    if ($ && !$.ua) {
      var parser = new UAParser();
      $.ua = parser.getResult();
      $.ua.get = function() {
        return parser.getUA();
      };
      $.ua.set = function(ua) {
        parser.setUA(ua);
        var result = parser.getResult();
        for (var prop in result) {
          $.ua[prop] = result[prop];
        }
      };
    }
  })(typeof window === "object" ? window : commonjsGlobal);
})(uaParser, uaParserExports);
const Chrome = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAMJUlEQVR4Ab3aBZAc17al4W9nZrPIMgjNbMseyx6Z7XjvMjMzMzMzMzMzg/EyM5mZ2WJuqszco+iYinGFWn0t+877I04xrHX22qcqIdxJrj72sAgKEYEGaQb6+qpAKSKDFulOEDedcpQ7wvj4RBEUqKFLUZZzsSDCfGI4AmI0wjqsxMbe1xdViBatO0AVEXaGsdGxggg0SRtFzAr+S8Q9g+OwH3a1PYl1Iq4K/irip8FvpK0pRRElkTtrpLITBka3jFaoSVHEoSGeg4djwQ4EJyAQ2HVqcCyej1uF74T4hHQZKSIq1Le/Av49W7ZsLSIQ6hBLibfhiSQCGmRSBKF3TGeqRWAhXjA1wheJ1yU3hygiJPJOR2jzpi0lmkwi4rkZ3hcMAmqUKN0+AoECkGhQ4cl4ZPBS8lOZpmKFxswRmkH8xi0V6rZoB8osvo0HAmpUqNw5AhWgxrDwSdytbKtHa3TaspnBxAwCNm3cXKGOjD2KtviNcCi6M175z1Mh0RAPbYvmXwr/jTVyx5WoiO3Fb9hUoha5h4i/Yy900Of/L4EKHWGZ9PcQK7BGmNZEFaGHjes3FWi0BhTxG9Ej/n+KPnSwD35d9DkanbYWyBkjdN0eg2DvVePfxqF3WHwEgoAgEgg7vA4ISESf0MGytvFNPKx/2frtDMT6F+yvy7V/66tQD020zyv4KOqIqCACgiB0rxGhex1FQVHQNDQ1TSsCUYmiz9R1JNn2vi+A+H83hCAIUQuVifLZ+FTfgRt7fieqdt0AuPaqthDqfW8ZW7p2bv972yIE5e2e7aLQjm6l01HMmq3cbY+M2XNEQdQb6awU9aZQDohyNpFkbj8h0H0MEQpClPn+ao/x03CzvqZAC1W1YAx8+pADAq5ZMPSWV3/7msH9bx2rx/uLKpiZspTj47IzaXD5CsP3fkAO/u/jDC5dEoaGIbVbNVuv067/bcbKb7Dhj6HooxwiazIBt71OErIgaxnDWu/CE7KNAIjJs/uduPH+Bdp5W+uDb9xt4JK7/WttvPo719o8XCmTHUaoLLWbN+vfcy/zXvJas+9+T106ycatCeYOh76CLvXK74srXy7HrqGaQ9ZAJqYxk0kgEw7HxSjQFtHXylRksmG4evas0Tp+u2yX+h8HzjEy3mjDtEyJ37jB8Emn5sJvn2lKvHTav7Z6yhfWO/ntq530zqnh5G3jKV9c57RztiJVCx7KinPE/LvT2UT0IYhAgegdUZBRE4jnEoggVMevfkCQtTCc6RFF0obya/+1wBHXbRE5fWyaTRuNnPJfucenvxIlzr9u3Eu/t9Wfr+4ogoGKsgiwbmvrklsa3/nHpBP2G/eBRww7Ys+5muU/E+fcQ677OdVcsiYAqZdQgvQw8lXYTEQc882HlGhwH+nMlG3RZrF5qPLi027wwL+vtXG4UmUiRBFyclK1cJHF3zlL35zZfn7BqMd/abPxyTR3KCTa3v+iiiCwcSwN9oWvPnW2ux8+rJncwN+PkRM3EQNot48PSGSDknwgTkNZZWYA7gFSm6Lo7zS+ddLuTrpsk+GJRluEgJgyYJeXvnZK/LaZnxKfyZyhULe2J2kSTL1moubxn9/s5y+ObZWYp97/PVz4MKohMvXQU5FIsqv1NCKKTE0mOE6SsmgjDUy2bpw/4LvH72Z4op0y0F0qB49eYc7d74Wcis34ZBqoaFr/lqY19drxTnrJd0aRqoUPZd5JtFspSiLQO8TUKAjEcQSKpvjbwp9mMCfT/ilJIWmCkfHaacfMd/niIUOTrfy/8dm2VILT/jk6lfm5QzGD+OlNbHvP1HtPO3cU5B6PpumgoCvYdk0dIhD7EfPIrEgp95B2hSRkgrJJmwdLXzl5d2/5/g2yaRWzZhlacTz40XkTiiDtPIki+NE5Ex5w1Ihil1NlNZtsUSCna+gAYT4WYEMhgjQ/KTIzZYJMmmDWeOP3B8/xx4PmGNk6zm67G1q6RCe56ObGQEWbdpo2GahMfUanpRzem4EFaFBMFx8EIikQuxIKQmYOy4RMZCa6RlK06cun7G6spG9kNsMjNo6mDWOpvBMlKIuwYTSnPks5QjmXbPUK7o6i+3gSiGFCRYCu/C6ZkDIYmmxcvGjI6UfN84S1bSKk/zAFUSYRBIJA2p7Qu1ciM0cB0RUOkkSLoYnGN4/fzV1+Om7+lq3mzJpl3lBM/UhV5R2oQtC0ad5wMbW0arfQbCYqvfHJ6fuA0a5tWJepzcwgSTJJSaYWfZ3GqvlDvnpAyzU36Mfhi0sTNUXYaYpgojb1Gf0lzegNaXJ1KPoJO1pGUQSBWHubHrCKXAuZMiVdIyBNNXSH0/aJ+Oct5yc84KgBbRJ2nkCbPGj5AGjX/6GnAtP3QaQIItYRKwnlD//rHpFpAg/BUjKlSJAkkCiSsTKtzFEPWnafOGRRv19dOuGaNY2h/pDpdlEWbBpLx+3b5+0PmYOQV706TK6k6EdOt5kGSQQuEvFRyigisoxI5F9lytQmZJIkMpNMTbZml0N+tf7COPuq3ye89xEjhvrCRE1Z3D7xEzWDfeH9jxhGqFednjb9hWo2cob4REsg/koQWVaZEvAzvFBmMdOq1GoNFH3e8ZdPxolLjrZ8zxFffEp68hc22TR2u/7MTRn+0lNnO3LPIVsmtqSr3mSoGJSpd9Yz9RACpJ8BkZXMFoTfSLcki5Ayg14j3WoMlgOu23iT5/38TfmV+7037rVsyFkvDi//zlZ/mebvdNOmiZo2OX6/Pu99+Ijlew3aUHP+P5+bp9ZXF3Uxl6wRO/gjJ4mSXKXwa5DRRue3ezjqqhUVanxI5gtRJ5WEBNl7WxmFDeOb/Nfex+XH7v7mmDc4gvTDc0b9+NxJF99c2zCaYN5wOGxR5YHL+z14+TDCqrFR7/jlK9tXDX4rFg7PirptBHK7rbIEMmtU5CfwXJRothlY4KgrjynQ4uDk0u2FQ253u4zSxonN9pm72KtPeI77HnBqzx+2roFdhkNR0OXsK37jpb/9ZL5q/j88YUkbk5OpjF7RmXZkpGeTcpuBheB/XbG8RIPP4ymZuo5JEiCz53YRhfF6wkQzacWiIz3gwLs5Yclye89bYLgaAqOdMdduuNWfbjzHGVf83C+vv8Bdd6nzR4evjbpphSS3F3sbIzVZ4at4ArpaVaIASULw+kyPIoeRmaL3w3qNNG2rv+wzUPb75y0X+vM2kbP6h+02NN/s/pFEbJrYYvXoOlsmt04tAPMHR7xhr5vJVmaIoDfvgQQRElWmcbwWkADR+d0SXY687IhuLzwr0ycx5XymCkBCUkQgNG2j09ZT11BGoSoq/RHWdApP2H1jvm//1TFZF0q5o90pSLoaeD4+RnY1gqh/v9RtOeLSwwu0mb4nPTTpoK9XOKTE9P0Cel+bqU5GisxfLLvFov466owZ4yOzgz7yx3gQWaCdce9020qIbB+dUfxL5jJ0kr4e4TM0t2mqVUqb6sLL995o0VATE51SFQk72hPREdFHXqLxSFCEXqYqsDd6OfziQ0o0MndL/o59urOR2FkjIY014cChOn+2bLUqMtpMAdNHqEP24XqRK7BKmyWaaQzsYzoOv+igEk2m3chfJ8ukmiyTsAOx2XtHosSGOnz54PV5n93GYrIOZeR0e+MSDVnJvET6L6wSbU/uew38YV874rALDizR1PSXmd8kH5JJt7F2FBdJSlBiY83dd5nMrx+2PjpNKLabdWR3qYT8sdIjMaFudiS+a2A/M3HoBft3SyfbfBben5nDgFpmmUSv8N6Y1S1nH7khl83qRKcNhSQTkmxQkchx6WX4ODDz8TGI+o8HwMwmzts3MgXazGYx8TbyyZm6NDIzKRBSpFRibSc8Z8l4vv2ALSY7oYxMskWQpUxAfpl8HW6UTQFowcwGDnR7OeTcvbvl1LbtwXiOzEckC+mtQKScTDm3bPO3R2+O3fraom6J3visJL8r8xO4BOTMkZnGwMF2hoPPWVog0EDT1iOh+C/pnimPk/bH/JCxuQ7vP2DME5ZOmOhQhbXk1TL/Sv4Uv8EWkHVJJlo7QdR/OsQd4aB/Li5Mc7JHW7dzRS5oWvMHC8N/X7HF3Kod7aR1xTQne8jJSmY7s/AZDRzmznDgPxYECikU2SDNwBXHrA0RJd1ekO4E/wccPWXUIiPyQwAAAABJRU5ErkJggg==";
const Firefox = "data:image/png;base64,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";
const Edge = "data:image/png;base64,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";
const Safari = "" + new URL("safari_48x48-wr0uobcc1sl.png", import.meta.url).href;
const MobileSafari = "data:image/png;base64,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";
const WebKit = "data:image/png;base64,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";
const IE = "" + new URL("internet-explorer_9-11_48x48-wr0uobcc1sl.png", import.meta.url).href;
const SamsungBrowser = "data:image/png;base64,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";
const Opera = "data:image/png;base64,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";
const Brave = "data:image/png;base64,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";
const Vivaldi = "data:image/png;base64,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";
const Generic = "data:image/png;base64,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";
const Windows = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAABTVBMVEVMaXFLp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+5Lp+4atrU3AAAAbnRSTlMAm4rypyH9D9LvCdOpJ8UMYuIfRSRuf5SlIyvuk43hZwuuqPMSaMejWz2Z5SIEMhPetFKGPgrBaweETIAqieRxiEhHgfX5xjp3ZKL+O7MIXZXqcJrMvQOwyCbRlxXohQ2dN6umoAJeGBGyrPAQrUr7lJQAAAAJcEhZcwAALiMAAC4jAXilP3YAAAEhSURBVHic7ZVVU8QwFEYv25ZsZd1dcXd3d3d3v///kQeybKYNpWUGBoY9j1++83CTTALwV2nxz9WHtaiFZk+swTtV5/bNICImzJqrwUBmQJttQgYnt5m9iMNxfnuDbfKFtvhgKLV3eIKX4EIuTtr0tHaGIh2qXMrPQao2FcZ1edVnQtKu4KgI+D926VqXP3x0WwUq3L7kRYZcBu5ETTTymIIvohQJS1GBG/JMjNyfUeG0ILMUkiAlnmQjwj4VIrrZriDGHzr9ew/OURHwG3ap0a4wL9gUwBOcXOgS3b6ltzwKEreP+h+o37+8Ft7aSR/BgTWBsksgu7m+ogpWhRJkeKJmJFc7WhbU9zUzlOZu79Bib/t0+dWw5rkCfWN2hJ/jFaOc+OtWo3AzAAAAAElFTkSuQmCC";
const macOs = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAACc1BMVEVMaXE/Pj6Eg4M6OTlBQEBaWVlMSkobGhpAPj5bWls1NDQhHx8mJSU/PT0mJCQyMDBLSUkyMTEcGhpRUFEoJidHRkZwb298e3sbGRlNTExoZ2dhYGCMjIwbGRltbG1xcXFrampEQkNUUlIbGRkvLy8pJyeTk5NfXl6Xl5c8Ozs2NTWKiYksKyu0tLQkIyNOTU2Af4BfX19ZWFjHyMeGhYY0MzNZWVmsrKw6OTliYmIcGxs/Pj4LCgpSUVFbWlqlpaVjYmKRkJD19fViYWE8OjpcW1teXV5hYWEzMjIYFhYUExNEQ0NxcHG2tbVgX1+Xl5crKysmJCSRkZGpqKmMi4tPT0+dnZ1ubW1HRkaSkZGnp6diYWFPTk+JiIiUk5Q8OjrV1dUSEREgHh4/PT2Ih4gmJSUtKyt6eXk6OTkfHh5EQ0MfHh44NzdpaGg5OTmpqamOjo5+fX4kIiJUU1PX19ctKysvLi5MTEwPDg5IRkYTEhJdXV1iYWGvrq96eXkrKSlZWVkgHh5sbGw1NDQ4NzdnZ2cbGRlBQEBEQ0Knp6cRDw9sa2x6enorKiopKCgZFxcAAAAbGRkaGBgcGhodGxsDAgICAQEXFRUVExMeHBwaFxcGBAQPDQ0TEBATERELCQkODAwBAQEFAwMPDAwHBQUWExMEAgIbGBgNCwsIBgYUEhIYFRUFBAQOCwsfHBwWFBMSEBAJBwcFBAMRDw8HBQQYFhYaGBcVExIUEREMCwsBAAAUEhEQDg4dGxoKCQkCAQIXFBQODAsdGhoKBwcMCgoeGxscGhkKCAgfHR0GBAMVEhIUExMgHh4JBwYEAwMLCgoWFBTGiOGtAAAAj3RSTlMAmBGwnGdf9oFCvN3gbvHZqMb9gJHANVvtvi97GftgPmYWq/7B2gMbMajTY8Ea5LQfUF4EdbtZG6Oh2r/yp0IXWUMIntCflWPW9/m9DQy3O8ziMzt6ukBtqWktc5NaLsoR+LdrSvK0ScPflfKVmWQhU3f5LxKhxaz6Zf5wigMiuIjsNrizIsiKQBDcYiJX9ehn+fkAAAAJcEhZcwAALiMAAC4jAXilP3YAAAI4SURBVHicxZTVctxAEEUnzMzMzMzMzMzMzOgwJ90zol1Jy2jHju0wM/MnpRJ7U5ZGoygPqfRbV51TV3c0EiH/dXZs3RJd9xf89t0YUjZ653fhh/eSstkzvxMTFEDZ4JXfezApg6xu8hxwFGVgH3GtV/7YSYWlUrjNc8Cpgu+SiQc88+RqOvT12wnvPLlw6dz5K3/GevauW3Pgmj2Z9eyhfetXd6rTQoQvXzg5OxYx8j7tP3KckIuXTx8uLIz5FONB5wmO/JJcNFOUUZofVz5nnbmmKEFKARjVVOw3leeX4rs3UDSMmWnji06LV6A6Dh5g5+diQMoAv5wSCzA/Trfxi/H1WxANA+w62yaswBtCHiTsYX+gGZGEmJdxItd4EMpiIRDtyAndk5aSlqHYiD9TMMUBNNKcFwrEPDzS6vOCz0UI1u7AC+IGAL5mrXhBc0ugjXkh6CLo2b0cOlwXCxTH8EKbxy4RryZN44R2cV0syDiOE1rj78vPD8tR+tuFlg9LfgxcxAscaROaajEXASQzd/wIq1EP3SLgSQBnWYUGbiUAwI9DrEL7hobb9YAcdY6tRV/0u9XGsfZz6jNUcWmRwFHcq1iG4uvhxykcT8g84Y9Devqsm4OwcpXqXIM9xy4OPCHzMZ35dzAGjN4tXl7iMEeekEUY/mlQGormhW/Fb9+RdADKcKaAJ2QBqhq9fzNZvUzF8tVK1QirIUYNbDtaKJDhtXz5FSqXK120VSpb9V6gShMx/k/mB+cvTInTCiU6AAAAAElFTkSuQmCC";
const iOS = "data:image/png;base64,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";
const iPadOS = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABAhJREFUaEPt11WoZmUUBuBnzFExxy5sEQMDUVTsGNEZFfVCFFtExMZCsQMVWxALAzERQWbEAvNCLyws7By7O0d5h7VlI4Ny+C7GM+wNP/8+//5ivbHeb58xRvk1ZpTXbwAwoxUcFBgUaGRgsFAjgc3TBwWaKWxcYFCgkcDm6YMCzRQ2LjAo0Ehg8/SZRoFZsB6+xhuYB7P36PkDPyDfI71C0ljMgZ/wa2+BeTE/0/4v+QbfY+o/NpgVC9cav+Czfh2dAgvgVryEk7ETVu8tlE3fxVN4bYQI5sRWWBP34Xmk8HWxAZZGivwQT+PJIjLb5NnmWAvzFcAXa51P8GcHYCFchddxHq4tEG/jC+R5mLoD52PKCECk2HOxB47GbZiIw7FcFR5lV8QHuAx343ccjwPxaX2WxGK4EmdmTAdgbuyLoHqoAGyDy/FILX4wxpVCd2Hl+sxW816uTWLHZUrBPAuzKWL3AhAFzsHaRUhUicJbYr+ySMb/Vs/nwol4BSvUGql7+yjVAVgCkxDGDygAke4I3IJFcQL2wQ24HweVxPFsNrsHN2NB7I+ty6svYFWsVpunv8LsMzgFeZ5rEVyD7XAk3sLV9ezYstdH2AKxfOr9rgOwLN4plBv1AByDO4vpbLYJbsLnxdgTVfyu8SPOwlI4rch4oFQbX8BioQA5rKx4RVm0c2TmH1IkXY+TsCOibhR4v2z+cNnt7x6YHoAdyk6vVlFRJPenV6LEAgGS3kjTx5/XIWruiQtxKVYqYAEfAGnIQ3FqefnbXj+l4Kh+O85G6kodCYDcL4+MfxDH9S00PQAp6s3ydTwaSSPbc9WQm1YqpAFTVKIydosC8fMZxWQiMJ6PSgGQZMl3xiYQwmquJFEU2auCJFZNbOb3NG4IChmxU/7eOLb6Nwt1TZymDoCPK0rXryT5qpjNebE3VinrZfH0ykW4uH5PYsSaKTypFnCZF5Yn42dsVoWHzARKip9Qe96IL8uGsc8a1QuP/1cPdE3cT80NS+IcSmEp+RyfJi0uqMZNgUm0R8tisV+sFgD34qgq8r1q5kRmDtI0e+wTxRYvQhLhsUwiNirsVvdJoSkdgAxO9qaRky7x4jrFYBKnf4XhMBRvBkTOjtgn6ZPGS8PFBtvWCZvDKWdBrHVJAYhasWgOuBQVmyTrHysAOSzz287YpVRMDak3zZxDN8pN7QCkgJyKP+LZmpCoymtFFu5fyfn4OmmSnI+1EqMBkNM640NI/JrnYTnfYTI9FWVy5UxJU2atrBlLhoxYpXudyOtHzpuAzH2sHCUCcNprzUzzMjeCN4P/19BBgRmtx6DAoEAjA4OFGglsnj4o0Exh4wKDAo0ENk8fFGimsHGBQYFGApunj3oF/gIXkfYze2V9GAAAAABJRU5ErkJggg==";
const Linux = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAADAFBMVEVMaXHynDcvMDEqKzA1NTUzMzPyoDk9Pj8dICQ5OTkhISvxmjbymDbxkzPwkDTzpz/xmjY3NzcsLCw0NzkuLi7yoD30sj31v0Dyozrzpz7zpDn0rzwnJyfxmzfymzYuLi7ypD3zoTfzpD5NTU3zpDhDRUgoKChSUlL1rDghKTVLS0sZGRg4NTArNl0xMTHzrjw0NDTwlTXwlTVzc3P1vUDxmzf3zkUsLCwzMzNJSUlJSUnYkzXTizHipTg6NDDLijAMGDVCOTJ8XzRPT0/zqj/////3xEL5+fn39/f09PQ2Njb1vED1tz7Kysrr6+tAQUH7+/vV1dbCwsLZ2dmEhIVbW1v3wkH4y0Tw8PD2wED1szz3yUT1uT/4+Pj2xUI7Ozvk5OT+/v784ET5z0T610e8vb1MTEz4zkWPkJHGxsZEQ0NUVFTm5ubzqTrc3Nzzrzzu7O3f39/T09K5uLixsbFxcXFpaWlQUE/74EoDAgTy8vLh4eHp6en3x0PzrDv520nynza0tLQhISGqqqu+v7/n5+jypThISEjQ0NAwMDAbGxvOzs4sLCt8e3wMDAyJiYn//1D/8kgmJiUTFRb5zD+jpKN3d3f50z340kVeX19lZWOBgYA1OD+8kTUkKjkcJUr85kz97k+dnZ1jY2Obm5u+x9YAABdBJBDQoDf750P/9FGmrb3i4uLa4ehDQkDg6/386U/51W9ZZHLu2dZHVnbnpTXtvFH840rr6uibZR7L1uToy6vo8fr4xzo0OU/60lFGRkYGD0Dvy2Optsjy112Oe3Gwj1rGiC2Uflb3vDnrfir//1tFRUWXl5fKwLrxv1nQ0d2lhEaCURjmrkyru87Rxs+0t0G+uEDMr4PrrDuOlq+ZjY/bqjHOr3/vxEn+9f/anTd2eYkVJTOSbTRqd4lJUkhnZUDdoVbyjy6QocBPNTYAACEAACWtnJVTUjX4xnkhHxve1t0LGj/S2uXwjTvaeymDcT7//3ablan64k3/9mfZwFTqtz/euzr97EWttsK4V/UfAAAARXRSTlMAb6pEjpR9/g3IKkUZAi/+mNR9snL53bOfuKipYFIkFuFgyex+xjfaEMiei1L8BMLrBn/k7IvzHdvpirK0xSGYy/r39d1g/2D6AAAACXBIWXMAAC4jAAAuIwF4pT92AAAEaUlEQVR4nMXUZVQbWRQHcCiBsLQLbaG+7da73bbr7rvnvEkyMyFkYkwSJkI8jTtLgiTBgjvFXUvd3W3d3d3d95w9aZcD3QaYb/s+zvn/5r1775uJivo/VjzlTo2G61xzA9n8ujylv+tpTUXTDHIgua6Oy20uczgdLlIioVvDrajgljm6eXpJDAmQ4uRyudxmB4/HU7HIbEHh8Zz1zQ5evf54Ies6EiBWz+Y0OfVaIB0t1pEBG3rS6HU1XKAF/hpSYG6dq+03z/ApT32gepQMSNGc8Pz598nznnZNKSmwcdOZ05eGGi6cO8tr080hAWJ++ePX7W41KpAPtLRQb5weJDRe+l3eIBD9dfFnVosqZXoQ/0TDvtMn9+65+NOZD2D9/STAprdrd+zI/exT5anRfFf39Fd2Q9O2Q3ufffG1l4ax+hrYsWq6fEyJBmx77pne3oBN6S+uVtXPnTp/L8wzy8zBrWxrSItxnDWlvO61U4I5hUZAZ6RnSy1GdijYVQ6X6lfFT5GnsMoAoNEZ6anBEaPVqM0vhUsLpxh3QlNxD5Cl0ehZ5myphc1M55ZL4GLd5GU8sCVfCWhhkJ662WJlWlMLS2CJZPJ5r2OpgmkZtDGgVdL85TBVJ6FMdiJeiR0wroBsqTGE2TgcSTH8FOu2WyKDmyU8AGi0DDo9yxwc4TCVeVi6Mx9mFcKRfwbxrho7oIVBuEsWttZmD8gqSqhUlSQ28gb6aukYyA6XkGfHQE/+KEtFjfhdrHVUu2RhEJ5D9ojRiuXlMYG/WsdyUe+LBNbs7tsJZJd3yDIHn+SEAnk2NrDDOpV+dH0kkPz8C2UyGS3jcgnhsQVs2GEw/B18XEXdGAk8JK9Cd4G0DDojyxw+EVOp/PHQt+ePVnRT2x696dr8ilxoqGrPy0DGyAr3iFOkDfR+f+HIgd2aLUc/lq++Jp+YlOtTdA4eeAOA1NSg1MgOabGDu9xVrT+0t594pXL21emZSxYQiK8AV1TW9u/cD6SbLRwrU8vcaj42WNv6zSevVrr/AwyinM5GsUmodle2fsWyMCwcdojJtB5+99ggv1ZeVdmhuCf6+omgwCD05ggQFGocyvzC0yzjsIuY2pAUgHfkIlygcCsUnR3zl04Ai30+IaEmcEKdU3XuS24RhmEYcwSAN9/a54Ugr0idk9Ox3XTHOIgmUDGCE4RIrXY3nP28zm7DrHQAPuqvVXj5CIriXhFiSFo4Dha4EYjg45BXoFbLj3x9cD8DAIbN1fehXO3FUZ/BYCjInbdy1jiAcsQIH8JxnBAJBA3vve+3d5XpykvaW+UiAjEV5BaYkpbHTax6HkIQECIWixGcj0PC/r5yT3m+pKVtQAEhQkOuCVm09KomRc2aPR/he71ik0mICoWvP74+OZZCiZ3x2EAmipp8iCg6wk1aNjPuVlSMoqgQf/iRsYcPZoogIlMdFyF/ZeCLhJAXWTl+0ZYtJxrVd0V6/7/r9hULl8RNaEZU4t2LVydOniez/gF/C7DTuj5i0wAAAABJRU5ErkJggg==";
const Android = "data:image/png;base64,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";
const Ahrefs = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABgWlDQ1BzUkdCIElFQzYxOTY2LTIuMQAAKJF1kc8rRFEUxz/zQ36NCAvK4qVhhQYlNspMGmrSNEYZbGae+aFmxuu9kWSrbKcosfFrwV/AVlkrRaRky5rYoOc8MzWTzLmdez73e+853Xsu2MNpNWM4PZDJ5vSQ36vMRuaU6mecNFNLOzVR1dDGgsEAFe3jDpsVb3qtWpXP/Wv1i3FDBVuN8Kiq6TnhCeHAak6zeFu4VU1FF4VPhXt0uaDwraXHCvxicbLAXxbr4ZAP7E3CSrKMY2WspvSMsLwcdya9ohbvY73EFc/OTEvsFO/AIIQfLwqTjONjiH5GZB6ilwH6ZEWFfM9v/hTLkqvKrLGGzhJJUuToEXVFqsclJkSPy0izZvX/b1+NxOBAobrLC1VPpvnWBdVb8J03zc9D0/w+AscjXGRL+csHMPwuer6kufehcQPOLktabAfON6HtQYvq0V/JIW5PJOD1BBoi0HINdfOFnhX3Ob6H8Lp81RXs7kG3nG9c+AEHA2e6ozG9sQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAt1JREFUaIHt2T/IHEUYx/HPJK/4N/5J1ELRRoMmCklEtAkWgihWWlgIplAEQTGRBGHSBEk1TUiRFIJoY6GNhSIkRBHsgmChEBBREH2TyBvxH8HoS2Qs9l7zuu/dubN3724C94Vh79h7nvn9bmdnn5kNRpCTjfh61PkeORSinUtf1vSpZBrMDPTNzEDfzAz0zcxA38yNOXcSj3clBPtxf2nQSAMh+gNHJlFUQk4XyoMSLvkhNDPQNzMDfTNuGi0mJxuwedA24VZcNuhnbtnnYcfb2vTZykBO1mNbTexm3NQm3yQ0NpCTq/AEnsEjJbGryf+KyMkcdmEfrl11RYWMNZCTB/AW7ulGTjkjDQzEf4x13ckpZ+g0mpNNOOoiF8/o58BB3NClkLasGEI52Y5HO+r/LBYGbSM2lCYYdg/smlAULOI7fItvMO+C0AWcwUKIzi0F5OQIHivtaJiBh8r1+hkf4gN8jh9C9HeLPMX8x0BO7sLNBfGn8DyOdSW4Tv0K3FcQexxPhujHKeoppj4LrS+IfaVv8aw0cH3DuFP4bMpaWlE3cF3DuC9DlKclIie3q0rvYur3wBWTy2lGToLqefOiavtmbZs8bUvi1iXGYNHzHF7AHW3zLFE30HRYbM3J2pKpMycP4iU8ZYpXum7gl4ZxV6v+xTfG/Sgnl+NplfDiXbcm1A2cLoh9ffAi8B2cCNFiTq7B3aol5jbswI1TUTqCuoH5gtg1eHXQ5OScamiE6UhrLmI5n+Kvlrmu1LF4agZCdBbHuhYxCcMWNIc6VzEBKwyE6CO814OWxTZBo5aUL6sWI6vNr6orfi8+aZNgqIEQncbDqlXVanAcz+KWEO0M0Ym2ica9ofk+J1uwe9Am3aE4g3fxZoi+mDDXv4ythUL0O17LyWHsVRVeJWXAn6pl5ts4GqLzbYWOolExF6KfsCcnB7Add6p2EZaO61QvBeeXta/wfoh+m7bo5fwDm96PGKNCrYcAAAAASUVORK5CYII=";
const Amazon = "data:image/png;base64,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";
const Bing = "data:image/png;base64,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";
const Facebook = "data:image/png;base64,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";
const Googlebot = "data:image/png;base64,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";
const SemrushBot = "data:image/png;base64,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";
const SeznamBot = "data:image/png;base64,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";
const WordPress = "" + new URL("wordpress-wr0uobcc1sl.png", import.meta.url).href;
const YandexBot = "data:image/png;base64,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";
function BrowserIcon({ uaString }) {
  var _a, _b;
  const { browser, os, ua } = uaParserExports.UAParser(uaString);
  const osName = os.name || ua;
  let botName;
  const browserNameOk = (_a = browser.name) == null ? void 0 : _a.replaceAll(" ", "");
  const osNameOk = (_b = os.name) == null ? void 0 : _b.replaceAll(" ", "");
  const browserIcons = {
    Chrome,
    ChromeWebView: Chrome,
    Firefox,
    Edge,
    Safari,
    IE,
    baiduboxapp: Chrome,
    WebKit,
    MobileSafari,
    SamsungBrowser,
    Opera,
    Brave,
    Vivaldi
  };
  const osIcons = {
    Windows,
    macOs,
    MacOS: macOs,
    iOS,
    iPadOS,
    iPadOs: iPadOS,
    Linux,
    Android
  };
  const botIcons = {
    Ahrefs,
    AhrefsSiteAudit: Ahrefs,
    Amazon,
    "Amazon CloudFront": Amazon,
    bingbot: Bing,
    Bing,
    Facebook,
    "Google Bot": Googlebot,
    "Semrush Bot": SemrushBot,
    SeznamBot,
    WordPress,
    YandexBot
  };
  if (osName === ua) {
    botName = ua.replace(/.+?(S|s)emrush.+/g, "Semrush Bot");
    botName = botName.includes("Google") ? "Google Bot" : botName;
    botName = botName.includes("facebook") ? "Facebook" : botName;
    botName = botName.includes("WordPress") ? "WordPress" : botName;
    botName = botName.replace(/(.+?compatible; ?)?([^\/]*)\/.+?$/g, "$2");
  }
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-align-center" }, browserIcons[browserNameOk] && !botName ? /* @__PURE__ */ React.createElement("img", { className: "browserIcon", src: browserIcons[browserNameOk], alt: browser.name }) : /* @__PURE__ */ React.createElement("img", { className: "browserIcon", src: botIcons[botName] || Generic, alt: botName }), osIcons[osNameOk] ? /* @__PURE__ */ React.createElement("img", { className: "ml-s browserIcon", src: osIcons[osNameOk] || Generic, alt: osName }) : /* @__PURE__ */ React.createElement("strong", { className: "limit" }, " ", botName));
}
function NotFoundTable({ slug }) {
  var _a;
  const paginationId = "url_id";
  const matchUrlField = reactExports.useRef();
  const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater({ slug });
  const defaultSorting = sorting.length ? sorting : [{ key: "updated", dir: "DESC", op: "<" }];
  const url = { filters, sorting: defaultSorting };
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
  } = useInfiniteFetch({ key: slug, filters, sorting: defaultSorting, paginationId });
  const { row, selectedRows, selectRow, activePanel, setActivePanel, deleteRow, deleteSelectedRows, updateRow } = useChangeRow({ data, url, slug, paginationId });
  const [rowToEdit, setEditorRow] = reactExports.useState({});
  const { redirectTypes, matchTypes, header: redirectHeader } = useRedirectTableMenus();
  const addRedirect = reactExports.useCallback(({ cell }) => {
    const { url: defaultMatchUrl } = cell.row.original;
    matchUrlField.current = defaultMatchUrl;
    setEditorRow({ match_type: "E", redirect_code: "301", match_url: defaultMatchUrl });
    setActivePanel("rowInserter");
  }, [setActivePanel, setEditorRow]);
  const rowEditorCells = {
    match_type: /* @__PURE__ */ React.createElement(SortMenu, { autoClose: true, items: matchTypes, name: "match_type", defaultValue: "E", onChange: (val) => setEditorRow({ ...rowToEdit, match_type: val }) }, redirectHeader.match_type),
    match_url: /* @__PURE__ */ React.createElement(InputField, { type: "url", liveUpdate: true, ref: matchUrlField, defaultValue: matchUrlField.current, label: redirectHeader.match_url, onChange: (val) => setEditorRow({ ...rowToEdit, match_url: val }) }),
    replace_url: /* @__PURE__ */ React.createElement(InputField, { type: "url", liveUpdate: true, defaultValue: "", label: redirectHeader.replace_url, onChange: (val) => setEditorRow({ ...rowToEdit, replace_url: val }), required: true }),
    redirect_code: /* @__PURE__ */ React.createElement(SortMenu, { autoClose: true, items: redirectTypes, name: "redirect_code", defaultValue: "301", onChange: (val) => setEditorRow({ ...rowToEdit, redirect_code: val }) }, redirectHeader.redirect_code)
  };
  const header = {
    url: __("URL"),
    cnt: __("Visits"),
    created: __("First visit"),
    updated: "Last visit",
    labels: "Tags",
    request_data: "User agent"
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "nolimit checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { defaultValue: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: null
    }),
    columnHelper.accessor("url", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.url),
      minSize: 200
    }),
    columnHelper.accessor("cnt", {
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.cnt),
      minSize: 50
    }),
    columnHelper.accessor("created", {
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.created),
      minSize: 80
    }),
    columnHelper.accessor("updated", {
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting: defaultSorting, th, onClick: () => sortBy(th) } }, header.updated),
      minSize: 80
    }),
    columnHelper == null ? void 0 : columnHelper.accessor((cell) => {
      var _a2;
      return (_a2 = JSON.parse(`${cell == null ? void 0 : cell.request_data}`)) == null ? void 0 : _a2.server.referer;
    }, {
      id: "referer",
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => {
        return cell.getValue();
      },
      header: __("Referer"),
      size: 100
    }),
    columnHelper == null ? void 0 : columnHelper.accessor((cell) => {
      var _a2;
      return (_a2 = JSON.parse(`${cell == null ? void 0 : cell.request_data}`)) == null ? void 0 : _a2.server.ip;
    }, {
      id: "ip",
      cell: (cell) => {
        return cell.getValue();
      },
      header: "IP address",
      size: 100
    }),
    columnHelper == null ? void 0 : columnHelper.accessor((cell) => {
      var _a2;
      return (_a2 = JSON.parse(`${cell == null ? void 0 : cell.request_data}`)) == null ? void 0 : _a2.server.agent;
    }, {
      id: "agent",
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement(BrowserIcon, { uaString: cell.getValue() }),
      header: __("User Agent"),
      size: 100
    }),
    columnHelper.accessor("labels", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(TagsMenu, { defaultValue: cell.getValue(), slug, onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: header.labels,
      size: 150
    }),
    columnHelper.accessor("addRedirect", {
      className: "hoverize",
      tooltip: () => /* @__PURE__ */ React.createElement(Tooltip, { className: "align-left xxxl" }, __("Create redirect from 404")),
      cell: (cell) => /* @__PURE__ */ React.createElement(SvgIconPlus, { onClick: () => addRedirect({ cell }) }),
      header: null
    }),
    columnHelper.accessor("editRow", {
      className: "editRow",
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
      onUpdateRow: (val) => {
        setActivePanel();
        setEditorRow();
        if (val === "rowInserted") {
          setActivePanel();
          setEditorRow(val);
          setTimeout(() => {
            setEditorRow();
          }, 3e3);
        }
      },
      noImport: true,
      noInsert: true,
      activatePanel: activePanel,
      rowEditorOptions: {
        rowEditorCells,
        title: "Create redirect from this",
        data,
        slug: "redirects",
        url,
        paginationId: "redirect_id",
        rowToEdit
      },
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
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, `${header.url} “${row.url}”`, " ", __("has been deleted.")) : null,
    rowToEdit === "rowInserted" ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("Redirect rule has been added.")) : null,
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sorting } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  NotFoundTable as default
};
