import { Q as QueryObserver, i as infiniteQueryBehavior, j as hasNextPage, k as hasPreviousPage, m as parseQueryArgs, n as useBaseQuery, R as React, r as reactExports, u as useI18n, h as fetchData, a as useQueryClient, l as langName, o as get, q as update, t as setData, B as Button, v as commonjsGlobal, e as useQuery } from "../main-b65fm56nnz.js";
import { S as SortMenu, I as InputField, F as FilterMenu, C as Checkbox } from "./datepicker-b65fm56nnz.js";
import { u as useMutation } from "./useMutation-b65fm56nnz.js";
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
      const recurseHeader = (h2) => {
        if (h2.subHeaders && h2.subHeaders.length) {
          h2.subHeaders.map(recurseHeader);
        }
        leafHeaders.push(h2);
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
        return (e2) => {
          if (!column || !canResize) {
            return;
          }
          e2.persist == null ? void 0 : e2.persist();
          if (isTouchStartEvent(e2)) {
            if (e2.touches && e2.touches.length > 1) {
              return;
            }
          }
          const startSize = header.getSize();
          const columnSizingStart = header ? header.getLeafHeaders().map((d) => [d.column.id, d.column.getSize()]) : [[column.id, column.getSize()]];
          const clientX = isTouchStartEvent(e2) ? Math.round(e2.touches[0].clientX) : e2.clientX;
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
            moveHandler: (e3) => onMove(e3.clientX),
            upHandler: (e3) => {
              document.removeEventListener("mousemove", mouseEvents.moveHandler);
              document.removeEventListener("mouseup", mouseEvents.upHandler);
              onEnd(e3.clientX);
            }
          };
          const touchEvents = {
            moveHandler: (e3) => {
              if (e3.cancelable) {
                e3.preventDefault();
                e3.stopPropagation();
              }
              onMove(e3.touches[0].clientX);
              return false;
            },
            upHandler: (e3) => {
              var _e$touches$;
              document.removeEventListener("touchmove", touchEvents.moveHandler);
              document.removeEventListener("touchend", touchEvents.upHandler);
              if (e3.cancelable) {
                e3.preventDefault();
                e3.stopPropagation();
              }
              onEnd((_e$touches$ = e3.touches[0]) == null ? void 0 : _e$touches$.clientX);
            }
          };
          const passiveIfSupported = passiveEventSupported() ? {
            passive: false
          } : false;
          if (isTouchStartEvent(e2)) {
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
function isTouchStartEvent(e2) {
  return e2.type === "touchstart";
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
        return (e2) => {
          e2.persist == null ? void 0 : e2.persist();
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
  const groupingColumns = grouping.map((g2) => leafColumns.find((col) => col.id === g2)).filter(Boolean);
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
        return (e2) => {
          table.toggleAllRowsSelected(e2.target.checked);
        };
      },
      getToggleAllPageRowsSelectedHandler: () => {
        return (e2) => {
          table.toggleAllPageRowsSelected(e2.target.checked);
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
        return (e2) => {
          var _target;
          if (!canSelect)
            return;
          row.toggleSelected((_target = e2.target) == null ? void 0 : _target.checked);
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
  const b2 = rowB.getValue(columnId);
  return a > b2 ? 1 : a < b2 ? -1 : 0;
};
const basic = (rowA, rowB, columnId) => {
  return compareBasic(rowA.getValue(columnId), rowB.getValue(columnId));
};
function compareBasic(a, b2) {
  return a === b2 ? 0 : a > b2 ? 1 : -1;
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
  const b2 = bStr.split(reSplitAlphaNumeric).filter(Boolean);
  while (a.length && b2.length) {
    const aa = a.shift();
    const bb = b2.shift();
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
  return a.length - b2.length;
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
      isMultiSortEvent: (e2) => {
        return e2.shiftKey;
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
        return (e2) => {
          if (!canSort)
            return;
          e2.persist == null ? void 0 : e2.persist();
          column.toggleSorting == null ? void 0 : column.toggleSorting(void 0, column.getCanMultiSort() ? table.options.isMultiSortEvent == null ? void 0 : table.options.isMultiSortEvent(e2) : false);
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
        return (e2) => {
          column.toggleVisibility == null ? void 0 : column.toggleVisibility(e2.target.checked);
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
        return (e2) => {
          var _target;
          table.toggleAllColumnsVisible((_target = e2.target) == null ? void 0 : _target.checked);
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
function useInfiniteFetch(options, maxRows = 50) {
  const columnHelper = createColumnHelper();
  const { __ } = useI18n();
  const { ref, inView } = useInView();
  const { key, url, pageId } = options;
  const query = useInfiniteQuery({
    queryKey: [key, url ? url : ""],
    queryFn: ({ pageParam = "" }) => {
      return fetchData(`${key}?from_${pageId}=${pageParam !== void 0 && pageParam}${url !== "undefined" ? url : ""}&rows_per_page=${maxRows}`);
    },
    getNextPageParam: (allRows) => {
      if (allRows.length < maxRows) {
        return void 0;
      }
      const lastRowId = allRows[(allRows == null ? void 0 : allRows.length) - 1][pageId] ?? void 0;
      return lastRowId;
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
    isFetchingNextPage,
    hasNextPage: hasNextPage2,
    fetchNextPage,
    ref
  };
}
const _Tooltip = "";
function Tooltip({ active, center, className, children }) {
  return children ? /* @__PURE__ */ React.createElement("div", { className: `urlslab-tooltip fadeInto ${className || ""} ${center ? "align-center" : ""} ${active ? "active" : ""}` }, children) : null;
}
const _RangeSlider = "";
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
      Object.entries(langEntries).sort(([, a], [, b2]) => a.localeCompare(b2))
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
var rectChanged = function rectChanged2(a, b2) {
  if (a === void 0) {
    a = {};
  }
  if (b2 === void 0) {
    b2 = {};
  }
  return props.some(function(prop) {
    return a[prop] !== b2[prop];
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
    var _loop = function _loop2(k3, len2) {
      var i = indexes[k3];
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
    for (var k2 = 0, len = indexes.length; k2 < len; k2++) {
      _loop(k2);
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
const _TableComponent = "";
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
    getColumnState();
    setContainerWidth(tableContainerRef.current.clientWidth);
    const menuWidth = document.querySelector(".urlslab-mainmenu").clientWidth + document.querySelector("#adminmenuwrap").clientWidth;
    const resizeWatcher = new ResizeObserver(([entry]) => {
      if (entry.borderBoxSize) {
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
    const result = await fetch(`/wp-json/urlslab/v1${slug ? `/${slug}/delete-all` : ""}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "X-WP-Nonce": window.wpApiSettings.nonce
      },
      credentials: "include"
    });
    return await result.json();
  } catch (error) {
    return false;
  }
}
async function deleteRow(slug) {
  try {
    const result = await fetch(`/wp-json/urlslab/v1${slug ? `/${slug}` : ""}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "X-WP-Nonce": window.wpApiSettings.nonce
      },
      credentials: "include"
    });
    return await result.json();
  } catch (error) {
    return false;
  }
}
const SvgIconImport = (props2) => /* @__PURE__ */ reactExports.createElement("svg", { width: "100%", height: "100%", viewBox: "0 0 20 21", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", xmlSpace: "preserve", "xmlns:serif": "http://www.serif.com/", style: {
  fillRule: "evenodd",
  clipRule: "evenodd",
  strokeLinejoin: "round",
  strokeMiterlimit: 2
}, ...props2 }, /* @__PURE__ */ reactExports.createElement("path", { d: "M15.083,12.166L15.083,14.944C15.083,15.114 15.016,15.276 14.896,15.396C14.776,15.516 14.614,15.583 14.444,15.583C14.444,15.583 4.722,15.583 4.722,15.583C4.553,15.583 4.39,15.516 4.27,15.396C4.151,15.276 4.083,15.114 4.083,14.944C4.083,14.944 4.083,12.166 4.083,12.166C4.083,11.753 3.747,11.416 3.333,11.416C2.919,11.417 2.583,11.753 2.583,12.167L2.583,14.944C2.583,15.511 2.809,16.056 3.21,16.457C3.21,16.457 3.21,16.457 3.21,16.457C3.611,16.858 4.155,17.083 4.722,17.083L14.444,17.083C15.012,17.083 15.556,16.858 15.957,16.457C15.957,16.457 15.957,16.457 15.957,16.457C16.358,16.055 16.583,15.511 16.583,14.944L16.583,12.167C16.583,11.753 16.247,11.417 15.833,11.416C15.419,11.416 15.083,11.753 15.083,12.166Z" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M13.586,6.775L10.114,3.303C9.973,3.162 9.782,3.083 9.583,3.083C9.384,3.083 9.194,3.162 9.053,3.303L5.581,6.775C5.288,7.068 5.288,7.543 5.581,7.836C5.873,8.128 6.349,8.128 6.641,7.836L9.583,4.894C9.583,4.894 12.525,7.836 12.525,7.836C12.818,8.128 13.293,8.128 13.586,7.836C13.879,7.543 13.879,7.068 13.586,6.775Z" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M8.833,3.833L8.833,12.167C8.833,12.581 9.169,12.917 9.583,12.917C9.997,12.917 10.333,12.581 10.333,12.167L10.333,3.833C10.333,3.419 9.997,3.083 9.583,3.083C9.169,3.083 8.833,3.419 8.833,3.833Z" }));
const SvgIconExport = (props2) => /* @__PURE__ */ reactExports.createElement("svg", { width: "100%", height: "100%", viewBox: "0 0 20 21", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", xmlSpace: "preserve", "xmlns:serif": "http://www.serif.com/", style: {
  fillRule: "evenodd",
  clipRule: "evenodd",
  strokeLinejoin: "round",
  strokeMiterlimit: 2
}, ...props2 }, /* @__PURE__ */ reactExports.createElement("path", { d: "M7.5,17.25L4.167,17.25C3.924,17.25 3.69,17.153 3.519,16.982C3.518,16.981 3.518,16.981 3.518,16.981C3.347,16.81 3.25,16.576 3.25,16.333L3.25,4.667C3.25,4.424 3.347,4.19 3.518,4.018C3.518,4.018 3.518,4.018 3.518,4.018C3.69,3.847 3.924,3.75 4.167,3.75C4.167,3.75 7.5,3.75 7.5,3.75C7.914,3.75 8.25,3.414 8.25,3C8.25,2.586 7.914,2.25 7.5,2.25L4.167,2.25C3.526,2.25 2.911,2.505 2.458,2.958C2.005,3.411 1.75,4.026 1.75,4.667C1.75,4.667 1.75,16.333 1.75,16.333C1.75,16.974 2.005,17.589 2.458,18.042C2.911,18.495 3.526,18.75 4.167,18.75L7.5,18.75C7.914,18.75 8.25,18.414 8.25,18C8.25,17.586 7.914,17.25 7.5,17.25Z" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M13.864,15.197L18.03,11.03C18.171,10.89 18.25,10.699 18.25,10.5C18.25,10.301 18.171,10.11 18.03,9.97L13.864,5.803C13.571,5.51 13.096,5.51 12.803,5.803C12.51,6.096 12.51,6.571 12.803,6.864L16.439,10.5C16.439,10.5 12.803,14.136 12.803,14.136C12.51,14.429 12.51,14.904 12.803,15.197C13.096,15.49 13.571,15.49 13.864,15.197Z" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M17.5,9.75L7.5,9.75C7.086,9.75 6.75,10.086 6.75,10.5C6.75,10.914 7.086,11.25 7.5,11.25L17.5,11.25C17.914,11.25 18.25,10.914 18.25,10.5C18.25,10.086 17.914,9.75 17.5,9.75Z" }));
const SvgIconCronRefresh = (props2) => /* @__PURE__ */ reactExports.createElement("svg", { width: "100%", height: "100%", viewBox: "0 0 18 18", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", xmlSpace: "preserve", "xmlns:serif": "http://www.serif.com/", style: {
  fillRule: "evenodd",
  clipRule: "evenodd",
  strokeLinejoin: "round",
  strokeMiterlimit: 2
}, ...props2 }, /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(1,0,0,1,-3.9043,-3.7627)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M21.404,12.513C21.404,7.682 17.485,3.763 12.654,3.763C7.824,3.763 3.904,7.682 3.904,12.513C3.904,17.343 7.824,21.263 12.654,21.263C17.485,21.263 21.404,17.343 21.404,12.513ZM19.904,12.513C19.904,16.515 16.657,19.763 12.654,19.763C8.652,19.763 5.404,16.515 5.404,12.513C5.404,8.51 8.652,5.263 12.654,5.263C16.657,5.263 19.904,8.51 19.904,12.513Z", style: {
  fill: "rgb(5,5,5)"
} })), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(1,0,0,1,-3.9043,-3.7627)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M7.812,11.851L7.812,12.52C7.815,13.483 8.111,14.421 8.658,15.213C9.206,16.004 9.981,16.61 10.881,16.952C11.781,17.294 12.763,17.355 13.698,17.128C14.101,17.03 14.348,16.624 14.25,16.222C14.152,15.82 13.746,15.572 13.344,15.67C12.703,15.826 12.03,15.784 11.414,15.55C11.414,15.55 11.414,15.55 11.414,15.55C10.798,15.316 10.267,14.9 9.892,14.359C9.517,13.817 9.314,13.174 9.312,12.516C9.312,12.516 9.312,11.851 9.312,11.851C9.312,11.437 8.976,11.101 8.562,11.101C8.148,11.101 7.812,11.437 7.812,11.851ZM17.312,13.172L17.312,12.503C17.309,11.541 17.014,10.604 16.467,9.813C16.467,9.813 16.467,9.813 16.467,9.813C15.92,9.022 15.146,8.416 14.247,8.074C13.349,7.732 12.367,7.67 11.433,7.897C11.031,7.994 10.783,8.4 10.881,8.802C10.978,9.205 11.384,9.452 11.786,9.354C12.426,9.199 13.098,9.242 13.714,9.476C14.329,9.71 14.859,10.125 15.234,10.666C15.608,11.208 15.81,11.849 15.812,12.507C15.812,12.507 15.812,13.172 15.812,13.172C15.812,13.586 16.148,13.922 16.562,13.922C16.976,13.922 17.312,13.586 17.312,13.172Z" })), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(1,0,0,1,-3.9043,-3.7627)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M16.846,12.074L16.481,12.581C16.481,12.581 16.089,12.062 16.089,12.062C15.84,11.731 15.37,11.665 15.039,11.914C14.708,12.163 14.642,12.633 14.891,12.964L15.895,14.297C16.039,14.488 16.264,14.599 16.502,14.596C16.741,14.593 16.964,14.478 17.103,14.284L18.063,12.951C18.305,12.615 18.228,12.146 17.893,11.904C17.557,11.662 17.088,11.739 16.846,12.074ZM7.068,12.074C6.903,12.303 6.881,12.604 7.009,12.855C7.137,13.105 7.395,13.263 7.677,13.263L9.641,13.263C9.925,13.263 10.185,13.102 10.312,12.847C10.439,12.593 10.411,12.289 10.24,12.062L9.236,10.728C9.092,10.538 8.867,10.427 8.629,10.429C8.39,10.432 8.167,10.548 8.028,10.741L7.068,12.074Z" })));
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
const _ColumnsMenu = "";
function ColumnsMenu({
  id,
  className,
  slug,
  table,
  columns,
  style
}) {
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
  const handleMenu = () => {
    setActive(!isActive);
    setTimeout(() => {
      setVisible(!isVisible);
    }, 100);
  };
  return /* @__PURE__ */ React.createElement("div", { className: `urlslab-FilterMenu urlslab-ColumnsMenu ${className || ""} ${isActive ? "active" : ""}`, style, ref, id }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: `urlslab-ColumnsMenu__icon ${isActive ? "active" : ""}`,
      onClick: handleMenu,
      onKeyUp: (event) => handleMenu(),
      role: "button",
      tabIndex: 0
    },
    /* @__PURE__ */ React.createElement(SvgIconColumns, null)
  ), isActive && /* @__PURE__ */ React.createElement("div", { className: `urlslab-FilterMenu__items urlslab-ColumnsMenu__items ${isActive ? "active" : ""} ${isVisible ? "visible" : ""}` }, /* @__PURE__ */ React.createElement("div", { className: `urlslab-FilterMenu__items--inn ${columns.length > 8 ? "has-scrollbar" : ""}` }, tableColumns == null ? void 0 : tableColumns.map((column) => {
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
function useChangeRow({ data, url, slug, pageId }) {
  const [rowValue, setRow] = reactExports.useState();
  const queryClient = useQueryClient();
  const [insertRowResult, setInsertRowRes] = reactExports.useState(false);
  const [rowsSelected, setRowsSelected] = reactExports.useState(false);
  const getRowId = (cell, optionalSelector) => {
    if (optionalSelector) {
      return `${cell.row.original[pageId]}/${cell.row.original[optionalSelector]}`;
    }
    return cell.row.original[pageId];
  };
  const getRow = (cell) => {
    return cell.row.original;
  };
  const insertNewRow = useMutation({
    mutationFn: async ({ rowToInsert }) => {
      const response = await setData(`${slug}`, rowToInsert);
      return { response };
    },
    onSuccess: async ({ response }) => {
      const { ok } = await response;
      await response.json();
      if (ok) {
        queryClient.invalidateQueries([slug]);
        setInsertRowRes(response);
      }
    }
  });
  const insertRow = ({ rowToInsert }) => {
    insertNewRow.mutate({ rowToInsert });
  };
  const deleteSelectedRow = useMutation({
    mutationFn: async (options) => {
      const { cell, optionalSelector } = options;
      const newPagesArray = (data == null ? void 0 : data.pages.map(
        (page) => page.filter(
          (row) => row[pageId] !== getRowId(cell)
        )
      )) ?? [];
      queryClient.setQueryData([slug, url], (origData) => ({
        pages: newPagesArray,
        pageParams: origData.pageParams
      }));
      setRow(getRow(cell));
      setTimeout(() => setRow(), 3e3);
      const response = await deleteRow(`${slug}/${getRowId(cell, optionalSelector)}`);
      return response;
    },
    onSuccess: async (response) => {
      const { ok } = response;
      if (ok) {
        await queryClient.invalidateQueries([slug, url]);
      }
    },
    onSettled: async ({ options }) => {
      await queryClient.invalidateQueries([options.slug, "count"]);
    }
  });
  const deleteRow$1 = ({ cell, optionalSelector }) => {
    deleteSelectedRow.mutate({ data, url, slug, cell, optionalSelector });
  };
  const updateRowData = useMutation({
    mutationFn: async (options) => {
      const { newVal, cell, optionalSelector } = options;
      const cellId = cell.column.id;
      const newPagesArray = (data == null ? void 0 : data.pages.map(
        (page) => page.map(
          (row) => {
            if (row[pageId] === getRowId(cell)) {
              row[cell.column.id] = newVal;
              return row;
            }
            return row;
          }
        )
      )) ?? [];
      queryClient.setQueryData([slug, url], (origData) => ({
        pages: newPagesArray,
        pageParams: origData.pageParams
      }));
      const response = await setData(`${slug}/${getRowId(cell, optionalSelector)}`, { [cellId]: newVal });
      return response;
    },
    onSuccess: (response) => {
      const { ok } = response;
      if (ok) {
        queryClient.invalidateQueries([slug, url]);
      }
    }
  });
  const updateRow = ({ newVal, cell, optionalSelector }) => {
    updateRowData.mutate({ data, newVal, url, slug, cell, optionalSelector });
  };
  const selectRow = (isSelected, cell) => {
    cell.row.toggleSelected();
  };
  return { row: rowValue, rowsSelected, insertRowResult, insertRow, selectRow, deleteRow: deleteRow$1, updateRow };
}
const SvgIconClose = (props2) => /* @__PURE__ */ reactExports.createElement("svg", { width: "100%", height: "100%", viewBox: "0 0 10 10", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", xmlSpace: "preserve", "xmlns:serif": "http://www.serif.com/", style: {
  fillRule: "evenodd",
  clipRule: "evenodd",
  strokeLinejoin: "round",
  strokeMiterlimit: 2
}, ...props2 }, /* @__PURE__ */ reactExports.createElement("g", { id: "Artboard1", transform: "matrix(0.941462,0,0,0.904724,-2.8617,-3.21412)" }, /* @__PURE__ */ reactExports.createElement("rect", { x: 3.04, y: 3.553, width: 9.814, height: 10.219, style: {
  fill: "none"
} }), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(1.06218,0,0,1.10531,-0.532301,-0.732545)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M11.576,4.076L3.576,12.076C3.342,12.31 3.342,12.69 3.576,12.924C3.81,13.158 4.19,13.158 4.424,12.924L12.424,4.924C12.658,4.69 12.658,4.31 12.424,4.076C12.19,3.842 11.81,3.842 11.576,4.076Z" })), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(1.06218,0,0,1.10531,-0.532301,-0.732545)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M3.576,4.924L11.576,12.924C11.81,13.158 12.19,13.158 12.424,12.924C12.658,12.69 12.658,12.31 12.424,12.076L4.424,4.076C4.19,3.842 3.81,3.842 3.576,4.076C3.342,4.31 3.342,4.69 3.576,4.924Z" }))));
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
  useQueryClient();
  const { __ } = useI18n();
  const enableAddButton = reactExports.useRef(false);
  const { CloseIcon, handleClose } = useCloseModal(handlePanel);
  const { inserterCells, title, text: text2, data, slug, url, pageId, rowToInsert } = insertOptions;
  const flattenedData = (_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page ?? []);
  const { insertRowResult, insertRow } = useChangeRow({ data: flattenedData, url, slug, pageId });
  const requiredFields = Object.keys(inserterCells).filter((cell) => inserterCells[cell].props.required === true);
  if (rowToInsert) {
    enableAddButton.current = requiredFields.every((key) => Object.keys(rowToInsert).includes(key));
  }
  if (!rowToInsert) {
    enableAddButton.current = false;
  }
  function hidePanel() {
    handleClose();
    enableAddButton.current = false;
    if (handlePanel) {
      handlePanel("clearRow");
    }
  }
  function handleInsert() {
    insertRow({ rowToInsert });
  }
  if (insertRowResult == null ? void 0 : insertRowResult.ok) {
    setTimeout(() => {
      hidePanel();
    }, 100);
  }
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel-wrap urlslab-panel-floating fadeInto" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel-header" }, /* @__PURE__ */ React.createElement("h3", null, title), /* @__PURE__ */ React.createElement("button", { className: "urlslab-panel-close", onClick: hidePanel }, /* @__PURE__ */ React.createElement(CloseIcon, null)), /* @__PURE__ */ React.createElement("p", null, text2)), /* @__PURE__ */ React.createElement("div", { className: "mt-l" }, Object.entries(inserterCells).map(([cellId, cell]) => {
    return /* @__PURE__ */ React.createElement("div", { className: "mb-l", key: cellId }, cell);
  }), /* @__PURE__ */ React.createElement("div", { className: "flex" }, /* @__PURE__ */ React.createElement(Button, { className: "ma-left simple", onClick: hidePanel }, __("Cancel")), /* @__PURE__ */ React.createElement(Button, { active: true, disabled: !enableAddButton.current, onClick: handleInsert }, title)))));
}
var papaparse_minExports = {};
var papaparse_min = {
  get exports() {
    return papaparse_minExports;
  },
  set exports(v2) {
    papaparse_minExports = v2;
  }
};
/* @license
Papa Parse
v5.4.0
https://github.com/mholt/PapaParse
License: MIT
*/
(function(module, exports) {
  !function(e2, t) {
    module.exports = t();
  }(commonjsGlobal, function s2() {
    var f = "undefined" != typeof self ? self : "undefined" != typeof window ? window : void 0 !== f ? f : {};
    var n = !f.document && !!f.postMessage, o = f.IS_PAPA_WORKER || false, a = {}, u2 = 0, b2 = { parse: function(e2, t) {
      var r2 = (t = t || {}).dynamicTyping || false;
      J(r2) && (t.dynamicTypingFunction = r2, r2 = {});
      if (t.dynamicTyping = r2, t.transform = !!J(t.transform) && t.transform, t.worker && b2.WORKERS_SUPPORTED) {
        var i = function() {
          if (!b2.WORKERS_SUPPORTED)
            return false;
          var e3 = (r3 = f.URL || f.webkitURL || null, i2 = s2.toString(), b2.BLOB_URL || (b2.BLOB_URL = r3.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ", "(", i2, ")();"], { type: "text/javascript" })))), t2 = new f.Worker(e3);
          var r3, i2;
          return t2.onmessage = _, t2.id = u2++, a[t2.id] = t2;
        }();
        return i.userStep = t.step, i.userChunk = t.chunk, i.userComplete = t.complete, i.userError = t.error, t.step = J(t.step), t.chunk = J(t.chunk), t.complete = J(t.complete), t.error = J(t.error), delete t.worker, void i.postMessage({ input: e2, config: t, workerId: i.id });
      }
      var n2 = null;
      b2.NODE_STREAM_INPUT, "string" == typeof e2 ? (e2 = function(e3) {
        if (65279 === e3.charCodeAt(0))
          return e3.slice(1);
        return e3;
      }(e2), n2 = t.download ? new l2(t) : new p2(t)) : true === e2.readable && J(e2.read) && J(e2.on) ? n2 = new g2(t) : (f.File && e2 instanceof File || e2 instanceof Object) && (n2 = new c(t));
      return n2.stream(e2);
    }, unparse: function(e2, t) {
      var n2 = false, _2 = true, m3 = ",", y3 = "\r\n", s3 = '"', a2 = s3 + s3, r2 = false, i = null, o2 = false;
      !function() {
        if ("object" != typeof t)
          return;
        "string" != typeof t.delimiter || b2.BAD_DELIMITERS.filter(function(e3) {
          return -1 !== t.delimiter.indexOf(e3);
        }).length || (m3 = t.delimiter);
        ("boolean" == typeof t.quotes || "function" == typeof t.quotes || Array.isArray(t.quotes)) && (n2 = t.quotes);
        "boolean" != typeof t.skipEmptyLines && "string" != typeof t.skipEmptyLines || (r2 = t.skipEmptyLines);
        "string" == typeof t.newline && (y3 = t.newline);
        "string" == typeof t.quoteChar && (s3 = t.quoteChar);
        "boolean" == typeof t.header && (_2 = t.header);
        if (Array.isArray(t.columns)) {
          if (0 === t.columns.length)
            throw new Error("Option columns is empty");
          i = t.columns;
        }
        void 0 !== t.escapeChar && (a2 = t.escapeChar + s3);
        ("boolean" == typeof t.escapeFormulae || t.escapeFormulae instanceof RegExp) && (o2 = t.escapeFormulae instanceof RegExp ? t.escapeFormulae : /^[=+\-@\t\r].*$/);
      }();
      var u3 = new RegExp(Q(s3), "g");
      "string" == typeof e2 && (e2 = JSON.parse(e2));
      if (Array.isArray(e2)) {
        if (!e2.length || Array.isArray(e2[0]))
          return h3(null, e2, r2);
        if ("object" == typeof e2[0])
          return h3(i || Object.keys(e2[0]), e2, r2);
      } else if ("object" == typeof e2)
        return "string" == typeof e2.data && (e2.data = JSON.parse(e2.data)), Array.isArray(e2.data) && (e2.fields || (e2.fields = e2.meta && e2.meta.fields || i), e2.fields || (e2.fields = Array.isArray(e2.data[0]) ? e2.fields : "object" == typeof e2.data[0] ? Object.keys(e2.data[0]) : []), Array.isArray(e2.data[0]) || "object" == typeof e2.data[0] || (e2.data = [e2.data])), h3(e2.fields || [], e2.data || [], r2);
      throw new Error("Unable to serialize unrecognized input");
      function h3(e3, t2, r3) {
        var i2 = "";
        "string" == typeof e3 && (e3 = JSON.parse(e3)), "string" == typeof t2 && (t2 = JSON.parse(t2));
        var n3 = Array.isArray(e3) && 0 < e3.length, s4 = !Array.isArray(t2[0]);
        if (n3 && _2) {
          for (var a3 = 0; a3 < e3.length; a3++)
            0 < a3 && (i2 += m3), i2 += v3(e3[a3], a3);
          0 < t2.length && (i2 += y3);
        }
        for (var o3 = 0; o3 < t2.length; o3++) {
          var u4 = n3 ? e3.length : t2[o3].length, h4 = false, f2 = n3 ? 0 === Object.keys(t2[o3]).length : 0 === t2[o3].length;
          if (r3 && !n3 && (h4 = "greedy" === r3 ? "" === t2[o3].join("").trim() : 1 === t2[o3].length && 0 === t2[o3][0].length), "greedy" === r3 && n3) {
            for (var d2 = [], l3 = 0; l3 < u4; l3++) {
              var c2 = s4 ? e3[l3] : l3;
              d2.push(t2[o3][c2]);
            }
            h4 = "" === d2.join("").trim();
          }
          if (!h4) {
            for (var p3 = 0; p3 < u4; p3++) {
              0 < p3 && !f2 && (i2 += m3);
              var g3 = n3 && s4 ? e3[p3] : p3;
              i2 += v3(t2[o3][g3], p3);
            }
            o3 < t2.length - 1 && (!r3 || 0 < u4 && !f2) && (i2 += y3);
          }
        }
        return i2;
      }
      function v3(e3, t2) {
        if (null == e3)
          return "";
        if (e3.constructor === Date)
          return JSON.stringify(e3).slice(1, 25);
        var r3 = false;
        o2 && "string" == typeof e3 && o2.test(e3) && (e3 = "'" + e3, r3 = true);
        var i2 = e3.toString().replace(u3, a2);
        return (r3 = r3 || true === n2 || "function" == typeof n2 && n2(e3, t2) || Array.isArray(n2) && n2[t2] || function(e4, t3) {
          for (var r4 = 0; r4 < t3.length; r4++)
            if (-1 < e4.indexOf(t3[r4]))
              return true;
          return false;
        }(i2, b2.BAD_DELIMITERS) || -1 < i2.indexOf(m3) || " " === i2.charAt(0) || " " === i2.charAt(i2.length - 1)) ? s3 + i2 + s3 : i2;
      }
    } };
    if (b2.RECORD_SEP = String.fromCharCode(30), b2.UNIT_SEP = String.fromCharCode(31), b2.BYTE_ORDER_MARK = "\uFEFF", b2.BAD_DELIMITERS = ["\r", "\n", '"', b2.BYTE_ORDER_MARK], b2.WORKERS_SUPPORTED = !n && !!f.Worker, b2.NODE_STREAM_INPUT = 1, b2.LocalChunkSize = 10485760, b2.RemoteChunkSize = 5242880, b2.DefaultDelimiter = ",", b2.Parser = E, b2.ParserHandle = r, b2.NetworkStreamer = l2, b2.FileStreamer = c, b2.StringStreamer = p2, b2.ReadableStreamStreamer = g2, f.jQuery) {
      var d = f.jQuery;
      d.fn.parse = function(o2) {
        var r2 = o2.config || {}, u3 = [];
        return this.each(function(e3) {
          if (!("INPUT" === d(this).prop("tagName").toUpperCase() && "file" === d(this).attr("type").toLowerCase() && f.FileReader) || !this.files || 0 === this.files.length)
            return true;
          for (var t = 0; t < this.files.length; t++)
            u3.push({ file: this.files[t], inputElem: this, instanceConfig: d.extend({}, r2) });
        }), e2(), this;
        function e2() {
          if (0 !== u3.length) {
            var e3, t, r3, i, n2 = u3[0];
            if (J(o2.before)) {
              var s3 = o2.before(n2.file, n2.inputElem);
              if ("object" == typeof s3) {
                if ("abort" === s3.action)
                  return e3 = "AbortError", t = n2.file, r3 = n2.inputElem, i = s3.reason, void (J(o2.error) && o2.error({ name: e3 }, t, r3, i));
                if ("skip" === s3.action)
                  return void h3();
                "object" == typeof s3.config && (n2.instanceConfig = d.extend(n2.instanceConfig, s3.config));
              } else if ("skip" === s3)
                return void h3();
            }
            var a2 = n2.instanceConfig.complete;
            n2.instanceConfig.complete = function(e4) {
              J(a2) && a2(e4, n2.file, n2.inputElem), h3();
            }, b2.parse(n2.file, n2.instanceConfig);
          } else
            J(o2.complete) && o2.complete();
        }
        function h3() {
          u3.splice(0, 1), e2();
        }
      };
    }
    function h2(e2) {
      this._handle = null, this._finished = false, this._completed = false, this._halted = false, this._input = null, this._baseIndex = 0, this._partialLine = "", this._rowCount = 0, this._start = 0, this._nextChunk = null, this.isFirstChunk = true, this._completeResults = { data: [], errors: [], meta: {} }, function(e3) {
        var t = w2(e3);
        t.chunkSize = parseInt(t.chunkSize), e3.step || e3.chunk || (t.chunkSize = null);
        this._handle = new r(t), (this._handle.streamer = this)._config = t;
      }.call(this, e2), this.parseChunk = function(e3, t) {
        if (this.isFirstChunk && J(this._config.beforeFirstChunk)) {
          var r2 = this._config.beforeFirstChunk(e3);
          void 0 !== r2 && (e3 = r2);
        }
        this.isFirstChunk = false, this._halted = false;
        var i = this._partialLine + e3;
        this._partialLine = "";
        var n2 = this._handle.parse(i, this._baseIndex, !this._finished);
        if (!this._handle.paused() && !this._handle.aborted()) {
          var s3 = n2.meta.cursor;
          this._finished || (this._partialLine = i.substring(s3 - this._baseIndex), this._baseIndex = s3), n2 && n2.data && (this._rowCount += n2.data.length);
          var a2 = this._finished || this._config.preview && this._rowCount >= this._config.preview;
          if (o)
            f.postMessage({ results: n2, workerId: b2.WORKER_ID, finished: a2 });
          else if (J(this._config.chunk) && !t) {
            if (this._config.chunk(n2, this._handle), this._handle.paused() || this._handle.aborted())
              return void (this._halted = true);
            n2 = void 0, this._completeResults = void 0;
          }
          return this._config.step || this._config.chunk || (this._completeResults.data = this._completeResults.data.concat(n2.data), this._completeResults.errors = this._completeResults.errors.concat(n2.errors), this._completeResults.meta = n2.meta), this._completed || !a2 || !J(this._config.complete) || n2 && n2.meta.aborted || (this._config.complete(this._completeResults, this._input), this._completed = true), a2 || n2 && n2.meta.paused || this._nextChunk(), n2;
        }
        this._halted = true;
      }, this._sendError = function(e3) {
        J(this._config.error) ? this._config.error(e3) : o && this._config.error && f.postMessage({ workerId: b2.WORKER_ID, error: e3, finished: false });
      };
    }
    function l2(e2) {
      var i;
      (e2 = e2 || {}).chunkSize || (e2.chunkSize = b2.RemoteChunkSize), h2.call(this, e2), this._nextChunk = n ? function() {
        this._readChunk(), this._chunkLoaded();
      } : function() {
        this._readChunk();
      }, this.stream = function(e3) {
        this._input = e3, this._nextChunk();
      }, this._readChunk = function() {
        if (this._finished)
          this._chunkLoaded();
        else {
          if (i = new XMLHttpRequest(), this._config.withCredentials && (i.withCredentials = this._config.withCredentials), n || (i.onload = v2(this._chunkLoaded, this), i.onerror = v2(this._chunkError, this)), i.open(this._config.downloadRequestBody ? "POST" : "GET", this._input, !n), this._config.downloadRequestHeaders) {
            var e3 = this._config.downloadRequestHeaders;
            for (var t in e3)
              i.setRequestHeader(t, e3[t]);
          }
          if (this._config.chunkSize) {
            var r2 = this._start + this._config.chunkSize - 1;
            i.setRequestHeader("Range", "bytes=" + this._start + "-" + r2);
          }
          try {
            i.send(this._config.downloadRequestBody);
          } catch (e4) {
            this._chunkError(e4.message);
          }
          n && 0 === i.status && this._chunkError();
        }
      }, this._chunkLoaded = function() {
        4 === i.readyState && (i.status < 200 || 400 <= i.status ? this._chunkError() : (this._start += this._config.chunkSize ? this._config.chunkSize : i.responseText.length, this._finished = !this._config.chunkSize || this._start >= function(e3) {
          var t = e3.getResponseHeader("Content-Range");
          if (null === t)
            return -1;
          return parseInt(t.substring(t.lastIndexOf("/") + 1));
        }(i), this.parseChunk(i.responseText)));
      }, this._chunkError = function(e3) {
        var t = i.statusText || e3;
        this._sendError(new Error(t));
      };
    }
    function c(e2) {
      var i, n2;
      (e2 = e2 || {}).chunkSize || (e2.chunkSize = b2.LocalChunkSize), h2.call(this, e2);
      var s3 = "undefined" != typeof FileReader;
      this.stream = function(e3) {
        this._input = e3, n2 = e3.slice || e3.webkitSlice || e3.mozSlice, s3 ? ((i = new FileReader()).onload = v2(this._chunkLoaded, this), i.onerror = v2(this._chunkError, this)) : i = new FileReaderSync(), this._nextChunk();
      }, this._nextChunk = function() {
        this._finished || this._config.preview && !(this._rowCount < this._config.preview) || this._readChunk();
      }, this._readChunk = function() {
        var e3 = this._input;
        if (this._config.chunkSize) {
          var t = Math.min(this._start + this._config.chunkSize, this._input.size);
          e3 = n2.call(e3, this._start, t);
        }
        var r2 = i.readAsText(e3, this._config.encoding);
        s3 || this._chunkLoaded({ target: { result: r2 } });
      }, this._chunkLoaded = function(e3) {
        this._start += this._config.chunkSize, this._finished = !this._config.chunkSize || this._start >= this._input.size, this.parseChunk(e3.target.result);
      }, this._chunkError = function() {
        this._sendError(i.error);
      };
    }
    function p2(e2) {
      var r2;
      h2.call(this, e2 = e2 || {}), this.stream = function(e3) {
        return r2 = e3, this._nextChunk();
      }, this._nextChunk = function() {
        if (!this._finished) {
          var e3, t = this._config.chunkSize;
          return t ? (e3 = r2.substring(0, t), r2 = r2.substring(t)) : (e3 = r2, r2 = ""), this._finished = !r2, this.parseChunk(e3);
        }
      };
    }
    function g2(e2) {
      h2.call(this, e2 = e2 || {});
      var t = [], r2 = true, i = false;
      this.pause = function() {
        h2.prototype.pause.apply(this, arguments), this._input.pause();
      }, this.resume = function() {
        h2.prototype.resume.apply(this, arguments), this._input.resume();
      }, this.stream = function(e3) {
        this._input = e3, this._input.on("data", this._streamData), this._input.on("end", this._streamEnd), this._input.on("error", this._streamError);
      }, this._checkIsFinished = function() {
        i && 1 === t.length && (this._finished = true);
      }, this._nextChunk = function() {
        this._checkIsFinished(), t.length ? this.parseChunk(t.shift()) : r2 = true;
      }, this._streamData = v2(function(e3) {
        try {
          t.push("string" == typeof e3 ? e3 : e3.toString(this._config.encoding)), r2 && (r2 = false, this._checkIsFinished(), this.parseChunk(t.shift()));
        } catch (e4) {
          this._streamError(e4);
        }
      }, this), this._streamError = v2(function(e3) {
        this._streamCleanUp(), this._sendError(e3);
      }, this), this._streamEnd = v2(function() {
        this._streamCleanUp(), i = true, this._streamData("");
      }, this), this._streamCleanUp = v2(function() {
        this._input.removeListener("data", this._streamData), this._input.removeListener("end", this._streamEnd), this._input.removeListener("error", this._streamError);
      }, this);
    }
    function r(m3) {
      var a2, o2, u3, i = Math.pow(2, 53), n2 = -i, s3 = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/, h3 = /^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/, t = this, r2 = 0, f2 = 0, d2 = false, e2 = false, l3 = [], c2 = { data: [], errors: [], meta: {} };
      if (J(m3.step)) {
        var p3 = m3.step;
        m3.step = function(e3) {
          if (c2 = e3, _2())
            g3();
          else {
            if (g3(), 0 === c2.data.length)
              return;
            r2 += e3.data.length, m3.preview && r2 > m3.preview ? o2.abort() : (c2.data = c2.data[0], p3(c2, t));
          }
        };
      }
      function y3(e3) {
        return "greedy" === m3.skipEmptyLines ? "" === e3.join("").trim() : 1 === e3.length && 0 === e3[0].length;
      }
      function g3() {
        return c2 && u3 && (k2("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '" + b2.DefaultDelimiter + "'"), u3 = false), m3.skipEmptyLines && (c2.data = c2.data.filter(function(e3) {
          return !y3(e3);
        })), _2() && function() {
          if (!c2)
            return;
          function e3(e4, t3) {
            J(m3.transformHeader) && (e4 = m3.transformHeader(e4, t3)), l3.push(e4);
          }
          if (Array.isArray(c2.data[0])) {
            for (var t2 = 0; _2() && t2 < c2.data.length; t2++)
              c2.data[t2].forEach(e3);
            c2.data.splice(0, 1);
          } else
            c2.data.forEach(e3);
        }(), function() {
          if (!c2 || !m3.header && !m3.dynamicTyping && !m3.transform)
            return c2;
          function e3(e4, t3) {
            var r3, i2 = m3.header ? {} : [];
            for (r3 = 0; r3 < e4.length; r3++) {
              var n3 = r3, s4 = e4[r3];
              m3.header && (n3 = r3 >= l3.length ? "__parsed_extra" : l3[r3]), m3.transform && (s4 = m3.transform(s4, n3)), s4 = v3(n3, s4), "__parsed_extra" === n3 ? (i2[n3] = i2[n3] || [], i2[n3].push(s4)) : i2[n3] = s4;
            }
            return m3.header && (r3 > l3.length ? k2("FieldMismatch", "TooManyFields", "Too many fields: expected " + l3.length + " fields but parsed " + r3, f2 + t3) : r3 < l3.length && k2("FieldMismatch", "TooFewFields", "Too few fields: expected " + l3.length + " fields but parsed " + r3, f2 + t3)), i2;
          }
          var t2 = 1;
          !c2.data.length || Array.isArray(c2.data[0]) ? (c2.data = c2.data.map(e3), t2 = c2.data.length) : c2.data = e3(c2.data, 0);
          m3.header && c2.meta && (c2.meta.fields = l3);
          return f2 += t2, c2;
        }();
      }
      function _2() {
        return m3.header && 0 === l3.length;
      }
      function v3(e3, t2) {
        return r3 = e3, m3.dynamicTypingFunction && void 0 === m3.dynamicTyping[r3] && (m3.dynamicTyping[r3] = m3.dynamicTypingFunction(r3)), true === (m3.dynamicTyping[r3] || m3.dynamicTyping) ? "true" === t2 || "TRUE" === t2 || "false" !== t2 && "FALSE" !== t2 && (function(e4) {
          if (s3.test(e4)) {
            var t3 = parseFloat(e4);
            if (n2 < t3 && t3 < i)
              return true;
          }
          return false;
        }(t2) ? parseFloat(t2) : h3.test(t2) ? new Date(t2) : "" === t2 ? null : t2) : t2;
        var r3;
      }
      function k2(e3, t2, r3, i2) {
        var n3 = { type: e3, code: t2, message: r3 };
        void 0 !== i2 && (n3.row = i2), c2.errors.push(n3);
      }
      this.parse = function(e3, t2, r3) {
        var i2 = m3.quoteChar || '"';
        if (m3.newline || (m3.newline = function(e4, t3) {
          e4 = e4.substring(0, 1048576);
          var r4 = new RegExp(Q(t3) + "([^]*?)" + Q(t3), "gm"), i3 = (e4 = e4.replace(r4, "")).split("\r"), n4 = e4.split("\n"), s5 = 1 < n4.length && n4[0].length < i3[0].length;
          if (1 === i3.length || s5)
            return "\n";
          for (var a3 = 0, o3 = 0; o3 < i3.length; o3++)
            "\n" === i3[o3][0] && a3++;
          return a3 >= i3.length / 2 ? "\r\n" : "\r";
        }(e3, i2)), u3 = false, m3.delimiter)
          J(m3.delimiter) && (m3.delimiter = m3.delimiter(e3), c2.meta.delimiter = m3.delimiter);
        else {
          var n3 = function(e4, t3, r4, i3, n4) {
            var s5, a3, o3, u4;
            n4 = n4 || [",", "	", "|", ";", b2.RECORD_SEP, b2.UNIT_SEP];
            for (var h4 = 0; h4 < n4.length; h4++) {
              var f3 = n4[h4], d3 = 0, l4 = 0, c3 = 0;
              o3 = void 0;
              for (var p4 = new E({ comments: i3, delimiter: f3, newline: t3, preview: 10 }).parse(e4), g4 = 0; g4 < p4.data.length; g4++)
                if (r4 && y3(p4.data[g4]))
                  c3++;
                else {
                  var _3 = p4.data[g4].length;
                  l4 += _3, void 0 !== o3 ? 0 < _3 && (d3 += Math.abs(_3 - o3), o3 = _3) : o3 = _3;
                }
              0 < p4.data.length && (l4 /= p4.data.length - c3), (void 0 === a3 || d3 <= a3) && (void 0 === u4 || u4 < l4) && 1.99 < l4 && (a3 = d3, s5 = f3, u4 = l4);
            }
            return { successful: !!(m3.delimiter = s5), bestDelimiter: s5 };
          }(e3, m3.newline, m3.skipEmptyLines, m3.comments, m3.delimitersToGuess);
          n3.successful ? m3.delimiter = n3.bestDelimiter : (u3 = true, m3.delimiter = b2.DefaultDelimiter), c2.meta.delimiter = m3.delimiter;
        }
        var s4 = w2(m3);
        return m3.preview && m3.header && s4.preview++, a2 = e3, o2 = new E(s4), c2 = o2.parse(a2, t2, r3), g3(), d2 ? { meta: { paused: true } } : c2 || { meta: { paused: false } };
      }, this.paused = function() {
        return d2;
      }, this.pause = function() {
        d2 = true, o2.abort(), a2 = J(m3.chunk) ? "" : a2.substring(o2.getCharIndex());
      }, this.resume = function() {
        t.streamer._halted ? (d2 = false, t.streamer.parseChunk(a2, true)) : setTimeout(t.resume, 3);
      }, this.aborted = function() {
        return e2;
      }, this.abort = function() {
        e2 = true, o2.abort(), c2.meta.aborted = true, J(m3.complete) && m3.complete(c2), a2 = "";
      };
    }
    function Q(e2) {
      return e2.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    function E(j2) {
      var z, M = (j2 = j2 || {}).delimiter, P2 = j2.newline, U = j2.comments, q = j2.step, N = j2.preview, B = j2.fastMode, K = z = void 0 === j2.quoteChar || null === j2.quoteChar ? '"' : j2.quoteChar;
      if (void 0 !== j2.escapeChar && (K = j2.escapeChar), ("string" != typeof M || -1 < b2.BAD_DELIMITERS.indexOf(M)) && (M = ","), U === M)
        throw new Error("Comment character same as delimiter");
      true === U ? U = "#" : ("string" != typeof U || -1 < b2.BAD_DELIMITERS.indexOf(U)) && (U = false), "\n" !== P2 && "\r" !== P2 && "\r\n" !== P2 && (P2 = "\n");
      var W = 0, H = false;
      this.parse = function(i, t, r2) {
        if ("string" != typeof i)
          throw new Error("Input must be a string");
        var n2 = i.length, e2 = M.length, s3 = P2.length, a2 = U.length, o2 = J(q), u3 = [], h3 = [], f2 = [], d2 = W = 0;
        if (!i)
          return L2();
        if (j2.header) {
          var l3 = i.split(P2)[0].split(M), c2 = [], p3 = {}, g3 = false;
          for (var _2 in l3) {
            var m3 = l3[_2];
            J(j2.transformHeader) && (m3 = j2.transformHeader(m3, _2));
            var y3 = m3, v3 = p3[m3] || 0;
            0 < v3 && (g3 = true, y3 = m3 + "_" + v3), p3[m3] = v3 + 1, c2.push(y3);
          }
          if (g3) {
            var k2 = i.split(P2);
            k2[0] = c2.join(M), i = k2.join(P2);
          }
        }
        if (B || false !== B && -1 === i.indexOf(z)) {
          for (var b3 = i.split(P2), E2 = 0; E2 < b3.length; E2++) {
            if (f2 = b3[E2], W += f2.length, E2 !== b3.length - 1)
              W += P2.length;
            else if (r2)
              return L2();
            if (!U || f2.substring(0, a2) !== U) {
              if (o2) {
                if (u3 = [], I(f2.split(M)), F2(), H)
                  return L2();
              } else
                I(f2.split(M));
              if (N && N <= E2)
                return u3 = u3.slice(0, N), L2(true);
            }
          }
          return L2();
        }
        for (var w3 = i.indexOf(M, W), R2 = i.indexOf(P2, W), C = new RegExp(Q(K) + Q(z), "g"), S2 = i.indexOf(z, W); ; )
          if (i[W] !== z)
            if (U && 0 === f2.length && i.substring(W, W + a2) === U) {
              if (-1 === R2)
                return L2();
              W = R2 + s3, R2 = i.indexOf(P2, W), w3 = i.indexOf(M, W);
            } else if (-1 !== w3 && (w3 < R2 || -1 === R2))
              f2.push(i.substring(W, w3)), W = w3 + e2, w3 = i.indexOf(M, W);
            else {
              if (-1 === R2)
                break;
              if (f2.push(i.substring(W, R2)), D2(R2 + s3), o2 && (F2(), H))
                return L2();
              if (N && u3.length >= N)
                return L2(true);
            }
          else
            for (S2 = W, W++; ; ) {
              if (-1 === (S2 = i.indexOf(z, S2 + 1)))
                return r2 || h3.push({ type: "Quotes", code: "MissingQuotes", message: "Quoted field unterminated", row: u3.length, index: W }), T2();
              if (S2 === n2 - 1)
                return T2(i.substring(W, S2).replace(C, z));
              if (z !== K || i[S2 + 1] !== K) {
                if (z === K || 0 === S2 || i[S2 - 1] !== K) {
                  -1 !== w3 && w3 < S2 + 1 && (w3 = i.indexOf(M, S2 + 1)), -1 !== R2 && R2 < S2 + 1 && (R2 = i.indexOf(P2, S2 + 1));
                  var O = A2(-1 === R2 ? w3 : Math.min(w3, R2));
                  if (i.substr(S2 + 1 + O, e2) === M) {
                    f2.push(i.substring(W, S2).replace(C, z)), i[W = S2 + 1 + O + e2] !== z && (S2 = i.indexOf(z, W)), w3 = i.indexOf(M, W), R2 = i.indexOf(P2, W);
                    break;
                  }
                  var x = A2(R2);
                  if (i.substring(S2 + 1 + x, S2 + 1 + x + s3) === P2) {
                    if (f2.push(i.substring(W, S2).replace(C, z)), D2(S2 + 1 + x + s3), w3 = i.indexOf(M, W), S2 = i.indexOf(z, W), o2 && (F2(), H))
                      return L2();
                    if (N && u3.length >= N)
                      return L2(true);
                    break;
                  }
                  h3.push({ type: "Quotes", code: "InvalidQuotes", message: "Trailing quote on quoted field is malformed", row: u3.length, index: W }), S2++;
                }
              } else
                S2++;
            }
        return T2();
        function I(e3) {
          u3.push(e3), d2 = W;
        }
        function A2(e3) {
          var t2 = 0;
          if (-1 !== e3) {
            var r3 = i.substring(S2 + 1, e3);
            r3 && "" === r3.trim() && (t2 = r3.length);
          }
          return t2;
        }
        function T2(e3) {
          return r2 || (void 0 === e3 && (e3 = i.substring(W)), f2.push(e3), W = n2, I(f2), o2 && F2()), L2();
        }
        function D2(e3) {
          W = e3, I(f2), f2 = [], R2 = i.indexOf(P2, W);
        }
        function L2(e3) {
          return { data: u3, errors: h3, meta: { delimiter: M, linebreak: P2, aborted: H, truncated: !!e3, cursor: d2 + (t || 0) } };
        }
        function F2() {
          q(L2()), u3 = [], h3 = [];
        }
      }, this.abort = function() {
        H = true;
      }, this.getCharIndex = function() {
        return W;
      };
    }
    function _(e2) {
      var t = e2.data, r2 = a[t.workerId], i = false;
      if (t.error)
        r2.userError(t.error, t.file);
      else if (t.results && t.results.data) {
        var n2 = { abort: function() {
          i = true, m2(t.workerId, { data: [], errors: [], meta: { aborted: true } });
        }, pause: y2, resume: y2 };
        if (J(r2.userStep)) {
          for (var s3 = 0; s3 < t.results.data.length && (r2.userStep({ data: t.results.data[s3], errors: t.results.errors, meta: t.results.meta }, n2), !i); s3++)
            ;
          delete t.results;
        } else
          J(r2.userChunk) && (r2.userChunk(t.results, n2, t.file), delete t.results);
      }
      t.finished && !i && m2(t.workerId, t.results);
    }
    function m2(e2, t) {
      var r2 = a[e2];
      J(r2.userComplete) && r2.userComplete(t), r2.terminate(), delete a[e2];
    }
    function y2() {
      throw new Error("Not implemented.");
    }
    function w2(e2) {
      if ("object" != typeof e2 || null === e2)
        return e2;
      var t = Array.isArray(e2) ? [] : {};
      for (var r2 in e2)
        t[r2] = w2(e2[r2]);
      return t;
    }
    function v2(e2, t) {
      return function() {
        e2.apply(t, arguments);
      };
    }
    function J(e2) {
      return "function" == typeof e2;
    }
    return o && (f.onmessage = function(e2) {
      var t = e2.data;
      void 0 === b2.WORKER_ID && t && (b2.WORKER_ID = t.workerId);
      if ("string" == typeof t.input)
        f.postMessage({ workerId: b2.WORKER_ID, results: b2.parse(t.input, t.config), finished: true });
      else if (f.File && t.input instanceof File || t.input instanceof Object) {
        var r2 = b2.parse(t.input, t.config);
        r2 && f.postMessage({ workerId: b2.WORKER_ID, results: r2, finished: true });
      }
    }), (l2.prototype = Object.create(h2.prototype)).constructor = l2, (c.prototype = Object.create(h2.prototype)).constructor = c, (p2.prototype = Object.create(p2.prototype)).constructor = p2, (g2.prototype = Object.create(h2.prototype)).constructor = g2, b2;
  });
})(papaparse_min);
const e = papaparse_minExports;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var u = function() {
  return u = Object.assign || function(e2) {
    for (var n, r = 1, t = arguments.length; r < t; r++)
      for (var o in n = arguments[r])
        Object.prototype.hasOwnProperty.call(n, o) && (e2[o] = n[o]);
    return e2;
  }, u.apply(this, arguments);
};
function s(e2, n) {
  var r = {};
  for (var t in e2)
    Object.prototype.hasOwnProperty.call(e2, t) && n.indexOf(t) < 0 && (r[t] = e2[t]);
  if (null != e2 && "function" == typeof Object.getOwnPropertySymbols) {
    var o = 0;
    for (t = Object.getOwnPropertySymbols(e2); o < t.length; o++)
      n.indexOf(t[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e2, t[o]) && (r[t[o]] = e2[t[o]]);
  }
  return r;
}
function l(e2, n) {
  for (var r = 0, t = n.length, o = e2.length; r < t; r++, o++)
    e2[o] = n[r];
  return e2;
}
function p(e2) {
  return "function" == typeof e2.isPropagationStopped ? e2.isPropagationStopped() : void 0 !== e2.cancelBubble && e2.cancelBubble;
}
function v() {
  for (var e2 = [], n = 0; n < arguments.length; n++)
    e2[n] = arguments[n];
  return function(n2) {
    for (var r = [], t = 1; t < arguments.length; t++)
      r[t - 1] = arguments[t];
    return e2.some(function(e3) {
      return !p(n2) && e3 && e3.apply(void 0, l([n2], r)), p(n2);
    });
  };
}
function g(e2) {
  return e2.dataTransfer ? Array.prototype.some.call(e2.dataTransfer.types, function(e3) {
    return "Files" === e3 || "application/x-moz-file" === e3;
  }) : !!e2.target && !!e2.target.files;
}
var m = function(e2) {
  e2 = Array.isArray(e2) && 1 === e2.length ? e2[0] : e2;
  var n = Array.isArray(e2) ? "one of ".concat(e2.join(", ")) : e2;
  return { code: "file-invalid-type", message: "File type must be ".concat(n) };
};
function y(e2, n) {
  var r = "application/x-moz-file" === e2.type || function(e3, n2) {
    if (e3 && n2) {
      var r2 = Array.isArray(n2) ? n2 : n2.split(","), t = e3.name || "", o = (e3.type || "").toLowerCase(), i = o.replace(/\/.*$/, "");
      return r2.some(function(e4) {
        var n3 = e4.trim().toLowerCase();
        return "." === n3.charAt(0) ? t.toLowerCase().endsWith(n3) : n3.endsWith("/*") ? i === n3.replace(/\/.*$/, "") : o === n3;
      });
    }
    return true;
  }(e2, n);
  return [r, r ? null : m(n)];
}
function h(e2) {
  return null != e2;
}
var D = function(e2) {
  return { code: "file-too-large", message: "File is larger than ".concat(e2, " bytes") };
}, F = function(e2) {
  return { code: "file-too-small", message: "File is smaller than ".concat(e2, " bytes") };
}, b = { code: "too-many-files", message: "Too many files" };
function w(e2) {
  e2.preventDefault();
}
function P(n, r) {
  return void 0 === r && (r = {}), e.unparse(n, r);
}
var A = { progressBar: { borderRadius: 3, boxShadow: "inset 0 1px 3px rgba(0, 0, 0, .2)", bottom: 14, width: "100%" }, button: { position: "inherit", width: "100%" }, fill: { backgroundColor: "#659cef", borderRadius: 3, height: 10, transition: "width 500ms ease-in-out" } };
function S(e2) {
  var o = e2.style, i = e2.className, a = e2.display, c = reactExports.useState(0), u2 = c[0], s2 = c[1];
  return reactExports.useEffect(function() {
    s2(e2.percentage);
  }, [e2.percentage]), React.createElement("span", { style: Object.assign({}, A.progressBar, A.fill, o, { width: "".concat(u2, "%"), display: a }), className: i });
}
function k(e2) {
  var r = e2.color, t = e2.width, o = void 0 === t ? 23 : t, i = e2.height, a = void 0 === i ? 23 : i;
  return React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: o, height: a, viewBox: "0 0 512 512" }, React.createElement("path", { fill: r, d: "M504.1 256C504.1 119 393 7.9 256 7.9S7.9 119 7.9 256 119 504.1 256 504.1 504.1 393 504.1 256z" }), React.createElement("path", { fill: "#FFF", d: "M285 256l72.5-84.2c7.9-9.2 6.9-23-2.3-31-9.2-7.9-23-6.9-30.9 2.3L256 222.4l-68.2-79.2c-7.9-9.2-21.8-10.2-31-2.3-9.2 7.9-10.2 21.8-2.3 31L227 256l-72.5 84.2c-7.9 9.2-6.9 23 2.3 31 4.1 3.6 9.2 5.3 14.3 5.3 6.2 0 12.3-2.6 16.6-7.6l68.2-79.2 68.2 79.2c4.3 5 10.5 7.6 16.6 7.6 5.1 0 10.2-1.7 14.3-5.3 9.2-7.9 10.2-21.8 2.3-31L285 256z" }));
}
function L() {
  var r = function(r2) {
    var f = r2.children, d = r2.accept, m2 = void 0 === d ? "text/csv, .csv, application/vnd.ms-excel" : d, E = r2.config, B = void 0 === E ? {} : E, P2 = r2.minSize, O = void 0 === P2 ? 0 : P2, C = r2.maxSize, x = void 0 === C ? 1 / 0 : C, A2 = r2.maxFiles, L2 = void 0 === A2 ? 1 : A2, R2 = r2.disabled, z = void 0 !== R2 && R2, K = r2.noClick, M = void 0 !== K && K, N = r2.noDrag, I = void 0 !== N && N, U = r2.noDragEventsBubbling, _ = void 0 !== U && U, q = r2.noKeyboard, V = void 0 !== q && q, W = r2.multiple, $ = void 0 !== W && W, G = r2.required, H = void 0 !== G && G, J = r2.preventDropOnDocument, Q = void 0 === J || J, X = r2.onUploadAccepted, Y = r2.validator, Z = r2.onUploadRejected, ee = r2.onDragEnter, ne = r2.onDragOver, re = r2.onDragLeave, te = reactExports.useRef(null), oe = reactExports.useRef(null), ie = reactExports.useRef([]), ae = reactExports.useReducer(T, j), ce = ae[0], ue = ae[1], se = ce.acceptedFile, le = ce.displayProgressBar, fe = ce.progressBarPercentage, de = ce.draggedFiles, pe = ce.isFileDialogActive, ve = function(e2) {
      oe.current && oe.current.contains(e2.target) || (e2.preventDefault(), ie.current = []);
    };
    reactExports.useEffect(function() {
      return Q && (document.addEventListener("dragover", w, false), document.addEventListener("drop", ve, false)), function() {
        Q && (document.removeEventListener("dragover", w), document.removeEventListener("drop", ve));
      };
    }, [oe, Q]);
    var ge = function(e2) {
      return z ? null : e2;
    }, me = function(e2) {
      return I ? null : ge(e2);
    }, ye = function(e2) {
      _ && e2.stopPropagation();
    }, he = function(e2) {
      e2.preventDefault(e2), e2.persist(), ye(e2);
    }, De = function(e2) {
      ue({ displayProgressBar: e2, type: "setDisplayProgressBar" });
    }, Fe = function(e2) {
      ue({ progressBarPercentage: e2, type: "setProgressBarPercentage" });
    }, be = function(e2) {
      return React.createElement(S, u({ display: le, percentage: fe }, e2));
    }, we = function(e2) {
      return React.createElement(k, u({}, e2));
    }, Ee = reactExports.useCallback(function() {
      te.current && ce.displayProgressBar && (ue({ type: "openDialog" }), te.current.value = null, te.current.click());
    }, [ue]), Be = function() {
      pe && setTimeout(function() {
        te.current && (te.current.files.length || ue({ type: "closeDialog" }));
      }, 300);
    };
    reactExports.useEffect(function() {
      return window.addEventListener("focus", Be, false), function() {
        window.removeEventListener("focus", Be, false);
      };
    }, [te, pe]);
    var Pe = reactExports.useCallback(function() {
      var e2;
      M || (void 0 === e2 && (e2 = window.navigator.userAgent), function(e3) {
        return -1 !== e3.indexOf("MSIE") || -1 !== e3.indexOf("Trident/");
      }(e2) || function(e3) {
        return -1 !== e3.indexOf("Edge/");
      }(e2) ? setTimeout(Ee, 0) : Ee());
    }, [te, M]), Oe = reactExports.useCallback(function(n) {
      if (he(n), Fe(0), ie.current = [], g(n)) {
        if (p(n) && !_)
          return;
        var r3 = [], t = [], o = n.target.files || n.dataTransfer && n.dataTransfer.files;
        if (Array.from(o).forEach(function(e2) {
          var n2 = y(e2, m2), o2 = n2[0], i2 = n2[1], a2 = function(e3, n3, r4) {
            if (h(e3.size))
              if (h(n3) && h(r4)) {
                if (e3.size > r4)
                  return [false, D(r4)];
                if (e3.size < n3)
                  return [false, F(n3)];
              } else {
                if (h(n3) && e3.size < n3)
                  return [false, F(n3)];
                if (h(r4) && e3.size > r4)
                  return [false, D(r4)];
              }
            return [true, null];
          }(e2, O, x), c2 = a2[0], u3 = a2[1], s3 = Y ? Y(e2) : null;
          if (o2 && c2 && !s3)
            r3.push(e2);
          else {
            var l3 = [i2, u3];
            s3 && (l3 = l3.concat(s3)), t.push({ file: e2, errors: l3.filter(function(e3) {
              return e3;
            }) });
          }
        }), (!$ && r3.length > 1 || $ && L2 >= 1 && r3.length > L2) && (r3.forEach(function(e2) {
          t.push({ file: e2, errors: [b] });
        }), r3.splice(0)), ue({ acceptedFiles: r3, fileRejections: t, type: "setFiles" }), De("block"), t.length > 0 && Z && Z(t, n), r3.length > 0 && X) {
          var i = {}, a = [], c = [], u2 = [], s2 = new window.FileReader(), l2 = 0;
          r3.forEach(function(n2) {
            ue({ acceptedFile: n2, type: "setFile" }), i = { complete: (null == B ? void 0 : B.complete) || (null == B ? void 0 : B.step) ? B.complete : function() {
              X({ data: a, errors: c, meta: u2 }, n2);
            }, step: (null == B ? void 0 : B.step) ? B.step : function(e2) {
              if (a.push(e2.data), e2.errors.length > 0 && c.push(e2.errors), e2.length > 0 && u2.push(e2[0].meta), B && B.preview) {
                if (l2 = Math.round(a.length / B.preview * 100), a.length === B.preview)
                  X({ data: a, errors: c, meta: u2 }, n2);
              } else {
                var r4 = e2.meta.cursor, t2 = Math.round(r4 / n2.size * 100);
                if (t2 === l2)
                  return;
                l2 = t2;
              }
              Fe(l2);
            } }, i = Object.assign({}, B, i), s2.onload = function(n3) {
              e.parse(n3.target.result, i);
            }, s2.onloadend = function() {
              setTimeout(function() {
                De("none");
              }, 2e3);
            }, s2.readAsText(n2, B.encoding || "utf-8");
          });
        }
      }
    }, [$, m2, O, x, L2, Y, X]), Ce = reactExports.useCallback(function(e2) {
      ye(e2);
    }, []), xe = function(e2) {
      return V ? null : ge(e2);
    }, Ae = reactExports.useCallback(function(e2) {
      if (he(e2), ie.current = l(l([], ie.current), [e2.target]), g(e2)) {
        if (p(e2) && !_)
          return;
        ue({ draggedFiles: de, isDragActive: true, type: "setDraggedFiles" }), ee && ee(e2);
      }
    }, [ee, _]), Se = reactExports.useCallback(function(e2) {
      he(e2);
      var n = g(e2);
      if (n && e2.dataTransfer)
        try {
          e2.dataTransfer.dropEffect = "copy";
        } catch (e3) {
        }
      return n && ne && ne(e2), false;
    }, [ne, _]), ke = reactExports.useCallback(function(e2) {
      he(e2);
      var n = ie.current.filter(function(e3) {
        return oe.current && oe.current.contains(e3);
      }), r3 = n.indexOf(e2.target);
      -1 !== r3 && n.splice(r3, 1), ie.current = n, n.length > 0 || (ue({ isDragActive: false, type: "setDraggedFiles", draggedFiles: [] }), g(e2) && re && re(e2));
    }, [oe, re, _]), Le = reactExports.useCallback(function(e2) {
      oe.current && oe.current.isEqualNode(e2.target) && ("Space" !== e2.key && "Enter" !== e2.key || (e2.preventDefault(), Ee()));
    }, [oe, te]), Re = reactExports.useCallback(function() {
      ue({ type: "focus" });
    }, []), je = reactExports.useCallback(function() {
      ue({ type: "blur" });
    }, []), Te = reactExports.useMemo(function() {
      return function(e2) {
        void 0 === e2 && (e2 = {});
        var n = e2.onClick, r3 = void 0 === n ? function() {
        } : n, t = e2.onDrop, o = void 0 === t ? function() {
        } : t, i = e2.onDragOver, a = void 0 === i ? function() {
        } : i, c = e2.onDragLeave, l2 = void 0 === c ? function() {
        } : c, f2 = e2.onKeyDown, d2 = void 0 === f2 ? function() {
        } : f2, p2 = e2.onFocus, g2 = void 0 === p2 ? function() {
        } : p2, m3 = e2.onBlur, y2 = void 0 === m3 ? function() {
        } : m3, h2 = e2.onDragEnter, D2 = void 0 === h2 ? function() {
        } : h2, F2 = s(e2, ["onClick", "onDrop", "onDragOver", "onDragLeave", "onKeyDown", "onFocus", "onBlur", "onDragEnter"]);
        return u({ onClick: ge(v(r3, Pe)), onDrop: me(v(o, Oe)), onDragEnter: me(v(D2, Ae)), onDragOver: me(v(a, Se)), onDragLeave: me(v(l2, ke)), onKeyDown: xe(v(d2, Le)), onFocus: xe(v(g2, Re)), onBlur: xe(v(y2, je)) }, F2);
      };
    }, [oe, Le, Re, je, Pe, Ae, Se, ke, Oe, V, I, z]), ze = reactExports.useMemo(function() {
      return function(e2) {
        var n;
        void 0 === e2 && (e2 = {});
        var r3 = e2.refKey, t = void 0 === r3 ? "ref" : r3, o = e2.onChange, i = void 0 === o ? function() {
        } : o, a = e2.onClick, c = void 0 === a ? function() {
        } : a, l2 = s(e2, ["refKey", "onChange", "onClick"]), f2 = ((n = { accept: m2, multiple: $, required: H, type: "file", style: { display: "none" }, onChange: ge(v(i, Oe)), onClick: ge(v(c, Ce)), autoComplete: "off", tabIndex: -1 })[t] = te, n);
        return u(u({}, f2), l2);
      };
    }, [te, m2, Oe, z]), Ke = reactExports.useCallback(function(e2) {
      te.current.value = "", ue({ type: "reset" }), e2.stopPropagation();
    }, []), Me = reactExports.useMemo(function() {
      return function(e2) {
        void 0 === e2 && (e2 = {});
        var n = e2.onClick, r3 = void 0 === n ? function() {
        } : n, t = s(e2, ["onClick"]);
        return u({ onClick: ge(v(r3, Ke)) }, t);
      };
    }, [Ke]);
    return React.createElement(React.Fragment, null, React.createElement("input", u({}, ze())), f({ getRootProps: Te, acceptedFile: se, ProgressBar: be, getRemoveFileProps: Me, Remove: we }));
  };
  return reactExports.useMemo(function() {
    return r;
  }, []);
}
function R() {
  return { CSVReader: L() };
}
var j = { displayProgressBar: "none", progressBarPercentage: 0, isDragActive: false, isFileDialogActive: false, isFocused: false, draggedFiles: [], acceptedFiles: [], acceptedFile: null };
function T(e2, n) {
  switch (n.type) {
    case "openDialog":
      return u(u({}, e2), { isFileDialogActive: true });
    case "closeDialog":
      return u(u({}, e2), { isFileDialogActive: false });
    case "setFiles":
      return u(u({}, e2), { acceptedFiles: n.acceptedFiles, fileRejections: n.fileRejections });
    case "setFile":
      return u(u({}, e2), { acceptedFile: n.acceptedFile });
    case "setDisplayProgressBar":
      return u(u({}, e2), { displayProgressBar: n.displayProgressBar });
    case "setProgressBarPercentage":
      return u(u({}, e2), { progressBarPercentage: n.progressBarPercentage });
    case "setDraggedFiles":
      var r = n.isDragActive, t = n.draggedFiles;
      return u(u({}, e2), { draggedFiles: t, isDragActive: r });
    case "focus":
      return u(u({}, e2), { isFocused: true });
    case "blur":
      return u(u({}, e2), { isFocused: false });
    case "reset":
      return u({}, j);
    default:
      return e2;
  }
}
e.BAD_DELIMITERS;
e.RECORD_SEP;
e.UNIT_SEP;
e.WORKERS_SUPPORTED;
e.LocalChunkSize;
e.DefaultDelimiter;
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
let lastPage = "";
let dataForCSV = [];
let ended = false;
let totalItems = 1;
let jsonData = { status: "loading", data: [] };
async function exportCSV(options, result) {
  const { url, filters, fromId, pageId, perPage = 9999, deleteCSVCols } = options;
  const qOperator = url.includes("?") ? "&" : "?";
  const prevDataLength = dataForCSV.length;
  const response = await fetchData(`${url}${qOperator}${fromId}=${lastPage}&rows_per_page=${perPage}${filters || ""}`);
  if (!lastPage) {
    totalItems = await fetchData(`${url}/count${filters ? `?${filters}` : ""}`);
  }
  dataForCSV.push(await response);
  dataForCSV = dataForCSV.flat();
  if (await response.length < perPage) {
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
    lastPage = "";
    dataForCSV = [];
    ended = false;
    return jsonData;
  }
  if (dataForCSV.length && dataForCSV.length > prevDataLength) {
    lastPage = dataForCSV[(dataForCSV == null ? void 0 : dataForCSV.length) - 1][pageId];
    result(`${Math.round(dataForCSV.length / totalItems * 100)}`);
    await exportCSV(options, result);
  }
  return jsonData;
}
function ExportCSVButton({ options, className, withFilters, onClick }) {
  const { __ } = useI18n();
  function handleExport() {
    if (withFilters) {
      exportCSV(options, (status) => onClick(status)).then((response) => {
        if (onClick && response.status === "done") {
          const csv = P(
            response,
            {
              delimiter: ",",
              header: true
            }
          );
          fileDownload(csv, `${options.url}.csv`);
        }
      });
    }
    if (!withFilters) {
      delete options.filters;
      exportCSV(options, (status) => onClick(status)).then((response) => {
        if (onClick && response.status === "done") {
          const csv = P(
            response,
            {
              delimiter: ",",
              header: true
            }
          );
          fileDownload(csv, `${options.url}.csv`);
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
    withFilters ? __("Export Filtered") : __("Export All")
  );
}
function ExportPanel({ options, currentFilters, header, handlePanel }) {
  const { __ } = useI18n();
  const activeFilters = currentFilters ? Object.keys(currentFilters) : null;
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
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel-wrap urlslab-panel-floating fadeInto" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel-header" }, /* @__PURE__ */ React.createElement("h3", null, __("Export data")), /* @__PURE__ */ React.createElement("button", { className: "urlslab-panel-close", onClick: hidePanel }, /* @__PURE__ */ React.createElement(CloseIcon, null))), (activeFilters == null ? void 0 : activeFilters.length) > 0 && header && /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel-section" }, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, __("Active Filters:"))), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("ul", { className: "columns-2" }, activeFilters.map((key) => {
    return /* @__PURE__ */ React.createElement("li", { key }, header[key]);
  })))), /* @__PURE__ */ React.createElement("div", { className: "mt-l" }, exportStatus ? /* @__PURE__ */ React.createElement(ProgressBar, { className: "mb-m", notification: "Exporting…", value: exportStatus }) : null, /* @__PURE__ */ React.createElement("div", { className: "flex" }, /* @__PURE__ */ React.createElement(Button, { className: "ma-left simple", onClick: hidePanel }, __("Cancel")), (activeFilters == null ? void 0 : activeFilters.length) > 0 && /* @__PURE__ */ React.createElement(ExportCSVButton, { className: "ml-s", options, withFilters: true, onClick: handleExportStatus }), /* @__PURE__ */ React.createElement(
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
    const response = await setData(slug, { rows: chunk });
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
function ImportPanel({ slug, handlePanel }) {
  const { __ } = useI18n();
  const [importStatus, setImportStatus] = reactExports.useState();
  const { CloseIcon, handleClose } = useCloseModal(handlePanel);
  let importCounter = 0;
  const hidePanel = (operation) => {
    handleClose();
    if (handlePanel) {
      handlePanel(operation);
    }
  };
  const queryClient = useQueryClient();
  const { CSVReader } = R();
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
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel-wrap urlslab-panel-floating fadeInto" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel-header" }, /* @__PURE__ */ React.createElement("h3", null, __("Import data")), /* @__PURE__ */ React.createElement("button", { className: "urlslab-panel-close", onClick: hidePanel }, /* @__PURE__ */ React.createElement(CloseIcon, null))), /* @__PURE__ */ React.createElement("div", { className: "mt-l" }, importStatus ? /* @__PURE__ */ React.createElement(ProgressBar, { className: "mb-m", notification: "Importing…", value: importStatus }) : null, /* @__PURE__ */ React.createElement(
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
    case "setKeyType":
      return {
        ...state,
        filterObj: { ...filterObj2, keyType: action.keyType }
      };
    case "setCurrentFilters":
      return {
        ...state,
        currentFilters: action.currentFilters
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
const numericOp = {
  exactly: "is exactly",
  "<>": "is not equal",
  IN: "is one of",
  NOTIN: "is not one of",
  BETWEEN: "is between",
  ">": "is larger than",
  "<": "is smaller than"
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
  "LIKE%": "begins with",
  "%LIKE": "ends with",
  NOTLIKE: "doesn't contain",
  "NOTLIKE%": "doesn't begin with",
  "NOT%LIKE": "doesn't end with",
  exactly: "is exactly",
  "<>": "is not",
  IN: "is one of",
  NOTIN: "is not one of",
  ">": "is longer than",
  "<": "is shorter than"
};
function filterArgs(currentFilters) {
  let filters = "";
  Object.entries(currentFilters).map(([key, filter]) => {
    const { op, val } = filter;
    if (op && op === "exactly") {
      filters += `&filter_${key}=${val}`;
    }
    if (op && (op === "IN" || op === "NOTIN")) {
      filters += `&filter_${key}=${encodeURIComponent(`{"op":"${op}","val":[${val}]}`)}`;
    }
    if (op && op === "BETWEEN") {
      filters += `&filter_${key}=${encodeURIComponent(`{"op":"${op}","min":${val.min}, "max": ${val.max}}`)}`;
    }
    if (op && op !== "IN" && op !== "NOTIN" && op !== "BETWEEN" && op !== "exactly") {
      filters += `&filter_${key}=${encodeURIComponent(`{"op":"${op}","val":"${val}"}`)}`;
    }
    return false;
  });
  return filters;
}
const filterObj = {
  filterKey: void 0,
  filterOp: void 0,
  filterVal: void 0,
  keyType: void 0
};
function useFilter({ slug, header, initialRow }) {
  const queryClient = useQueryClient();
  const runFilter = reactExports.useRef(false);
  const possibleFilters = reactExports.useRef({ ...header });
  const [state, dispatch] = reactExports.useReducer(filterReducer, { currentFilters: {}, filteringState: void 0, possibleFilters: possibleFilters.current, filterObj, editFilterActive: false });
  const filters = filterArgs(state.currentFilters);
  const activeFilters = state.currentFilters ? Object.keys(state.currentFilters) : null;
  const getQueryData = reactExports.useCallback(() => {
    dispatch({ type: "setFilteringState", filteringState: queryClient.getQueryData([slug, "filters"]) });
  }, [dispatch, slug, queryClient]);
  reactExports.useEffect(() => {
    var _a, _b, _c, _d;
    getQueryData();
    if ((_a = state.filteringState) == null ? void 0 : _a.possibleFilters) {
      possibleFilters.current = (_b = state.filteringState) == null ? void 0 : _b.possibleFilters;
    }
    if ((_c = state.filteringState) == null ? void 0 : _c.currentFilters) {
      dispatch({
        type: "setCurrentFilters",
        currentFilters: (_d = state.filteringState) == null ? void 0 : _d.currentFilters
      });
    }
  }, [getQueryData, state.filteringState]);
  function addFilter(key, value) {
    if (value) {
      dispatch({ type: "setCurrentFilters", currentFilters: { ...state.currentFilters, [key]: value } });
    }
    if (!value) {
      removeFilters([key]);
    }
  }
  const handleType = (key, sendCellOptions) => {
    const cell = initialRow == null ? void 0 : initialRow.getVisibleCells().find((cellItem) => cellItem.column.id === key);
    const cellfilterValMenu = cell == null ? void 0 : cell.column.columnDef.filterValMenu;
    if (cellfilterValMenu) {
      dispatch({ type: "setKeyType", keyType: "menu" });
      if (sendCellOptions) {
        sendCellOptions(cellfilterValMenu);
      }
      return "menu";
    }
    if (typeof (initialRow == null ? void 0 : initialRow.original[key]) === "number") {
      dispatch({ type: "setKeyType", keyType: "number" });
      return "number";
    }
    if (key === "lang") {
      dispatch({ type: "setKeyType", keyType: "lang" });
      return "lang";
    }
    dispatch({ type: "setKeyType", keyType: "string" });
    return "string";
  };
  function handleSaveFilter(filterParams) {
    const { filterKey, filterOp, filterVal } = filterParams;
    let key = filterKey;
    const op = filterOp;
    const val = filterVal;
    if (!key) {
      key = Object.keys(state.possibleFilters)[0];
    }
    delete state.possibleFilters[key];
    dispatch({ type: "possibleFilters", possibleFilters: possibleFilters.current });
    dispatch({ type: "toggleEditFilter", editFilter: false });
    if (!op) {
      addFilter(key, val);
    }
    if (op) {
      addFilter(key, { op, val });
    }
    runFilter.current = true;
  }
  function removeFilters(keyArray) {
    const getFilters = () => {
      const filtersCopy = { ...state.currentFilters };
      keyArray.map((key) => {
        delete filtersCopy[key];
        return false;
      });
      return filtersCopy;
    };
    dispatch({ type: "setCurrentFilters", currentFilters: getFilters() });
  }
  function handleRemoveFilter(keysArray) {
    if ((keysArray == null ? void 0 : keysArray.length) === 1) {
      const key = keysArray[0];
      const newHeader = { ...header };
      const usedFilters = activeFilters.filter((k2) => k2 !== key);
      usedFilters.map((k2) => {
        delete newHeader[k2];
        return false;
      });
      dispatch({ type: "possibleFilters", possibleFilters: newHeader });
    }
    if ((keysArray == null ? void 0 : keysArray.length) > 1) {
      dispatch({ type: "possibleFilters", possibleFilters: { ...header } });
    }
    removeFilters(keysArray);
    runFilter.current = true;
  }
  if (runFilter.current) {
    runFilter.current = false;
    queryClient.setQueryData([slug, "filters"], { filters, currentFilters: state.currentFilters, possibleFilters: possibleFilters.current });
  }
  return { filters, currentFilters: state.currentFilters, filteringState: state.filteringState, addFilter, removeFilters, state, dispatch, handleType, handleSaveFilter, handleRemoveFilter };
}
function useSorting({ slug }) {
  const [sortingColumn, setSortingColumn] = reactExports.useState("");
  const queryClient = useQueryClient();
  function sortBy(key) {
    queryClient.setQueryData([slug, "sortBy"], key);
    setSortingColumn(`&sort_column=${key.replace(/(&ASC|&DESC)/, "")}&sort_direction=${key.replace(/\w+&(ASC|DESC)/, "$1")}`);
  }
  return { sortingColumn, sortBy };
}
const _TableFilter = "";
function TableFilterPanel({ props: props2, onEdit }) {
  var _a, _b, _c, _d, _e, _f;
  const { key, slug, header, possibleFilters, initialRow, currentFilters } = props2;
  const { __ } = useI18n();
  const [filterValMenu, setFilterValMenu] = reactExports.useState();
  const { state, dispatch, handleType } = useFilter({ slug, header, possibleFilters, initialRow });
  const notBetween = reactExports.useMemo(() => {
    var _a2, _b2, _c2;
    return ((_a2 = Object.keys(currentFilters)) == null ? void 0 : _a2.length) && ((_b2 = currentFilters[key]) == null ? void 0 : _b2.op) ? ((_c2 = currentFilters[key]) == null ? void 0 : _c2.op) !== "BETWEEN" : state.filterObj.filterOp !== "BETWEEN";
  }, [currentFilters, key, state.filterObj.filterOp]);
  const handleKeyChange = (keyParam) => {
    dispatch({ type: "setFilterKey", key: keyParam });
    handleType(keyParam, (cellOptions) => setFilterValMenu(cellOptions));
  };
  reactExports.useEffect(() => {
    var _a2, _b2, _c2, _d2, _e2, _f2, _g, _h;
    if (state.filterObj.keyType === void 0) {
      dispatch({ type: "setFilterKey", key: key || Object.keys(possibleFilters)[0] });
      handleType(key || Object.keys(possibleFilters)[0], (cellOptions) => setFilterValMenu(cellOptions));
    }
    if (state.filterObj.keyType === "string") {
      dispatch({ type: "setFilterOp", op: ((_a2 = currentFilters[key]) == null ? void 0 : _a2.op) || "LIKE" });
      dispatch({ type: "setFilterVal", val: (_b2 = currentFilters[key]) == null ? void 0 : _b2.val });
    }
    if (state.filterObj.keyType === "number") {
      dispatch({ type: "setFilterOp", op: ((_c2 = currentFilters[key]) == null ? void 0 : _c2.op) || "exactly" });
      dispatch({ type: "setFilterVal", val: (_d2 = currentFilters[key]) == null ? void 0 : _d2.val });
    }
    if (state.filterObj.keyType === "menu") {
      dispatch({ type: "setFilterOp", op: ((_e2 = currentFilters[key]) == null ? void 0 : _e2.op) || "exactly" });
      dispatch({ type: "setFilterVal", val: ((_f2 = currentFilters[key]) == null ? void 0 : _f2.val) || Object.keys(filterValMenu)[0] });
    }
    if (state.filterObj.keyType === "lang") {
      dispatch({ type: "setFilterOp", op: ((_g = currentFilters[key]) == null ? void 0 : _g.op) || "exactly" });
      dispatch({ type: "setFilterVal", val: ((_h = currentFilters[key]) == null ? void 0 : _h.val) || "all" });
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
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel urslab-TableFilter-panel pos-absolute" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel-header urslab-TableFilter-panel-header" }, /* @__PURE__ */ React.createElement("strong", null, __("Edit filter"), key ? ` ${header[key]}` : "")), /* @__PURE__ */ React.createElement("div", { className: "flex mt-m mb-m flex-align-center" }, /* @__PURE__ */ React.createElement(
    SortMenu,
    {
      className: "mr-s",
      items: key ? header : possibleFilters,
      name: "filters",
      checkedId: key || Object.keys(possibleFilters)[0],
      defaultAccept: true,
      autoClose: true,
      disabled: key ? true : false,
      onChange: handleKeyChange
    }
  ), /* @__PURE__ */ React.createElement(
    SortMenu,
    {
      className: "ml-s",
      items: state.filterObj.keyType === "number" && numericOp || state.filterObj.keyType === "string" && stringOp || state.filterObj.keyType === "lang" && langOp || state.filterObj.keyType === "menu" && menuOp,
      name: "filter_ops",
      defaultAccept: true,
      autoClose: true,
      checkedId: ((_a = currentFilters[key]) == null ? void 0 : _a.op) || state.filterObj.filterOp,
      onChange: (op) => dispatch({ type: "setFilterOp", op })
    }
  )), /* @__PURE__ */ React.createElement("div", null, state.filterObj.keyType === "lang" && /* @__PURE__ */ React.createElement(LangMenu, { autoClose: true, multiSelect: state.filterObj.filterOp === "IN", checkedId: ((_b = currentFilters[key]) == null ? void 0 : _b.val) || "all", defaultAccept: true, onChange: (val) => dispatch({ type: "setFilterVal", val }) }), state.filterObj.keyType === "menu" && /* @__PURE__ */ React.createElement(
    SortMenu,
    {
      items: filterValMenu,
      name: "menu_ops",
      defaultAccept: true,
      autoClose: true,
      checkedId: ((_c = currentFilters[key]) == null ? void 0 : _c.val) || Object.keys(filterValMenu)[0],
      onChange: (val) => dispatch({ type: "setFilterVal", val })
    }
  ), state.filterObj.keyType !== "lang" && state.filterObj.keyType !== "menu" && notBetween && /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, autoFocus: true, defaultValue: (_d = currentFilters[key]) == null ? void 0 : _d.val, placeholder: state.filterObj.filterOp === "IN" ? "enter ie. 0,10,15,20" : "Enter search term", onChange: (val) => dispatch({ type: "setFilterVal", val }) }), !notBetween && /* @__PURE__ */ React.createElement(
    RangeInputs,
    {
      liveUpdate: true,
      defaultMin: (_e = currentFilters[key]) == null ? void 0 : _e.val.min,
      defaultMax: (_f = currentFilters[key]) == null ? void 0 : _f.val.max,
      onChange: (val) => dispatch({ type: "setFilterVal", val })
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "Buttons mt-m flex flex-align-center" }, /* @__PURE__ */ React.createElement(Button, { className: "ma-left simple wide", onClick: () => onEdit(false) }, __("Cancel")), /* @__PURE__ */ React.createElement(Button, { active: true, className: "wide", disabled: state.filterObj.filterVal ? false : true, onClick: () => onEdit(state.filterObj) }, __("Save"))));
}
function TableFilter({ slug, header, initialRow, onFilter }) {
  const { __ } = useI18n();
  const didMountRef = reactExports.useRef(false);
  const { filters, currentFilters, state, dispatch, handleSaveFilter, handleRemoveFilter } = useFilter({ slug, header, initialRow });
  const handleOnEdit = reactExports.useCallback((returnObj) => {
    if (returnObj) {
      handleSaveFilter(returnObj);
      onFilter({ filters, currentFilters });
    }
    if (!returnObj) {
      dispatch({ type: "toggleEditFilter", editFilter: false });
    }
  }, [handleSaveFilter, filters, currentFilters, dispatch, onFilter]);
  reactExports.useEffect(() => {
    if (onFilter && didMountRef.current) {
      onFilter({ filters, currentFilters });
    }
    didMountRef.current = true;
  }, [filters, currentFilters, onFilter]);
  const activeFilters = Object.keys(currentFilters).length ? Object.keys(currentFilters) : null;
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-align-center flex-wrap" }, header && (activeFilters == null ? void 0 : activeFilters.map((key) => {
    var _a, _b, _c, _d, _e;
    return /* @__PURE__ */ React.createElement(
      Button,
      {
        key,
        active: state.editFilter === key ? true : false,
        className: "outline ml-s pos-relative",
        onClick: () => !state.editFilter && dispatch({ type: "toggleEditFilter", editFilter: key })
      },
      header[key],
      ": ",
      /* @__PURE__ */ React.createElement("span", { className: "regular flex" }, "“", /* @__PURE__ */ React.createElement("span", { className: "limit-20" }, ((_a = currentFilters[key]) == null ? void 0 : _a.op) === "BETWEEN" && !(currentFilters == null ? void 0 : currentFilters.lang) ? `min: ${(_b = currentFilters[key]) == null ? void 0 : _b.val.min}, max: ${(_c = currentFilters[key]) == null ? void 0 : _c.val.max}` : !(currentFilters == null ? void 0 : currentFilters.lang) && ((_d = currentFilters[key]) == null ? void 0 : _d.val), (currentFilters == null ? void 0 : currentFilters.lang) && langName((_e = currentFilters == null ? void 0 : currentFilters.lang) == null ? void 0 : _e.val)), "”"),
      /* @__PURE__ */ React.createElement(SvgIconClose, { className: "close", onClick: () => {
        handleRemoveFilter([key]);
      } }),
      state.editFilter === key && // Edit filter panel
      /* @__PURE__ */ React.createElement(TableFilterPanel, { props: { key, slug, header, initialRow, possibleFilters: state.possibleFilters, currentFilters }, onEdit: handleOnEdit })
    );
  })), /* @__PURE__ */ React.createElement("div", { className: "pos-relative" }, /* @__PURE__ */ React.createElement(Button, { className: "simple underline", onClick: () => dispatch({ type: "toggleEditFilter", editFilter: "addFilter" }) }, __("+ Add filter")), state.editFilter === "addFilter" && // Our main adding panel (only when Add button clicked)
  /* @__PURE__ */ React.createElement(TableFilterPanel, { props: { slug, header, initialRow, possibleFilters: state.possibleFilters, currentFilters }, onEdit: handleOnEdit })), (activeFilters == null ? void 0 : activeFilters.length) > 0 && // Removes all used filters in given table
  /* @__PURE__ */ React.createElement(Button, { className: "simple underline", onClick: () => {
    handleRemoveFilter(activeFilters);
  } }, __("Clear filters")));
}
function DetailsPanel({ options, handlePanel }) {
  const { __ } = useI18n();
  const { CloseIcon, handleClose } = useCloseModal(handlePanel);
  const { title, text: text2, slug, url, showKeys, listId } = options;
  const { data } = useQuery({
    queryKey: [slug, `${url}`],
    queryFn: () => fetchData(`${slug}/${url}`).then((res) => res),
    refetchOnWindowFocus: false
  });
  function hidePanel() {
    handleClose();
    if (handlePanel) {
      handlePanel();
    }
  }
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel-wrap wide urlslab-panel-floating fadeInto" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel Details" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel-header" }, /* @__PURE__ */ React.createElement("h3", null, title), /* @__PURE__ */ React.createElement("button", { className: "urlslab-panel-close", onClick: hidePanel }, /* @__PURE__ */ React.createElement(CloseIcon, null)), /* @__PURE__ */ React.createElement("p", null, text2)), /* @__PURE__ */ React.createElement("div", { className: "mt-l" }, /* @__PURE__ */ React.createElement("div", { className: "table-container" }, data && /* @__PURE__ */ React.createElement("table", null, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, showKeys.map((key) => /* @__PURE__ */ React.createElement("th", { className: "pr-m", key }, key.charAt(0).toUpperCase() + key.slice(1).replaceAll("_", " "))))), /* @__PURE__ */ React.createElement("tbody", null, data.flat().map((row) => {
    return /* @__PURE__ */ React.createElement("tr", { key: row[listId], className: "" }, showKeys.map((key) => {
      return /* @__PURE__ */ React.createElement("td", { className: "pr-m", key: row[key] }, /* @__PURE__ */ React.createElement("div", { className: "limit" }, key.includes("url") ? /* @__PURE__ */ React.createElement("a", { href: row[key], target: "_blank", rel: "noreferrer" }, row[key]) : row[key]));
    }));
  })))), /* @__PURE__ */ React.createElement("div", { className: "flex" }, /* @__PURE__ */ React.createElement(Button, { className: "ma-left simple", onClick: hidePanel }, __("Cancel"))))));
}
function ModuleViewHeaderBottom({ slug, noImport, noExport, noCount, noDelete, header, table, insertOptions, detailsOptions, exportOptions, rowsSelected, defaultSortBy, onSort, onFilter, onClearRow }) {
  var _a;
  const { __ } = useI18n();
  const queryClient = useQueryClient();
  const [activePanel, setActivePanel] = reactExports.useState();
  const [filtersObj, setFiltersObj] = reactExports.useState();
  reactExports.useEffect(() => {
    if (detailsOptions) {
      setActivePanel("details");
    }
  }, [slug, detailsOptions]);
  const initialRow = table == null ? void 0 : table.getRowModel().rows[0];
  if (filtersObj && onFilter) {
    onFilter(filtersObj == null ? void 0 : filtersObj.filters);
  }
  const currentCountFilters = (filtersObj == null ? void 0 : filtersObj.filters) ? (_a = filtersObj == null ? void 0 : filtersObj.filters) == null ? void 0 : _a.replace("&", "?") : "";
  const { data: rowCount } = useQuery({
    queryKey: [slug, `count${currentCountFilters}`],
    queryFn: () => fetchData(`${slug}/count${currentCountFilters}`).then((count2) => {
      if (!noCount) {
        return count2;
      }
      return false;
    }),
    refetchOnWindowFocus: false
  });
  const sortItems = reactExports.useMemo(
    () => {
      const items = {};
      Object.entries(header).map(([key, value]) => {
        items[`${key}&ASC`] = `${value}<strong>&nbsp;(ascending)</strong>`;
        items[`${key}&DESC`] = `${value}<strong>&nbsp;(descending)</strong>`;
        return false;
      });
      return items;
    },
    [header]
  );
  const handleSorting = (val) => {
    onSort(val);
  };
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
    if (key === "clearRow" && onClearRow) {
      onClearRow(true);
    }
  };
  const handleRefresh = () => {
    queryClient.invalidateQueries([slug]);
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "urlslab-moduleView-headerBottom" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-moduleView-headerBottom__top flex flex-align-center" }, /* @__PURE__ */ React.createElement(Button, { className: "", onClick: () => handleRefresh() }, /* @__PURE__ */ React.createElement(SvgIconCronRefresh, null), __("Refresh table")), !noDelete && /* @__PURE__ */ React.createElement(Button, { className: "ml-s", onClick: () => handlePanel("deleteSelected"), disabled: !rowsSelected }, /* @__PURE__ */ React.createElement(SvgIconTrash, null), __("Delete selected")), /* @__PURE__ */ React.createElement("div", { className: "ma-left flex flex-align-center" }, !noDelete && /* @__PURE__ */ React.createElement(Button, { className: "no-padding underline simple", onClick: () => handlePanel("deleteall") }, __("Delete All")), !noExport && /* @__PURE__ */ React.createElement(Button, { className: "no-padding underline simple ml-m", onClick: () => handlePanel("export") }, __("Export CSV")), !noImport && /* @__PURE__ */ React.createElement(Button, { className: "no-padding underline simple ml-m", onClick: () => handlePanel("import") }, __("Import CSV")), insertOptions && /* @__PURE__ */ React.createElement(Button, { className: "ml-m active", onClick: () => handlePanel("addrow") }, "+ ", insertOptions.title))), /* @__PURE__ */ React.createElement("div", { className: "urlslab-moduleView-headerBottom__bottom mt-l flex flex-align-center" }, /* @__PURE__ */ React.createElement(TableFilter, { slug, header, initialRow, onFilter: setFiltersObj }), /* @__PURE__ */ React.createElement("div", { className: "ma-left flex flex-align-center" }, !noCount && rowCount && /* @__PURE__ */ React.createElement("small", { className: "urlslab-rowcount fadeInto flex flex-align-center" }, __("Rows: "), /* @__PURE__ */ React.createElement("strong", { className: "ml-s" }, rowCount)), /* @__PURE__ */ React.createElement(SortMenu, { className: "menu-left ml-m", isFilter: true, checkedId: defaultSortBy, items: sortItems, name: "sorting", onChange: handleSorting }, __("Sort by")), table && /* @__PURE__ */ React.createElement(
    ColumnsMenu,
    {
      className: "menu-left ml-m",
      id: "visibleColumns",
      slug,
      table,
      columns: header
    }
  )))), activePanel === "deleteall" && /* @__PURE__ */ React.createElement(
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
      action: "deleteselected"
    }
  ), activePanel === "addrow" && /* @__PURE__ */ React.createElement(InsertRowPanel, { insertOptions, handlePanel }), activePanel === "export" && /* @__PURE__ */ React.createElement(
    ExportPanel,
    {
      options: exportOptions,
      currentFilters: filtersObj == null ? void 0 : filtersObj.currentFilters,
      header,
      handlePanel
    }
  ), activePanel === "import" && /* @__PURE__ */ React.createElement(ImportPanel, { slug, handlePanel }), activePanel === "details" && /* @__PURE__ */ React.createElement(DetailsPanel, { options: detailsOptions, handlePanel }));
}
function useTableUpdater({ slug }) {
  const [tableHidden, setHiddenTable] = reactExports.useState(false);
  const [table, setTable] = reactExports.useState();
  const [filters, setFilters] = reactExports.useState();
  const [rowToInsert, setInsertRow] = reactExports.useState({});
  const { sortingColumn, sortBy } = useSorting({ slug });
  return {
    tableHidden,
    setHiddenTable,
    table,
    setTable,
    filters,
    setFilters,
    sortingColumn,
    sortBy,
    rowToInsert,
    setInsertRow
  };
}
export {
  LangMenu as L,
  ModuleViewHeaderBottom as M,
  SvgIconTrash as S,
  Tooltip as T,
  useInfiniteFetch as a,
  useChangeRow as b,
  Table as c,
  useTableUpdater as u
};
