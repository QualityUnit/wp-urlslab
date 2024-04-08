import { useRef, useCallback, useState, useEffect, memo, createContext, useMemo } from 'react';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

import useTableStore from '../hooks/useTableStore';
import useUserLocalData from '../hooks/useUserLocalData';

import AddNewTableRecord from '../elements/AddNewTableRecord';
import TooltipSortingFiltering from '../elements/Tooltip_SortingFiltering';
import TableHead from './TableHead';
import TableBody from './TableBody';

import JoyTable from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Alert from '@mui/joy/Alert';
import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';
import Typography from '@mui/joy/Typography';

import '../assets/styles/components/_TableComponent.scss';

export const TableContext = createContext( {} );

const Table = ( { resizable, children, className, columns, data, initialState, returnTable, referrer, loadingRows, closeableRowActions = true, disableAddNewTableRecord = false, customSlug, containerSxStyles, maxRowsReachedText } ) => {
	const tableContainerRef = useRef();
	const rowActionsInitialized = useRef( false );

	let slug = useTableStore( ( state ) => state.activeTable );
	if ( customSlug ) {
		slug = customSlug;
	}

	const setUserLocalData = useUserLocalData( ( state ) => state.setUserLocalData );
	const getUserLocalData = useUserLocalData( ( state ) => state.getUserLocalData );
	const columnVisibility = useUserLocalData( ( state ) => state.userData[ slug ]?.columnVisibility || initialState?.columnVisibility || {} );

	const [ rowSelection, setRowSelection ] = useState( {} );

	const setColumnVisibility = useCallback( ( updater ) => {
		// updater can be update function, or object with defined values in case "hide all / show all" action
		setUserLocalData( slug, {
			columnVisibility: typeof updater === 'function'
				? updater( getUserLocalData( slug, 'columnVisibility' ) || initialState?.columnVisibility || {} )
				: updater,
		} );
	}, [ getUserLocalData, initialState?.columnVisibility, setUserLocalData, slug ] );

	const checkTableOverflow = useCallback( () => {
		if ( tableContainerRef.current?.clientHeight < tableContainerRef.current?.querySelector( 'table.urlslab-table' )?.clientHeight ) {
			tableContainerRef.current?.style.setProperty( '--Table-ScrollbarWidth', '16px' );
			return 'has-scrollbar';
		}

		tableContainerRef.current?.style.setProperty( '--Table-ScrollbarWidth', '0px' );
		return '';
	}, [] );

	// save css variable for closed toggle button width
	if ( tableContainerRef.current && ! rowActionsInitialized.current ) {
		const toggleButton = tableContainerRef.current.querySelector( 'thead th.editRow .editRow-toggle-button' );
		if ( toggleButton ) {
			tableContainerRef.current.style.setProperty( '--Table-editRowClosedColumnWidth', `${ toggleButton.offsetWidth + 3 }px` );
			rowActionsInitialized.current = true;
		}
	}

	const table = useReactTable( {
		columns: useMemo( () => columns, [ columns ] ),
		data,
		defaultColumn: {
			minSize: resizable ? 80 : 32,
			size: resizable ? 100 : 32,
		},
		initialState,
		state: {
			rowSelection,
			columnVisibility,
		},
		columnResizeMode: 'onChange',
		enableRowSelection: true,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
	}, );

	useEffect( () => {
		useTableStore.setState( () => ( {
			tables: {
				...useTableStore.getState().tables,
				[ slug ]: {
					...useTableStore.getState().tables[ slug ], table, selectedRows: rowSelection,
				},
			},
		} ) );

		const getTableContainerWidth = () => {
			const tableContainerWidth = document.documentElement.clientWidth - adminMenuWidth;
			tableContainerRef.current?.style.setProperty( '--tableContainerWidth', `${ tableContainerWidth }px` );
		};

		const adminMenuWidth = document.querySelector( '#adminmenuwrap' ).clientWidth;
		const resizeWatcher = new ResizeObserver( ( [ entry ] ) => {
			if ( entry.borderBoxSize && tableContainerRef.current ) {
				getTableContainerWidth();
			}
		} );
		resizeWatcher.observe( document.documentElement );
	}, [ rowSelection, slug, table ] );

	if ( table && returnTable ) {
		returnTable( table );
	}

	if ( ! data?.length ) {
		return <NoTable disableAddNewTableRecord={ disableAddNewTableRecord } customSlug={ slug }>
			<TooltipSortingFiltering />
		</NoTable>;
	}

	return (
		<TableContext.Provider value={ { tableContainerRef, table, slug, resizable, closeableRowActions } }>
			<Sheet
				ref={ tableContainerRef }
				variant="plain"
				className={ classNames( [
					'urlslab-table-container',
					checkTableOverflow(),
				] ) }
				sx={ {
					...containerSxStyles,
				} }
				urlslabTableContainer
			>
				<JoyTable
					className={ classNames( [
						'urlslab-table',
						className,
						resizable ? 'resizable' : null,
					] ) }
					urlslabTable
				>
					<TableHead key={ slug } />
					<TableBody slug={ slug } />
					<TableFoot referrer={ referrer } visibleColumns={ table.getVisibleFlatColumns() } data={ data } loadingRows={ loadingRows } maxRowsReachedText={ maxRowsReachedText } />
				</JoyTable>

				{ children }
			</Sheet>
		</TableContext.Provider>
	);
};

const TableFoot = memo( ( { referrer, visibleColumns, data, loadingRows, maxRowsReachedText } ) => (
	<tfoot className="referrer-footer">
		<tr>
			<td colSpan={ visibleColumns.length }>
				{
					data.length < 1000
						? <Box
							className="scrollReferrer"
							ref={ referrer }
							sx={ { position: 'absolute', zIndex: -1, width: '100%', height: 0, bottom: 'calc(var(--Table-height) / 1.5)', left: 0 } }
						/>
						: <Alert
							color="danger"
							size="md"
							variant="soft"
							sx={ {
								display: 'inline-block',
								position: 'sticky',
								left: '50%',
								transform: 'translateX(-50%)',
								marginY: 2,
							} }
						>
							{ maxRowsReachedText || __( 'Maximum rows showed, please use filters and sorting for better results', 'wp-urlslab' ) }
						</Alert>
				}
				{ loadingRows &&
					<Box sx={ {
						display: 'inline-flex',
						alignItems: 'center',
						position: 'sticky',
						left: '50%',
						transform: 'translateX(-50%)',
						marginY: 2,
					} }
					>
						<CircularProgress size="sm" sx={ { mr: 1 } } />
						<Typography component="span" color="neutral" level="body-sm">{ __( 'Loading more rows…', 'wp-urlslab' ) }</Typography>
					</Box>
				}

			</td>
		</tr>
	</tfoot>
) );

// disableAddNewTableRecord: disable add button, used for tables in table popup panel when we cannot reset global table store as main table still use it.
const NoTable = memo( ( { disableAddNewTableRecord, customSlug, children } ) => {
	let slug = useTableStore( ( state ) => state.activeTable );
	if ( customSlug ) {
		slug = customSlug;
	}
	const title = useTableStore( ( state ) => state.tables[ slug ]?.title );
	const filters = useTableStore().useFilters( slug );
	const hasFilters = Object.keys( filters ).length ? true : false;

	return (
		<div className="urlslab-table-fake">
			<div className="urlslab-table-fake-inn">
				{ ( ! disableAddNewTableRecord && title && ! hasFilters ) && <AddNewTableRecord title={ title } /> }
				{ hasFilters && <div className="bg-white p-m c-saturated-red">{ __( 'No items are matching your search or filter conditions.', 'wp-urlslab' ) }</div> }
				{ children }
			</div>
		</div>
	);
} );

export default memo( Table );
