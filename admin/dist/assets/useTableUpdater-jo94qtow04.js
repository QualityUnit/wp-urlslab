import { Q as QueryObserver, C as infiniteQueryBehavior, D as hasNextPage, E as hasPreviousPage, F as parseQueryArgs, G as useBaseQuery, R as React, r as reactExports, u as useI18n, i as postFetch, a as useQueryClient, l as langName, H as get, B as Button, T as Tooltip, I as SvgIconClose, L as Loader, f as fetchData, k as getParamsChar, J as update, K as HeaderHeightContext, M as useResizeObserver, d as useQuery, S as SvgIconCronRefresh } from "../main-jo94qtow04.js";
import { u as useClickOutside, P, R, I as IconButton } from "./_ColumnsMenu-jo94qtow04.js";
import { S as SortMenu, I as InputField, F as FilterMenu, H as Ht, C as Checkbox } from "./FilterMenu-jo94qtow04.js";
/* empty css                       */import { u as useMutation } from "./useMutation-jo94qtow04.js";
class InfiniteQueryObserver extends QueryObserver {
  // Type override
  // Type override
  // Type override
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(client, options) {
    super(client, options);
  }
  bindMethods() {
    super.bindMethods();
    this.fetchNextPage = this.fetchNextPage.bind(this);
    this.fetchPreviousPage = this.fetchPreviousPage.bind(this);
  }
  setOptions(options, notifyOptions) {
    super.setOptions({
      ...options,
      behavior: infiniteQueryBehavior()
    }, notifyOptions);
  }
  getOptimisticResult(options) {
    options.behavior = infiniteQueryBehavior();
    return super.getOptimisticResult(options);
  }
  fetchNextPage({
    pageParam,
    ...options
  } = {}) {
    return this.fetch({
      ...options,
      meta: {
        fetchMore: {
          direction: "forward",
          pageParam
        }
      }
    });
  }
  fetchPreviousPage({
    pageParam,
    ...options
  } = {}) {
    return this.fetch({
      ...options,
      meta: {
        fetchMore: {
          direction: "backward",
          pageParam
        }
      }
    });
  }
  createResult(query, options) {
    var _state$fetchMeta, _state$fetchMeta$fetc, _state$fetchMeta2, _state$fetchMeta2$fet, _state$data, _state$data2;
    const {
      state
    } = query;
    const result = super.createResult(query, options);
    const {
      isFetching,
      isRefetching
    } = result;
    const isFetchingNextPage = isFetching && ((_state$fetchMeta = state.fetchMeta) == null ? void 0 : (_state$fetchMeta$fetc = _state$fetchMeta.fetchMore) == null ? void 0 : _state$fetchMeta$fetc.direction) === "forward";
    const isFetchingPreviousPage = isFetching && ((_state$fetchMeta2 = state.fetchMeta) == null ? void 0 : (_state$fetchMeta2$fet = _state$fetchMeta2.fetchMore) == null ? void 0 : _state$fetchMeta2$fet.direction) === "backward";
    return {
      ...result,
      fetchNextPage: this.fetchNextPage,
      fetchPreviousPage: this.fetchPreviousPage,
      hasNextPage: hasNextPage(options, (_state$data = state.data) == null ? void 0 : _state$data.pages),
      hasPreviousPage: hasPreviousPage(options, (_state$data2 = state.data) == null ? void 0 : _state$data2.pages),
      isFetchingNextPage,
      isFetchingPreviousPage,
      isRefetching: isRefetching && !isFetchingNextPage && !isFetchingPreviousPage
    };
  }
}
function useInfiniteQuery(arg1, arg2, arg3) {
  const options = parseQueryArgs(arg1, arg2, arg3);
  return useBaseQuery(options, InfiniteQueryObserver);
}
function ProgressBar({ notification, value, className }) {
  return /* @__PURE__ */ React.createElement("div", { className: `urlslab-progressBar-wrapper ${className || ""}` }, /* @__PURE__ */ React.createElement("progress", { className: "urlslab-progressBar", value, max: "100" }), /* @__PURE__ */ React.createElement("span", { className: "urlslab-progressBar-timer" }, notification, " "));
}
/**
 * table-core
 *
 * Copyright (c) TanStack
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function functionalUpdate(updater, input) {
  return typeof updater === "function" ? updater(input) : updater;
}
function makeStateUpdater(key, instance) {
  return (updater) => {
    instance.setState((old) => {
      return {
        ...old,
        [key]: functionalUpdate(updater, old[key])
      };
    });
  };
}
function isFunction(d) {
  return d instanceof Function;
}
function flattenBy(arr, getChildren) {
  const flat = [];
  const recurse = (subArr) => {
    subArr.forEach((item) => {
      flat.push(item);
      const children = getChildren(item);
      if (children != null && children.length) {
        recurse(children);
      }
    });
  };
  recurse(arr);
  return flat;
}
function memo(getDeps, fn, opts) {
  let deps = [];
  let result;
  return () => {
    let depTime;
    if (opts.key && opts.debug)
      depTime = Date.now();
    const newDeps = getDeps();
    const depsChanged = newDeps.length !== deps.length || newDeps.some((dep, index) => deps[index] !== dep);
    if (!depsChanged) {
      return result;
    }
    deps = newDeps;
    let resultTime;
    if (opts.key && opts.debug)
      resultTime = Date.now();
    result = fn(...newDeps);
    opts == null ? void 0 : opts.onChange == null ? void 0 : opts.onChange(result);
    if (opts.key && opts.debug) {
      if (opts != null && opts.debug()) {
        const depEndTime = Math.round((Date.now() - depTime) * 100) / 100;
        const resultEndTime = Math.round((Date.now() - resultTime) * 100) / 100;
        const resultFpsPercentage = resultEndTime / 16;
        const pad = (str, num) => {
          str = String(str);
          while (str.length < num) {
            str = " " + str;
          }
          return str;
        };
        console.info(`%c⏱ ${pad(resultEndTime, 5)} /${pad(depEndTime, 5)} ms`, `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(0, Math.min(120 - 120 * resultFpsPercentage, 120))}deg 100% 31%);`, opts == null ? void 0 : opts.key);
      }
    }
    return result;
  };
}
function createColumn(table, columnDef, depth, parent) {
  var _ref, _resolvedColumnDef$id;
  const defaultColumn = table._getDefaultColumnDef();
  const resolvedColumnDef = {
    ...defaultColumn,
    ...columnDef
  };
  const accessorKey = resolvedColumnDef.accessorKey;
  let id = (_ref = (_resolvedColumnDef$id = resolvedColumnDef.id) != null ? _resolvedColumnDef$id : accessorKey ? accessorKey.replace(".", "_") : void 0) != null ? _ref : typeof resolvedColumnDef.header === "string" ? resolvedColumnDef.header : void 0;
  let accessorFn;
  if (resolvedColumnDef.accessorFn) {
    accessorFn = resolvedColumnDef.accessorFn;
  } else if (accessorKey) {
    if (accessorKey.includes(".")) {
      accessorFn = (originalRow) => {
        let result = originalRow;
        for (const key of accessorKey.split(".")) {
          var _result;
          result = (_result = result) == null ? void 0 : _result[key];
        }
        return result;
      };
    } else {
      accessorFn = (originalRow) => originalRow[resolvedColumnDef.accessorKey];
    }
  }
  if (!id) {
    throw new Error();
  }
  let column = {
    id: `${String(id)}`,
    accessorFn,
    parent,
    depth,
    columnDef: resolvedColumnDef,
    columns: [],
    getFlatColumns: memo(() => [true], () => {
      var _column$columns;
      return [column, ...(_column$columns = column.columns) == null ? void 0 : _column$columns.flatMap((d) => d.getFlatColumns())];
    }, {
      key: "column.getFlatColumns",
      debug: () => {
        var _table$options$debugA;
        return (_table$options$debugA = table.options.debugAll) != null ? _table$options$debugA : table.options.debugColumns;
      }
    }),
    getLeafColumns: memo(() => [table._getOrderColumnsFn()], (orderColumns2) => {
      var _column$columns2;
      if ((_column$columns2 = column.columns) != null && _column$columns2.length) {
        let leafColumns = column.columns.flatMap((column2) => column2.getLeafColumns());
        return orderColumns2(leafColumns);
      }
      return [column];
    }, {
      key: "column.getLeafColumns",
      debug: () => {
        var _table$options$debugA2;
        return (_table$options$debugA2 = table.options.debugAll) != null ? _table$options$debugA2 : table.options.debugColumns;
      }
    })
  };
  column = table._features.reduce((obj, feature) => {
    return Object.assign(obj, feature.createColumn == null ? void 0 : feature.createColumn(column, table));
  }, column);
  return column;
}
function createHeader(table, column, options) {
  var _options$id;
  const id = (_options$id = options.id) != null ? _options$id : column.id;
  let header = {
    id,
    column,
    index: options.index,
    isPlaceholder: !!options.isPlaceholder,
    placeholderId: options.placeholderId,
    depth: options.depth,
    subHeaders: [],
    colSpan: 0,
    rowSpan: 0,
    headerGroup: null,
    getLeafHeaders: () => {
      const leafHeaders = [];
      const recurseHeader = (h) => {
        if (h.subHeaders && h.subHeaders.length) {
          h.subHeaders.map(recurseHeader);
        }
        leafHeaders.push(h);
      };
      recurseHeader(header);
      return leafHeaders;
    },
    getContext: () => ({
      table,
      header,
      column
    })
  };
  table._features.forEach((feature) => {
    Object.assign(header, feature.createHeader == null ? void 0 : feature.createHeader(header, table));
  });
  return header;
}
const Headers = {
  createTable: (table) => {
    return {
      // Header Groups
      getHeaderGroups: memo(() => [table.getAllColumns(), table.getVisibleLeafColumns(), table.getState().columnPinning.left, table.getState().columnPinning.right], (allColumns, leafColumns, left, right) => {
        var _left$map$filter, _right$map$filter;
        const leftColumns = (_left$map$filter = left == null ? void 0 : left.map((columnId) => leafColumns.find((d) => d.id === columnId)).filter(Boolean)) != null ? _left$map$filter : [];
        const rightColumns = (_right$map$filter = right == null ? void 0 : right.map((columnId) => leafColumns.find((d) => d.id === columnId)).filter(Boolean)) != null ? _right$map$filter : [];
        const centerColumns = leafColumns.filter((column) => !(left != null && left.includes(column.id)) && !(right != null && right.includes(column.id)));
        const headerGroups = buildHeaderGroups(allColumns, [...leftColumns, ...centerColumns, ...rightColumns], table);
        return headerGroups;
      }, {
        key: false,
        debug: () => {
          var _table$options$debugA;
          return (_table$options$debugA = table.options.debugAll) != null ? _table$options$debugA : table.options.debugHeaders;
        }
      }),
      getCenterHeaderGroups: memo(() => [table.getAllColumns(), table.getVisibleLeafColumns(), table.getState().columnPinning.left, table.getState().columnPinning.right], (allColumns, leafColumns, left, right) => {
        leafColumns = leafColumns.filter((column) => !(left != null && left.includes(column.id)) && !(right != null && right.includes(column.id)));
        return buildHeaderGroups(allColumns, leafColumns, table, "center");
      }, {
        key: false,
        debug: () => {
          var _table$options$debugA2;
          return (_table$options$debugA2 = table.options.debugAll) != null ? _table$options$debugA2 : table.options.debugHeaders;
        }
      }),
      getLeftHeaderGroups: memo(() => [table.getAllColumns(), table.getVisibleLeafColumns(), table.getState().columnPinning.left], (allColumns, leafColumns, left) => {
        var _left$map$filter2;
        const orderedLeafColumns = (_left$map$filter2 = left == null ? void 0 : left.map((columnId) => leafColumns.find((d) => d.id === columnId)).filter(Boolean)) != null ? _left$map$filter2 : [];
        return buildHeaderGroups(allColumns, orderedLeafColumns, table, "left");
      }, {
        key: false,
        debug: () => {
          var _table$options$debugA3;
          return (_table$options$debugA3 = table.options.debugAll) != null ? _table$options$debugA3 : table.options.debugHeaders;
        }
      }),
      getRightHeaderGroups: memo(() => [table.getAllColumns(), table.getVisibleLeafColumns(), table.getState().columnPinning.right], (allColumns, leafColumns, right) => {
        var _right$map$filter2;
        const orderedLeafColumns = (_right$map$filter2 = right == null ? void 0 : right.map((columnId) => leafColumns.find((d) => d.id === columnId)).filter(Boolean)) != null ? _right$map$filter2 : [];
        return buildHeaderGroups(allColumns, orderedLeafColumns, table, "right");
      }, {
        key: false,
        debug: () => {
          var _table$options$debugA4;
          return (_table$options$debugA4 = table.options.debugAll) != null ? _table$options$debugA4 : table.options.debugHeaders;
        }
      }),
      // Footer Groups
      getFooterGroups: memo(() => [table.getHeaderGroups()], (headerGroups) => {
        return [...headerGroups].reverse();
      }, {
        key: false,
        debug: () => {
          var _table$options$debugA5;
          return (_table$options$debugA5 = table.options.debugAll) != null ? _table$options$debugA5 : table.options.debugHeaders;
        }
      }),
      getLeftFooterGroups: memo(() => [table.getLeftHeaderGroups()], (headerGroups) => {
        return [...headerGroups].reverse();
      }, {
        key: false,
        debug: () => {
          var _table$options$debugA6;
          return (_table$options$debugA6 = table.options.debugAll) != null ? _table$options$debugA6 : table.options.debugHeaders;
        }
      }),
      getCenterFooterGroups: memo(() => [table.getCenterHeaderGroups()], (headerGroups) => {
        return [...headerGroups].reverse();
      }, {
        key: false,
        debug: () => {
          var _table$options$debugA7;
          return (_table$options$debugA7 = table.options.debugAll) != null ? _table$options$debugA7 : table.options.debugHeaders;
        }
      }),
      getRightFooterGroups: memo(() => [table.getRightHeaderGroups()], (headerGroups) => {
        return [...headerGroups].reverse();
      }, {
        key: false,
        debug: () => {
          var _table$options$debugA8;
          return (_table$options$debugA8 = table.options.debugAll) != null ? _table$options$debugA8 : table.options.debugHeaders;
        }
      }),
      // Flat Headers
      getFlatHeaders: memo(() => [table.getHeaderGroups()], (headerGroups) => {
        return headerGroups.map((headerGroup) => {
          return headerGroup.headers;
        }).flat();
      }, {
        key: false,
        debug: () => {
          var _table$options$debugA9;
          return (_table$options$debugA9 = table.options.debugAll) != null ? _table$options$debugA9 : table.options.debugHeaders;
        }
      }),
      getLeftFlatHeaders: memo(() => [table.getLeftHeaderGroups()], (left) => {
        return left.map((headerGroup) => {
          return headerGroup.headers;
        }).flat();
      }, {
        key: false,
        debug: () => {
          var _table$options$debugA10;
          return (_table$options$debugA10 = table.options.debugAll) != null ? _table$options$debugA10 : table.options.debugHeaders;
        }
      }),
      getCenterFlatHeaders: memo(() => [table.getCenterHeaderGroups()], (left) => {
        return left.map((headerGroup) => {
          return headerGroup.headers;
        }).flat();
      }, {
        key: false,
        debug: () => {
          var _table$options$debugA11;
          return (_table$options$debugA11 = table.options.debugAll) != null ? _table$options$debugA11 : table.options.debugHeaders;
        }
      }),
      getRightFlatHeaders: memo(() => [table.getRightHeaderGroups()], (left) => {
        return left.map((headerGroup) => {
          return headerGroup.headers;
        }).flat();
      }, {
        key: false,
        debug: () => {
          var _table$options$debugA12;
          return (_table$options$debugA12 = table.options.debugAll) != null ? _table$options$debugA12 : table.options.debugHeaders;
        }
      }),
      // Leaf Headers
      getCenterLeafHeaders: memo(() => [table.getCenterFlatHeaders()], (flatHeaders) => {
        return flatHeaders.filter((header) => {
          var _header$subHeaders;
          return !((_header$subHeaders = header.subHeaders) != null && _header$subHeaders.length);
        });
      }, {
        key: false,
        debug: () => {
          var _table$options$debugA13;
          return (_table$options$debugA13 = table.options.debugAll) != null ? _table$options$debugA13 : table.options.debugHeaders;
        }
      }),
      getLeftLeafHeaders: memo(() => [table.getLeftFlatHeaders()], (flatHeaders) => {
        return flatHeaders.filter((header) => {
          var _header$subHeaders2;
          return !((_header$subHeaders2 = header.subHeaders) != null && _header$subHeaders2.length);
        });
      }, {
        key: false,
        debug: () => {
          var _table$options$debugA14;
          return (_table$options$debugA14 = table.options.debugAll) != null ? _table$options$debugA14 : table.options.debugHeaders;
        }
      }),
      getRightLeafHeaders: memo(() => [table.getRightFlatHeaders()], (flatHeaders) => {
        return flatHeaders.filter((header) => {
          var _header$subHeaders3;
          return !((_header$subHeaders3 = header.subHeaders) != null && _header$subHeaders3.length);
        });
      }, {
        key: false,
        debug: () => {
          var _table$options$debugA15;
          return (_table$options$debugA15 = table.options.debugAll) != null ? _table$options$debugA15 : table.options.debugHeaders;
        }
      }),
      getLeafHeaders: memo(() => [table.getLeftHeaderGroups(), table.getCenterHeaderGroups(), table.getRightHeaderGroups()], (left, center, right) => {
        var _left$0$headers, _left$, _center$0$headers, _center$, _right$0$headers, _right$;
        return [...(_left$0$headers = (_left$ = left[0]) == null ? void 0 : _left$.headers) != null ? _left$0$headers : [], ...(_center$0$headers = (_center$ = center[0]) == null ? void 0 : _center$.headers) != null ? _center$0$headers : [], ...(_right$0$headers = (_right$ = right[0]) == null ? void 0 : _right$.headers) != null ? _right$0$headers : []].map((header) => {
          return header.getLeafHeaders();
        }).flat();
      }, {
        key: false,
        debug: () => {
          var _table$options$debugA16;
          return (_table$options$debugA16 = table.options.debugAll) != null ? _table$options$debugA16 : table.options.debugHeaders;
        }
      })
    };
  }
};
function buildHeaderGroups(allColumns, columnsToGroup, table, headerFamily) {
  var _headerGroups$0$heade, _headerGroups$;
  let maxDepth = 0;
  const findMaxDepth = function(columns, depth) {
    if (depth === void 0) {
      depth = 1;
    }
    maxDepth = Math.max(maxDepth, depth);
    columns.filter((column) => column.getIsVisible()).forEach((column) => {
      var _column$columns;
      if ((_column$columns = column.columns) != null && _column$columns.length) {
        findMaxDepth(column.columns, depth + 1);
      }
    }, 0);
  };
  findMaxDepth(allColumns);
  let headerGroups = [];
  const createHeaderGroup = (headersToGroup, depth) => {
    const headerGroup = {
      depth,
      id: [headerFamily, `${depth}`].filter(Boolean).join("_"),
      headers: []
    };
    const pendingParentHeaders = [];
    headersToGroup.forEach((headerToGroup) => {
      const latestPendingParentHeader = [...pendingParentHeaders].reverse()[0];
      const isLeafHeader = headerToGroup.column.depth === headerGroup.depth;
      let column;
      let isPlaceholder = false;
      if (isLeafHeader && headerToGroup.column.parent) {
        column = headerToGroup.column.parent;
      } else {
        column = headerToGroup.column;
        isPlaceholder = true;
      }
      if (latestPendingParentHeader && (latestPendingParentHeader == null ? void 0 : latestPendingParentHeader.column) === column) {
        latestPendingParentHeader.subHeaders.push(headerToGroup);
      } else {
        const header = createHeader(table, column, {
          id: [headerFamily, depth, column.id, headerToGroup == null ? void 0 : headerToGroup.id].filter(Boolean).join("_"),
          isPlaceholder,
          placeholderId: isPlaceholder ? `${pendingParentHeaders.filter((d) => d.column === column).length}` : void 0,
          depth,
          index: pendingParentHeaders.length
        });
        header.subHeaders.push(headerToGroup);
        pendingParentHeaders.push(header);
      }
      headerGroup.headers.push(headerToGroup);
      headerToGroup.headerGroup = headerGroup;
    });
    headerGroups.push(headerGroup);
    if (depth > 0) {
      createHeaderGroup(pendingParentHeaders, depth - 1);
    }
  };
  const bottomHeaders = columnsToGroup.map((column, index) => createHeader(table, column, {
    depth: maxDepth,
    index
  }));
  createHeaderGroup(bottomHeaders, maxDepth - 1);
  headerGroups.reverse();
  const recurseHeadersForSpans = (headers) => {
    const filteredHeaders = headers.filter((header) => header.column.getIsVisible());
    return filteredHeaders.map((header) => {
      let colSpan = 0;
      let rowSpan = 0;
      let childRowSpans = [0];
      if (header.subHeaders && header.subHeaders.length) {
        childRowSpans = [];
        recurseHeadersForSpans(header.subHeaders).forEach((_ref) => {
          let {
            colSpan: childColSpan,
            rowSpan: childRowSpan
          } = _ref;
          colSpan += childColSpan;
          childRowSpans.push(childRowSpan);
        });
      } else {
        colSpan = 1;
      }
      const minChildRowSpan = Math.min(...childRowSpans);
      rowSpan = rowSpan + minChildRowSpan;
      header.colSpan = colSpan;
      header.rowSpan = rowSpan;
      return {
        colSpan,
        rowSpan
      };
    });
  };
  recurseHeadersForSpans((_headerGroups$0$heade = (_headerGroups$ = headerGroups[0]) == null ? void 0 : _headerGroups$.headers) != null ? _headerGroups$0$heade : []);
  return headerGroups;
}
const defaultColumnSizing = {
  size: 150,
  minSize: 20,
  maxSize: Number.MAX_SAFE_INTEGER
};
const getDefaultColumnSizingInfoState = () => ({
  startOffset: null,
  startSize: null,
  deltaOffset: null,
  deltaPercentage: null,
  isResizingColumn: false,
  columnSizingStart: []
});
const ColumnSizing = {
  getDefaultColumnDef: () => {
    return defaultColumnSizing;
  },
  getInitialState: (state) => {
    return {
      columnSizing: {},
      columnSizingInfo: getDefaultColumnSizingInfoState(),
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      columnResizeMode: "onEnd",
      onColumnSizingChange: makeStateUpdater("columnSizing", table),
      onColumnSizingInfoChange: makeStateUpdater("columnSizingInfo", table)
    };
  },
  createColumn: (column, table) => {
    return {
      getSize: () => {
        var _column$columnDef$min, _ref, _column$columnDef$max;
        const columnSize = table.getState().columnSizing[column.id];
        return Math.min(Math.max((_column$columnDef$min = column.columnDef.minSize) != null ? _column$columnDef$min : defaultColumnSizing.minSize, (_ref = columnSize != null ? columnSize : column.columnDef.size) != null ? _ref : defaultColumnSizing.size), (_column$columnDef$max = column.columnDef.maxSize) != null ? _column$columnDef$max : defaultColumnSizing.maxSize);
      },
      getStart: (position) => {
        const columns = !position ? table.getVisibleLeafColumns() : position === "left" ? table.getLeftVisibleLeafColumns() : table.getRightVisibleLeafColumns();
        const index = columns.findIndex((d) => d.id === column.id);
        if (index > 0) {
          const prevSiblingColumn = columns[index - 1];
          return prevSiblingColumn.getStart(position) + prevSiblingColumn.getSize();
        }
        return 0;
      },
      resetSize: () => {
        table.setColumnSizing((_ref2) => {
          let {
            [column.id]: _,
            ...rest
          } = _ref2;
          return rest;
        });
      },
      getCanResize: () => {
        var _column$columnDef$ena, _table$options$enable;
        return ((_column$columnDef$ena = column.columnDef.enableResizing) != null ? _column$columnDef$ena : true) && ((_table$options$enable = table.options.enableColumnResizing) != null ? _table$options$enable : true);
      },
      getIsResizing: () => {
        return table.getState().columnSizingInfo.isResizingColumn === column.id;
      }
    };
  },
  createHeader: (header, table) => {
    return {
      getSize: () => {
        let sum2 = 0;
        const recurse = (header2) => {
          if (header2.subHeaders.length) {
            header2.subHeaders.forEach(recurse);
          } else {
            var _header$column$getSiz;
            sum2 += (_header$column$getSiz = header2.column.getSize()) != null ? _header$column$getSiz : 0;
          }
        };
        recurse(header);
        return sum2;
      },
      getStart: () => {
        if (header.index > 0) {
          const prevSiblingHeader = header.headerGroup.headers[header.index - 1];
          return prevSiblingHeader.getStart() + prevSiblingHeader.getSize();
        }
        return 0;
      },
      getResizeHandler: () => {
        const column = table.getColumn(header.column.id);
        const canResize = column == null ? void 0 : column.getCanResize();
        return (e) => {
          if (!column || !canResize) {
            return;
          }
          e.persist == null ? void 0 : e.persist();
          if (isTouchStartEvent(e)) {
            if (e.touches && e.touches.length > 1) {
              return;
            }
          }
          const startSize = header.getSize();
          const columnSizingStart = header ? header.getLeafHeaders().map((d) => [d.column.id, d.column.getSize()]) : [[column.id, column.getSize()]];
          const clientX = isTouchStartEvent(e) ? Math.round(e.touches[0].clientX) : e.clientX;
          const newColumnSizing = {};
          const updateOffset = (eventType, clientXPos) => {
            if (typeof clientXPos !== "number") {
              return;
            }
            table.setColumnSizingInfo((old) => {
              var _old$startOffset, _old$startSize;
              const deltaOffset = clientXPos - ((_old$startOffset = old == null ? void 0 : old.startOffset) != null ? _old$startOffset : 0);
              const deltaPercentage = Math.max(deltaOffset / ((_old$startSize = old == null ? void 0 : old.startSize) != null ? _old$startSize : 0), -0.999999);
              old.columnSizingStart.forEach((_ref3) => {
                let [columnId, headerSize] = _ref3;
                newColumnSizing[columnId] = Math.round(Math.max(headerSize + headerSize * deltaPercentage, 0) * 100) / 100;
              });
              return {
                ...old,
                deltaOffset,
                deltaPercentage
              };
            });
            if (table.options.columnResizeMode === "onChange" || eventType === "end") {
              table.setColumnSizing((old) => ({
                ...old,
                ...newColumnSizing
              }));
            }
          };
          const onMove = (clientXPos) => updateOffset("move", clientXPos);
          const onEnd = (clientXPos) => {
            updateOffset("end", clientXPos);
            table.setColumnSizingInfo((old) => ({
              ...old,
              isResizingColumn: false,
              startOffset: null,
              startSize: null,
              deltaOffset: null,
              deltaPercentage: null,
              columnSizingStart: []
            }));
          };
          const mouseEvents = {
            moveHandler: (e2) => onMove(e2.clientX),
            upHandler: (e2) => {
              document.removeEventListener("mousemove", mouseEvents.moveHandler);
              document.removeEventListener("mouseup", mouseEvents.upHandler);
              onEnd(e2.clientX);
            }
          };
          const touchEvents = {
            moveHandler: (e2) => {
              if (e2.cancelable) {
                e2.preventDefault();
                e2.stopPropagation();
              }
              onMove(e2.touches[0].clientX);
              return false;
            },
            upHandler: (e2) => {
              var _e$touches$;
              document.removeEventListener("touchmove", touchEvents.moveHandler);
              document.removeEventListener("touchend", touchEvents.upHandler);
              if (e2.cancelable) {
                e2.preventDefault();
                e2.stopPropagation();
              }
              onEnd((_e$touches$ = e2.touches[0]) == null ? void 0 : _e$touches$.clientX);
            }
          };
          const passiveIfSupported = passiveEventSupported() ? {
            passive: false
          } : false;
          if (isTouchStartEvent(e)) {
            document.addEventListener("touchmove", touchEvents.moveHandler, passiveIfSupported);
            document.addEventListener("touchend", touchEvents.upHandler, passiveIfSupported);
          } else {
            document.addEventListener("mousemove", mouseEvents.moveHandler, passiveIfSupported);
            document.addEventListener("mouseup", mouseEvents.upHandler, passiveIfSupported);
          }
          table.setColumnSizingInfo((old) => ({
            ...old,
            startOffset: clientX,
            startSize,
            deltaOffset: 0,
            deltaPercentage: 0,
            columnSizingStart,
            isResizingColumn: column.id
          }));
        };
      }
    };
  },
  createTable: (table) => {
    return {
      setColumnSizing: (updater) => table.options.onColumnSizingChange == null ? void 0 : table.options.onColumnSizingChange(updater),
      setColumnSizingInfo: (updater) => table.options.onColumnSizingInfoChange == null ? void 0 : table.options.onColumnSizingInfoChange(updater),
      resetColumnSizing: (defaultState) => {
        var _table$initialState$c;
        table.setColumnSizing(defaultState ? {} : (_table$initialState$c = table.initialState.columnSizing) != null ? _table$initialState$c : {});
      },
      resetHeaderSizeInfo: (defaultState) => {
        var _table$initialState$c2;
        table.setColumnSizingInfo(defaultState ? getDefaultColumnSizingInfoState() : (_table$initialState$c2 = table.initialState.columnSizingInfo) != null ? _table$initialState$c2 : getDefaultColumnSizingInfoState());
      },
      getTotalSize: () => {
        var _table$getHeaderGroup, _table$getHeaderGroup2;
        return (_table$getHeaderGroup = (_table$getHeaderGroup2 = table.getHeaderGroups()[0]) == null ? void 0 : _table$getHeaderGroup2.headers.reduce((sum2, header) => {
          return sum2 + header.getSize();
        }, 0)) != null ? _table$getHeaderGroup : 0;
      },
      getLeftTotalSize: () => {
        var _table$getLeftHeaderG, _table$getLeftHeaderG2;
        return (_table$getLeftHeaderG = (_table$getLeftHeaderG2 = table.getLeftHeaderGroups()[0]) == null ? void 0 : _table$getLeftHeaderG2.headers.reduce((sum2, header) => {
          return sum2 + header.getSize();
        }, 0)) != null ? _table$getLeftHeaderG : 0;
      },
      getCenterTotalSize: () => {
        var _table$getCenterHeade, _table$getCenterHeade2;
        return (_table$getCenterHeade = (_table$getCenterHeade2 = table.getCenterHeaderGroups()[0]) == null ? void 0 : _table$getCenterHeade2.headers.reduce((sum2, header) => {
          return sum2 + header.getSize();
        }, 0)) != null ? _table$getCenterHeade : 0;
      },
      getRightTotalSize: () => {
        var _table$getRightHeader, _table$getRightHeader2;
        return (_table$getRightHeader = (_table$getRightHeader2 = table.getRightHeaderGroups()[0]) == null ? void 0 : _table$getRightHeader2.headers.reduce((sum2, header) => {
          return sum2 + header.getSize();
        }, 0)) != null ? _table$getRightHeader : 0;
      }
    };
  }
};
let passiveSupported = null;
function passiveEventSupported() {
  if (typeof passiveSupported === "boolean")
    return passiveSupported;
  let supported = false;
  try {
    const options = {
      get passive() {
        supported = true;
        return false;
      }
    };
    const noop = () => {
    };
    window.addEventListener("test", noop, options);
    window.removeEventListener("test", noop);
  } catch (err) {
    supported = false;
  }
  passiveSupported = supported;
  return passiveSupported;
}
function isTouchStartEvent(e) {
  return e.type === "touchstart";
}
const Expanding = {
  getInitialState: (state) => {
    return {
      expanded: {},
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onExpandedChange: makeStateUpdater("expanded", table),
      paginateExpandedRows: true
    };
  },
  createTable: (table) => {
    let registered = false;
    let queued = false;
    return {
      _autoResetExpanded: () => {
        var _ref, _table$options$autoRe;
        if (!registered) {
          table._queue(() => {
            registered = true;
          });
          return;
        }
        if ((_ref = (_table$options$autoRe = table.options.autoResetAll) != null ? _table$options$autoRe : table.options.autoResetExpanded) != null ? _ref : !table.options.manualExpanding) {
          if (queued)
            return;
          queued = true;
          table._queue(() => {
            table.resetExpanded();
            queued = false;
          });
        }
      },
      setExpanded: (updater) => table.options.onExpandedChange == null ? void 0 : table.options.onExpandedChange(updater),
      toggleAllRowsExpanded: (expanded) => {
        if (expanded != null ? expanded : !table.getIsAllRowsExpanded()) {
          table.setExpanded(true);
        } else {
          table.setExpanded({});
        }
      },
      resetExpanded: (defaultState) => {
        var _table$initialState$e, _table$initialState;
        table.setExpanded(defaultState ? {} : (_table$initialState$e = (_table$initialState = table.initialState) == null ? void 0 : _table$initialState.expanded) != null ? _table$initialState$e : {});
      },
      getCanSomeRowsExpand: () => {
        return table.getRowModel().flatRows.some((row) => row.getCanExpand());
      },
      getToggleAllRowsExpandedHandler: () => {
        return (e) => {
          e.persist == null ? void 0 : e.persist();
          table.toggleAllRowsExpanded();
        };
      },
      getIsSomeRowsExpanded: () => {
        const expanded = table.getState().expanded;
        return expanded === true || Object.values(expanded).some(Boolean);
      },
      getIsAllRowsExpanded: () => {
        const expanded = table.getState().expanded;
        if (typeof expanded === "boolean") {
          return expanded === true;
        }
        if (!Object.keys(expanded).length) {
          return false;
        }
        if (table.getRowModel().flatRows.some((row) => !row.getIsExpanded())) {
          return false;
        }
        return true;
      },
      getExpandedDepth: () => {
        let maxDepth = 0;
        const rowIds = table.getState().expanded === true ? Object.keys(table.getRowModel().rowsById) : Object.keys(table.getState().expanded);
        rowIds.forEach((id) => {
          const splitId = id.split(".");
          maxDepth = Math.max(maxDepth, splitId.length);
        });
        return maxDepth;
      },
      getPreExpandedRowModel: () => table.getSortedRowModel(),
      getExpandedRowModel: () => {
        if (!table._getExpandedRowModel && table.options.getExpandedRowModel) {
          table._getExpandedRowModel = table.options.getExpandedRowModel(table);
        }
        if (table.options.manualExpanding || !table._getExpandedRowModel) {
          return table.getPreExpandedRowModel();
        }
        return table._getExpandedRowModel();
      }
    };
  },
  createRow: (row, table) => {
    return {
      toggleExpanded: (expanded) => {
        table.setExpanded((old) => {
          var _expanded;
          const exists = old === true ? true : !!(old != null && old[row.id]);
          let oldExpanded = {};
          if (old === true) {
            Object.keys(table.getRowModel().rowsById).forEach((rowId) => {
              oldExpanded[rowId] = true;
            });
          } else {
            oldExpanded = old;
          }
          expanded = (_expanded = expanded) != null ? _expanded : !exists;
          if (!exists && expanded) {
            return {
              ...oldExpanded,
              [row.id]: true
            };
          }
          if (exists && !expanded) {
            const {
              [row.id]: _,
              ...rest
            } = oldExpanded;
            return rest;
          }
          return old;
        });
      },
      getIsExpanded: () => {
        var _table$options$getIsR;
        const expanded = table.getState().expanded;
        return !!((_table$options$getIsR = table.options.getIsRowExpanded == null ? void 0 : table.options.getIsRowExpanded(row)) != null ? _table$options$getIsR : expanded === true || (expanded == null ? void 0 : expanded[row.id]));
      },
      getCanExpand: () => {
        var _table$options$getRow, _table$options$enable, _row$subRows;
        return (_table$options$getRow = table.options.getRowCanExpand == null ? void 0 : table.options.getRowCanExpand(row)) != null ? _table$options$getRow : ((_table$options$enable = table.options.enableExpanding) != null ? _table$options$enable : true) && !!((_row$subRows = row.subRows) != null && _row$subRows.length);
      },
      getToggleExpandedHandler: () => {
        const canExpand = row.getCanExpand();
        return () => {
          if (!canExpand)
            return;
          row.toggleExpanded();
        };
      }
    };
  }
};
const includesString = (row, columnId, filterValue) => {
  var _row$getValue;
  const search = filterValue.toLowerCase();
  return Boolean((_row$getValue = row.getValue(columnId)) == null ? void 0 : _row$getValue.toLowerCase().includes(search));
};
includesString.autoRemove = (val) => testFalsey(val);
const includesStringSensitive = (row, columnId, filterValue) => {
  var _row$getValue2;
  return Boolean((_row$getValue2 = row.getValue(columnId)) == null ? void 0 : _row$getValue2.includes(filterValue));
};
includesStringSensitive.autoRemove = (val) => testFalsey(val);
const equalsString = (row, columnId, filterValue) => {
  var _row$getValue3;
  return ((_row$getValue3 = row.getValue(columnId)) == null ? void 0 : _row$getValue3.toLowerCase()) === filterValue.toLowerCase();
};
equalsString.autoRemove = (val) => testFalsey(val);
const arrIncludes = (row, columnId, filterValue) => {
  var _row$getValue4;
  return (_row$getValue4 = row.getValue(columnId)) == null ? void 0 : _row$getValue4.includes(filterValue);
};
arrIncludes.autoRemove = (val) => testFalsey(val) || !(val != null && val.length);
const arrIncludesAll = (row, columnId, filterValue) => {
  return !filterValue.some((val) => {
    var _row$getValue5;
    return !((_row$getValue5 = row.getValue(columnId)) != null && _row$getValue5.includes(val));
  });
};
arrIncludesAll.autoRemove = (val) => testFalsey(val) || !(val != null && val.length);
const arrIncludesSome = (row, columnId, filterValue) => {
  return filterValue.some((val) => {
    var _row$getValue6;
    return (_row$getValue6 = row.getValue(columnId)) == null ? void 0 : _row$getValue6.includes(val);
  });
};
arrIncludesSome.autoRemove = (val) => testFalsey(val) || !(val != null && val.length);
const equals = (row, columnId, filterValue) => {
  return row.getValue(columnId) === filterValue;
};
equals.autoRemove = (val) => testFalsey(val);
const weakEquals = (row, columnId, filterValue) => {
  return row.getValue(columnId) == filterValue;
};
weakEquals.autoRemove = (val) => testFalsey(val);
const inNumberRange = (row, columnId, filterValue) => {
  let [min2, max2] = filterValue;
  const rowValue = row.getValue(columnId);
  return rowValue >= min2 && rowValue <= max2;
};
inNumberRange.resolveFilterValue = (val) => {
  let [unsafeMin, unsafeMax] = val;
  let parsedMin = typeof unsafeMin !== "number" ? parseFloat(unsafeMin) : unsafeMin;
  let parsedMax = typeof unsafeMax !== "number" ? parseFloat(unsafeMax) : unsafeMax;
  let min2 = unsafeMin === null || Number.isNaN(parsedMin) ? -Infinity : parsedMin;
  let max2 = unsafeMax === null || Number.isNaN(parsedMax) ? Infinity : parsedMax;
  if (min2 > max2) {
    const temp = min2;
    min2 = max2;
    max2 = temp;
  }
  return [min2, max2];
};
inNumberRange.autoRemove = (val) => testFalsey(val) || testFalsey(val[0]) && testFalsey(val[1]);
const filterFns = {
  includesString,
  includesStringSensitive,
  equalsString,
  arrIncludes,
  arrIncludesAll,
  arrIncludesSome,
  equals,
  weakEquals,
  inNumberRange
};
function testFalsey(val) {
  return val === void 0 || val === null || val === "";
}
const Filters = {
  getDefaultColumnDef: () => {
    return {
      filterFn: "auto"
    };
  },
  getInitialState: (state) => {
    return {
      columnFilters: [],
      globalFilter: void 0,
      // filtersProgress: 1,
      // facetProgress: {},
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onColumnFiltersChange: makeStateUpdater("columnFilters", table),
      onGlobalFilterChange: makeStateUpdater("globalFilter", table),
      filterFromLeafRows: false,
      maxLeafRowFilterDepth: 100,
      globalFilterFn: "auto",
      getColumnCanGlobalFilter: (column) => {
        var _table$getCoreRowMode, _table$getCoreRowMode2;
        const value = (_table$getCoreRowMode = table.getCoreRowModel().flatRows[0]) == null ? void 0 : (_table$getCoreRowMode2 = _table$getCoreRowMode._getAllCellsByColumnId()[column.id]) == null ? void 0 : _table$getCoreRowMode2.getValue();
        return typeof value === "string" || typeof value === "number";
      }
    };
  },
  createColumn: (column, table) => {
    return {
      getAutoFilterFn: () => {
        const firstRow = table.getCoreRowModel().flatRows[0];
        const value = firstRow == null ? void 0 : firstRow.getValue(column.id);
        if (typeof value === "string") {
          return filterFns.includesString;
        }
        if (typeof value === "number") {
          return filterFns.inNumberRange;
        }
        if (typeof value === "boolean") {
          return filterFns.equals;
        }
        if (value !== null && typeof value === "object") {
          return filterFns.equals;
        }
        if (Array.isArray(value)) {
          return filterFns.arrIncludes;
        }
        return filterFns.weakEquals;
      },
      getFilterFn: () => {
        var _table$options$filter, _table$options$filter2;
        return isFunction(column.columnDef.filterFn) ? column.columnDef.filterFn : column.columnDef.filterFn === "auto" ? column.getAutoFilterFn() : (_table$options$filter = (_table$options$filter2 = table.options.filterFns) == null ? void 0 : _table$options$filter2[column.columnDef.filterFn]) != null ? _table$options$filter : filterFns[column.columnDef.filterFn];
      },
      getCanFilter: () => {
        var _column$columnDef$ena, _table$options$enable, _table$options$enable2;
        return ((_column$columnDef$ena = column.columnDef.enableColumnFilter) != null ? _column$columnDef$ena : true) && ((_table$options$enable = table.options.enableColumnFilters) != null ? _table$options$enable : true) && ((_table$options$enable2 = table.options.enableFilters) != null ? _table$options$enable2 : true) && !!column.accessorFn;
      },
      getCanGlobalFilter: () => {
        var _column$columnDef$ena2, _table$options$enable3, _table$options$enable4, _table$options$getCol;
        return ((_column$columnDef$ena2 = column.columnDef.enableGlobalFilter) != null ? _column$columnDef$ena2 : true) && ((_table$options$enable3 = table.options.enableGlobalFilter) != null ? _table$options$enable3 : true) && ((_table$options$enable4 = table.options.enableFilters) != null ? _table$options$enable4 : true) && ((_table$options$getCol = table.options.getColumnCanGlobalFilter == null ? void 0 : table.options.getColumnCanGlobalFilter(column)) != null ? _table$options$getCol : true) && !!column.accessorFn;
      },
      getIsFiltered: () => column.getFilterIndex() > -1,
      getFilterValue: () => {
        var _table$getState$colum, _table$getState$colum2;
        return (_table$getState$colum = table.getState().columnFilters) == null ? void 0 : (_table$getState$colum2 = _table$getState$colum.find((d) => d.id === column.id)) == null ? void 0 : _table$getState$colum2.value;
      },
      getFilterIndex: () => {
        var _table$getState$colum3, _table$getState$colum4;
        return (_table$getState$colum3 = (_table$getState$colum4 = table.getState().columnFilters) == null ? void 0 : _table$getState$colum4.findIndex((d) => d.id === column.id)) != null ? _table$getState$colum3 : -1;
      },
      setFilterValue: (value) => {
        table.setColumnFilters((old) => {
          const filterFn = column.getFilterFn();
          const previousfilter = old == null ? void 0 : old.find((d) => d.id === column.id);
          const newFilter = functionalUpdate(value, previousfilter ? previousfilter.value : void 0);
          if (shouldAutoRemoveFilter(filterFn, newFilter, column)) {
            var _old$filter;
            return (_old$filter = old == null ? void 0 : old.filter((d) => d.id !== column.id)) != null ? _old$filter : [];
          }
          const newFilterObj = {
            id: column.id,
            value: newFilter
          };
          if (previousfilter) {
            var _old$map;
            return (_old$map = old == null ? void 0 : old.map((d) => {
              if (d.id === column.id) {
                return newFilterObj;
              }
              return d;
            })) != null ? _old$map : [];
          }
          if (old != null && old.length) {
            return [...old, newFilterObj];
          }
          return [newFilterObj];
        });
      },
      _getFacetedRowModel: table.options.getFacetedRowModel && table.options.getFacetedRowModel(table, column.id),
      getFacetedRowModel: () => {
        if (!column._getFacetedRowModel) {
          return table.getPreFilteredRowModel();
        }
        return column._getFacetedRowModel();
      },
      _getFacetedUniqueValues: table.options.getFacetedUniqueValues && table.options.getFacetedUniqueValues(table, column.id),
      getFacetedUniqueValues: () => {
        if (!column._getFacetedUniqueValues) {
          return /* @__PURE__ */ new Map();
        }
        return column._getFacetedUniqueValues();
      },
      _getFacetedMinMaxValues: table.options.getFacetedMinMaxValues && table.options.getFacetedMinMaxValues(table, column.id),
      getFacetedMinMaxValues: () => {
        if (!column._getFacetedMinMaxValues) {
          return void 0;
        }
        return column._getFacetedMinMaxValues();
      }
      // () => [column.getFacetedRowModel()],
      // facetedRowModel => getRowModelMinMaxValues(facetedRowModel, column.id),
    };
  },
  createRow: (row, table) => {
    return {
      columnFilters: {},
      columnFiltersMeta: {}
    };
  },
  createTable: (table) => {
    return {
      getGlobalAutoFilterFn: () => {
        return filterFns.includesString;
      },
      getGlobalFilterFn: () => {
        var _table$options$filter3, _table$options$filter4;
        const {
          globalFilterFn
        } = table.options;
        return isFunction(globalFilterFn) ? globalFilterFn : globalFilterFn === "auto" ? table.getGlobalAutoFilterFn() : (_table$options$filter3 = (_table$options$filter4 = table.options.filterFns) == null ? void 0 : _table$options$filter4[globalFilterFn]) != null ? _table$options$filter3 : filterFns[globalFilterFn];
      },
      setColumnFilters: (updater) => {
        const leafColumns = table.getAllLeafColumns();
        const updateFn = (old) => {
          var _functionalUpdate;
          return (_functionalUpdate = functionalUpdate(updater, old)) == null ? void 0 : _functionalUpdate.filter((filter) => {
            const column = leafColumns.find((d) => d.id === filter.id);
            if (column) {
              const filterFn = column.getFilterFn();
              if (shouldAutoRemoveFilter(filterFn, filter.value, column)) {
                return false;
              }
            }
            return true;
          });
        };
        table.options.onColumnFiltersChange == null ? void 0 : table.options.onColumnFiltersChange(updateFn);
      },
      setGlobalFilter: (updater) => {
        table.options.onGlobalFilterChange == null ? void 0 : table.options.onGlobalFilterChange(updater);
      },
      resetGlobalFilter: (defaultState) => {
        table.setGlobalFilter(defaultState ? void 0 : table.initialState.globalFilter);
      },
      resetColumnFilters: (defaultState) => {
        var _table$initialState$c, _table$initialState;
        table.setColumnFilters(defaultState ? [] : (_table$initialState$c = (_table$initialState = table.initialState) == null ? void 0 : _table$initialState.columnFilters) != null ? _table$initialState$c : []);
      },
      getPreFilteredRowModel: () => table.getCoreRowModel(),
      getFilteredRowModel: () => {
        if (!table._getFilteredRowModel && table.options.getFilteredRowModel) {
          table._getFilteredRowModel = table.options.getFilteredRowModel(table);
        }
        if (table.options.manualFiltering || !table._getFilteredRowModel) {
          return table.getPreFilteredRowModel();
        }
        return table._getFilteredRowModel();
      },
      _getGlobalFacetedRowModel: table.options.getFacetedRowModel && table.options.getFacetedRowModel(table, "__global__"),
      getGlobalFacetedRowModel: () => {
        if (table.options.manualFiltering || !table._getGlobalFacetedRowModel) {
          return table.getPreFilteredRowModel();
        }
        return table._getGlobalFacetedRowModel();
      },
      _getGlobalFacetedUniqueValues: table.options.getFacetedUniqueValues && table.options.getFacetedUniqueValues(table, "__global__"),
      getGlobalFacetedUniqueValues: () => {
        if (!table._getGlobalFacetedUniqueValues) {
          return /* @__PURE__ */ new Map();
        }
        return table._getGlobalFacetedUniqueValues();
      },
      _getGlobalFacetedMinMaxValues: table.options.getFacetedMinMaxValues && table.options.getFacetedMinMaxValues(table, "__global__"),
      getGlobalFacetedMinMaxValues: () => {
        if (!table._getGlobalFacetedMinMaxValues) {
          return;
        }
        return table._getGlobalFacetedMinMaxValues();
      }
    };
  }
};
function shouldAutoRemoveFilter(filterFn, value, column) {
  return (filterFn && filterFn.autoRemove ? filterFn.autoRemove(value, column) : false) || typeof value === "undefined" || typeof value === "string" && !value;
}
const sum = (columnId, _leafRows, childRows) => {
  return childRows.reduce((sum2, next) => {
    const nextValue = next.getValue(columnId);
    return sum2 + (typeof nextValue === "number" ? nextValue : 0);
  }, 0);
};
const min = (columnId, _leafRows, childRows) => {
  let min2;
  childRows.forEach((row) => {
    const value = row.getValue(columnId);
    if (value != null && (min2 > value || min2 === void 0 && value >= value)) {
      min2 = value;
    }
  });
  return min2;
};
const max = (columnId, _leafRows, childRows) => {
  let max2;
  childRows.forEach((row) => {
    const value = row.getValue(columnId);
    if (value != null && (max2 < value || max2 === void 0 && value >= value)) {
      max2 = value;
    }
  });
  return max2;
};
const extent = (columnId, _leafRows, childRows) => {
  let min2;
  let max2;
  childRows.forEach((row) => {
    const value = row.getValue(columnId);
    if (value != null) {
      if (min2 === void 0) {
        if (value >= value)
          min2 = max2 = value;
      } else {
        if (min2 > value)
          min2 = value;
        if (max2 < value)
          max2 = value;
      }
    }
  });
  return [min2, max2];
};
const mean = (columnId, leafRows) => {
  let count2 = 0;
  let sum2 = 0;
  leafRows.forEach((row) => {
    let value = row.getValue(columnId);
    if (value != null && (value = +value) >= value) {
      ++count2, sum2 += value;
    }
  });
  if (count2)
    return sum2 / count2;
  return;
};
const median = (columnId, leafRows) => {
  if (!leafRows.length) {
    return;
  }
  let min2 = 0;
  let max2 = 0;
  leafRows.forEach((row) => {
    let value = row.getValue(columnId);
    if (typeof value === "number") {
      min2 = Math.min(min2, value);
      max2 = Math.max(max2, value);
    }
  });
  return (min2 + max2) / 2;
};
const unique = (columnId, leafRows) => {
  return Array.from(new Set(leafRows.map((d) => d.getValue(columnId))).values());
};
const uniqueCount = (columnId, leafRows) => {
  return new Set(leafRows.map((d) => d.getValue(columnId))).size;
};
const count = (_columnId, leafRows) => {
  return leafRows.length;
};
const aggregationFns = {
  sum,
  min,
  max,
  extent,
  mean,
  median,
  unique,
  uniqueCount,
  count
};
const Grouping = {
  getDefaultColumnDef: () => {
    return {
      aggregatedCell: (props2) => {
        var _toString, _props$getValue;
        return (_toString = (_props$getValue = props2.getValue()) == null ? void 0 : _props$getValue.toString == null ? void 0 : _props$getValue.toString()) != null ? _toString : null;
      },
      aggregationFn: "auto"
    };
  },
  getInitialState: (state) => {
    return {
      grouping: [],
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onGroupingChange: makeStateUpdater("grouping", table),
      groupedColumnMode: "reorder"
    };
  },
  createColumn: (column, table) => {
    return {
      toggleGrouping: () => {
        table.setGrouping((old) => {
          if (old != null && old.includes(column.id)) {
            return old.filter((d) => d !== column.id);
          }
          return [...old != null ? old : [], column.id];
        });
      },
      getCanGroup: () => {
        var _ref, _ref2, _ref3, _column$columnDef$ena;
        return (_ref = (_ref2 = (_ref3 = (_column$columnDef$ena = column.columnDef.enableGrouping) != null ? _column$columnDef$ena : true) != null ? _ref3 : table.options.enableGrouping) != null ? _ref2 : true) != null ? _ref : !!column.accessorFn;
      },
      getIsGrouped: () => {
        var _table$getState$group;
        return (_table$getState$group = table.getState().grouping) == null ? void 0 : _table$getState$group.includes(column.id);
      },
      getGroupedIndex: () => {
        var _table$getState$group2;
        return (_table$getState$group2 = table.getState().grouping) == null ? void 0 : _table$getState$group2.indexOf(column.id);
      },
      getToggleGroupingHandler: () => {
        const canGroup = column.getCanGroup();
        return () => {
          if (!canGroup)
            return;
          column.toggleGrouping();
        };
      },
      getAutoAggregationFn: () => {
        const firstRow = table.getCoreRowModel().flatRows[0];
        const value = firstRow == null ? void 0 : firstRow.getValue(column.id);
        if (typeof value === "number") {
          return aggregationFns.sum;
        }
        if (Object.prototype.toString.call(value) === "[object Date]") {
          return aggregationFns.extent;
        }
      },
      getAggregationFn: () => {
        var _table$options$aggreg, _table$options$aggreg2;
        if (!column) {
          throw new Error();
        }
        return isFunction(column.columnDef.aggregationFn) ? column.columnDef.aggregationFn : column.columnDef.aggregationFn === "auto" ? column.getAutoAggregationFn() : (_table$options$aggreg = (_table$options$aggreg2 = table.options.aggregationFns) == null ? void 0 : _table$options$aggreg2[column.columnDef.aggregationFn]) != null ? _table$options$aggreg : aggregationFns[column.columnDef.aggregationFn];
      }
    };
  },
  createTable: (table) => {
    return {
      setGrouping: (updater) => table.options.onGroupingChange == null ? void 0 : table.options.onGroupingChange(updater),
      resetGrouping: (defaultState) => {
        var _table$initialState$g, _table$initialState;
        table.setGrouping(defaultState ? [] : (_table$initialState$g = (_table$initialState = table.initialState) == null ? void 0 : _table$initialState.grouping) != null ? _table$initialState$g : []);
      },
      getPreGroupedRowModel: () => table.getFilteredRowModel(),
      getGroupedRowModel: () => {
        if (!table._getGroupedRowModel && table.options.getGroupedRowModel) {
          table._getGroupedRowModel = table.options.getGroupedRowModel(table);
        }
        if (table.options.manualGrouping || !table._getGroupedRowModel) {
          return table.getPreGroupedRowModel();
        }
        return table._getGroupedRowModel();
      }
    };
  },
  createRow: (row) => {
    return {
      getIsGrouped: () => !!row.groupingColumnId,
      _groupingValuesCache: {}
    };
  },
  createCell: (cell, column, row, table) => {
    return {
      getIsGrouped: () => column.getIsGrouped() && column.id === row.groupingColumnId,
      getIsPlaceholder: () => !cell.getIsGrouped() && column.getIsGrouped(),
      getIsAggregated: () => {
        var _row$subRows;
        return !cell.getIsGrouped() && !cell.getIsPlaceholder() && !!((_row$subRows = row.subRows) != null && _row$subRows.length);
      }
    };
  }
};
function orderColumns(leafColumns, grouping, groupedColumnMode) {
  if (!(grouping != null && grouping.length) || !groupedColumnMode) {
    return leafColumns;
  }
  const nonGroupingColumns = leafColumns.filter((col) => !grouping.includes(col.id));
  if (groupedColumnMode === "remove") {
    return nonGroupingColumns;
  }
  const groupingColumns = grouping.map((g) => leafColumns.find((col) => col.id === g)).filter(Boolean);
  return [...groupingColumns, ...nonGroupingColumns];
}
const Ordering = {
  getInitialState: (state) => {
    return {
      columnOrder: [],
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onColumnOrderChange: makeStateUpdater("columnOrder", table)
    };
  },
  createTable: (table) => {
    return {
      setColumnOrder: (updater) => table.options.onColumnOrderChange == null ? void 0 : table.options.onColumnOrderChange(updater),
      resetColumnOrder: (defaultState) => {
        var _table$initialState$c;
        table.setColumnOrder(defaultState ? [] : (_table$initialState$c = table.initialState.columnOrder) != null ? _table$initialState$c : []);
      },
      _getOrderColumnsFn: memo(() => [table.getState().columnOrder, table.getState().grouping, table.options.groupedColumnMode], (columnOrder, grouping, groupedColumnMode) => (columns) => {
        let orderedColumns = [];
        if (!(columnOrder != null && columnOrder.length)) {
          orderedColumns = columns;
        } else {
          const columnOrderCopy = [...columnOrder];
          const columnsCopy = [...columns];
          while (columnsCopy.length && columnOrderCopy.length) {
            const targetColumnId = columnOrderCopy.shift();
            const foundIndex = columnsCopy.findIndex((d) => d.id === targetColumnId);
            if (foundIndex > -1) {
              orderedColumns.push(columnsCopy.splice(foundIndex, 1)[0]);
            }
          }
          orderedColumns = [...orderedColumns, ...columnsCopy];
        }
        return orderColumns(orderedColumns, grouping, groupedColumnMode);
      }, {
        key: false
        // debug: () => table.options.debugAll ?? table.options.debugTable,
      })
    };
  }
};
const defaultPageIndex = 0;
const defaultPageSize = 10;
const getDefaultPaginationState = () => ({
  pageIndex: defaultPageIndex,
  pageSize: defaultPageSize
});
const Pagination = {
  getInitialState: (state) => {
    return {
      ...state,
      pagination: {
        ...getDefaultPaginationState(),
        ...state == null ? void 0 : state.pagination
      }
    };
  },
  getDefaultOptions: (table) => {
    return {
      onPaginationChange: makeStateUpdater("pagination", table)
    };
  },
  createTable: (table) => {
    let registered = false;
    let queued = false;
    return {
      _autoResetPageIndex: () => {
        var _ref, _table$options$autoRe;
        if (!registered) {
          table._queue(() => {
            registered = true;
          });
          return;
        }
        if ((_ref = (_table$options$autoRe = table.options.autoResetAll) != null ? _table$options$autoRe : table.options.autoResetPageIndex) != null ? _ref : !table.options.manualPagination) {
          if (queued)
            return;
          queued = true;
          table._queue(() => {
            table.resetPageIndex();
            queued = false;
          });
        }
      },
      setPagination: (updater) => {
        const safeUpdater = (old) => {
          let newState = functionalUpdate(updater, old);
          return newState;
        };
        return table.options.onPaginationChange == null ? void 0 : table.options.onPaginationChange(safeUpdater);
      },
      resetPagination: (defaultState) => {
        var _table$initialState$p;
        table.setPagination(defaultState ? getDefaultPaginationState() : (_table$initialState$p = table.initialState.pagination) != null ? _table$initialState$p : getDefaultPaginationState());
      },
      setPageIndex: (updater) => {
        table.setPagination((old) => {
          let pageIndex = functionalUpdate(updater, old.pageIndex);
          const maxPageIndex = typeof table.options.pageCount === "undefined" || table.options.pageCount === -1 ? Number.MAX_SAFE_INTEGER : table.options.pageCount - 1;
          pageIndex = Math.max(0, Math.min(pageIndex, maxPageIndex));
          return {
            ...old,
            pageIndex
          };
        });
      },
      resetPageIndex: (defaultState) => {
        var _table$initialState$p2, _table$initialState, _table$initialState$p3;
        table.setPageIndex(defaultState ? defaultPageIndex : (_table$initialState$p2 = (_table$initialState = table.initialState) == null ? void 0 : (_table$initialState$p3 = _table$initialState.pagination) == null ? void 0 : _table$initialState$p3.pageIndex) != null ? _table$initialState$p2 : defaultPageIndex);
      },
      resetPageSize: (defaultState) => {
        var _table$initialState$p4, _table$initialState2, _table$initialState2$;
        table.setPageSize(defaultState ? defaultPageSize : (_table$initialState$p4 = (_table$initialState2 = table.initialState) == null ? void 0 : (_table$initialState2$ = _table$initialState2.pagination) == null ? void 0 : _table$initialState2$.pageSize) != null ? _table$initialState$p4 : defaultPageSize);
      },
      setPageSize: (updater) => {
        table.setPagination((old) => {
          const pageSize = Math.max(1, functionalUpdate(updater, old.pageSize));
          const topRowIndex = old.pageSize * old.pageIndex;
          const pageIndex = Math.floor(topRowIndex / pageSize);
          return {
            ...old,
            pageIndex,
            pageSize
          };
        });
      },
      setPageCount: (updater) => table.setPagination((old) => {
        var _table$options$pageCo;
        let newPageCount = functionalUpdate(updater, (_table$options$pageCo = table.options.pageCount) != null ? _table$options$pageCo : -1);
        if (typeof newPageCount === "number") {
          newPageCount = Math.max(-1, newPageCount);
        }
        return {
          ...old,
          pageCount: newPageCount
        };
      }),
      getPageOptions: memo(() => [table.getPageCount()], (pageCount) => {
        let pageOptions = [];
        if (pageCount && pageCount > 0) {
          pageOptions = [...new Array(pageCount)].fill(null).map((_, i) => i);
        }
        return pageOptions;
      }, {
        key: false,
        debug: () => {
          var _table$options$debugA;
          return (_table$options$debugA = table.options.debugAll) != null ? _table$options$debugA : table.options.debugTable;
        }
      }),
      getCanPreviousPage: () => table.getState().pagination.pageIndex > 0,
      getCanNextPage: () => {
        const {
          pageIndex
        } = table.getState().pagination;
        const pageCount = table.getPageCount();
        if (pageCount === -1) {
          return true;
        }
        if (pageCount === 0) {
          return false;
        }
        return pageIndex < pageCount - 1;
      },
      previousPage: () => {
        return table.setPageIndex((old) => old - 1);
      },
      nextPage: () => {
        return table.setPageIndex((old) => {
          return old + 1;
        });
      },
      getPrePaginationRowModel: () => table.getExpandedRowModel(),
      getPaginationRowModel: () => {
        if (!table._getPaginationRowModel && table.options.getPaginationRowModel) {
          table._getPaginationRowModel = table.options.getPaginationRowModel(table);
        }
        if (table.options.manualPagination || !table._getPaginationRowModel) {
          return table.getPrePaginationRowModel();
        }
        return table._getPaginationRowModel();
      },
      getPageCount: () => {
        var _table$options$pageCo2;
        return (_table$options$pageCo2 = table.options.pageCount) != null ? _table$options$pageCo2 : Math.ceil(table.getPrePaginationRowModel().rows.length / table.getState().pagination.pageSize);
      }
    };
  }
};
const getDefaultPinningState = () => ({
  left: [],
  right: []
});
const Pinning = {
  getInitialState: (state) => {
    return {
      columnPinning: getDefaultPinningState(),
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onColumnPinningChange: makeStateUpdater("columnPinning", table)
    };
  },
  createColumn: (column, table) => {
    return {
      pin: (position) => {
        const columnIds = column.getLeafColumns().map((d) => d.id).filter(Boolean);
        table.setColumnPinning((old) => {
          var _old$left3, _old$right3;
          if (position === "right") {
            var _old$left, _old$right;
            return {
              left: ((_old$left = old == null ? void 0 : old.left) != null ? _old$left : []).filter((d) => !(columnIds != null && columnIds.includes(d))),
              right: [...((_old$right = old == null ? void 0 : old.right) != null ? _old$right : []).filter((d) => !(columnIds != null && columnIds.includes(d))), ...columnIds]
            };
          }
          if (position === "left") {
            var _old$left2, _old$right2;
            return {
              left: [...((_old$left2 = old == null ? void 0 : old.left) != null ? _old$left2 : []).filter((d) => !(columnIds != null && columnIds.includes(d))), ...columnIds],
              right: ((_old$right2 = old == null ? void 0 : old.right) != null ? _old$right2 : []).filter((d) => !(columnIds != null && columnIds.includes(d)))
            };
          }
          return {
            left: ((_old$left3 = old == null ? void 0 : old.left) != null ? _old$left3 : []).filter((d) => !(columnIds != null && columnIds.includes(d))),
            right: ((_old$right3 = old == null ? void 0 : old.right) != null ? _old$right3 : []).filter((d) => !(columnIds != null && columnIds.includes(d)))
          };
        });
      },
      getCanPin: () => {
        const leafColumns = column.getLeafColumns();
        return leafColumns.some((d) => {
          var _d$columnDef$enablePi, _table$options$enable;
          return ((_d$columnDef$enablePi = d.columnDef.enablePinning) != null ? _d$columnDef$enablePi : true) && ((_table$options$enable = table.options.enablePinning) != null ? _table$options$enable : true);
        });
      },
      getIsPinned: () => {
        const leafColumnIds = column.getLeafColumns().map((d) => d.id);
        const {
          left,
          right
        } = table.getState().columnPinning;
        const isLeft = leafColumnIds.some((d) => left == null ? void 0 : left.includes(d));
        const isRight = leafColumnIds.some((d) => right == null ? void 0 : right.includes(d));
        return isLeft ? "left" : isRight ? "right" : false;
      },
      getPinnedIndex: () => {
        var _table$getState$colum, _table$getState$colum2, _table$getState$colum3;
        const position = column.getIsPinned();
        return position ? (_table$getState$colum = (_table$getState$colum2 = table.getState().columnPinning) == null ? void 0 : (_table$getState$colum3 = _table$getState$colum2[position]) == null ? void 0 : _table$getState$colum3.indexOf(column.id)) != null ? _table$getState$colum : -1 : 0;
      }
    };
  },
  createRow: (row, table) => {
    return {
      getCenterVisibleCells: memo(() => [row._getAllVisibleCells(), table.getState().columnPinning.left, table.getState().columnPinning.right], (allCells, left, right) => {
        const leftAndRight = [...left != null ? left : [], ...right != null ? right : []];
        return allCells.filter((d) => !leftAndRight.includes(d.column.id));
      }, {
        key: "row.getCenterVisibleCells",
        debug: () => {
          var _table$options$debugA;
          return (_table$options$debugA = table.options.debugAll) != null ? _table$options$debugA : table.options.debugRows;
        }
      }),
      getLeftVisibleCells: memo(() => [row._getAllVisibleCells(), table.getState().columnPinning.left, ,], (allCells, left) => {
        const cells = (left != null ? left : []).map((columnId) => allCells.find((cell) => cell.column.id === columnId)).filter(Boolean).map((d) => ({
          ...d,
          position: "left"
        }));
        return cells;
      }, {
        key: "row.getLeftVisibleCells",
        debug: () => {
          var _table$options$debugA2;
          return (_table$options$debugA2 = table.options.debugAll) != null ? _table$options$debugA2 : table.options.debugRows;
        }
      }),
      getRightVisibleCells: memo(() => [row._getAllVisibleCells(), table.getState().columnPinning.right], (allCells, right) => {
        const cells = (right != null ? right : []).map((columnId) => allCells.find((cell) => cell.column.id === columnId)).filter(Boolean).map((d) => ({
          ...d,
          position: "right"
        }));
        return cells;
      }, {
        key: "row.getRightVisibleCells",
        debug: () => {
          var _table$options$debugA3;
          return (_table$options$debugA3 = table.options.debugAll) != null ? _table$options$debugA3 : table.options.debugRows;
        }
      })
    };
  },
  createTable: (table) => {
    return {
      setColumnPinning: (updater) => table.options.onColumnPinningChange == null ? void 0 : table.options.onColumnPinningChange(updater),
      resetColumnPinning: (defaultState) => {
        var _table$initialState$c, _table$initialState;
        return table.setColumnPinning(defaultState ? getDefaultPinningState() : (_table$initialState$c = (_table$initialState = table.initialState) == null ? void 0 : _table$initialState.columnPinning) != null ? _table$initialState$c : getDefaultPinningState());
      },
      getIsSomeColumnsPinned: (position) => {
        var _pinningState$positio;
        const pinningState = table.getState().columnPinning;
        if (!position) {
          var _pinningState$left, _pinningState$right;
          return Boolean(((_pinningState$left = pinningState.left) == null ? void 0 : _pinningState$left.length) || ((_pinningState$right = pinningState.right) == null ? void 0 : _pinningState$right.length));
        }
        return Boolean((_pinningState$positio = pinningState[position]) == null ? void 0 : _pinningState$positio.length);
      },
      getLeftLeafColumns: memo(() => [table.getAllLeafColumns(), table.getState().columnPinning.left], (allColumns, left) => {
        return (left != null ? left : []).map((columnId) => allColumns.find((column) => column.id === columnId)).filter(Boolean);
      }, {
        key: false,
        debug: () => {
          var _table$options$debugA4;
          return (_table$options$debugA4 = table.options.debugAll) != null ? _table$options$debugA4 : table.options.debugColumns;
        }
      }),
      getRightLeafColumns: memo(() => [table.getAllLeafColumns(), table.getState().columnPinning.right], (allColumns, right) => {
        return (right != null ? right : []).map((columnId) => allColumns.find((column) => column.id === columnId)).filter(Boolean);
      }, {
        key: false,
        debug: () => {
          var _table$options$debugA5;
          return (_table$options$debugA5 = table.options.debugAll) != null ? _table$options$debugA5 : table.options.debugColumns;
        }
      }),
      getCenterLeafColumns: memo(() => [table.getAllLeafColumns(), table.getState().columnPinning.left, table.getState().columnPinning.right], (allColumns, left, right) => {
        const leftAndRight = [...left != null ? left : [], ...right != null ? right : []];
        return allColumns.filter((d) => !leftAndRight.includes(d.id));
      }, {
        key: false,
        debug: () => {
          var _table$options$debugA6;
          return (_table$options$debugA6 = table.options.debugAll) != null ? _table$options$debugA6 : table.options.debugColumns;
        }
      })
    };
  }
};
const RowSelection = {
  getInitialState: (state) => {
    return {
      rowSelection: {},
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onRowSelectionChange: makeStateUpdater("rowSelection", table),
      enableRowSelection: true,
      enableMultiRowSelection: true,
      enableSubRowSelection: true
      // enableGroupingRowSelection: false,
      // isAdditiveSelectEvent: (e: unknown) => !!e.metaKey,
      // isInclusiveSelectEvent: (e: unknown) => !!e.shiftKey,
    };
  },
  createTable: (table) => {
    return {
      setRowSelection: (updater) => table.options.onRowSelectionChange == null ? void 0 : table.options.onRowSelectionChange(updater),
      resetRowSelection: (defaultState) => {
        var _table$initialState$r;
        return table.setRowSelection(defaultState ? {} : (_table$initialState$r = table.initialState.rowSelection) != null ? _table$initialState$r : {});
      },
      toggleAllRowsSelected: (value) => {
        table.setRowSelection((old) => {
          value = typeof value !== "undefined" ? value : !table.getIsAllRowsSelected();
          const rowSelection = {
            ...old
          };
          const preGroupedFlatRows = table.getPreGroupedRowModel().flatRows;
          if (value) {
            preGroupedFlatRows.forEach((row) => {
              if (!row.getCanSelect()) {
                return;
              }
              rowSelection[row.id] = true;
            });
          } else {
            preGroupedFlatRows.forEach((row) => {
              delete rowSelection[row.id];
            });
          }
          return rowSelection;
        });
      },
      toggleAllPageRowsSelected: (value) => table.setRowSelection((old) => {
        const resolvedValue = typeof value !== "undefined" ? value : !table.getIsAllPageRowsSelected();
        const rowSelection = {
          ...old
        };
        table.getRowModel().rows.forEach((row) => {
          mutateRowIsSelected(rowSelection, row.id, resolvedValue, table);
        });
        return rowSelection;
      }),
      // addRowSelectionRange: rowId => {
      //   const {
      //     rows,
      //     rowsById,
      //     options: { selectGroupingRows, selectSubRows },
      //   } = table
      //   const findSelectedRow = (rows: Row[]) => {
      //     let found
      //     rows.find(d => {
      //       if (d.getIsSelected()) {
      //         found = d
      //         return true
      //       }
      //       const subFound = findSelectedRow(d.subRows || [])
      //       if (subFound) {
      //         found = subFound
      //         return true
      //       }
      //       return false
      //     })
      //     return found
      //   }
      //   const firstRow = findSelectedRow(rows) || rows[0]
      //   const lastRow = rowsById[rowId]
      //   let include = false
      //   const selectedRowIds = {}
      //   const addRow = (row: Row) => {
      //     mutateRowIsSelected(selectedRowIds, row.id, true, {
      //       rowsById,
      //       selectGroupingRows: selectGroupingRows!,
      //       selectSubRows: selectSubRows!,
      //     })
      //   }
      //   table.rows.forEach(row => {
      //     const isFirstRow = row.id === firstRow.id
      //     const isLastRow = row.id === lastRow.id
      //     if (isFirstRow || isLastRow) {
      //       if (!include) {
      //         include = true
      //       } else if (include) {
      //         addRow(row)
      //         include = false
      //       }
      //     }
      //     if (include) {
      //       addRow(row)
      //     }
      //   })
      //   table.setRowSelection(selectedRowIds)
      // },
      getPreSelectedRowModel: () => table.getCoreRowModel(),
      getSelectedRowModel: memo(() => [table.getState().rowSelection, table.getCoreRowModel()], (rowSelection, rowModel) => {
        if (!Object.keys(rowSelection).length) {
          return {
            rows: [],
            flatRows: [],
            rowsById: {}
          };
        }
        return selectRowsFn(table, rowModel);
      }, {
        key: false,
        debug: () => {
          var _table$options$debugA;
          return (_table$options$debugA = table.options.debugAll) != null ? _table$options$debugA : table.options.debugTable;
        }
      }),
      getFilteredSelectedRowModel: memo(() => [table.getState().rowSelection, table.getFilteredRowModel()], (rowSelection, rowModel) => {
        if (!Object.keys(rowSelection).length) {
          return {
            rows: [],
            flatRows: [],
            rowsById: {}
          };
        }
        return selectRowsFn(table, rowModel);
      }, {
        key: "getFilteredSelectedRowModel",
        debug: () => {
          var _table$options$debugA2;
          return (_table$options$debugA2 = table.options.debugAll) != null ? _table$options$debugA2 : table.options.debugTable;
        }
      }),
      getGroupedSelectedRowModel: memo(() => [table.getState().rowSelection, table.getSortedRowModel()], (rowSelection, rowModel) => {
        if (!Object.keys(rowSelection).length) {
          return {
            rows: [],
            flatRows: [],
            rowsById: {}
          };
        }
        return selectRowsFn(table, rowModel);
      }, {
        key: "getGroupedSelectedRowModel",
        debug: () => {
          var _table$options$debugA3;
          return (_table$options$debugA3 = table.options.debugAll) != null ? _table$options$debugA3 : table.options.debugTable;
        }
      }),
      ///
      // getGroupingRowCanSelect: rowId => {
      //   const row = table.getRow(rowId)
      //   if (!row) {
      //     throw new Error()
      //   }
      //   if (typeof table.options.enableGroupingRowSelection === 'function') {
      //     return table.options.enableGroupingRowSelection(row)
      //   }
      //   return table.options.enableGroupingRowSelection ?? false
      // },
      getIsAllRowsSelected: () => {
        const preGroupedFlatRows = table.getFilteredRowModel().flatRows;
        const {
          rowSelection
        } = table.getState();
        let isAllRowsSelected = Boolean(preGroupedFlatRows.length && Object.keys(rowSelection).length);
        if (isAllRowsSelected) {
          if (preGroupedFlatRows.some((row) => row.getCanSelect() && !rowSelection[row.id])) {
            isAllRowsSelected = false;
          }
        }
        return isAllRowsSelected;
      },
      getIsAllPageRowsSelected: () => {
        const paginationFlatRows = table.getPaginationRowModel().flatRows;
        const {
          rowSelection
        } = table.getState();
        let isAllPageRowsSelected = !!paginationFlatRows.length;
        if (isAllPageRowsSelected && paginationFlatRows.some((row) => row.getCanSelect() && !rowSelection[row.id])) {
          isAllPageRowsSelected = false;
        }
        return isAllPageRowsSelected;
      },
      getIsSomeRowsSelected: () => {
        var _table$getState$rowSe;
        const totalSelected = Object.keys((_table$getState$rowSe = table.getState().rowSelection) != null ? _table$getState$rowSe : {}).length;
        return totalSelected > 0 && totalSelected < table.getFilteredRowModel().flatRows.length;
      },
      getIsSomePageRowsSelected: () => {
        const paginationFlatRows = table.getPaginationRowModel().flatRows;
        return table.getIsAllPageRowsSelected() ? false : paginationFlatRows.some((d) => d.getIsSelected() || d.getIsSomeSelected());
      },
      getToggleAllRowsSelectedHandler: () => {
        return (e) => {
          table.toggleAllRowsSelected(e.target.checked);
        };
      },
      getToggleAllPageRowsSelectedHandler: () => {
        return (e) => {
          table.toggleAllPageRowsSelected(e.target.checked);
        };
      }
    };
  },
  createRow: (row, table) => {
    return {
      toggleSelected: (value) => {
        const isSelected = row.getIsSelected();
        table.setRowSelection((old) => {
          value = typeof value !== "undefined" ? value : !isSelected;
          if (isSelected === value) {
            return old;
          }
          const selectedRowIds = {
            ...old
          };
          mutateRowIsSelected(selectedRowIds, row.id, value, table);
          return selectedRowIds;
        });
      },
      getIsSelected: () => {
        const {
          rowSelection
        } = table.getState();
        return isRowSelected(row, rowSelection);
      },
      getIsSomeSelected: () => {
        const {
          rowSelection
        } = table.getState();
        return isSubRowSelected(row, rowSelection) === "some";
      },
      getIsAllSubRowsSelected: () => {
        const {
          rowSelection
        } = table.getState();
        return isSubRowSelected(row, rowSelection) === "all";
      },
      getCanSelect: () => {
        var _table$options$enable;
        if (typeof table.options.enableRowSelection === "function") {
          return table.options.enableRowSelection(row);
        }
        return (_table$options$enable = table.options.enableRowSelection) != null ? _table$options$enable : true;
      },
      getCanSelectSubRows: () => {
        var _table$options$enable2;
        if (typeof table.options.enableSubRowSelection === "function") {
          return table.options.enableSubRowSelection(row);
        }
        return (_table$options$enable2 = table.options.enableSubRowSelection) != null ? _table$options$enable2 : true;
      },
      getCanMultiSelect: () => {
        var _table$options$enable3;
        if (typeof table.options.enableMultiRowSelection === "function") {
          return table.options.enableMultiRowSelection(row);
        }
        return (_table$options$enable3 = table.options.enableMultiRowSelection) != null ? _table$options$enable3 : true;
      },
      getToggleSelectedHandler: () => {
        const canSelect = row.getCanSelect();
        return (e) => {
          var _target;
          if (!canSelect)
            return;
          row.toggleSelected((_target = e.target) == null ? void 0 : _target.checked);
        };
      }
    };
  }
};
const mutateRowIsSelected = (selectedRowIds, id, value, table) => {
  var _row$subRows;
  const row = table.getRow(id);
  if (value) {
    if (!row.getCanMultiSelect()) {
      Object.keys(selectedRowIds).forEach((key) => delete selectedRowIds[key]);
    }
    if (row.getCanSelect()) {
      selectedRowIds[id] = true;
    }
  } else {
    delete selectedRowIds[id];
  }
  if ((_row$subRows = row.subRows) != null && _row$subRows.length && row.getCanSelectSubRows()) {
    row.subRows.forEach((row2) => mutateRowIsSelected(selectedRowIds, row2.id, value, table));
  }
};
function selectRowsFn(table, rowModel) {
  const rowSelection = table.getState().rowSelection;
  const newSelectedFlatRows = [];
  const newSelectedRowsById = {};
  const recurseRows = function(rows, depth) {
    return rows.map((row) => {
      var _row$subRows2;
      const isSelected = isRowSelected(row, rowSelection);
      if (isSelected) {
        newSelectedFlatRows.push(row);
        newSelectedRowsById[row.id] = row;
      }
      if ((_row$subRows2 = row.subRows) != null && _row$subRows2.length) {
        row = {
          ...row,
          subRows: recurseRows(row.subRows)
        };
      }
      if (isSelected) {
        return row;
      }
    }).filter(Boolean);
  };
  return {
    rows: recurseRows(rowModel.rows),
    flatRows: newSelectedFlatRows,
    rowsById: newSelectedRowsById
  };
}
function isRowSelected(row, selection) {
  var _selection$row$id;
  return (_selection$row$id = selection[row.id]) != null ? _selection$row$id : false;
}
function isSubRowSelected(row, selection, table) {
  if (row.subRows && row.subRows.length) {
    let allChildrenSelected = true;
    let someSelected = false;
    row.subRows.forEach((subRow) => {
      if (someSelected && !allChildrenSelected) {
        return;
      }
      if (isRowSelected(subRow, selection)) {
        someSelected = true;
      } else {
        allChildrenSelected = false;
      }
    });
    return allChildrenSelected ? "all" : someSelected ? "some" : false;
  }
  return false;
}
const reSplitAlphaNumeric = /([0-9]+)/gm;
const alphanumeric = (rowA, rowB, columnId) => {
  return compareAlphanumeric(toString(rowA.getValue(columnId)).toLowerCase(), toString(rowB.getValue(columnId)).toLowerCase());
};
const alphanumericCaseSensitive = (rowA, rowB, columnId) => {
  return compareAlphanumeric(toString(rowA.getValue(columnId)), toString(rowB.getValue(columnId)));
};
const text = (rowA, rowB, columnId) => {
  return compareBasic(toString(rowA.getValue(columnId)).toLowerCase(), toString(rowB.getValue(columnId)).toLowerCase());
};
const textCaseSensitive = (rowA, rowB, columnId) => {
  return compareBasic(toString(rowA.getValue(columnId)), toString(rowB.getValue(columnId)));
};
const datetime = (rowA, rowB, columnId) => {
  const a = rowA.getValue(columnId);
  const b = rowB.getValue(columnId);
  return a > b ? 1 : a < b ? -1 : 0;
};
const basic = (rowA, rowB, columnId) => {
  return compareBasic(rowA.getValue(columnId), rowB.getValue(columnId));
};
function compareBasic(a, b) {
  return a === b ? 0 : a > b ? 1 : -1;
}
function toString(a) {
  if (typeof a === "number") {
    if (isNaN(a) || a === Infinity || a === -Infinity) {
      return "";
    }
    return String(a);
  }
  if (typeof a === "string") {
    return a;
  }
  return "";
}
function compareAlphanumeric(aStr, bStr) {
  const a = aStr.split(reSplitAlphaNumeric).filter(Boolean);
  const b = bStr.split(reSplitAlphaNumeric).filter(Boolean);
  while (a.length && b.length) {
    const aa = a.shift();
    const bb = b.shift();
    const an = parseInt(aa, 10);
    const bn = parseInt(bb, 10);
    const combo = [an, bn].sort();
    if (isNaN(combo[0])) {
      if (aa > bb) {
        return 1;
      }
      if (bb > aa) {
        return -1;
      }
      continue;
    }
    if (isNaN(combo[1])) {
      return isNaN(an) ? -1 : 1;
    }
    if (an > bn) {
      return 1;
    }
    if (bn > an) {
      return -1;
    }
  }
  return a.length - b.length;
}
const sortingFns = {
  alphanumeric,
  alphanumericCaseSensitive,
  text,
  textCaseSensitive,
  datetime,
  basic
};
const Sorting = {
  getInitialState: (state) => {
    return {
      sorting: [],
      ...state
    };
  },
  getDefaultColumnDef: () => {
    return {
      sortingFn: "auto"
    };
  },
  getDefaultOptions: (table) => {
    return {
      onSortingChange: makeStateUpdater("sorting", table),
      isMultiSortEvent: (e) => {
        return e.shiftKey;
      }
    };
  },
  createColumn: (column, table) => {
    return {
      getAutoSortingFn: () => {
        const firstRows = table.getFilteredRowModel().flatRows.slice(10);
        let isString = false;
        for (const row of firstRows) {
          const value = row == null ? void 0 : row.getValue(column.id);
          if (Object.prototype.toString.call(value) === "[object Date]") {
            return sortingFns.datetime;
          }
          if (typeof value === "string") {
            isString = true;
            if (value.split(reSplitAlphaNumeric).length > 1) {
              return sortingFns.alphanumeric;
            }
          }
        }
        if (isString) {
          return sortingFns.text;
        }
        return sortingFns.basic;
      },
      getAutoSortDir: () => {
        const firstRow = table.getFilteredRowModel().flatRows[0];
        const value = firstRow == null ? void 0 : firstRow.getValue(column.id);
        if (typeof value === "string") {
          return "asc";
        }
        return "desc";
      },
      getSortingFn: () => {
        var _table$options$sortin, _table$options$sortin2;
        if (!column) {
          throw new Error();
        }
        return isFunction(column.columnDef.sortingFn) ? column.columnDef.sortingFn : column.columnDef.sortingFn === "auto" ? column.getAutoSortingFn() : (_table$options$sortin = (_table$options$sortin2 = table.options.sortingFns) == null ? void 0 : _table$options$sortin2[column.columnDef.sortingFn]) != null ? _table$options$sortin : sortingFns[column.columnDef.sortingFn];
      },
      toggleSorting: (desc, multi) => {
        const nextSortingOrder = column.getNextSortingOrder();
        const hasManualValue = typeof desc !== "undefined" && desc !== null;
        table.setSorting((old) => {
          const existingSorting = old == null ? void 0 : old.find((d) => d.id === column.id);
          const existingIndex = old == null ? void 0 : old.findIndex((d) => d.id === column.id);
          let newSorting = [];
          let sortAction;
          let nextDesc = hasManualValue ? desc : nextSortingOrder === "desc";
          if (old != null && old.length && column.getCanMultiSort() && multi) {
            if (existingSorting) {
              sortAction = "toggle";
            } else {
              sortAction = "add";
            }
          } else {
            if (old != null && old.length && existingIndex !== old.length - 1) {
              sortAction = "replace";
            } else if (existingSorting) {
              sortAction = "toggle";
            } else {
              sortAction = "replace";
            }
          }
          if (sortAction === "toggle") {
            if (!hasManualValue) {
              if (!nextSortingOrder) {
                sortAction = "remove";
              }
            }
          }
          if (sortAction === "add") {
            var _table$options$maxMul;
            newSorting = [...old, {
              id: column.id,
              desc: nextDesc
            }];
            newSorting.splice(0, newSorting.length - ((_table$options$maxMul = table.options.maxMultiSortColCount) != null ? _table$options$maxMul : Number.MAX_SAFE_INTEGER));
          } else if (sortAction === "toggle") {
            newSorting = old.map((d) => {
              if (d.id === column.id) {
                return {
                  ...d,
                  desc: nextDesc
                };
              }
              return d;
            });
          } else if (sortAction === "remove") {
            newSorting = old.filter((d) => d.id !== column.id);
          } else {
            newSorting = [{
              id: column.id,
              desc: nextDesc
            }];
          }
          return newSorting;
        });
      },
      getFirstSortDir: () => {
        var _ref, _column$columnDef$sor;
        const sortDescFirst = (_ref = (_column$columnDef$sor = column.columnDef.sortDescFirst) != null ? _column$columnDef$sor : table.options.sortDescFirst) != null ? _ref : column.getAutoSortDir() === "desc";
        return sortDescFirst ? "desc" : "asc";
      },
      getNextSortingOrder: (multi) => {
        var _table$options$enable, _table$options$enable2;
        const firstSortDirection = column.getFirstSortDir();
        const isSorted = column.getIsSorted();
        if (!isSorted) {
          return firstSortDirection;
        }
        if (isSorted !== firstSortDirection && ((_table$options$enable = table.options.enableSortingRemoval) != null ? _table$options$enable : true) && // If enableSortRemove, enable in general
        (multi ? (_table$options$enable2 = table.options.enableMultiRemove) != null ? _table$options$enable2 : true : true)) {
          return false;
        }
        return isSorted === "desc" ? "asc" : "desc";
      },
      getCanSort: () => {
        var _column$columnDef$ena, _table$options$enable3;
        return ((_column$columnDef$ena = column.columnDef.enableSorting) != null ? _column$columnDef$ena : true) && ((_table$options$enable3 = table.options.enableSorting) != null ? _table$options$enable3 : true) && !!column.accessorFn;
      },
      getCanMultiSort: () => {
        var _ref2, _column$columnDef$ena2;
        return (_ref2 = (_column$columnDef$ena2 = column.columnDef.enableMultiSort) != null ? _column$columnDef$ena2 : table.options.enableMultiSort) != null ? _ref2 : !!column.accessorFn;
      },
      getIsSorted: () => {
        var _table$getState$sorti;
        const columnSort = (_table$getState$sorti = table.getState().sorting) == null ? void 0 : _table$getState$sorti.find((d) => d.id === column.id);
        return !columnSort ? false : columnSort.desc ? "desc" : "asc";
      },
      getSortIndex: () => {
        var _table$getState$sorti2, _table$getState$sorti3;
        return (_table$getState$sorti2 = (_table$getState$sorti3 = table.getState().sorting) == null ? void 0 : _table$getState$sorti3.findIndex((d) => d.id === column.id)) != null ? _table$getState$sorti2 : -1;
      },
      clearSorting: () => {
        table.setSorting((old) => old != null && old.length ? old.filter((d) => d.id !== column.id) : []);
      },
      getToggleSortingHandler: () => {
        const canSort = column.getCanSort();
        return (e) => {
          if (!canSort)
            return;
          e.persist == null ? void 0 : e.persist();
          column.toggleSorting == null ? void 0 : column.toggleSorting(void 0, column.getCanMultiSort() ? table.options.isMultiSortEvent == null ? void 0 : table.options.isMultiSortEvent(e) : false);
        };
      }
    };
  },
  createTable: (table) => {
    return {
      setSorting: (updater) => table.options.onSortingChange == null ? void 0 : table.options.onSortingChange(updater),
      resetSorting: (defaultState) => {
        var _table$initialState$s, _table$initialState;
        table.setSorting(defaultState ? [] : (_table$initialState$s = (_table$initialState = table.initialState) == null ? void 0 : _table$initialState.sorting) != null ? _table$initialState$s : []);
      },
      getPreSortedRowModel: () => table.getGroupedRowModel(),
      getSortedRowModel: () => {
        if (!table._getSortedRowModel && table.options.getSortedRowModel) {
          table._getSortedRowModel = table.options.getSortedRowModel(table);
        }
        if (table.options.manualSorting || !table._getSortedRowModel) {
          return table.getPreSortedRowModel();
        }
        return table._getSortedRowModel();
      }
    };
  }
};
const Visibility = {
  getInitialState: (state) => {
    return {
      columnVisibility: {},
      ...state
    };
  },
  getDefaultOptions: (table) => {
    return {
      onColumnVisibilityChange: makeStateUpdater("columnVisibility", table)
    };
  },
  createColumn: (column, table) => {
    return {
      toggleVisibility: (value) => {
        if (column.getCanHide()) {
          table.setColumnVisibility((old) => ({
            ...old,
            [column.id]: value != null ? value : !column.getIsVisible()
          }));
        }
      },
      getIsVisible: () => {
        var _table$getState$colum, _table$getState$colum2;
        return (_table$getState$colum = (_table$getState$colum2 = table.getState().columnVisibility) == null ? void 0 : _table$getState$colum2[column.id]) != null ? _table$getState$colum : true;
      },
      getCanHide: () => {
        var _column$columnDef$ena, _table$options$enable;
        return ((_column$columnDef$ena = column.columnDef.enableHiding) != null ? _column$columnDef$ena : true) && ((_table$options$enable = table.options.enableHiding) != null ? _table$options$enable : true);
      },
      getToggleVisibilityHandler: () => {
        return (e) => {
          column.toggleVisibility == null ? void 0 : column.toggleVisibility(e.target.checked);
        };
      }
    };
  },
  createRow: (row, table) => {
    return {
      _getAllVisibleCells: memo(() => [row.getAllCells(), table.getState().columnVisibility], (cells) => {
        return cells.filter((cell) => cell.column.getIsVisible());
      }, {
        key: "row._getAllVisibleCells",
        debug: () => {
          var _table$options$debugA;
          return (_table$options$debugA = table.options.debugAll) != null ? _table$options$debugA : table.options.debugRows;
        }
      }),
      getVisibleCells: memo(() => [row.getLeftVisibleCells(), row.getCenterVisibleCells(), row.getRightVisibleCells()], (left, center, right) => [...left, ...center, ...right], {
        key: false,
        debug: () => {
          var _table$options$debugA2;
          return (_table$options$debugA2 = table.options.debugAll) != null ? _table$options$debugA2 : table.options.debugRows;
        }
      })
    };
  },
  createTable: (table) => {
    const makeVisibleColumnsMethod = (key, getColumns) => {
      return memo(() => [getColumns(), getColumns().filter((d) => d.getIsVisible()).map((d) => d.id).join("_")], (columns) => {
        return columns.filter((d) => d.getIsVisible == null ? void 0 : d.getIsVisible());
      }, {
        key,
        debug: () => {
          var _table$options$debugA3;
          return (_table$options$debugA3 = table.options.debugAll) != null ? _table$options$debugA3 : table.options.debugColumns;
        }
      });
    };
    return {
      getVisibleFlatColumns: makeVisibleColumnsMethod("getVisibleFlatColumns", () => table.getAllFlatColumns()),
      getVisibleLeafColumns: makeVisibleColumnsMethod("getVisibleLeafColumns", () => table.getAllLeafColumns()),
      getLeftVisibleLeafColumns: makeVisibleColumnsMethod("getLeftVisibleLeafColumns", () => table.getLeftLeafColumns()),
      getRightVisibleLeafColumns: makeVisibleColumnsMethod("getRightVisibleLeafColumns", () => table.getRightLeafColumns()),
      getCenterVisibleLeafColumns: makeVisibleColumnsMethod("getCenterVisibleLeafColumns", () => table.getCenterLeafColumns()),
      setColumnVisibility: (updater) => table.options.onColumnVisibilityChange == null ? void 0 : table.options.onColumnVisibilityChange(updater),
      resetColumnVisibility: (defaultState) => {
        var _table$initialState$c;
        table.setColumnVisibility(defaultState ? {} : (_table$initialState$c = table.initialState.columnVisibility) != null ? _table$initialState$c : {});
      },
      toggleAllColumnsVisible: (value) => {
        var _value;
        value = (_value = value) != null ? _value : !table.getIsAllColumnsVisible();
        table.setColumnVisibility(table.getAllLeafColumns().reduce((obj, column) => ({
          ...obj,
          [column.id]: !value ? !(column.getCanHide != null && column.getCanHide()) : value
        }), {}));
      },
      getIsAllColumnsVisible: () => !table.getAllLeafColumns().some((column) => !(column.getIsVisible != null && column.getIsVisible())),
      getIsSomeColumnsVisible: () => table.getAllLeafColumns().some((column) => column.getIsVisible == null ? void 0 : column.getIsVisible()),
      getToggleAllColumnsVisibilityHandler: () => {
        return (e) => {
          var _target;
          table.toggleAllColumnsVisible((_target = e.target) == null ? void 0 : _target.checked);
        };
      }
    };
  }
};
const features = [Headers, Visibility, Ordering, Pinning, Filters, Sorting, Grouping, Expanding, Pagination, RowSelection, ColumnSizing];
function createTable(options) {
  var _options$initialState;
  if (options.debugAll || options.debugTable) {
    console.info("Creating Table Instance...");
  }
  let table = {
    _features: features
  };
  const defaultOptions = table._features.reduce((obj, feature) => {
    return Object.assign(obj, feature.getDefaultOptions == null ? void 0 : feature.getDefaultOptions(table));
  }, {});
  const mergeOptions = (options2) => {
    if (table.options.mergeOptions) {
      return table.options.mergeOptions(defaultOptions, options2);
    }
    return {
      ...defaultOptions,
      ...options2
    };
  };
  const coreInitialState = {};
  let initialState = {
    ...coreInitialState,
    ...(_options$initialState = options.initialState) != null ? _options$initialState : {}
  };
  table._features.forEach((feature) => {
    var _feature$getInitialSt;
    initialState = (_feature$getInitialSt = feature.getInitialState == null ? void 0 : feature.getInitialState(initialState)) != null ? _feature$getInitialSt : initialState;
  });
  const queued = [];
  let queuedTimeout = false;
  const coreInstance = {
    _features: features,
    options: {
      ...defaultOptions,
      ...options
    },
    initialState,
    _queue: (cb) => {
      queued.push(cb);
      if (!queuedTimeout) {
        queuedTimeout = true;
        Promise.resolve().then(() => {
          while (queued.length) {
            queued.shift()();
          }
          queuedTimeout = false;
        }).catch((error) => setTimeout(() => {
          throw error;
        }));
      }
    },
    reset: () => {
      table.setState(table.initialState);
    },
    setOptions: (updater) => {
      const newOptions = functionalUpdate(updater, table.options);
      table.options = mergeOptions(newOptions);
    },
    getState: () => {
      return table.options.state;
    },
    setState: (updater) => {
      table.options.onStateChange == null ? void 0 : table.options.onStateChange(updater);
    },
    _getRowId: (row, index, parent) => {
      var _table$options$getRow;
      return (_table$options$getRow = table.options.getRowId == null ? void 0 : table.options.getRowId(row, index, parent)) != null ? _table$options$getRow : `${parent ? [parent.id, index].join(".") : index}`;
    },
    getCoreRowModel: () => {
      if (!table._getCoreRowModel) {
        table._getCoreRowModel = table.options.getCoreRowModel(table);
      }
      return table._getCoreRowModel();
    },
    // The final calls start at the bottom of the model,
    // expanded rows, which then work their way up
    getRowModel: () => {
      return table.getPaginationRowModel();
    },
    getRow: (id) => {
      const row = table.getRowModel().rowsById[id];
      if (!row) {
        throw new Error();
      }
      return row;
    },
    _getDefaultColumnDef: memo(() => [table.options.defaultColumn], (defaultColumn) => {
      var _defaultColumn;
      defaultColumn = (_defaultColumn = defaultColumn) != null ? _defaultColumn : {};
      return {
        header: (props2) => {
          const resolvedColumnDef = props2.header.column.columnDef;
          if (resolvedColumnDef.accessorKey) {
            return resolvedColumnDef.accessorKey;
          }
          if (resolvedColumnDef.accessorFn) {
            return resolvedColumnDef.id;
          }
          return null;
        },
        // footer: props => props.header.column.id,
        cell: (props2) => {
          var _props$renderValue$to, _props$renderValue;
          return (_props$renderValue$to = (_props$renderValue = props2.renderValue()) == null ? void 0 : _props$renderValue.toString == null ? void 0 : _props$renderValue.toString()) != null ? _props$renderValue$to : null;
        },
        ...table._features.reduce((obj, feature) => {
          return Object.assign(obj, feature.getDefaultColumnDef == null ? void 0 : feature.getDefaultColumnDef());
        }, {}),
        ...defaultColumn
      };
    }, {
      debug: () => {
        var _table$options$debugA;
        return (_table$options$debugA = table.options.debugAll) != null ? _table$options$debugA : table.options.debugColumns;
      },
      key: false
    }),
    _getColumnDefs: () => table.options.columns,
    getAllColumns: memo(() => [table._getColumnDefs()], (columnDefs) => {
      const recurseColumns = function(columnDefs2, parent, depth) {
        if (depth === void 0) {
          depth = 0;
        }
        return columnDefs2.map((columnDef) => {
          const column = createColumn(table, columnDef, depth, parent);
          const groupingColumnDef = columnDef;
          column.columns = groupingColumnDef.columns ? recurseColumns(groupingColumnDef.columns, column, depth + 1) : [];
          return column;
        });
      };
      return recurseColumns(columnDefs);
    }, {
      key: false,
      debug: () => {
        var _table$options$debugA2;
        return (_table$options$debugA2 = table.options.debugAll) != null ? _table$options$debugA2 : table.options.debugColumns;
      }
    }),
    getAllFlatColumns: memo(() => [table.getAllColumns()], (allColumns) => {
      return allColumns.flatMap((column) => {
        return column.getFlatColumns();
      });
    }, {
      key: false,
      debug: () => {
        var _table$options$debugA3;
        return (_table$options$debugA3 = table.options.debugAll) != null ? _table$options$debugA3 : table.options.debugColumns;
      }
    }),
    _getAllFlatColumnsById: memo(() => [table.getAllFlatColumns()], (flatColumns) => {
      return flatColumns.reduce((acc, column) => {
        acc[column.id] = column;
        return acc;
      }, {});
    }, {
      key: false,
      debug: () => {
        var _table$options$debugA4;
        return (_table$options$debugA4 = table.options.debugAll) != null ? _table$options$debugA4 : table.options.debugColumns;
      }
    }),
    getAllLeafColumns: memo(() => [table.getAllColumns(), table._getOrderColumnsFn()], (allColumns, orderColumns2) => {
      let leafColumns = allColumns.flatMap((column) => column.getLeafColumns());
      return orderColumns2(leafColumns);
    }, {
      key: false,
      debug: () => {
        var _table$options$debugA5;
        return (_table$options$debugA5 = table.options.debugAll) != null ? _table$options$debugA5 : table.options.debugColumns;
      }
    }),
    getColumn: (columnId) => {
      const column = table._getAllFlatColumnsById()[columnId];
      return column;
    }
  };
  Object.assign(table, coreInstance);
  table._features.forEach((feature) => {
    return Object.assign(table, feature.createTable == null ? void 0 : feature.createTable(table));
  });
  return table;
}
function createCell(table, row, column, columnId) {
  const getRenderValue = () => {
    var _cell$getValue;
    return (_cell$getValue = cell.getValue()) != null ? _cell$getValue : table.options.renderFallbackValue;
  };
  const cell = {
    id: `${row.id}_${column.id}`,
    row,
    column,
    getValue: () => row.getValue(columnId),
    renderValue: getRenderValue,
    getContext: memo(() => [table, column, row, cell], (table2, column2, row2, cell2) => ({
      table: table2,
      column: column2,
      row: row2,
      cell: cell2,
      getValue: cell2.getValue,
      renderValue: cell2.renderValue
    }), {
      key: false,
      debug: () => table.options.debugAll
    })
  };
  table._features.forEach((feature) => {
    Object.assign(cell, feature.createCell == null ? void 0 : feature.createCell(cell, column, row, table));
  }, {});
  return cell;
}
const createRow = (table, id, original, rowIndex, depth, subRows) => {
  let row = {
    id,
    index: rowIndex,
    original,
    depth,
    _valuesCache: {},
    _uniqueValuesCache: {},
    getValue: (columnId) => {
      if (row._valuesCache.hasOwnProperty(columnId)) {
        return row._valuesCache[columnId];
      }
      const column = table.getColumn(columnId);
      if (!(column != null && column.accessorFn)) {
        return void 0;
      }
      row._valuesCache[columnId] = column.accessorFn(row.original, rowIndex);
      return row._valuesCache[columnId];
    },
    getUniqueValues: (columnId) => {
      if (row._uniqueValuesCache.hasOwnProperty(columnId)) {
        return row._uniqueValuesCache[columnId];
      }
      const column = table.getColumn(columnId);
      if (!(column != null && column.accessorFn)) {
        return void 0;
      }
      if (!column.columnDef.getUniqueValues) {
        row._uniqueValuesCache[columnId] = [row.getValue(columnId)];
        return row._uniqueValuesCache[columnId];
      }
      row._uniqueValuesCache[columnId] = column.columnDef.getUniqueValues(row.original, rowIndex);
      return row._uniqueValuesCache[columnId];
    },
    renderValue: (columnId) => {
      var _row$getValue;
      return (_row$getValue = row.getValue(columnId)) != null ? _row$getValue : table.options.renderFallbackValue;
    },
    subRows: subRows != null ? subRows : [],
    getLeafRows: () => flattenBy(row.subRows, (d) => d.subRows),
    getAllCells: memo(() => [table.getAllLeafColumns()], (leafColumns) => {
      return leafColumns.map((column) => {
        return createCell(table, row, column, column.id);
      });
    }, {
      key: false,
      debug: () => {
        var _table$options$debugA;
        return (_table$options$debugA = table.options.debugAll) != null ? _table$options$debugA : table.options.debugRows;
      }
    }),
    _getAllCellsByColumnId: memo(() => [row.getAllCells()], (allCells) => {
      return allCells.reduce((acc, cell) => {
        acc[cell.column.id] = cell;
        return acc;
      }, {});
    }, {
      key: "row.getAllCellsByColumnId",
      debug: () => {
        var _table$options$debugA2;
        return (_table$options$debugA2 = table.options.debugAll) != null ? _table$options$debugA2 : table.options.debugRows;
      }
    })
  };
  for (let i = 0; i < table._features.length; i++) {
    const feature = table._features[i];
    Object.assign(row, feature == null ? void 0 : feature.createRow == null ? void 0 : feature.createRow(row, table));
  }
  return row;
};
function createColumnHelper() {
  return {
    accessor: (accessor, column) => {
      return typeof accessor === "function" ? {
        ...column,
        accessorFn: accessor
      } : {
        ...column,
        accessorKey: accessor
      };
    },
    display: (column) => column,
    group: (column) => column
  };
}
function getCoreRowModel() {
  return (table) => memo(() => [table.options.data], (data) => {
    const rowModel = {
      rows: [],
      flatRows: [],
      rowsById: {}
    };
    const accessRows = function(originalRows, depth, parent) {
      if (depth === void 0) {
        depth = 0;
      }
      const rows = [];
      for (let i = 0; i < originalRows.length; i++) {
        const row = createRow(table, table._getRowId(originalRows[i], i, parent), originalRows[i], i, depth);
        rowModel.flatRows.push(row);
        rowModel.rowsById[row.id] = row;
        rows.push(row);
        if (table.options.getSubRows) {
          var _row$originalSubRows;
          row.originalSubRows = table.options.getSubRows(originalRows[i], i);
          if ((_row$originalSubRows = row.originalSubRows) != null && _row$originalSubRows.length) {
            row.subRows = accessRows(row.originalSubRows, depth + 1, row);
          }
        }
      }
      return rows;
    };
    rowModel.rows = accessRows(data);
    return rowModel;
  }, {
    key: false,
    debug: () => {
      var _table$options$debugA;
      return (_table$options$debugA = table.options.debugAll) != null ? _table$options$debugA : table.options.debugTable;
    },
    onChange: () => {
      table._autoResetPageIndex();
    }
  });
}
/**
 * react-table
 *
 * Copyright (c) TanStack
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function flexRender(Comp, props2) {
  return !Comp ? null : isReactComponent(Comp) ? /* @__PURE__ */ reactExports.createElement(Comp, props2) : Comp;
}
function isReactComponent(component) {
  return isClassComponent(component) || typeof component === "function" || isExoticComponent(component);
}
function isClassComponent(component) {
  return typeof component === "function" && (() => {
    const proto = Object.getPrototypeOf(component);
    return proto.prototype && proto.prototype.isReactComponent;
  })();
}
function isExoticComponent(component) {
  return typeof component === "object" && typeof component.$$typeof === "symbol" && ["react.memo", "react.forward_ref"].includes(component.$$typeof.description);
}
function useReactTable(options) {
  const resolvedOptions = {
    state: {},
    // Dummy state
    onStateChange: () => {
    },
    // noop
    renderFallbackValue: null,
    ...options
  };
  const [tableRef] = reactExports.useState(() => ({
    current: createTable(resolvedOptions)
  }));
  const [state, setState] = reactExports.useState(() => tableRef.current.initialState);
  tableRef.current.setOptions((prev) => ({
    ...prev,
    ...options,
    state: {
      ...state,
      ...options.state
    },
    // Similarly, we'll maintain both our internal state and any user-provided
    // state.
    onStateChange: (updater) => {
      setState(updater);
      options.onStateChange == null ? void 0 : options.onStateChange(updater);
    }
  }));
  return tableRef.current;
}
const observerMap = /* @__PURE__ */ new Map();
const RootIds = /* @__PURE__ */ new WeakMap();
let rootId = 0;
let unsupportedValue = void 0;
function getRootId(root) {
  if (!root)
    return "0";
  if (RootIds.has(root))
    return RootIds.get(root);
  rootId += 1;
  RootIds.set(root, rootId.toString());
  return RootIds.get(root);
}
function optionsToId(options) {
  return Object.keys(options).sort().filter((key) => options[key] !== void 0).map((key) => {
    return `${key}_${key === "root" ? getRootId(options.root) : options[key]}`;
  }).toString();
}
function createObserver(options) {
  let id = optionsToId(options);
  let instance = observerMap.get(id);
  if (!instance) {
    const elements = /* @__PURE__ */ new Map();
    let thresholds;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        var _elements$get;
        const inView = entry.isIntersecting && thresholds.some((threshold) => entry.intersectionRatio >= threshold);
        if (options.trackVisibility && typeof entry.isVisible === "undefined") {
          entry.isVisible = inView;
        }
        (_elements$get = elements.get(entry.target)) == null ? void 0 : _elements$get.forEach((callback) => {
          callback(inView, entry);
        });
      });
    }, options);
    thresholds = observer.thresholds || (Array.isArray(options.threshold) ? options.threshold : [options.threshold || 0]);
    instance = {
      id,
      observer,
      elements
    };
    observerMap.set(id, instance);
  }
  return instance;
}
function observe(element, callback, options = {}, fallbackInView = unsupportedValue) {
  if (typeof window.IntersectionObserver === "undefined" && fallbackInView !== void 0) {
    const bounds = element.getBoundingClientRect();
    callback(fallbackInView, {
      isIntersecting: fallbackInView,
      target: element,
      intersectionRatio: typeof options.threshold === "number" ? options.threshold : 0,
      time: 0,
      boundingClientRect: bounds,
      intersectionRect: bounds,
      rootBounds: bounds
    });
    return () => {
    };
  }
  const {
    id,
    observer,
    elements
  } = createObserver(options);
  let callbacks = elements.get(element) || [];
  if (!elements.has(element)) {
    elements.set(element, callbacks);
  }
  callbacks.push(callback);
  observer.observe(element);
  return function unobserve() {
    callbacks.splice(callbacks.indexOf(callback), 1);
    if (callbacks.length === 0) {
      elements.delete(element);
      observer.unobserve(element);
    }
    if (elements.size === 0) {
      observer.disconnect();
      observerMap.delete(id);
    }
  };
}
function useInView({
  threshold,
  delay,
  trackVisibility,
  rootMargin,
  root,
  triggerOnce,
  skip,
  initialInView,
  fallbackInView,
  onChange
} = {}) {
  var _state$entry;
  const [ref, setRef] = reactExports.useState(null);
  const callback = reactExports.useRef();
  const [state, setState] = reactExports.useState({
    inView: !!initialInView,
    entry: void 0
  });
  callback.current = onChange;
  reactExports.useEffect(
    () => {
      if (skip || !ref)
        return;
      let unobserve;
      unobserve = observe(ref, (inView, entry) => {
        setState({
          inView,
          entry
        });
        if (callback.current)
          callback.current(inView, entry);
        if (entry.isIntersecting && triggerOnce && unobserve) {
          unobserve();
          unobserve = void 0;
        }
      }, {
        root,
        rootMargin,
        threshold,
        // @ts-ignore
        trackVisibility,
        // @ts-ignore
        delay
      }, fallbackInView);
      return () => {
        if (unobserve) {
          unobserve();
        }
      };
    },
    // We break the rule here, because we aren't including the actual `threshold` variable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // If the threshold is an array, convert it to a string, so it won't change between renders.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Array.isArray(threshold) ? threshold.toString() : threshold,
      ref,
      root,
      rootMargin,
      triggerOnce,
      skip,
      trackVisibility,
      fallbackInView,
      delay
    ]
  );
  const entryTarget = (_state$entry = state.entry) == null ? void 0 : _state$entry.target;
  const previousEntryTarget = reactExports.useRef();
  if (!ref && entryTarget && !triggerOnce && !skip && previousEntryTarget.current !== entryTarget) {
    previousEntryTarget.current = entryTarget;
    setState({
      inView: !!initialInView,
      entry: void 0
    });
  }
  const result = [setRef, state.inView, state.entry];
  result.ref = result[0];
  result.inView = result[1];
  result.entry = result[2];
  return result;
}
function filtersArray(userFilters) {
  const arrayOfFilters = userFilters ? Object.entries(userFilters).map(([col, params]) => {
    const { op, val } = params;
    return { col, op, val };
  }) : [];
  return arrayOfFilters;
}
function useInfiniteFetch(options, maxRows = 50) {
  const { __ } = useI18n();
  const columnHelper = reactExports.useMemo(() => createColumnHelper(), []);
  const { ref, inView } = useInView();
  const { key, filters: userFilters, sorting, paginationId } = options;
  const sortingArray = sorting ? sorting.map((sortingObj) => {
    const { key: keyName, dir } = sortingObj;
    return { col: keyName, dir };
  }) : [];
  const query = useInfiniteQuery({
    queryKey: [key, filtersArray(userFilters), sorting],
    queryFn: async ({ pageParam = "" }) => {
      const { lastRowId: lastRowId2, sortingFilters, sortingFiltersLastValue } = pageParam;
      const response = await postFetch(key, {
        sorting: [...sortingArray, { col: paginationId, dir: "ASC" }],
        filters: sortingFilters ? [
          {
            cond: "OR",
            filters: [
              { cond: "AND", filters: [...sortingFiltersLastValue, { col: paginationId, op: ">", val: lastRowId2 }] },
              ...sortingFilters
            ]
          },
          ...filtersArray(userFilters)
        ] : [...filtersArray(userFilters)],
        rows_per_page: maxRows
      });
      return response.json();
    },
    getNextPageParam: (allRows) => {
      if (allRows.length < maxRows) {
        return void 0;
      }
      const lastRowId2 = allRows[(allRows == null ? void 0 : allRows.length) - 1][paginationId] ?? void 0;
      const sortingFilters = sorting ? sorting.map((sortingObj) => {
        const { key: keyName, op } = sortingObj;
        return { col: keyName, op, val: allRows[(allRows == null ? void 0 : allRows.length) - 1][keyName] };
      }) : [];
      const sortingFiltersLastValue = sorting ? sorting.map((sortingObj) => {
        const { key: keyName } = sortingObj;
        return { col: keyName, op: "=", val: allRows[(allRows == null ? void 0 : allRows.length) - 1][keyName] };
      }) : [];
      return { lastRowId: lastRowId2, sortingFilters, sortingFiltersLastValue };
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    cacheTime: Infinity,
    staleTime: Infinity
  });
  const {
    data,
    status,
    isSuccess,
    isFetching,
    isFetchingNextPage,
    hasNextPage: hasNextPage2,
    fetchNextPage
  } = query;
  reactExports.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, key, fetchNextPage]);
  return {
    __,
    columnHelper,
    data,
    status,
    isSuccess,
    isFetching,
    isFetchingNextPage,
    hasNextPage: hasNextPage2,
    fetchNextPage,
    ref
  };
}
function RangeInputs({
  min: min2,
  max: max2,
  onChange,
  unit,
  defaultMin,
  defaultMax
}) {
  const [minimum, setMin] = reactExports.useState(min2);
  const [maximum, setMax] = reactExports.useState(max2);
  const handleMin = (event) => {
    setMin(event.target.value);
  };
  const handleMax = (event) => {
    setMax(event.target.value);
  };
  reactExports.useEffect(() => {
    if (onChange) {
      onChange({ min: minimum, max: maximum });
    }
  }, [minimum, maximum]);
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-rangeslider-inputs" }, /* @__PURE__ */ React.createElement("label", { className: "urlslab-inputField dark-text", "data-unit": unit }, /* @__PURE__ */ React.createElement("input", { className: "urlslab-input", type: "number", autoFocus: true, defaultValue: minimum || defaultMin, onChange: (event) => handleMin(event) })), "—", /* @__PURE__ */ React.createElement("label", { className: "urlslab-inputField dark-text", "data-unit": unit }, /* @__PURE__ */ React.createElement("input", { className: "urlslab-input", type: "number", defaultValue: maximum || defaultMax, onChange: (event) => handleMax(event) })));
}
function LangMenu({ noAll, multiSelect, isFilter, children, defaultAccept, onChange, checkedId, autoClose }) {
  const queryClient = useQueryClient();
  const langData = queryClient.getQueryData(["languages"]);
  const sortLangs = (langEntries) => {
    return Object.fromEntries(
      Object.entries(langEntries).sort(([, a], [, b]) => a.localeCompare(b))
    );
  };
  if (noAll) {
    delete langData.all;
  }
  if (!langData[checkedId]) {
    langData[checkedId] = langName(checkedId);
    queryClient.setQueryData(["languages"], sortLangs(langData));
    queryClient.invalidateQueries(["languages"]);
  }
  const langs = sortLangs(langData);
  const handleSelected = (lang) => {
    if (onChange) {
      onChange(lang);
    }
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, langs && !multiSelect ? /* @__PURE__ */ React.createElement(
    SortMenu,
    {
      autoClose,
      items: langs,
      isFilter,
      name: "languages",
      defaultAccept,
      checkedId,
      onChange: (lang) => handleSelected(lang)
    },
    children
  ) : !multiSelect && /* @__PURE__ */ React.createElement(InputField, { defaultValue: checkedId, onChange: (lang) => handleSelected(lang) }), langs && multiSelect && /* @__PURE__ */ React.createElement(
    FilterMenu,
    {
      items: langs,
      isFilter,
      checkedItems: [checkedId].flat(),
      onChange: (lang) => handleSelected(lang)
    }
  ));
}
const SvgIconTrash = (props2) => /* @__PURE__ */ reactExports.createElement("svg", { width: "100%", height: "100%", viewBox: "0 0 17 19", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", xmlSpace: "preserve", "xmlns:serif": "http://www.serif.com/", style: {
  fillRule: "evenodd",
  clipRule: "evenodd",
  strokeLinejoin: "round",
  strokeMiterlimit: 2
}, ...props2 }, /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(1,0,0,1,-1.75,-0.91663)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M5.917,4.25L4.174,4.25L2.5,4.25C2.086,4.25 1.75,4.586 1.75,5C1.75,5.414 2.086,5.75 2.5,5.75L3.417,5.75L3.417,16.667C3.417,17.308 3.672,17.922 4.125,18.375C4.578,18.829 5.193,19.083 5.834,19.083C5.834,19.083 14.167,19.083 14.167,19.083C14.808,19.083 15.423,18.829 15.876,18.375C16.329,17.922 16.584,17.308 16.584,16.667L16.584,5.75L17.5,5.75C17.914,5.75 18.25,5.414 18.25,5C18.25,4.586 17.914,4.25 17.5,4.25L15.841,4.25L14.084,4.25L14.084,3.333C14.084,2.692 13.829,2.078 13.376,1.624C12.923,1.171 12.308,0.917 11.667,0.917L8.334,0.917C7.693,0.917 7.078,1.171 6.625,1.624C6.172,2.078 5.917,2.692 5.917,3.333L5.917,4.25ZM15.084,5.75L4.917,5.75L4.917,16.667C4.917,16.91 5.014,17.143 5.185,17.315C5.185,17.315 5.185,17.315 5.186,17.315C5.357,17.487 5.591,17.583 5.834,17.583L14.167,17.583C14.41,17.583 14.643,17.487 14.815,17.315C14.815,17.315 14.815,17.315 14.815,17.315C14.987,17.143 15.084,16.91 15.084,16.667L15.084,5.75ZM7.583,9.167L7.583,14.167C7.583,14.581 7.919,14.917 8.333,14.917C8.747,14.917 9.083,14.581 9.083,14.167L9.083,9.167C9.083,8.753 8.747,8.417 8.333,8.417C7.919,8.417 7.583,8.753 7.583,9.167ZM10.917,9.167L10.917,14.167C10.917,14.581 11.253,14.917 11.667,14.917C12.081,14.917 12.417,14.581 12.417,14.167L12.417,9.167C12.417,8.753 12.081,8.417 11.667,8.417C11.253,8.417 10.917,8.753 10.917,9.167ZM12.584,4.25L12.584,3.333C12.584,3.09 12.487,2.857 12.315,2.685C12.143,2.513 11.91,2.417 11.667,2.417C11.667,2.417 8.334,2.417 8.334,2.417C8.091,2.417 7.857,2.513 7.685,2.685C7.514,2.857 7.417,3.09 7.417,3.333L7.417,4.25L12.584,4.25Z" })));
function _extends() {
  _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
var props = ["bottom", "height", "left", "right", "top", "width"];
var rectChanged = function rectChanged2(a, b) {
  if (a === void 0) {
    a = {};
  }
  if (b === void 0) {
    b = {};
  }
  return props.some(function(prop) {
    return a[prop] !== b[prop];
  });
};
var observedNodes = /* @__PURE__ */ new Map();
var rafId;
var run = function run2() {
  var changedStates = [];
  observedNodes.forEach(function(state, node) {
    var newRect = node.getBoundingClientRect();
    if (rectChanged(newRect, state.rect)) {
      state.rect = newRect;
      changedStates.push(state);
    }
  });
  changedStates.forEach(function(state) {
    state.callbacks.forEach(function(cb) {
      return cb(state.rect);
    });
  });
  rafId = window.requestAnimationFrame(run2);
};
function observeRect(node, cb) {
  return {
    observe: function observe2() {
      var wasEmpty = observedNodes.size === 0;
      if (observedNodes.has(node)) {
        observedNodes.get(node).callbacks.push(cb);
      } else {
        observedNodes.set(node, {
          rect: void 0,
          hasRectChanged: false,
          callbacks: [cb]
        });
      }
      if (wasEmpty)
        run();
    },
    unobserve: function unobserve() {
      var state = observedNodes.get(node);
      if (state) {
        var index = state.callbacks.indexOf(cb);
        if (index >= 0)
          state.callbacks.splice(index, 1);
        if (!state.callbacks.length)
          observedNodes["delete"](node);
        if (!observedNodes.size)
          cancelAnimationFrame(rafId);
      }
    }
  };
}
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;
function useRect(nodeRef, initialRect) {
  if (initialRect === void 0) {
    initialRect = {
      width: 0,
      height: 0
    };
  }
  var _React$useState = React.useState(nodeRef.current), element = _React$useState[0], setElement = _React$useState[1];
  var _React$useReducer = React.useReducer(rectReducer, initialRect), rect = _React$useReducer[0], dispatch = _React$useReducer[1];
  var initialRectSet = React.useRef(false);
  useIsomorphicLayoutEffect(function() {
    if (nodeRef.current !== element) {
      setElement(nodeRef.current);
    }
  });
  useIsomorphicLayoutEffect(function() {
    if (element && !initialRectSet.current) {
      initialRectSet.current = true;
      var _rect = element.getBoundingClientRect();
      dispatch({
        rect: _rect
      });
    }
  }, [element]);
  React.useEffect(function() {
    if (!element) {
      return;
    }
    var observer = observeRect(element, function(rect2) {
      dispatch({
        rect: rect2
      });
    });
    observer.observe();
    return function() {
      observer.unobserve();
    };
  }, [element]);
  return rect;
}
function rectReducer(state, action) {
  var rect = action.rect;
  if (state.height !== rect.height || state.width !== rect.width) {
    return rect;
  }
  return state;
}
var defaultEstimateSize = function defaultEstimateSize2() {
  return 50;
};
var defaultKeyExtractor = function defaultKeyExtractor2(index) {
  return index;
};
var defaultMeasureSize = function defaultMeasureSize2(el, horizontal) {
  var key = horizontal ? "offsetWidth" : "offsetHeight";
  return el[key];
};
var defaultRangeExtractor = function defaultRangeExtractor2(range) {
  var start = Math.max(range.start - range.overscan, 0);
  var end = Math.min(range.end + range.overscan, range.size - 1);
  var arr = [];
  for (var i = start; i <= end; i++) {
    arr.push(i);
  }
  return arr;
};
function useVirtual(_ref) {
  var _measurements;
  var _ref$size = _ref.size, size = _ref$size === void 0 ? 0 : _ref$size, _ref$estimateSize = _ref.estimateSize, estimateSize = _ref$estimateSize === void 0 ? defaultEstimateSize : _ref$estimateSize, _ref$overscan = _ref.overscan, overscan = _ref$overscan === void 0 ? 1 : _ref$overscan, _ref$paddingStart = _ref.paddingStart, paddingStart = _ref$paddingStart === void 0 ? 0 : _ref$paddingStart, _ref$paddingEnd = _ref.paddingEnd, paddingEnd = _ref$paddingEnd === void 0 ? 0 : _ref$paddingEnd, parentRef = _ref.parentRef, horizontal = _ref.horizontal, scrollToFn = _ref.scrollToFn, useObserver = _ref.useObserver, initialRect = _ref.initialRect, onScrollElement = _ref.onScrollElement, scrollOffsetFn = _ref.scrollOffsetFn, _ref$keyExtractor = _ref.keyExtractor, keyExtractor = _ref$keyExtractor === void 0 ? defaultKeyExtractor : _ref$keyExtractor, _ref$measureSize = _ref.measureSize, measureSize = _ref$measureSize === void 0 ? defaultMeasureSize : _ref$measureSize, _ref$rangeExtractor = _ref.rangeExtractor, rangeExtractor = _ref$rangeExtractor === void 0 ? defaultRangeExtractor : _ref$rangeExtractor;
  var sizeKey = horizontal ? "width" : "height";
  var scrollKey = horizontal ? "scrollLeft" : "scrollTop";
  var latestRef = React.useRef({
    scrollOffset: 0,
    measurements: []
  });
  var _React$useState = React.useState(0), scrollOffset = _React$useState[0], setScrollOffset = _React$useState[1];
  latestRef.current.scrollOffset = scrollOffset;
  var useMeasureParent = useObserver || useRect;
  var _useMeasureParent = useMeasureParent(parentRef, initialRect), outerSize = _useMeasureParent[sizeKey];
  latestRef.current.outerSize = outerSize;
  var defaultScrollToFn = React.useCallback(function(offset) {
    if (parentRef.current) {
      parentRef.current[scrollKey] = offset;
    }
  }, [parentRef, scrollKey]);
  var resolvedScrollToFn = scrollToFn || defaultScrollToFn;
  scrollToFn = React.useCallback(function(offset) {
    resolvedScrollToFn(offset, defaultScrollToFn);
  }, [defaultScrollToFn, resolvedScrollToFn]);
  var _React$useState2 = React.useState({}), measuredCache = _React$useState2[0], setMeasuredCache = _React$useState2[1];
  var measure = React.useCallback(function() {
    return setMeasuredCache({});
  }, []);
  var pendingMeasuredCacheIndexesRef = React.useRef([]);
  var measurements = React.useMemo(function() {
    var min2 = pendingMeasuredCacheIndexesRef.current.length > 0 ? Math.min.apply(Math, pendingMeasuredCacheIndexesRef.current) : 0;
    pendingMeasuredCacheIndexesRef.current = [];
    var measurements2 = latestRef.current.measurements.slice(0, min2);
    for (var i = min2; i < size; i++) {
      var key = keyExtractor(i);
      var measuredSize = measuredCache[key];
      var _start = measurements2[i - 1] ? measurements2[i - 1].end : paddingStart;
      var _size = typeof measuredSize === "number" ? measuredSize : estimateSize(i);
      var _end = _start + _size;
      measurements2[i] = {
        index: i,
        start: _start,
        size: _size,
        end: _end,
        key
      };
    }
    return measurements2;
  }, [estimateSize, measuredCache, paddingStart, size, keyExtractor]);
  var totalSize = (((_measurements = measurements[size - 1]) == null ? void 0 : _measurements.end) || paddingStart) + paddingEnd;
  latestRef.current.measurements = measurements;
  latestRef.current.totalSize = totalSize;
  var element = onScrollElement ? onScrollElement.current : parentRef.current;
  var scrollOffsetFnRef = React.useRef(scrollOffsetFn);
  scrollOffsetFnRef.current = scrollOffsetFn;
  useIsomorphicLayoutEffect(function() {
    if (!element) {
      setScrollOffset(0);
      return;
    }
    var onScroll = function onScroll2(event) {
      var offset = scrollOffsetFnRef.current ? scrollOffsetFnRef.current(event) : element[scrollKey];
      setScrollOffset(offset);
    };
    onScroll();
    element.addEventListener("scroll", onScroll, {
      capture: false,
      passive: true
    });
    return function() {
      element.removeEventListener("scroll", onScroll);
    };
  }, [element, scrollKey]);
  var _calculateRange = calculateRange(latestRef.current), start = _calculateRange.start, end = _calculateRange.end;
  var indexes = React.useMemo(function() {
    return rangeExtractor({
      start,
      end,
      overscan,
      size: measurements.length
    });
  }, [start, end, overscan, measurements.length, rangeExtractor]);
  var measureSizeRef = React.useRef(measureSize);
  measureSizeRef.current = measureSize;
  var virtualItems = React.useMemo(function() {
    var virtualItems2 = [];
    var _loop = function _loop2(k2, len2) {
      var i = indexes[k2];
      var measurement = measurements[i];
      var item = _extends(_extends({}, measurement), {}, {
        measureRef: function measureRef(el) {
          if (el) {
            var measuredSize = measureSizeRef.current(el, horizontal);
            if (measuredSize !== item.size) {
              var _scrollOffset = latestRef.current.scrollOffset;
              if (item.start < _scrollOffset) {
                defaultScrollToFn(_scrollOffset + (measuredSize - item.size));
              }
              pendingMeasuredCacheIndexesRef.current.push(i);
              setMeasuredCache(function(old) {
                var _extends2;
                return _extends(_extends({}, old), {}, (_extends2 = {}, _extends2[item.key] = measuredSize, _extends2));
              });
            }
          }
        }
      });
      virtualItems2.push(item);
    };
    for (var k = 0, len = indexes.length; k < len; k++) {
      _loop(k);
    }
    return virtualItems2;
  }, [indexes, defaultScrollToFn, horizontal, measurements]);
  var mountedRef = React.useRef(false);
  useIsomorphicLayoutEffect(function() {
    if (mountedRef.current) {
      setMeasuredCache({});
    }
    mountedRef.current = true;
  }, [estimateSize]);
  var scrollToOffset = React.useCallback(function(toOffset, _temp) {
    var _ref2 = _temp === void 0 ? {} : _temp, _ref2$align = _ref2.align, align = _ref2$align === void 0 ? "start" : _ref2$align;
    var _latestRef$current = latestRef.current, scrollOffset2 = _latestRef$current.scrollOffset, outerSize2 = _latestRef$current.outerSize;
    if (align === "auto") {
      if (toOffset <= scrollOffset2) {
        align = "start";
      } else if (toOffset >= scrollOffset2 + outerSize2) {
        align = "end";
      } else {
        align = "start";
      }
    }
    if (align === "start") {
      scrollToFn(toOffset);
    } else if (align === "end") {
      scrollToFn(toOffset - outerSize2);
    } else if (align === "center") {
      scrollToFn(toOffset - outerSize2 / 2);
    }
  }, [scrollToFn]);
  var tryScrollToIndex = React.useCallback(function(index, _temp2) {
    var _ref3 = _temp2 === void 0 ? {} : _temp2, _ref3$align = _ref3.align, align = _ref3$align === void 0 ? "auto" : _ref3$align, rest = _objectWithoutPropertiesLoose(_ref3, ["align"]);
    var _latestRef$current2 = latestRef.current, measurements2 = _latestRef$current2.measurements, scrollOffset2 = _latestRef$current2.scrollOffset, outerSize2 = _latestRef$current2.outerSize;
    var measurement = measurements2[Math.max(0, Math.min(index, size - 1))];
    if (!measurement) {
      return;
    }
    if (align === "auto") {
      if (measurement.end >= scrollOffset2 + outerSize2) {
        align = "end";
      } else if (measurement.start <= scrollOffset2) {
        align = "start";
      } else {
        return;
      }
    }
    var toOffset = align === "center" ? measurement.start + measurement.size / 2 : align === "end" ? measurement.end : measurement.start;
    scrollToOffset(toOffset, _extends({
      align
    }, rest));
  }, [scrollToOffset, size]);
  var scrollToIndex = React.useCallback(function() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    tryScrollToIndex.apply(void 0, args);
    requestAnimationFrame(function() {
      tryScrollToIndex.apply(void 0, args);
    });
  }, [tryScrollToIndex]);
  return {
    virtualItems,
    totalSize,
    scrollToOffset,
    scrollToIndex,
    measure
  };
}
var findNearestBinarySearch = function findNearestBinarySearch2(low, high, getCurrentValue, value) {
  while (low <= high) {
    var middle = (low + high) / 2 | 0;
    var currentValue = getCurrentValue(middle);
    if (currentValue < value) {
      low = middle + 1;
    } else if (currentValue > value) {
      high = middle - 1;
    } else {
      return middle;
    }
  }
  if (low > 0) {
    return low - 1;
  } else {
    return 0;
  }
};
function calculateRange(_ref4) {
  var measurements = _ref4.measurements, outerSize = _ref4.outerSize, scrollOffset = _ref4.scrollOffset;
  var size = measurements.length - 1;
  var getOffset = function getOffset2(index) {
    return measurements[index].start;
  };
  var start = findNearestBinarySearch(0, size, getOffset, scrollOffset);
  var end = start;
  while (end < size && measurements[end].end < scrollOffset + outerSize) {
    end++;
  }
  return {
    start,
    end
  };
}
function Table({ slug, resizable, children, className, columns, data, initialState, returnTable }) {
  var _a, _b;
  const [rowSelection, setRowSelection] = reactExports.useState({});
  const [containerWidth, setContainerWidth] = reactExports.useState();
  const [columnVisibility, setColumnVisibility] = reactExports.useState((initialState == null ? void 0 : initialState.columnVisibility) || {});
  const tableContainerRef = reactExports.useRef();
  const getColumnState = reactExports.useCallback(() => {
    get(slug).then(async (dbData) => {
      if ((dbData == null ? void 0 : dbData.columnVisibility) && Object.keys(dbData == null ? void 0 : dbData.columnVisibility).length) {
        await setColumnVisibility(dbData == null ? void 0 : dbData.columnVisibility);
      }
    });
  }, [slug]);
  reactExports.useEffect(() => {
    var _a2;
    getColumnState();
    setContainerWidth((_a2 = tableContainerRef.current) == null ? void 0 : _a2.clientWidth);
    const menuWidth = document.querySelector(".urlslab-mainmenu").clientWidth + document.querySelector("#adminmenuwrap").clientWidth;
    const resizeWatcher = new ResizeObserver(([entry]) => {
      if (entry.borderBoxSize && tableContainerRef.current) {
        tableContainerRef.current.style.width = `${document.querySelector("#wpadminbar").clientWidth - menuWidth - 54}px`;
      }
    });
    resizeWatcher.observe(document.querySelector("#wpadminbar"));
  }, [getColumnState, setContainerWidth]);
  const table = useReactTable({
    columns,
    data,
    defaultColumn: {
      minSize: resizable ? 80 : 24,
      size: resizable ? 100 : 24
    },
    initialState,
    state: {
      rowSelection,
      columnVisibility
    },
    columnResizeMode: "onChange",
    enableRowSelection: true,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel()
  });
  if (table && returnTable) {
    returnTable(table);
  }
  const tbody = [];
  const { rows } = table == null ? void 0 : table.getRowModel();
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows == null ? void 0 : rows.length,
    overscan: 10
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;
  const paddingTop = (virtualRows == null ? void 0 : virtualRows.length) > 0 ? ((_a = virtualRows == null ? void 0 : virtualRows[0]) == null ? void 0 : _a.start) || 0 : 0;
  const paddingBottom = (virtualRows == null ? void 0 : virtualRows.length) > 0 ? totalSize - (((_b = virtualRows == null ? void 0 : virtualRows[virtualRows.length - 1]) == null ? void 0 : _b.end) || 0) : 0;
  for (const virtualRow of virtualRows) {
    const row = rows[virtualRow == null ? void 0 : virtualRow.index];
    tbody.push(
      /* @__PURE__ */ React.createElement("tr", { key: row.id, className: row.getIsSelected() ? "selected" : "" }, row.getVisibleCells().map((cell) => {
        const tooltip = cell.column.columnDef.tooltip;
        return cell.column.getIsVisible() && /* @__PURE__ */ React.createElement(
          "td",
          {
            key: cell.id,
            className: cell.column.columnDef.className,
            style: {
              width: cell.column.getSize() !== 0 && resizable ? cell.column.getSize() : void 0
            }
          },
          tooltip ? flexRender(tooltip, cell.getContext()) : null,
          /* @__PURE__ */ React.createElement("div", { className: "limit" }, flexRender(cell.column.columnDef.cell, cell.getContext()))
        );
      }))
    );
  }
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-table-container", ref: tableContainerRef, style: {
    width: resizable ? `${containerWidth}px` : "auto",
    "--tableContainerWidth": `${containerWidth}px`
  } }, containerWidth ? /* @__PURE__ */ React.createElement("table", { className: `urlslab-table ${className} ${resizable ? "resizable" : ""}`, style: {
    width: table.getCenterTotalSize()
  } }, /* @__PURE__ */ React.createElement("thead", { className: "urlslab-table-head" }, table.getHeaderGroups().map((headerGroup) => /* @__PURE__ */ React.createElement("tr", { className: "urlslab-table-head-row", key: headerGroup.id }, headerGroup.headers.map((header) => /* @__PURE__ */ React.createElement(
    "th",
    {
      key: header.id,
      className: header.column.columnDef.className,
      style: {
        position: resizable ? "absolute" : "relative",
        left: resizable ? header.getStart() : "0",
        width: header.getSize() !== 0 ? header.getSize() : ""
      }
    },
    header.isPlaceholder ? null : flexRender(
      header.column.columnDef.header,
      header.getContext()
    ),
    resizable && header.column.columnDef.enableResizing !== false ? /* @__PURE__ */ React.createElement(
      "div",
      {
        ...{
          onMouseDown: header.getResizeHandler(),
          onTouchStart: header.getResizeHandler(),
          className: `resizer ${header.column.getIsResizing() ? "isResizing" : ""}`
        }
      }
    ) : null
  ))))), /* @__PURE__ */ React.createElement("tbody", { className: "urlslab-table-body" }, paddingTop > 0 && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { style: { height: `${paddingTop}px` } })), tbody, paddingBottom > 0 && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { style: { height: `${paddingBottom}px` } })))) : null, children);
}
async function deleteAll(slug) {
  try {
    const result = await fetch(wpApiSettings.root + `urlslab/v1${slug ? `/${slug}/delete-all` : ""}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "X-WP-Nonce": window.wpApiSettings.nonce
      },
      credentials: "include"
    });
    return result;
  } catch (error) {
    return false;
  }
}
async function deleteRow(slug) {
  try {
    const result = await fetch(wpApiSettings.root + `urlslab/v1${slug ? `/${slug}` : ""}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "X-WP-Nonce": window.wpApiSettings.nonce
      },
      credentials: "include"
    });
    return result;
  } catch (error) {
    return false;
  }
}
function filterReducer(state, action) {
  const { filterObj: filterObj2 } = state;
  switch (action.type) {
    case "setFilterKey":
      return {
        ...state,
        filterObj: { ...filterObj2, filterKey: action.key }
      };
    case "setFilterOp":
      return {
        ...state,
        filterObj: { ...filterObj2, filterOp: action.op }
      };
    case "setFilterVal":
      return {
        ...state,
        filterObj: { ...filterObj2, filterVal: action.val }
      };
    case "setFilterValMenu":
      return {
        ...state,
        filterObj: { ...filterObj2, filterValMenu: action.filterValMenu }
      };
    case "setKeyType":
      return {
        ...state,
        filterObj: { ...filterObj2, keyType: action.keyType }
      };
    case "setFilters":
      return {
        ...state,
        filters: action.filters
      };
    case "setFilteringState":
      return {
        ...state,
        filteringState: action.filteringState
      };
    case "possibleFilters":
      return {
        ...state,
        possibleFilters: action.possibleFilters
      };
    case "toggleEditFilter":
      return {
        ...state,
        editFilter: action.editFilter
      };
    default:
      return state;
  }
}
const filterObj = {
  filterKey: void 0,
  filterOp: void 0,
  filterVal: void 0,
  filterValMenu: void 0,
  keyType: void 0
};
function useFilter({ slug, header, initialRow }) {
  const queryClient = useQueryClient();
  const runFilter = reactExports.useRef(false);
  const possiblefilters = reactExports.useRef({ ...header });
  const [state, dispatch] = reactExports.useReducer(filterReducer, { filters: {}, filteringState: void 0, possiblefilters: possiblefilters.current, filterObj, editFilterActive: false });
  const activefilters = state.filters ? Object.keys(state.filters) : null;
  const getQueryData = reactExports.useCallback(() => {
    dispatch({ type: "setFilteringState", filteringState: queryClient.getQueryData([slug, "filters"]) });
  }, [dispatch, slug, queryClient]);
  reactExports.useEffect(() => {
    var _a, _b;
    getQueryData();
    if (state == null ? void 0 : state.possiblefilters) {
      possiblefilters.current = state == null ? void 0 : state.possiblefilters;
    }
    if ((_a = state.filteringState) == null ? void 0 : _a.filters) {
      dispatch({
        type: "setFilters",
        filters: (_b = state.filteringState) == null ? void 0 : _b.filters
      });
    }
  }, [getQueryData, state.possiblefilters, state.filteringState]);
  function addFilter(key, value) {
    if (value) {
      dispatch({ type: "setFilters", filters: { ...state.filters, [key]: value } });
    }
    if (!value) {
      removefilters([key]);
    }
  }
  const handleType = (key, sendCellOptions) => {
    const testDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2} ?[0-9]{2}:/g;
    const cell = initialRow == null ? void 0 : initialRow.getVisibleCells().find((cellItem) => cellItem.column.id === key);
    const cellValue = initialRow == null ? void 0 : initialRow.original[key];
    const cellfilterValMenu = cell == null ? void 0 : cell.column.columnDef.filterValMenu;
    if (cellfilterValMenu) {
      dispatch({ type: "setKeyType", keyType: "menu" });
      dispatch({ type: "setFilterValMenu", filterValMenu: cellfilterValMenu });
      if (sendCellOptions) {
        sendCellOptions(cellfilterValMenu);
      }
      return cellfilterValMenu;
    }
    if (testDate.test(cellValue)) {
      dispatch({ type: "setKeyType", keyType: "date" });
      return "date";
    }
    if (typeof (initialRow == null ? void 0 : initialRow.original[key]) === "number") {
      dispatch({ type: "setKeyType", keyType: "number" });
      return "number";
    }
    if (key === "lang") {
      dispatch({ type: "setKeyType", keyType: "lang" });
      return "lang";
    }
    if (typeof (initialRow == null ? void 0 : initialRow.original[key]) === "boolean") {
      dispatch({ type: "setKeyType", keyType: "boolean" });
      return "boolean";
    }
    dispatch({ type: "setKeyType", keyType: "string" });
    return "string";
  };
  function handleSaveFilter(filterParams) {
    const { filterKey, filterOp, filterVal, filterValMenu, keyType } = filterParams;
    let key = filterKey;
    const op = filterOp;
    const val = filterVal;
    if (!key) {
      key = Object.keys(state.possiblefilters)[0];
    }
    delete state.possiblefilters[key];
    dispatch({ type: "possiblefilters", possiblefilters: possiblefilters.current });
    dispatch({ type: "toggleEditFilter", editFilter: false });
    if (!op) {
      addFilter(key, val);
    }
    if (op) {
      addFilter(key, { op, val, keyType });
    }
    if (op && filterValMenu) {
      addFilter(key, { op, val, keyType, filterValMenu });
    }
    runFilter.current = true;
  }
  function removefilters(keyArray) {
    const getfilters = () => {
      const filtersCopy = { ...state.filters };
      keyArray.map((key) => {
        delete filtersCopy[key];
        return false;
      });
      return filtersCopy;
    };
    dispatch({ type: "setFilters", filters: getfilters() });
  }
  function handleRemoveFilter(keysArray) {
    if ((keysArray == null ? void 0 : keysArray.length) === 1) {
      const key = keysArray[0];
      const newHeader = { ...header };
      const usedfilters = activefilters.filter((k) => k !== key);
      usedfilters.map((k) => {
        delete newHeader[k];
        return false;
      });
      possiblefilters.current = newHeader;
    }
    if ((keysArray == null ? void 0 : keysArray.length) > 1) {
      possiblefilters.current = { ...header };
    }
    removefilters(keysArray);
    runFilter.current = true;
  }
  if (runFilter.current) {
    runFilter.current = false;
    queryClient.setQueryData([slug, "filters"], { filters: state.filters, possiblefilters: possiblefilters.current });
  }
  return { filters: state.filters, possiblefilters: possiblefilters.current, filteringState: state.filteringState, addFilter, removefilters, state, dispatch, handleType, handleSaveFilter, handleRemoveFilter };
}
function useSorting({ slug }) {
  const [sorting, setSorting] = reactExports.useState([]);
  const runSorting = reactExports.useRef(false);
  const queryClient = useQueryClient();
  const getQueryData = reactExports.useCallback(() => {
    const sortingQuery = queryClient.getQueryData([slug, "sorting"]);
    if (sortingQuery) {
      setSorting(queryClient.getQueryData([slug, "sorting"]));
    }
  }, [slug, queryClient]);
  reactExports.useEffect(() => {
    getQueryData();
  }, [getQueryData]);
  function sortBy(th) {
    const { header } = th;
    const key = header.id;
    setSorting(
      (currentSorting) => {
        const objFromArr = currentSorting.filter((k) => k.key)[0];
        const cleanArr = currentSorting.filter((k) => !k.key);
        if (objFromArr && (objFromArr == null ? void 0 : objFromArr.dir) === "ASC") {
          return [{ key, dir: "DESC", op: "<" }, ...cleanArr];
        }
        if (objFromArr && (objFromArr == null ? void 0 : objFromArr.dir) === "DESC") {
          return cleanArr;
        }
        return [{ key, dir: "ASC", op: ">" }, ...currentSorting];
      }
    );
    runSorting.current = true;
  }
  if (runSorting.current) {
    runSorting.current = false;
    queryClient.setQueryData([slug, "sorting"], sorting);
  }
  return { sorting, sortBy };
}
const SvgIconPlus = (props2) => /* @__PURE__ */ reactExports.createElement("svg", { width: "100%", height: "100%", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", xmlSpace: "preserve", "xmlns:serif": "http://www.serif.com/", style: {
  fillRule: "evenodd",
  clipRule: "evenodd",
  strokeLinejoin: "round",
  strokeMiterlimit: 2
}, ...props2 }, /* @__PURE__ */ reactExports.createElement("g", { id: "Artboard1", transform: "matrix(0.640269,0,0,0.584735,-248.54,-164.228)" }, /* @__PURE__ */ reactExports.createElement("rect", { x: 388.181, y: 280.859, width: 37.484, height: 41.044, style: {
  fill: "none"
} }), /* @__PURE__ */ reactExports.createElement("clipPath", { id: "_clip1" }, /* @__PURE__ */ reactExports.createElement("rect", { x: 388.181, y: 280.859, width: 37.484, height: 41.044 })), /* @__PURE__ */ reactExports.createElement("g", { clipPath: "url(#_clip1)" }, /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(3.25946,0,0,3.56902,-896.862,-749.123)" }, /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(1,0,0,1,393.349,287.84)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M5.901,1.5L5.901,11.5C5.901,11.914 6.237,12.25 6.651,12.25C7.065,12.25 7.401,11.914 7.401,11.5L7.401,1.5C7.401,1.086 7.065,0.75 6.651,0.75C6.237,0.75 5.901,1.086 5.901,1.5Z" })), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(1,0,0,1,393.349,287.84)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M1.651,7.251L11.651,7.251C12.065,7.251 12.401,6.915 12.401,6.501C12.402,6.087 12.065,5.751 11.652,5.751L1.651,5.751C1.237,5.751 0.901,6.087 0.901,6.501C0.901,6.915 1.237,7.251 1.651,7.251Z" }))))));
const numericOp = {
  exactly: "is exactly",
  "<>": "is not equal",
  IN: "is one of",
  NOTIN: "is not one of",
  BETWEEN: "is between",
  ">": "is larger than",
  "<": "is smaller than"
};
const dateOp = {
  exactly: "is exactly",
  "<>": "is not equal",
  // BETWEEN: 'is between', //Disabled for now
  ">": "is after",
  "<": "is before"
};
const menuOp = {
  exactly: "is",
  "<>": "is not"
};
const langOp = {
  exactly: "is",
  "<>": "is not"
  // IN: 'is one of',
};
const stringOp = {
  LIKE: "contains",
  NOTLIKE: "doesn't contain",
  exactly: "is exactly",
  "<>": "is not",
  "LIKE%": "begins with",
  "NOTLIKE%": "doesn't begin with",
  "%LIKE": "ends with",
  "NOT%LIKE": "doesn't end with",
  IN: "is one of",
  NOTIN: "is not one of",
  ">": "is longer than",
  "<": "is shorter than"
};
const booleanTypes = {
  true: "Checked",
  false: "Unchecked"
};
function TableFilterPanel({ props: props2, onEdit }) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v;
  const currentDate = /* @__PURE__ */ new Date();
  const { key, slug, header, possiblefilters, initialRow, filters } = props2;
  const { __ } = useI18n();
  const [filterValMenu, setFilterValMenu] = reactExports.useState();
  const [date, setDate] = reactExports.useState(((_a = filters[key]) == null ? void 0 : _a.val) ? new Date((_b = filters[key]) == null ? void 0 : _b.val) : currentDate);
  const [startDate, setStartDate] = reactExports.useState(((_d = (_c = filters[key]) == null ? void 0 : _c.val) == null ? void 0 : _d.min) ? new Date((_e = filters[key]) == null ? void 0 : _e.val.min) : currentDate.setDate(currentDate.getDate() - 2));
  const [endDate, setEndDate] = reactExports.useState(((_g = (_f = filters[key]) == null ? void 0 : _f.val) == null ? void 0 : _g.max) ? new Date((_h = filters[key]) == null ? void 0 : _h.val.max) : currentDate);
  const { state, dispatch, handleType } = useFilter({ slug, header, initialRow });
  const cellUnit = (_k = (_j = (_i = initialRow == null ? void 0 : initialRow.getVisibleCells()) == null ? void 0 : _i.filter((cell) => {
    var _a2;
    return ((_a2 = cell.column) == null ? void 0 : _a2.id) === state.filterObj.filterKey;
  })[0]) == null ? void 0 : _j.column) == null ? void 0 : _k.columnDef.unit;
  const notBetween = reactExports.useMemo(() => {
    var _a2, _b2, _c2;
    return ((_a2 = Object.keys(filters)) == null ? void 0 : _a2.length) && ((_b2 = filters[key]) == null ? void 0 : _b2.op) ? ((_c2 = filters[key]) == null ? void 0 : _c2.op) !== "BETWEEN" : state.filterObj.filterOp !== "BETWEEN";
  }, [filters, key, state.filterObj.filterOp]);
  const handleKeyChange = reactExports.useCallback((keyParam) => {
    dispatch({ type: "setFilterKey", key: keyParam });
    handleType(keyParam, (cellOptions) => setFilterValMenu(cellOptions));
  }, [dispatch, handleType]);
  const handleOnEdit = reactExports.useCallback((val) => {
    onEdit(val);
  }, [onEdit]);
  reactExports.useEffect(() => {
    var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2, _j2, _k2, _l2;
    if (state.filterObj.keyType === void 0) {
      dispatch({ type: "setFilterKey", key: key || Object.keys(possiblefilters)[0] });
      handleType(key || Object.keys(possiblefilters)[0], (cellOptions) => setFilterValMenu(cellOptions));
    }
    if (state.filterObj.keyType === "string") {
      dispatch({ type: "setFilterOp", op: ((_a2 = filters[key]) == null ? void 0 : _a2.op) || "LIKE" });
      dispatch({ type: "setFilterVal", val: (_b2 = filters[key]) == null ? void 0 : _b2.val });
    }
    if (state.filterObj.keyType === "date") {
      dispatch({ type: "setFilterOp", op: ((_c2 = filters[key]) == null ? void 0 : _c2.op) || "exactly" });
      dispatch({ type: "setFilterVal", val: (_d2 = filters[key]) == null ? void 0 : _d2.val });
    }
    if (state.filterObj.keyType === "number") {
      dispatch({ type: "setFilterOp", op: ((_e2 = filters[key]) == null ? void 0 : _e2.op) || "exactly" });
      dispatch({ type: "setFilterVal", val: (_f2 = filters[key]) == null ? void 0 : _f2.val });
    }
    if (state.filterObj.keyType === "menu") {
      dispatch({ type: "setFilterOp", op: ((_g2 = filters[key]) == null ? void 0 : _g2.op) || "exactly" });
      dispatch({ type: "setFilterVal", val: ((_h2 = filters[key]) == null ? void 0 : _h2.val) || Object.keys(filterValMenu)[0] });
    }
    if (state.filterObj.keyType === "boolean") {
      dispatch({ type: "setFilterOp", op: ((_i2 = filters[key]) == null ? void 0 : _i2.op) || "exactly" });
      dispatch({ type: "setFilterVal", val: ((_j2 = filters[key]) == null ? void 0 : _j2.val) || Object.keys(booleanTypes)[0] });
    }
    if (state.filterObj.keyType === "lang") {
      dispatch({ type: "setFilterOp", op: ((_k2 = filters[key]) == null ? void 0 : _k2.op) || "exactly" });
      dispatch({ type: "setFilterVal", val: ((_l2 = filters[key]) == null ? void 0 : _l2.val) || "all" });
    }
    window.addEventListener(
      "keyup",
      (event) => {
        if (event.key === "Escape") {
          onEdit(false);
        }
        if (event.key === "Enter" && state.filterObj.filterVal) {
          event.target.blur();
          onEdit(state.filterObj);
        }
      }
    );
  }, [state.filterObj.keyType]);
  return /* @__PURE__ */ React.createElement("div", { className: `urlslab-panel fadeInto urslab-floating-panel urslab-TableFilter-panel` }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel-header urslab-TableFilter-panel-header" }, /* @__PURE__ */ React.createElement("strong", null, __("Edit filter"), key ? ` ${header[key]}` : "")), /* @__PURE__ */ React.createElement("div", { className: "flex mt-m mb-m flex-align-center" }, /* @__PURE__ */ React.createElement(
    SortMenu,
    {
      className: "mr-s",
      items: key ? header : possiblefilters,
      name: "filters",
      checkedId: key || Object.keys(possiblefilters)[0],
      defaultAccept: true,
      autoClose: true,
      disabled: key ? true : false,
      onChange: handleKeyChange
    }
  ), state.filterObj.keyType && (((_l = filters[key]) == null ? void 0 : _l.op) || state.filterObj.filterOp) && /* @__PURE__ */ React.createElement(
    SortMenu,
    {
      className: "ml-s",
      key: ((_m = filters[key]) == null ? void 0 : _m.op) || state.filterObj.filterOp,
      items: state.filterObj.keyType === "date" && dateOp || state.filterObj.keyType === "number" && numericOp || state.filterObj.keyType === "string" && stringOp || state.filterObj.keyType === "lang" && langOp || state.filterObj.keyType === "menu" && menuOp || state.filterObj.keyType === "boolean" && menuOp,
      name: "filter_ops",
      defaultAccept: true,
      autoClose: true,
      checkedId: ((_n = filters[key]) == null ? void 0 : _n.op) || state.filterObj.filterOp,
      onChange: (op) => dispatch({ type: "setFilterOp", op })
    }
  )), /* @__PURE__ */ React.createElement("div", null, state.filterObj.keyType === "lang" && /* @__PURE__ */ React.createElement(LangMenu, { autoClose: true, multiSelect: state.filterObj.filterOp === "IN", checkedId: ((_o = filters[key]) == null ? void 0 : _o.val) || "all", defaultAccept: true, onChange: (val) => dispatch({ type: "setFilterVal", val }) }), state.filterObj.keyType === "menu" && /* @__PURE__ */ React.createElement(
    SortMenu,
    {
      items: filterValMenu,
      name: "menu_vals",
      defaultAccept: true,
      autoClose: true,
      checkedId: ((_p = filters[key]) == null ? void 0 : _p.val) || Object.keys(filterValMenu)[0],
      onChange: (val) => dispatch({ type: "setFilterVal", val })
    }
  ), state.filterObj.keyType === "boolean" && /* @__PURE__ */ React.createElement(
    SortMenu,
    {
      items: booleanTypes,
      name: "boolean_vals",
      defaultAccept: true,
      autoClose: true,
      checkedId: ((_q = filters[key]) == null ? void 0 : _q.val) || Object.keys(booleanTypes)[0],
      onChange: (val) => dispatch({ type: "setFilterVal", val })
    }
  ), state.filterObj.keyType === "string" && notBetween && /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, autoFocus: true, defaultValue: (_r = filters[key]) == null ? void 0 : _r.val, placeholder: state.filterObj.filterOp === "IN" ? "enter ie. 0,10,15,20" : "Enter search term", onChange: (val) => dispatch({ type: "setFilterVal", val }) }), state.filterObj.keyType === "number" && notBetween && /* @__PURE__ */ React.createElement(InputField, { type: "number", liveUpdate: true, autoFocus: true, defaultValue: cellUnit === "kB" ? ((_s = filters[key]) == null ? void 0 : _s.val) / 1024 : (_t = filters[key]) == null ? void 0 : _t.val, placeholder: state.filterObj.filterOp === "IN" ? "enter ie. 0,10,15,20" : `Enter size ${cellUnit && "in " + cellUnit}`, onChange: (val) => dispatch({ type: "setFilterVal", val: cellUnit === "kB" ? val * 1024 : val }) }), state.filterObj.keyType === "date" && notBetween && // Datepicker not between
  /* @__PURE__ */ React.createElement("div", { className: "urlslab-inputField-datetime" }, /* @__PURE__ */ React.createElement(
    Ht,
    {
      className: "urlslab-input",
      selected: date,
      dateFormat: "dd. MMMM yyyy, HH:mm",
      timeFormat: "HH:mm",
      showTimeSelect: true,
      onChange: (val) => {
        setDate(new Date(val));
        dispatch({ type: "setFilterVal", val: val.toISOString().replace(/^(.+?)T(.+?)\..+$/g, "$1 $2") });
      }
    }
  )), state.filterObj.keyType === "date" && !notBetween && // Datepicker between range
  /* @__PURE__ */ React.createElement("div", { className: "urlslab-datetime-range" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-inputField-datetime" }, /* @__PURE__ */ React.createElement(
    Ht,
    {
      className: "urlslab-input",
      selected: startDate,
      dateFormat: "dd. MMMM yyyy, HH:mm",
      timeFormat: "HH:mm",
      showTimeSelect: true,
      selectsStart: true,
      startDate,
      endDate,
      maxDate: endDate,
      onChange: (val) => {
        setStartDate(new Date(val));
        dispatch({ type: "setFilterVal", val: { ...state.filterObj.filterVal, min: val.toISOString().replace(/^(.+?)T(.+?)\..+$/g, "$1 $2") } });
      }
    }
  )), "—", /* @__PURE__ */ React.createElement("div", { className: "urlslab-inputField-datetime" }, /* @__PURE__ */ React.createElement(
    Ht,
    {
      className: "urlslab-input",
      selected: endDate,
      dateFormat: "dd. MMMM yyyy, HH:mm",
      timeFormat: "HH:mm",
      selectsEnd: true,
      showTimeSelect: true,
      startDate,
      endDate,
      minDate: startDate,
      onChange: (val) => {
        setEndDate(new Date(val));
        dispatch({ type: "setFilterVal", val: { ...state.filterObj.filterVal, max: val.toISOString().replace(/^(.+?)T(.+?)\..+$/g, "$1 $2") } });
      }
    }
  ))), state.filterObj.keyType === "number" && !notBetween && /* @__PURE__ */ React.createElement(
    RangeInputs,
    {
      liveUpdate: true,
      unit: cellUnit,
      defaultMin: (_u = filters[key]) == null ? void 0 : _u.val.min,
      defaultMax: (_v = filters[key]) == null ? void 0 : _v.val.max,
      onChange: (val) => dispatch({ type: "setFilterVal", val })
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "Buttons mt-m flex flex-align-center" }, /* @__PURE__ */ React.createElement(Button, { className: "ma-left simple wide", onClick: () => handleOnEdit(false) }, __("Cancel")), /* @__PURE__ */ React.createElement(Button, { active: true, className: "wide", disabled: state.filterObj.filterVal ? false : true, onClick: () => handleOnEdit(state.filterObj) }, __("Save"))));
}
function TableFilter({ props: props2, onEdit, onRemove }) {
  const { __ } = useI18n();
  const panelPopover = reactExports.useRef();
  const { filters, possiblefilters, state, slug, header, initialRow } = props2;
  const [editFilter, activateEditing] = reactExports.useState();
  const activefilters = Object.keys(filters).length ? Object.keys(filters) : null;
  const close = reactExports.useCallback(() => {
    activateEditing();
  }, []);
  useClickOutside(panelPopover, close);
  const operatorTypes = {
    date: dateOp,
    number: numericOp,
    string: stringOp,
    lang: langOp,
    menu: menuOp,
    boolean: menuOp
  };
  const handleOnEdit = reactExports.useCallback((val) => {
    activateEditing();
    onEdit(val);
  }, [onEdit]);
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-align-center flex-wrap" }, header && (activefilters == null ? void 0 : activefilters.map((key, index) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
    return /* @__PURE__ */ React.createElement(
      Button,
      {
        key,
        active: editFilter === key ? true : false,
        className: `outline ${index > 0 && "ml-s"} pos-relative`,
        onClick: () => !state.editFilter && !editFilter && activateEditing(key)
      },
      /* @__PURE__ */ React.createElement("div", { className: "flex" }, header[key], ": ", /* @__PURE__ */ React.createElement("span", { className: "regular flex flex-align-center" }, /* @__PURE__ */ React.createElement("span", { className: "fs-xs" }, operatorTypes[(_a = filters[key]) == null ? void 0 : _a.keyType][(_b = filters[key]) == null ? void 0 : _b.op]), "  “", /* @__PURE__ */ React.createElement("span", { className: "limit-20" }, ((_c = filters[key]) == null ? void 0 : _c.op) === "BETWEEN" && `min: ${(_d = filters[key]) == null ? void 0 : _d.val.min}, max: ${(_e = filters[key]) == null ? void 0 : _e.val.max}`, key === "lang" && langName((_f = filters == null ? void 0 : filters.lang) == null ? void 0 : _f.val), ((_g = filters[key]) == null ? void 0 : _g.op) !== "BETWEEN" && key !== "lang" && ((_h = filters[key]) == null ? void 0 : _h.filterValMenu) ? (_j = filters[key]) == null ? void 0 : _j.filterValMenu[(_i = filters[key]) == null ? void 0 : _i.val] : (_k = filters[key]) == null ? void 0 : _k.val), "”"), /* @__PURE__ */ React.createElement(Tooltip, { className: "showOnHover" }, __("Edit filter"))),
      /* @__PURE__ */ React.createElement("div", { className: "flex flex-align-center" }, /* @__PURE__ */ React.createElement(SvgIconClose, { className: "close", onClick: () => {
        onRemove([key]);
      } }), /* @__PURE__ */ React.createElement(Tooltip, { className: "showOnHover", style: { width: "8em" } }, __("Delete filter"))),
      editFilter === key && // Edit filter panel
      /* @__PURE__ */ React.createElement(TableFilterPanel, { ref: panelPopover, key, props: { key, slug, header, initialRow, possiblefilters, filters }, onEdit: handleOnEdit })
    );
  })), (activefilters == null ? void 0 : activefilters.length) > 0 && // Removes all used filters in given table
  /* @__PURE__ */ React.createElement(Button, { className: "simple underline", onClick: () => {
    onRemove(activefilters);
  } }, __("Clear filters")));
}
function useChangeRow({ data, url, slug, paginationId }) {
  const queryClient = useQueryClient();
  const [rowValue, setRow] = reactExports.useState();
  const [insertRowResult, setInsertRowRes] = reactExports.useState(false);
  const [selectedRows, setSelectedRows] = reactExports.useState([]);
  const [responseCounter, setResponseCounter] = reactExports.useState(0);
  const { filters, sorting } = url;
  const getRowId = reactExports.useCallback((cell, optionalSelector) => {
    if (optionalSelector) {
      return `${cell.row.original[paginationId]}/${cell.row.original[optionalSelector]}`;
    }
    return cell.row.original[paginationId];
  }, [paginationId]);
  const getRow = (cell) => {
    return cell.row.original;
  };
  const insertNewRow = useMutation({
    mutationFn: async ({ rowToInsert }) => {
      const response = await postFetch(`${slug}/create`, rowToInsert);
      return { response };
    },
    onSuccess: async ({ response }) => {
      const { ok } = await response;
      if (ok) {
        queryClient.invalidateQueries([slug, filtersArray(filters), sorting]);
        setInsertRowRes(response);
      }
    }
  });
  const insertRow = ({ rowToInsert }) => {
    insertNewRow.mutate({ rowToInsert });
  };
  const processDeletedPages = reactExports.useCallback((cell) => {
    let deletedPagesArray = data == null ? void 0 : data.pages;
    if (cell.row.getIsSelected()) {
      cell.row.toggleSelected();
    }
    setSelectedRows([]);
    return deletedPagesArray = deletedPagesArray.map((page) => page.filter((row) => row[paginationId] !== getRowId(cell))) ?? [];
  }, [data == null ? void 0 : data.pages, getRowId, paginationId]);
  const deleteSelectedRow = useMutation({
    mutationFn: async (options) => {
      const { deletedPagesArray, cell, optionalSelector } = options;
      queryClient.setQueryData([slug, filtersArray(filters), sorting], (origData) => ({
        pages: deletedPagesArray,
        pageParams: origData.pageParams
      }));
      if (!selectedRows.length) {
        setRow(getRow(cell));
        setTimeout(() => {
          setRow();
        }, 3e3);
      }
      const response = await deleteRow(`${slug}/${getRowId(cell, optionalSelector)}`);
      return { response };
    },
    onSuccess: async ({ response }) => {
      const { ok } = response;
      if (ok) {
        setResponseCounter(responseCounter - 1);
      }
      if (responseCounter === 0 || responseCounter === 1) {
        await queryClient.invalidateQueries([slug, filtersArray(filters), sorting]);
        await queryClient.invalidateQueries([slug, "count"]);
      }
    }
  });
  const deleteRow$1 = reactExports.useCallback(({ cell, optionalSelector }) => {
    setResponseCounter(1);
    deleteSelectedRow.mutate({ deletedPagesArray: processDeletedPages(cell), cell, optionalSelector });
  }, [processDeletedPages, deleteSelectedRow]);
  const deleteSelectedRows = async (optionalSelector) => {
    setResponseCounter(selectedRows.length);
    selectedRows.map((cell) => {
      deleteSelectedRow.mutate({ deletedPagesArray: processDeletedPages(cell), cell, optionalSelector });
      return false;
    });
  };
  const updateRowData = useMutation({
    mutationFn: async (options) => {
      const { newVal, cell, customEndpoint, changeField, optionalSelector } = options;
      const cellId = cell.column.id;
      const newPagesArray = (data == null ? void 0 : data.pages.map(
        (page) => page.map(
          (row) => {
            if (row[paginationId] === getRowId(cell)) {
              row[cell.column.id] = newVal;
              return row;
            }
            return row;
          }
        )
      )) ?? [];
      queryClient.setQueryData([slug, filtersArray(filters), sorting], (origData) => ({
        pages: newPagesArray,
        pageParams: origData.pageParams
      }));
      if (changeField) {
        const response2 = await postFetch(`${slug}/${getRowId(cell, optionalSelector)}${customEndpoint || ""}`, { [changeField]: newVal });
        return response2;
      }
      const response = await postFetch(`${slug}/${getRowId(cell, optionalSelector)}${customEndpoint || ""}`, { [cellId]: newVal });
      return response;
    },
    onSuccess: (response) => {
      const { ok } = response;
      if (ok) {
        queryClient.invalidateQueries([slug, filtersArray(filters), sorting]);
      }
    }
  });
  const updateRow = ({ newVal, cell, customEndpoint, changeField, optionalSelector }) => {
    updateRowData.mutate({ newVal, cell, customEndpoint, changeField, optionalSelector });
  };
  const selectRow = (isSelected, cell) => {
    cell.row.toggleSelected();
    if (!isSelected) {
      setSelectedRows(selectedRows.filter((item) => item !== cell));
    }
    if (isSelected) {
      setSelectedRows(selectedRows.concat(cell));
    }
  };
  return { row: rowValue, selectedRows, insertRowResult, insertRow, selectRow, deleteRow: deleteRow$1, deleteSelectedRows, updateRow };
}
function useCloseModal(handlePanel) {
  const handleClose = (operationVal) => {
    document.querySelector("#urlslab-root").classList.remove("dark");
    return operationVal;
  };
  reactExports.useEffect(() => {
    window.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape") {
          handleClose(handlePanel());
        }
      }
    );
    document.querySelector("#urlslab-root").classList.add("dark");
  });
  return { CloseIcon: SvgIconClose, handleClose };
}
function InsertRowPanel({ insertOptions, handlePanel }) {
  var _a;
  const { __ } = useI18n();
  const enableAddButton = reactExports.useRef(false);
  const { CloseIcon, handleClose } = useCloseModal(handlePanel);
  const { inserterCells, title, text: text2, data, slug, url, paginationId, rowToInsert } = insertOptions || {};
  const flattenedData = (_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page ?? []);
  const { insertRowResult, insertRow } = useChangeRow({ data: flattenedData, url, slug, paginationId });
  const requiredFields = inserterCells && Object.keys(inserterCells).filter((cell) => inserterCells[cell].props.required === true);
  if (rowToInsert) {
    enableAddButton.current = requiredFields == null ? void 0 : requiredFields.every((key) => Object.keys(rowToInsert).includes(key));
  }
  if (!rowToInsert) {
    enableAddButton.current = false;
  }
  function hidePanel(response) {
    handleClose();
    enableAddButton.current = false;
    if (handlePanel && !response) {
      handlePanel("clearRow");
    }
    if (handlePanel && response) {
      handlePanel(response);
    }
  }
  function handleInsert() {
    insertRow({ rowToInsert });
  }
  if (insertRowResult == null ? void 0 : insertRowResult.ok) {
    setTimeout(() => {
      hidePanel("rowInserted");
    }, 100);
  }
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel-wrap urlslab-panel-floating fadeInto" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel-header" }, /* @__PURE__ */ React.createElement("h3", null, title), /* @__PURE__ */ React.createElement("button", { className: "urlslab-panel-close", onClick: hidePanel }, /* @__PURE__ */ React.createElement(CloseIcon, null)), /* @__PURE__ */ React.createElement("p", null, text2)), /* @__PURE__ */ React.createElement("div", { className: "mt-l" }, inserterCells && Object.entries(inserterCells).map(([cellId, cell]) => {
    return /* @__PURE__ */ React.createElement("div", { className: "mb-l", key: cellId }, cell);
  }), /* @__PURE__ */ React.createElement("div", { className: "flex" }, /* @__PURE__ */ React.createElement(Button, { className: "ma-left simple", onClick: hidePanel }, __("Cancel")), /* @__PURE__ */ React.createElement(Button, { active: true, disabled: !enableAddButton.current, onClick: handleInsert }, title)))));
}
var fileDownload = function(data, filename, mime, bom) {
  var blobData = typeof bom !== "undefined" ? [bom, data] : [data];
  var blob = new Blob(blobData, { type: mime || "application/octet-stream" });
  if (typeof window.navigator.msSaveBlob !== "undefined") {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    var blobURL = window.URL && window.URL.createObjectURL ? window.URL.createObjectURL(blob) : window.webkitURL.createObjectURL(blob);
    var tempLink = document.createElement("a");
    tempLink.style.display = "none";
    tempLink.href = blobURL;
    tempLink.setAttribute("download", filename);
    if (typeof tempLink.download === "undefined") {
      tempLink.setAttribute("target", "_blank");
    }
    document.body.appendChild(tempLink);
    tempLink.click();
    setTimeout(function() {
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(blobURL);
    }, 200);
  }
};
let lastRowId = "";
let dataForCSV = [];
let responseData = [];
let ended = false;
let totalItems = 1;
let jsonData = { status: "loading", data: [] };
async function exportCSV(options, result) {
  const { slug, url, paginationId, perPage = 9999, deleteCSVCols } = options;
  const { filters: userFilters } = url;
  const response = await postFetch(slug, {
    sorting: [{ col: paginationId, dir: "ASC" }],
    filters: lastRowId ? [
      {
        cond: "OR",
        filters: [
          { cond: "AND", filters: [{ col: paginationId, op: ">", val: lastRowId }] }
        ]
      },
      ...filtersArray(userFilters)
    ] : [...filtersArray(userFilters)],
    rows_per_page: perPage
  });
  responseData = await response.json() ?? [];
  if (!lastRowId) {
    const totalItemsRes = await postFetch(`${slug}/count`);
    totalItems = await totalItemsRes.json();
  }
  const prevDataLength = dataForCSV.length;
  dataForCSV.push(...responseData);
  if (responseData.length < perPage) {
    ended = true;
    if (deleteCSVCols == null ? void 0 : deleteCSVCols.length) {
      for (const obj of dataForCSV) {
        for (const field of deleteCSVCols) {
          delete obj[field];
        }
      }
    }
  }
  if (ended) {
    result(100);
    jsonData = { status: "done", data: dataForCSV };
    lastRowId = "";
    dataForCSV = [];
    ended = false;
    return jsonData;
  }
  if (totalItems && dataForCSV.length && dataForCSV.length > prevDataLength) {
    lastRowId = dataForCSV[(dataForCSV == null ? void 0 : dataForCSV.length) - 1][paginationId];
    result(`${Math.round(dataForCSV.length / totalItems * 100)}`);
    await exportCSV(options, result);
  }
  return jsonData;
}
const SvgIconExport = (props2) => /* @__PURE__ */ reactExports.createElement("svg", { width: "100%", height: "100%", viewBox: "0 0 20 21", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", xmlSpace: "preserve", "xmlns:serif": "http://www.serif.com/", style: {
  fillRule: "evenodd",
  clipRule: "evenodd",
  strokeLinejoin: "round",
  strokeMiterlimit: 2
}, ...props2 }, /* @__PURE__ */ reactExports.createElement("path", { d: "M7.5,17.25L4.167,17.25C3.924,17.25 3.69,17.153 3.519,16.982C3.518,16.981 3.518,16.981 3.518,16.981C3.347,16.81 3.25,16.576 3.25,16.333L3.25,4.667C3.25,4.424 3.347,4.19 3.518,4.018C3.518,4.018 3.518,4.018 3.518,4.018C3.69,3.847 3.924,3.75 4.167,3.75C4.167,3.75 7.5,3.75 7.5,3.75C7.914,3.75 8.25,3.414 8.25,3C8.25,2.586 7.914,2.25 7.5,2.25L4.167,2.25C3.526,2.25 2.911,2.505 2.458,2.958C2.005,3.411 1.75,4.026 1.75,4.667C1.75,4.667 1.75,16.333 1.75,16.333C1.75,16.974 2.005,17.589 2.458,18.042C2.911,18.495 3.526,18.75 4.167,18.75L7.5,18.75C7.914,18.75 8.25,18.414 8.25,18C8.25,17.586 7.914,17.25 7.5,17.25Z" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M13.864,15.197L18.03,11.03C18.171,10.89 18.25,10.699 18.25,10.5C18.25,10.301 18.171,10.11 18.03,9.97L13.864,5.803C13.571,5.51 13.096,5.51 12.803,5.803C12.51,6.096 12.51,6.571 12.803,6.864L16.439,10.5C16.439,10.5 12.803,14.136 12.803,14.136C12.51,14.429 12.51,14.904 12.803,15.197C13.096,15.49 13.571,15.49 13.864,15.197Z" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M17.5,9.75L7.5,9.75C7.086,9.75 6.75,10.086 6.75,10.5C6.75,10.914 7.086,11.25 7.5,11.25L17.5,11.25C17.914,11.25 18.25,10.914 18.25,10.5C18.25,10.086 17.914,9.75 17.5,9.75Z" }));
function ExportCSVButton({ options, className, withfilters, onClick }) {
  const { __ } = useI18n();
  function handleExport() {
    if (withfilters) {
      exportCSV(options, (status) => onClick(status)).then((response) => {
        if (onClick && response.status === "done") {
          const csv = P(
            response,
            {
              delimiter: ",",
              header: true
            }
          );
          fileDownload(csv, `${options.slug}.csv`);
        }
      });
    }
    if (!withfilters) {
      delete options.url.filters;
      exportCSV(options, (status) => onClick(status)).then((response) => {
        if (onClick && response.status === "done") {
          const csv = P(
            response,
            {
              delimiter: ",",
              header: true
            }
          );
          fileDownload(csv, `${options.slug}.csv`);
        }
      });
    }
  }
  return /* @__PURE__ */ React.createElement(
    Button,
    {
      className,
      active: true,
      onClick: handleExport
    },
    /* @__PURE__ */ React.createElement(SvgIconExport, null),
    withfilters ? __("Export Filtered") : __("Export All")
  );
}
function ExportPanel({ options, filters, header, handlePanel }) {
  const { __ } = useI18n();
  const activefilters = filters ? Object.keys(filters) : null;
  const [exportStatus, setExportStatus] = reactExports.useState();
  const { CloseIcon, handleClose } = useCloseModal(handlePanel);
  const hidePanel = (operation) => {
    handleClose();
    if (handlePanel) {
      handlePanel(operation);
    }
  };
  const handleExportStatus = (val) => {
    setExportStatus(val);
    if (val === 100) {
      setTimeout(() => {
        setExportStatus();
        hidePanel();
      }, 1e3);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel-wrap urlslab-panel-floating fadeInto" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel-header" }, /* @__PURE__ */ React.createElement("h3", null, __("Export data")), /* @__PURE__ */ React.createElement("button", { className: "urlslab-panel-close", onClick: hidePanel }, /* @__PURE__ */ React.createElement(CloseIcon, null))), (activefilters == null ? void 0 : activefilters.length) > 0 && header && /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel-section" }, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, __("Active filters:"))), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("ul", { className: "columns-2" }, activefilters.map((key) => {
    return /* @__PURE__ */ React.createElement("li", { key }, header[key]);
  })))), /* @__PURE__ */ React.createElement("div", { className: "mt-l" }, exportStatus ? /* @__PURE__ */ React.createElement(ProgressBar, { className: "mb-m", notification: "Exporting…", value: exportStatus }) : null, /* @__PURE__ */ React.createElement("div", { className: "flex" }, /* @__PURE__ */ React.createElement(Button, { className: "ma-left simple", onClick: hidePanel }, __("Cancel")), (activefilters == null ? void 0 : activefilters.length) > 0 && /* @__PURE__ */ React.createElement(ExportCSVButton, { className: "ml-s", options, withfilters: true, onClick: handleExportStatus }), /* @__PURE__ */ React.createElement(
    ExportCSVButton,
    {
      className: "ml-s",
      options,
      onClick: handleExportStatus
    }
  )))));
}
async function importCsv(slug, dataArray, result) {
  const dataChunks = () => {
    const chunkSize = 1e3;
    const chunkArray = [];
    for (let i = 0; i < dataArray.length; i += chunkSize) {
      const chunk = dataArray.slice(i, i + chunkSize);
      chunkArray.push(chunk);
    }
    return { data: chunkArray, length: chunkArray.length };
  };
  const chunksLength = dataChunks().length;
  let chunkIndex = 0;
  let ended2 = false;
  const onResult = (resultStatus) => {
    if (result) {
      result(resultStatus);
    }
  };
  async function continueImport(index, returnResult) {
    const chunk = dataChunks().data[index];
    const response = await postFetch(slug, { rows: chunk });
    if (index === chunksLength - 1) {
      ended2 = true;
      returnResult(100);
    }
    if (response.ok && index < chunksLength && !ended2) {
      chunkIndex += 1;
      returnResult(chunkIndex / chunksLength * 100);
      await continueImport(chunkIndex, returnResult);
    }
    return response;
  }
  continueImport(chunkIndex, onResult);
}
const SvgIconImport = (props2) => /* @__PURE__ */ reactExports.createElement("svg", { width: "100%", height: "100%", viewBox: "0 0 20 21", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", xmlSpace: "preserve", "xmlns:serif": "http://www.serif.com/", style: {
  fillRule: "evenodd",
  clipRule: "evenodd",
  strokeLinejoin: "round",
  strokeMiterlimit: 2
}, ...props2 }, /* @__PURE__ */ reactExports.createElement("path", { d: "M15.083,12.166L15.083,14.944C15.083,15.114 15.016,15.276 14.896,15.396C14.776,15.516 14.614,15.583 14.444,15.583C14.444,15.583 4.722,15.583 4.722,15.583C4.553,15.583 4.39,15.516 4.27,15.396C4.151,15.276 4.083,15.114 4.083,14.944C4.083,14.944 4.083,12.166 4.083,12.166C4.083,11.753 3.747,11.416 3.333,11.416C2.919,11.417 2.583,11.753 2.583,12.167L2.583,14.944C2.583,15.511 2.809,16.056 3.21,16.457C3.21,16.457 3.21,16.457 3.21,16.457C3.611,16.858 4.155,17.083 4.722,17.083L14.444,17.083C15.012,17.083 15.556,16.858 15.957,16.457C15.957,16.457 15.957,16.457 15.957,16.457C16.358,16.055 16.583,15.511 16.583,14.944L16.583,12.167C16.583,11.753 16.247,11.417 15.833,11.416C15.419,11.416 15.083,11.753 15.083,12.166Z" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M13.586,6.775L10.114,3.303C9.973,3.162 9.782,3.083 9.583,3.083C9.384,3.083 9.194,3.162 9.053,3.303L5.581,6.775C5.288,7.068 5.288,7.543 5.581,7.836C5.873,8.128 6.349,8.128 6.641,7.836L9.583,4.894C9.583,4.894 12.525,7.836 12.525,7.836C12.818,8.128 13.293,8.128 13.586,7.836C13.879,7.543 13.879,7.068 13.586,6.775Z" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M8.833,3.833L8.833,12.167C8.833,12.581 9.169,12.917 9.583,12.917C9.997,12.917 10.333,12.581 10.333,12.167L10.333,3.833C10.333,3.419 9.997,3.083 9.583,3.083C9.169,3.083 8.833,3.419 8.833,3.833Z" }));
function ImportPanel({ props: props2, handlePanel }) {
  var _a, _b;
  const { slug, header, initialRow } = props2;
  const { __ } = useI18n();
  const queryClient = useQueryClient();
  const { CSVReader } = R();
  const [importStatus, setImportStatus] = reactExports.useState();
  const { CloseIcon, handleClose } = useCloseModal(handlePanel);
  const { handleType } = useFilter({ slug, header, initialRow });
  let importCounter = 0;
  const csvFields = reactExports.useMemo(() => {
    var _a2, _b2, _c;
    const routeEndpoints = (_b2 = (_a2 = queryClient.getQueryData(["routes"])) == null ? void 0 : _a2.routes[`/urlslab/v1/${slug}`]) == null ? void 0 : _b2.endpoints;
    const endpointArgs = (_c = routeEndpoints == null ? void 0 : routeEndpoints.filter((endpoint) => (endpoint == null ? void 0 : endpoint.methods[0]) === "POST")[0]) == null ? void 0 : _c.args;
    const requiredFields = [];
    const optionalFields = [];
    const removeFieldsRegex = /^.*(length|usage|wpml_language).*$/g;
    const setType = (key) => {
      let type = handleType(key, (cellOptions) => cellOptions);
      if (type === "lang") {
        type = 'like "en", "fr", "es" etc.';
      }
      if (type === "date") {
        type = 'ie "2023–04–31 09:00:00" (YYYY-MM-dd HH:mm:ss)';
      }
      if (type === "boolean") {
        type = "true/false";
      }
      return type;
    };
    Object.entries(endpointArgs).filter(([key, valObj]) => {
      if (typeof valObj === "object" && (valObj == null ? void 0 : valObj.required) === true) {
        requiredFields.push({ key, type: setType(key) });
      }
      if (typeof valObj === "object" && (valObj == null ? void 0 : valObj.required) !== true && !removeFieldsRegex.test(key)) {
        optionalFields.push({ key, type: setType(key) });
      }
      return false;
    });
    return { requiredFields, optionalFields };
  }, [queryClient, slug, header]);
  const hidePanel = (operation) => {
    handleClose();
    if (handlePanel) {
      handlePanel(operation);
    }
  };
  const handleImportStatus = (val) => {
    setImportStatus(val);
    if (importCounter === 0) {
      queryClient.invalidateQueries([slug]);
    }
    if (val === 100) {
      importCounter = 0;
      queryClient.invalidateQueries([slug]);
      setTimeout(() => {
        setImportStatus();
        hidePanel();
      }, 1e3);
    }
    importCounter += 1;
  };
  const importData = useMutation({
    mutationFn: async (results) => {
      await importCsv(`${slug}/import`, results.data, handleImportStatus);
    }
  });
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel-wrap urlslab-panel-floating fadeInto" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel-header" }, /* @__PURE__ */ React.createElement("h3", null, __("Import data")), /* @__PURE__ */ React.createElement("button", { className: "urlslab-panel-close", onClick: hidePanel }, /* @__PURE__ */ React.createElement(CloseIcon, null))), /* @__PURE__ */ React.createElement("div", { className: "mt-l" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel-section" }, /* @__PURE__ */ React.createElement("p", null, __("CSV file should contain headers:")), /* @__PURE__ */ React.createElement("div", { className: "flex" }, ((_a = csvFields == null ? void 0 : csvFields.requiredFields) == null ? void 0 : _a.length) > 0 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, __("Required headers:"))), /* @__PURE__ */ React.createElement("ul", null, csvFields == null ? void 0 : csvFields.requiredFields.map((field) => {
    return /* @__PURE__ */ React.createElement("li", { key: field.key }, `${header[field.key]} (${field.key})`, typeof field.type !== "object" ? ` – ${field.type}` : /* @__PURE__ */ React.createElement("ul", { className: "pl-s" }, Object.entries(field.type).map(([key, val]) => {
      return /* @__PURE__ */ React.createElement("li", { key }, `${key} – ${val}`);
    })));
  }))), (csvFields == null ? void 0 : csvFields.optionalFields.length) > 0 && /* @__PURE__ */ React.createElement("div", { className: "ml-xxl" }, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, __("Optional headers:"))), /* @__PURE__ */ React.createElement("ul", null, (_b = csvFields == null ? void 0 : csvFields.optionalFields) == null ? void 0 : _b.map((field) => {
    return /* @__PURE__ */ React.createElement("li", { key: field.key }, `${header[field.key]} (${field.key})`, typeof field.type !== "object" ? ` – ${field.type}` : /* @__PURE__ */ React.createElement("ul", { className: "pl-s" }, Object.entries(field.type).map(([key, val]) => {
      return /* @__PURE__ */ React.createElement("li", { key }, `${key} – ${val}`);
    })));
  }))))), importStatus ? /* @__PURE__ */ React.createElement(ProgressBar, { className: "mb-m", notification: "Importing…", value: importStatus }) : null, /* @__PURE__ */ React.createElement(
    CSVReader,
    {
      onUploadAccepted: (results) => {
        importData.mutate(results);
      },
      config: {
        header: true
      }
    },
    ({
      getRootProps,
      acceptedFile,
      getRemoveFileProps
    }) => /* @__PURE__ */ React.createElement("div", { className: "flex" }, /* @__PURE__ */ React.createElement("div", { className: "ma-left flex flex-align-center" }, acceptedFile && /* @__PURE__ */ React.createElement("button", { className: "removeFile flex flex-align-center", ...getRemoveFileProps() }, acceptedFile.name, " ", /* @__PURE__ */ React.createElement(CloseIcon, null)), /* @__PURE__ */ React.createElement(Button, { className: "ml-s simple", onClick: hidePanel }, __("Cancel")), /* @__PURE__ */ React.createElement(Button, { ...getRootProps(), active: true }, /* @__PURE__ */ React.createElement(SvgIconImport, null), __("Import CSV"))))
  ))));
}
function DangerPanel({ title, text: text2, button, handlePanel, action }) {
  const { __ } = useI18n();
  const { CloseIcon, handleClose } = useCloseModal(handlePanel);
  const hidePanel = (operation) => {
    handleClose();
    if (handlePanel) {
      handlePanel(operation);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel-wrap urlslab-panel-floating fadeInto" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel-header" }, /* @__PURE__ */ React.createElement("h3", null, title), /* @__PURE__ */ React.createElement("button", { className: "urlslab-panel-close", onClick: hidePanel }, /* @__PURE__ */ React.createElement(CloseIcon, null))), /* @__PURE__ */ React.createElement("p", null, text2), /* @__PURE__ */ React.createElement("div", { className: "flex" }, /* @__PURE__ */ React.createElement(Button, { className: "ma-left simple", onClick: hidePanel }, __("Cancel")), /* @__PURE__ */ React.createElement(Button, { className: "ml-s danger", onClick: () => hidePanel(action) }, button))));
}
function DetailsPanel({ options, handlePanel }) {
  var _a, _b, _c;
  const maxRows = 150;
  const { __ } = useI18n();
  const { ref, inView } = useInView();
  const tableContainerRef = reactExports.useRef();
  const { CloseIcon, handleClose } = useCloseModal(handlePanel);
  const tbody = [];
  const { title, text: text2, slug, url, showKeys, listId } = options;
  const {
    isSuccess,
    data,
    isFetchingNextPage,
    hasNextPage: hasNextPage2,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: [slug, url],
    queryFn: ({ pageParam = "" }) => {
      return fetchData(`${slug}/${url}` + getParamsChar() + `from_${listId}=${pageParam !== void 0 && pageParam}&rows_per_page=${maxRows}`);
    },
    getNextPageParam: (allRows) => {
      if (allRows.length < maxRows) {
        return void 0;
      }
      const lastRowId2 = allRows[(allRows == null ? void 0 : allRows.length) - 1][listId] ?? void 0;
      return lastRowId2;
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    cacheTime: Infinity,
    staleTime: Infinity
  });
  const rows = (_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page ?? []);
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows == null ? void 0 : rows.length,
    overscan: 10,
    estimateSize: reactExports.useCallback(() => 20, [])
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;
  const paddingTop = (virtualRows == null ? void 0 : virtualRows.length) > 0 ? ((_b = virtualRows == null ? void 0 : virtualRows[0]) == null ? void 0 : _b.start) || 0 : 0;
  const paddingBottom = (virtualRows == null ? void 0 : virtualRows.length) > 0 ? totalSize - (((_c = virtualRows == null ? void 0 : virtualRows[virtualRows.length - 1]) == null ? void 0 : _c.end) || 0) : 0;
  for (const virtualRow of virtualRows) {
    const row = rows[virtualRow == null ? void 0 : virtualRow.index];
    tbody.push(
      /* @__PURE__ */ React.createElement("tr", { key: row[listId], className: "" }, showKeys.map((key) => {
        return /* @__PURE__ */ React.createElement("td", { className: "pr-m pos-relative", key: row[key] }, /* @__PURE__ */ React.createElement("div", { className: "limit" }, key.includes("url") ? /* @__PURE__ */ React.createElement("a", { href: row[key], target: "_blank", rel: "noreferrer" }, row[key]) : row[key]));
      }))
    );
  }
  reactExports.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
  function hidePanel() {
    handleClose();
    if (handlePanel) {
      handlePanel();
    }
  }
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel-wrap wide urlslab-panel-floating fadeInto" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel Details" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel-header" }, /* @__PURE__ */ React.createElement("h3", null, title), /* @__PURE__ */ React.createElement("button", { className: "urlslab-panel-close", onClick: hidePanel }, /* @__PURE__ */ React.createElement(CloseIcon, null)), /* @__PURE__ */ React.createElement("p", null, text2)), /* @__PURE__ */ React.createElement("div", { className: "mt-l" }, /* @__PURE__ */ React.createElement("div", { className: "table-container", ref: tableContainerRef }, isSuccess && data ? /* @__PURE__ */ React.createElement("table", null, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, showKeys.map((key) => /* @__PURE__ */ React.createElement("th", { className: "pr-m", key }, key.charAt(0).toUpperCase() + key.slice(1).replaceAll("_", " "))))), /* @__PURE__ */ React.createElement("tbody", null, paddingTop > 0 && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { style: { height: `${paddingTop}px` } })), tbody, paddingBottom > 0 && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { style: { height: `${paddingBottom}px` } })))) : /* @__PURE__ */ React.createElement(Loader, null), /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage2, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))), /* @__PURE__ */ React.createElement("div", { className: "flex" }, /* @__PURE__ */ React.createElement(Button, { className: "ma-left simple", onClick: hidePanel }, __("Cancel"))))));
}
function TablePanels({ props: props2 }) {
  const { header, slug, filters, initialRow, detailsOptions, insertOptions, exportOptions, activePanel, handlePanel } = props2;
  const { __ } = useI18n();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, activePanel === "deleteall" && /* @__PURE__ */ React.createElement(
    DangerPanel,
    {
      title: __("Delete All?"),
      text: __("Are you sure you want to delete all rows? Deleting rows will remove them from all modules where this table occurs."),
      button: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SvgIconTrash, null), __("Delete All")),
      handlePanel,
      action: "delete-all"
    }
  ), activePanel === "deleteSelected" && /* @__PURE__ */ React.createElement(
    DangerPanel,
    {
      title: __("Delete Selected?"),
      text: __("Are you sure you want to delete selected rows? Deleting rows will remove them from all modules where this table occurs."),
      button: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SvgIconTrash, null), __("Delete selected")),
      handlePanel,
      action: "delete-selected"
    }
  ), activePanel === "addrow" && /* @__PURE__ */ React.createElement(InsertRowPanel, { insertOptions, handlePanel }), activePanel === "export" && /* @__PURE__ */ React.createElement(
    ExportPanel,
    {
      options: exportOptions,
      filters,
      header,
      handlePanel
    }
  ), activePanel === "import" && /* @__PURE__ */ React.createElement(ImportPanel, { props: { slug, header, initialRow }, handlePanel }), activePanel === "details" && /* @__PURE__ */ React.createElement(DetailsPanel, { options: detailsOptions, handlePanel }));
}
const SvgIconColumns = (props2) => /* @__PURE__ */ reactExports.createElement("svg", { width: "100%", height: "100%", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", xmlSpace: "preserve", "xmlns:serif": "http://www.serif.com/", style: {
  fillRule: "evenodd",
  clipRule: "evenodd",
  strokeLinejoin: "round",
  strokeMiterlimit: 2
}, ...props2 }, /* @__PURE__ */ reactExports.createElement("g", { id: "Artboard1", transform: "matrix(1.00734,0,0,1.11098,0,-1.01523)" }, /* @__PURE__ */ reactExports.createElement("rect", { x: 0, y: 0.914, width: 23.825, height: 21.603, style: {
  fill: "none"
} }), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(0.992717,0,0,0.900104,5.45994e-05,1.13886)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M2.594,5.355L10.037,5.355", style: {
  fill: "none",
  fillRule: "nonzero"
} })), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(0.992717,0,0,0.900104,5.45994e-05,1.13886)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M2.594,6.105L10.037,6.105C10.451,6.105 10.787,5.769 10.787,5.355C10.787,4.941 10.451,4.605 10.037,4.605L2.594,4.605C2.18,4.605 1.844,4.941 1.844,5.355C1.844,5.769 2.18,6.105 2.594,6.105Z" })), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(0.992717,0,0,0.900104,5.45994e-05,1.13886)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M2.594,9.618L10.037,9.618", style: {
  fill: "none",
  fillRule: "nonzero"
} })), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(0.992717,0,0,0.900104,5.45994e-05,1.13886)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M2.594,10.368L10.037,10.368C10.451,10.368 10.787,10.032 10.787,9.618C10.787,9.204 10.451,8.868 10.037,8.868L2.594,8.868C2.18,8.868 1.844,9.204 1.844,9.618C1.844,10.032 2.18,10.368 2.594,10.368Z" })), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(0.992717,0,0,0.900104,5.45994e-05,1.13886)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M2.594,13.882L10.037,13.882", style: {
  fill: "none",
  fillRule: "nonzero"
} })), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(0.992717,0,0,0.900104,5.45994e-05,1.13886)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M2.594,14.632L10.037,14.632C10.451,14.632 10.787,14.296 10.787,13.882C10.787,13.468 10.451,13.132 10.037,13.132L2.594,13.132C2.18,13.132 1.844,13.468 1.844,13.882C1.844,14.296 2.18,14.632 2.594,14.632Z" })), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(0.992717,0,0,0.900104,5.45994e-05,1.13886)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M2.594,18.145L10.037,18.145", style: {
  fill: "none",
  fillRule: "nonzero"
} })), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(0.992717,0,0,0.900104,5.45994e-05,1.13886)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M2.594,18.895L10.037,18.895C10.451,18.895 10.787,18.559 10.787,18.145C10.787,17.731 10.451,17.395 10.037,17.395L2.594,17.395C2.18,17.395 1.844,17.731 1.844,18.145C1.844,18.559 2.18,18.895 2.594,18.895Z" })), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(0.992717,0,0,0.900104,5.45994e-05,1.13886)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M13.963,5.355L21.406,5.355", style: {
  fill: "none",
  fillRule: "nonzero"
} })), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(0.992717,0,0,0.900104,5.45994e-05,1.13886)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M13.963,6.105L21.406,6.105C21.82,6.105 22.156,5.769 22.156,5.355C22.156,4.941 21.82,4.605 21.406,4.605L13.963,4.605C13.549,4.605 13.213,4.941 13.213,5.355C13.213,5.769 13.549,6.105 13.963,6.105Z" })), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(0.992717,0,0,0.900104,5.45994e-05,1.13886)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M13.963,9.618L21.406,9.618", style: {
  fill: "none",
  fillRule: "nonzero"
} })), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(0.992717,0,0,0.900104,5.45994e-05,1.13886)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M13.963,10.368L21.406,10.368C21.82,10.368 22.156,10.032 22.156,9.618C22.156,9.204 21.82,8.868 21.406,8.868L13.963,8.868C13.549,8.868 13.213,9.204 13.213,9.618C13.213,10.032 13.549,10.368 13.963,10.368Z" })), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(0.992717,0,0,0.900104,5.45994e-05,1.13886)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M13.963,13.882L21.406,13.882", style: {
  fill: "none",
  fillRule: "nonzero"
} })), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(0.992717,0,0,0.900104,5.45994e-05,1.13886)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M13.963,14.632L21.406,14.632C21.82,14.632 22.156,14.296 22.156,13.882C22.156,13.468 21.82,13.132 21.406,13.132L13.963,13.132C13.549,13.132 13.213,13.468 13.213,13.882C13.213,14.296 13.549,14.632 13.963,14.632Z" })), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(0.992717,0,0,0.900104,5.45994e-05,1.13886)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M13.963,18.145L21.406,18.145", style: {
  fill: "none",
  fillRule: "nonzero"
} })), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(0.992717,0,0,0.900104,5.45994e-05,1.13886)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M13.963,18.895L21.406,18.895C21.82,18.895 22.156,18.559 22.156,18.145C22.156,17.731 21.82,17.395 21.406,17.395L13.963,17.395C13.549,17.395 13.213,17.731 13.213,18.145C13.213,18.559 13.549,18.895 13.963,18.895Z" }))));
function ColumnsMenu({
  id,
  className,
  slug,
  table,
  columns,
  style
}) {
  const { __ } = useI18n();
  const [isActive, setActive] = reactExports.useState(false);
  const [isVisible, setVisible] = reactExports.useState(false);
  const [hiddenCols, setHiddenCols] = reactExports.useState(table == null ? void 0 : table.getState().columnVisibility);
  const ref = reactExports.useRef(id);
  const tableColumns = table == null ? void 0 : table.getAllLeafColumns();
  const getColumnState = reactExports.useCallback(() => {
    get(slug).then(async (dbData) => {
      if ((dbData == null ? void 0 : dbData.columnVisibility) && Object.keys(dbData == null ? void 0 : dbData.columnVisibility).length) {
        await setHiddenCols(dbData == null ? void 0 : dbData.columnVisibility);
      }
    });
  }, [slug]);
  reactExports.useEffect(() => {
    getColumnState();
    const handleClickOutside = (event) => {
      var _a, _b;
      if (!((_a = ref.current) == null ? void 0 : _a.contains(event.target)) && isActive && ((_b = ref.current) == null ? void 0 : _b.id) === id) {
        setActive(false);
        setVisible(false);
      }
    };
    document.addEventListener("click", handleClickOutside, false);
  }, [getColumnState, id, isActive]);
  const checkedCheckbox = (column, isChecked) => {
    const hiddenColsCopy = { ...hiddenCols };
    column.toggleVisibility();
    if (isChecked) {
      delete hiddenColsCopy[`${column.id}`];
      setHiddenCols(hiddenColsCopy);
    }
    if (!isChecked) {
      hiddenColsCopy[column.id] = false;
      setHiddenCols(hiddenColsCopy);
    }
    update(slug, (dbData) => {
      return { ...dbData, columnVisibility: hiddenColsCopy };
    });
  };
  const handleVisibilityAll = reactExports.useCallback((action) => {
    const columnsArray = table.getAllColumns();
    const hiddenColsCopy = { ...hiddenCols };
    columnsArray.forEach((column) => {
      if (action === "showAllCols" && !column.getIsVisible()) {
        column.toggleVisibility();
        delete hiddenColsCopy[`${column.id}`];
        setHiddenCols(hiddenColsCopy);
      }
      if (action === "hideAllCols" && column.getIsVisible()) {
        column.toggleVisibility();
        hiddenColsCopy[column.id] = false;
        setHiddenCols(hiddenColsCopy);
      }
    });
    update(slug, (dbData) => {
      return { ...dbData, columnVisibility: hiddenColsCopy };
    });
  }, [hiddenCols, slug, table]);
  const handleMenu = () => {
    setActive(!isActive);
    setTimeout(() => {
      setVisible(!isVisible);
    }, 100);
  };
  return /* @__PURE__ */ React.createElement("div", { className: `urlslab-FilterMenu urlslab-ColumnsMenu ${className || ""} ${isActive ? "active" : ""}`, style, ref, id }, !isActive && /* @__PURE__ */ React.createElement(Tooltip, { className: "showOnHover align-left-0", style: { width: "11em" } }, __("Turn off/on columns")), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: `urlslab-ColumnsMenu__icon ${isActive ? "active" : ""}`,
      onClick: handleMenu,
      onKeyUp: (event) => handleMenu(),
      role: "button",
      tabIndex: 0
    },
    /* @__PURE__ */ React.createElement(SvgIconColumns, null)
  ), isActive && /* @__PURE__ */ React.createElement("div", { className: `urlslab-FilterMenu__items urlslab-ColumnsMenu__items ${isActive ? "active" : ""} ${isVisible ? "visible" : ""}` }, /* @__PURE__ */ React.createElement("div", { className: "flex urlslab-ColumnsMenu__buttons" }, /* @__PURE__ */ React.createElement(Button, { className: "xl simple", onClick: () => handleVisibilityAll("hideAllCols") }, __("Hide all")), /* @__PURE__ */ React.createElement(Button, { className: "ma-left xl active", onClick: () => handleVisibilityAll("showAllCols") }, __("Show all"))), /* @__PURE__ */ React.createElement("div", { className: `urlslab-FilterMenu__items--inn ${columns.length > 8 ? "has-scrollbar" : ""}` }, tableColumns == null ? void 0 : tableColumns.map((column) => {
    return columns[column.id] && /* @__PURE__ */ React.createElement(
      Checkbox,
      {
        className: "urlslab-FilterMenu__item urlslab-ColumnsMenu__item",
        key: column.id,
        id: column.id,
        onChange: (isChecked) => checkedCheckbox(column, isChecked),
        checked: !Object.keys(hiddenCols).includes(column.id)
      },
      columns[column.id]
    );
  }))));
}
function TableActionsMenu({ options, onAction }) {
  const { noImport, noExport, noDelete } = options;
  const { __ } = useI18n();
  const [isActive, setActive] = reactExports.useState(false);
  const [isVisible, setVisible] = reactExports.useState(false);
  const ref = reactExports.useRef();
  const didMountRef = reactExports.useRef(false);
  const handleMenu = () => {
    setActive(!isActive);
    setTimeout(() => {
      setVisible(!isVisible);
    }, 100);
  };
  reactExports.useEffect(() => {
    const handleClickOutside = (event) => {
      var _a;
      if (!((_a = ref.current) == null ? void 0 : _a.contains(event.target)) && isActive) {
        setActive(false);
        setVisible(false);
      }
    };
    didMountRef.current = true;
    document.addEventListener("click", handleClickOutside, false);
  }, [isActive]);
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-FilterMenu urlslab-moreactions-menu fadeInto", ref }, /* @__PURE__ */ React.createElement(Button, { className: "no-padding underline simple ml-m", onClick: handleMenu }, __("More actions")), /* @__PURE__ */ React.createElement("div", { className: `urlslab-FilterMenu__items ${isActive ? "active" : ""} ${isVisible ? "visible" : ""}` }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-FilterMenu__items--inn" }, !noImport && /* @__PURE__ */ React.createElement(Button, { className: "simple", onClick: () => onAction("import") }, __("Import CSV")), !noExport && /* @__PURE__ */ React.createElement(Button, { className: "simple", onClick: () => onAction("export") }, __("Export CSV")), !noDelete && /* @__PURE__ */ React.createElement(Button, { className: "simple", onClick: () => onAction("deleteall") }, __("Delete All")))));
}
function ModuleViewHeaderBottom({ slug, noColumnsMenu, noFiltering, noImport, noInsert, noExport, noCount, noDelete, header, table, insertOptions, activatePanel, detailsOptions, exportOptions, selectedRows, onFilter, onDeleteSelected, onClearRow }) {
  const { __ } = useI18n();
  const queryClient = useQueryClient();
  const didMountRef = reactExports.useRef(false);
  const panelPopover = reactExports.useRef();
  const { headerBottomHeight, setHeaderBottomHeight } = reactExports.useContext(HeaderHeightContext);
  const handleHeaderHeight = reactExports.useCallback((elem) => {
    const bottomHeight = elem == null ? void 0 : elem.getBoundingClientRect().height;
    if (bottomHeight && bottomHeight !== headerBottomHeight) {
      setHeaderBottomHeight(bottomHeight);
    }
  }, [headerBottomHeight, setHeaderBottomHeight]);
  const headerBottom = useResizeObserver(handleHeaderHeight);
  const [activePanel, setActivePanel] = reactExports.useState();
  const initialRow = table == null ? void 0 : table.getRowModel().rows[0];
  const { filters, possiblefilters, state, dispatch, handleSaveFilter, handleRemoveFilter } = useFilter({ slug, header, initialRow });
  const sorting = queryClient.getQueryData([slug, "sorting"]);
  const close = reactExports.useCallback(() => {
    dispatch({ type: "toggleEditFilter", editFilter: false });
  }, []);
  useClickOutside(panelPopover, close);
  const handleOnEdit = reactExports.useCallback((returnObj) => {
    if (returnObj) {
      handleSaveFilter(returnObj);
      onFilter(filters);
    }
    if (!returnObj) {
      dispatch({ type: "toggleEditFilter", editFilter: false });
    }
  }, [handleSaveFilter, filters, dispatch, onFilter]);
  reactExports.useEffect(() => {
    handleHeaderHeight();
    if (onFilter && didMountRef.current) {
      onFilter(filters);
    }
    didMountRef.current = true;
    if (activatePanel) {
      setActivePanel(activatePanel);
    }
    if (detailsOptions) {
      setActivePanel("details");
    }
  }, [slug, activatePanel, detailsOptions, filters, onFilter]);
  const { data: rowCount, isFetching } = useQuery({
    queryKey: [slug, `count`, filtersArray(filters)],
    queryFn: async () => {
      const count2 = await postFetch(`${slug}/count`, { filters: filtersArray(filters) });
      if (!noCount) {
        return count2.json();
      }
    },
    refetchOnWindowFocus: false
  });
  const Counter = reactExports.memo(() => {
    return !noCount && !isFetching && rowCount && /* @__PURE__ */ React.createElement("small", { className: "urlslab-rowcount fadeInto flex flex-align-center" }, __("Rows: "), /* @__PURE__ */ React.createElement("strong", { className: "ml-s" }, rowCount));
  });
  const handleDeleteAll = useMutation({
    mutationFn: () => {
      return deleteAll(slug);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([slug]);
    }
  });
  const handlePanel = (key) => {
    setActivePanel(key);
    if (key === "delete-all") {
      handleDeleteAll.mutate();
    }
    if (key === "delete-selected") {
      if (onDeleteSelected) {
        onDeleteSelected();
      }
    }
    if (onClearRow) {
      onClearRow(key);
    }
  };
  const handleRefresh = () => {
    queryClient.invalidateQueries([slug, filtersArray(filters), sorting ? sorting : []]);
    if (!noCount) {
      queryClient.invalidateQueries([slug, "count", filtersArray(filters)]);
    }
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { ref: headerBottom, className: "urlslab-moduleView-headerBottom" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-moduleView-headerBottom__top flex flex-align-center" }, !noDelete && (selectedRows == null ? void 0 : selectedRows.length) > 0 && /* @__PURE__ */ React.createElement(Button, { className: "mr-s", onClick: () => handlePanel("deleteSelected") }, /* @__PURE__ */ React.createElement(SvgIconTrash, null), __("Delete selected")), insertOptions && !noInsert && /* @__PURE__ */ React.createElement(Button, { className: "active", onClick: () => handlePanel("addrow") }, /* @__PURE__ */ React.createElement(SvgIconPlus, null), insertOptions.title), !noFiltering && /* @__PURE__ */ React.createElement("div", { className: "pos-relative" }, /* @__PURE__ */ React.createElement(Button, { className: "simple underline", onClick: () => dispatch({ type: "toggleEditFilter", editFilter: "addFilter" }) }, __("+ Add filter")), state.editFilter === "addFilter" && // Our main adding panel (only when Add button clicked)
  /* @__PURE__ */ React.createElement(TableFilterPanel, { ref: panelPopover, props: { slug, header, initialRow, possiblefilters, filters }, onEdit: (val) => {
    handleHeaderHeight();
    handleOnEdit(val);
  } })), /* @__PURE__ */ React.createElement("div", { className: "ma-left flex flex-align-center" }, /* @__PURE__ */ React.createElement(Counter, null), !noImport && !noExport && !noDelete && /* @__PURE__ */ React.createElement(TableActionsMenu, { onAction: handlePanel, options: { noImport, noExport, noDelete } }), table && !noColumnsMenu && /* @__PURE__ */ React.createElement(
    ColumnsMenu,
    {
      className: "menu-left ml-m",
      id: "visibleColumns",
      slug,
      table,
      columns: header
    }
  ), /* @__PURE__ */ React.createElement(IconButton, { className: "ml-m", tooltip: __("Refresh table"), tooltipClass: "align-left-0", onClick: handleRefresh }, /* @__PURE__ */ React.createElement(SvgIconCronRefresh, null)))), Object.keys(filters).length !== 0 && /* @__PURE__ */ React.createElement("div", { className: "urlslab-moduleView-headerBottom__bottom mt-l flex flex-align-center" }, /* @__PURE__ */ React.createElement(TableFilter, { props: { filters, possiblefilters, state, slug, header, initialRow }, onEdit: handleOnEdit, onRemove: (key) => {
    handleHeaderHeight();
    handleRemoveFilter(key);
  } }))), /* @__PURE__ */ React.createElement(TablePanels, { props: { header, slug, filters, initialRow, detailsOptions, insertOptions, exportOptions, activePanel, handlePanel } }));
}
function useTableUpdater({ slug }) {
  const [tableHidden, setHiddenTable] = reactExports.useState(false);
  const [table, setTable] = reactExports.useState();
  const [filters, setFilters] = reactExports.useState();
  const [rowToInsert, setInsertRow] = reactExports.useState({});
  const { sorting, sortBy } = useSorting({ slug });
  return {
    tableHidden,
    setHiddenTable,
    table,
    setTable,
    filters,
    setFilters,
    sorting,
    sortBy,
    rowToInsert,
    setInsertRow
  };
}
export {
  LangMenu as L,
  ModuleViewHeaderBottom as M,
  ProgressBar as P,
  SvgIconTrash as S,
  Table as T,
  useInfiniteFetch as a,
  useChangeRow as b,
  SvgIconPlus as c,
  useTableUpdater as u
};
