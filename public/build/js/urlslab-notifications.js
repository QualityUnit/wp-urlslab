/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/js/urlslab-notifications.js":
/*!********************************************!*\
  !*** ./assets/js/urlslab-notifications.js ***!
  \********************************************/
/***/ (function() {

eval("const setNotification = props => {\n  const {\n    message,\n    status\n  } = props;\n  const id = Date.now();\n  const body = document.body;\n  if (document.querySelector('.urlslab-notifications') === null) {\n    const notificationsWrapper = document.createElement('div');\n    notificationsWrapper.classList.add('urlslab-notifications');\n    body.appendChild(notificationsWrapper);\n  }\n  const notificationsWrapper = document.querySelector('.urlslab-notifications');\n  const panel = `<div data-panelId='${id}' class='urlslab-notifications-panel ${status || ''} fadeInto'>\n\t\t<strong>${message}</strong>\n\t</div>`;\n  notificationsWrapper.insertAdjacentHTML('beforeend', panel);\n  setTimeout(() => {\n    document.querySelector(`[data-panelid='${id}']`).remove();\n    if (!document.querySelectorAll('.urlslab-notifications-panel').length) {\n      notificationsWrapper.remove();\n    }\n  }, 3000);\n};\nconst getFetch = async slug => {\n  try {\n    const result = await fetch(wpApiSettings.root + `urlslab/v1${slug ? `/${slug}` : ''}`, {\n      method: 'GET',\n      headers: {\n        'Content-Type': 'application/json',\n        accept: 'application/json',\n        'X-WP-Nonce': window.wpApiSettings.nonce\n      },\n      credentials: 'include'\n    });\n    return result;\n  } catch (error) {\n    return false;\n  }\n};\nconst deleteAll = async slug => {\n  try {\n    const result = await fetch(wpApiSettings.root + `urlslab/v1${slug ? `/${slug}/delete-all` : ''}`, {\n      method: 'DELETE',\n      headers: {\n        'Content-Type': 'application/json',\n        accept: 'application/json',\n        'X-WP-Nonce': window.wpApiSettings.nonce\n      },\n      credentials: 'include'\n    });\n    return result;\n  } catch (error) {\n    return false;\n  }\n};\n\n// All files and caches cleaning\ndocument.querySelector('#wp-admin-bar-urlslab-cache-clearall a').addEventListener('click', async event => {\n  event.preventDefault();\n  setNotification({\n    message: 'Clearing All caches',\n    status: 'info'\n  });\n  const responseJS = await deleteAll('js-cache');\n  const responseCSS = await deleteAll('css-cache');\n  const responseCloudFront = await getFetch('cache-rules/drop-cloudfront');\n  if (responseCSS.ok && responseJS.ok && responseCloudFront.ok) {\n    setNotification({\n      message: 'All caches deleted!',\n      status: 'success'\n    });\n    return false;\n  }\n  setNotification({\n    message: 'Deleting all caches failed',\n    status: 'error'\n  });\n});\n\n// CSS files cleaning\ndocument.querySelector('#wp-admin-bar-urlslab-cache-css a').addEventListener('click', async event => {\n  event.preventDefault();\n  setNotification({\n    message: 'Clearing CSS cache',\n    status: 'info'\n  });\n  const response = await deleteAll('css-cache');\n  // const message = await response.json();\n\n  if (response.ok) {\n    setNotification({\n      message: 'All optimized CSS files deleted!',\n      status: 'success'\n    });\n    return false;\n  }\n  setNotification({\n    message: message.message,\n    status: 'error'\n  });\n});\n\n// JS files cleaning\ndocument.querySelector('#wp-admin-bar-urlslab-cache-js a').addEventListener('click', async event => {\n  event.preventDefault();\n  setNotification({\n    message: 'Clearing JS cache',\n    status: 'info'\n  });\n  const response = await deleteAll('js-cache');\n  const message = await response.json();\n  if (response.ok) {\n    setNotification({\n      message: 'All optimized JS files deleted!',\n      status: 'success'\n    });\n    return false;\n  }\n  setNotification({\n    message: message.message,\n    status: 'error'\n  });\n});\n\n// CSS and JS files cleaning\ndocument.querySelector('#wp-admin-bar-urlslab-cache-css-js a').addEventListener('click', async event => {\n  event.preventDefault();\n  setNotification({\n    message: 'Clearing CSS and JS cache',\n    status: 'info'\n  });\n  const responseJS = await deleteAll('js-cache');\n  const responseCSS = await deleteAll('css-cache');\n  if (responseCSS.ok && responseJS.ok) {\n    setNotification({\n      message: 'All optimized CSS and JS files deleted!',\n      status: 'success'\n    });\n    return false;\n  }\n  setNotification({\n    message: 'Deleting cached CSS and JS files failed',\n    status: 'error'\n  });\n});\n\n// CLoudfront cache clean\ndocument.querySelector('#wp-admin-bar-urlslab-cache-cloudfront a').addEventListener('click', async event => {\n  event.preventDefault();\n  setNotification({\n    message: 'Clearing Cloudfront cache',\n    status: 'info'\n  });\n  const response = await getFetch('cache-rules/drop-cloudfront');\n  const message = await response.json();\n  if (response.ok) {\n    setNotification({\n      message: 'Cloudfront cache invalidated!',\n      status: 'success'\n    });\n    return false;\n  }\n  setNotification({\n    message: message.message,\n    status: 'error'\n  });\n});\n\n//# sourceURL=webpack://urlslab/./assets/js/urlslab-notifications.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./assets/js/urlslab-notifications.js"]();
/******/ 	
/******/ })()
;