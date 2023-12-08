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

eval("window.urlsLab = {};\nurlsLab.setNotification = props => {\n  const {\n    message,\n    status\n  } = props;\n  const id = Date.now();\n  const body = document.body;\n  if (document.querySelector('.urlslab-notifications') === null) {\n    const notificationsWrapper = document.createElement('div');\n    notificationsWrapper.classList.add('urlslab-notifications');\n    body.appendChild(notificationsWrapper);\n  }\n  const notificationsWrapper = document.querySelector('.urlslab-notifications');\n  const panel = `<div data-panelId='${id}' class='urlslab-notifications-panel ${status || ''} fadeInto'>\n\t\t<strong>${message}</strong>\n\t</div>`;\n  notificationsWrapper.insertAdjacentHTML('beforeend', panel);\n  setTimeout(() => {\n    document.querySelector(`[data-panelid='${id}']`).remove();\n    if (!document.querySelectorAll('.urlslab-notifications-panel').length) {\n      notificationsWrapper.remove();\n    }\n  }, 3000);\n};\n\n//# sourceURL=webpack://urlslab/./assets/js/urlslab-notifications.js?");

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