/* eslint-disable indent */
import { useRef, useCallback, useState, useEffect } from "react";
import { get } from "idb-keyval";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useVirtual } from "react-virtual";

import "../assets/styles/components/_TableComponent.scss";

export default function Table({
  slug,
  resizable,
  children,
  className,
  columns,
  data,
  initialState,
  returnTable,
  getRowExtraProps,
}) {
  const [rowSelection, setRowSelection] = useState({ 0: true });
  const [containerWidth, setContainerWidth] = useState();
  const [columnVisibility, setColumnVisibility] = useState(
    initialState?.columnVisibility || {}
  );
  const tableContainerRef = useRef();

 

  const getColumnState = useCallback(() => {
    get(slug).then(async (dbData) => {
      if (
        dbData?.columnVisibility &&
        Object.keys(dbData?.columnVisibility).length
      ) {
        await setColumnVisibility(dbData?.columnVisibility);
      }
    });
  }, [slug]);

  useEffect(() => {
    getColumnState();

    setContainerWidth(tableContainerRef.current?.clientWidth);
    const menuWidth =
      document.querySelector(".urlslab-mainmenu").clientWidth +
      document.querySelector("#adminmenuwrap").clientWidth;

    const resizeWatcher = new ResizeObserver(([entry]) => {
      if (entry.borderBoxSize && tableContainerRef.current) {
        tableContainerRef.current.style.width = `${
          document.querySelector("#wpadminbar").clientWidth - menuWidth - 54
        }px`;
      }
    });

    resizeWatcher.observe(document.querySelector("#wpadminbar"));
  }, [getColumnState, setContainerWidth]);

  const table = useReactTable({
    columns,
    data,
    defaultColumn: {
      minSize: resizable ? 80 : 24,
      size: resizable ? 100 : 24,
    },
    initialState: {
      rowSelection: { 0: true },
    },
    state: {
      rowSelection,
      columnVisibility,
    },
    columnResizeMode: "onChange",
    enableRowSelection: true,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  if (table && returnTable) {
    returnTable(table);
  }

  const tbody = [];

  const { rows } = table?.getRowModel();
  
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows?.length,
    overscan: 10,
  });

  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;
  const paddingTop = virtualRows?.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows?.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0;

  for (const virtualRow of virtualRows) {
    const row = rows[virtualRow?.index];
    tbody.push(
      <tr
        key={row.id}
        className={row.getIsSelected() ? "selected" : ""}
        {...getRowExtraProps?.(row, rows)}
      >
        {row.getVisibleCells().map((cell) => {
          const tooltip = cell.column.columnDef.tooltip;

          return (
            cell.column.getIsVisible() && (
              <td
                key={cell.id}
                className={cell.column.columnDef.className}
                style={{
                  width:
                    cell.column.getSize() !== 0 && resizable
                      ? cell.column.getSize()
                      : undefined,
                }}
              >
                {tooltip ? flexRender(tooltip, cell.getContext()) : null}
                <div className="limit">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              </td>
            )
          );
        })}
      </tr>
    );
  }

  return (
    <div
      className="urlslab-table-container"
      // ref={tableContainerRef}
      // style={{
      //   width: `${containerWidth}px`,
      //   '--tableContainerWidth': `${containerWidth}px`,
      // }}
    >
      {/* {containerWidth ? ( */}
      <table
        className={`urlslab-table ${className} ${resizable ? "resizable" : ""}`}
        // style={{
        //   width: table.getCenterTotalSize(),
        // }}
      >
        <thead className="urlslab-table-head">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className="urlslab-table-head-row" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={header.column.columnDef.className}
                  style={{
                    position: resizable ? "absolute" : "relative",
                    left: resizable ? header.getStart() : "0",
                    width: header.getSize() !== 0 ? header.getSize() : "",
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {resizable &&
                  header.column.columnDef.enableResizing !== false ? (
                    <div
                      {...{
                        onMouseDown: header.getResizeHandler(),
                        onTouchStart: header.getResizeHandler(),
                        className: `resizer ${
                          header.column.getIsResizing() ? "isResizing" : ""
                        }`,
                      }}
                    />
                  ) : null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="urlslab-table-body">
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: `${paddingTop}px` }} />
            </tr>
          )}
          {tbody}
          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: `${paddingBottom}px` }} />
            </tr>
          )}
        </tbody>
      </table>
      {/* ) : null} */}

      {children}
    </div>
  );
}
