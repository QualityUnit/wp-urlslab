import { useRef, useCallback, useState, useEffect, memo, createContext } from 'react';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { get, update } from 'idb-keyval';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

import useTableStore from '../hooks/useTableStore';

import AddNewTableRecord from '../elements/AddNewTableRecord';
import TooltipSortingFiltering from '../elements/Tooltip_SortingFiltering';
import TableHead from './TableHead';
import TableBody from './TableBody';

import JoyTable from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';

import '../assets/styles/components/_TableComponent.scss';

export const TableContext = createContext( {} );

export default function Table( { resizable, children, className, columns, data, initialState, returnTable, referer, closeableRowActions = false, disableAddNewTableRecord = false, customSlug } ) {
	const [ userCustomSettings, setUserCustomSettings ] = useState( {
		columnVisibility: initialState?.columnVisibility || {},
		openedRowActions: false,
	} );
	const [ columnsInitialized, setColumnsInitialized ] = useState( false );
	const tableContainerRef = useRef();
	const rowActionsInitialized = useRef( false );
	const didMountRef = useRef( false );

	let slug = useTableStore( ( state ) => state.activeTable );
	if ( customSlug ) {
		slug = customSlug;
	}

	const [ rowSelection, setRowSelection ] = useState( {} );

	const setColumnVisibility = useCallback( ( updater ) => {
		// updater can be update function, or object with defined values in case "hide all / show all" action
		setUserCustomSettings( ( s ) => ( { ...s, columnVisibility: typeof updater === 'function' ? updater( s.columnVisibility ) : updater } ) );
	}, [] );

	const checkTableOverflow = useCallback( () => {
		if ( tableContainerRef.current?.clientHeight < tableContainerRef.current?.querySelector( 'table.urlslab-table' )?.clientHeight ) {
			tableContainerRef.current?.style.setProperty( '--Table-ScrollbarWidth', '16px' );
			return 'has-scrollbar';
		}

		tableContainerRef.current?.style.setProperty( '--Table-ScrollbarWidth', '0px' );
		return '';
	}, [] );

	const toggleOpenedRowActions = useCallback( () => {
		if ( closeableRowActions ) {
			update( slug, ( dbData ) => {
				return { ...dbData, openedRowActions: ! userCustomSettings.openedRowActions };
			} );
			setUserCustomSettings( ( s ) => ( { ...s, openedRowActions: ! s.openedRowActions } ) );
		}
	}, [ closeableRowActions, slug, userCustomSettings.openedRowActions ] );

	// fetch user defined settings from internal db
	const getUserCustomSettings = useCallback( () => {
		get( slug ).then( ( dbData ) => {
			if ( dbData?.columnVisibility && Object.keys( dbData?.columnVisibility ).length ) {
				setUserCustomSettings( ( s ) => ( { ...s, columnVisibility: dbData?.columnVisibility } ) );
			}

			if ( closeableRowActions ) {
				if ( dbData?.openedRowActions !== undefined ) {
					setUserCustomSettings( ( s ) => ( { ...s, openedRowActions: dbData.openedRowActions } ) );
				} else {
					// on first load open edit settings
					setUserCustomSettings( ( s ) => ( { ...s, openedRowActions: true } ) );
				}
			}

			// wait a while until user defined settings are loaded from internal db
			// prevents jumping of columns
			setColumnsInitialized( true );
		} );
	}, [ closeableRowActions, slug ] );

	// save css variable for closed toggle button width
	if ( closeableRowActions && tableContainerRef.current && ! rowActionsInitialized.current ) {
		const toggleButton = tableContainerRef.current.querySelector( 'thead th.editRow .editRow-toggle-button' );
		if ( toggleButton ) {
			tableContainerRef.current.style.setProperty( '--Table-editRowClosedColumnWidth', `${ toggleButton.offsetWidth + 3 }px` );
			rowActionsInitialized.current = true;
		}
	}

	const table = useReactTable( {
		columns,
		data,
		defaultColumn: {
			minSize: resizable ? 80 : 32,
			size: resizable ? 100 : 32,
		},
		initialState,
		state: {
			rowSelection,
			columnVisibility: userCustomSettings.columnVisibility,
		},
		columnResizeMode: 'onChange',
		enableRowSelection: true,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
	}, );

	useEffect( () => {
		if ( closeableRowActions && ! userCustomSettings.openedRowActions ) {
			tableContainerRef.current?.style.setProperty( '--Table-editRowColumnWidth', '0px' );
		}
	}, [ closeableRowActions, userCustomSettings.openedRowActions ] );

	useEffect( () => {
		getUserCustomSettings();

		useTableStore.setState( () => ( {
			tables: {
				...useTableStore.getState().tables,
				[ slug ]: {
					...useTableStore.getState().tables[ slug ], table, selectedRows: rowSelection,
				},
			},
		} ) );

		if ( data?.length ) {
			useTableStore.setState( () => ( {
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: { ...useTableStore.getState().tables[ slug ], initialRow: table?.getRowModel().rows[ 0 ] },
				},
			} ) );
		}

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
	}, [ slug, table, rowSelection, checkTableOverflow, getUserCustomSettings ] );

	// Defines table data when no data were initially loaded (ie Content Gap generator)
	useEffect( () => {
		if ( data?.length && ! didMountRef.current ) {
			useTableStore.setState( () => ( {
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: { ...useTableStore.getState().tables[ slug ], initialRow: table?.getRowModel().rows[ 0 ] },
				},
			} ) );
			didMountRef.current = true;
		}
	}, [ data, table, slug ] );

	if ( table && returnTable ) {
		returnTable( table );
	}

	if ( ! data?.length ) {
		return <NoTable disableAddNewTableRecord={ disableAddNewTableRecord }>
			<TooltipSortingFiltering />
		</NoTable>;
	}

	return (
		<TableContext.Provider value={ { tableContainerRef, table, resizable, userCustomSettings, closeableRowActions, toggleOpenedRowActions } }>
			<Sheet
				ref={ tableContainerRef }
				variant="plain"
				className={ `urlslab-table-container ${ checkTableOverflow() }` }
				// hide table until user defined visible columns are loaded
				sx={ { opacity: columnsInitialized ? 1 : 0 } }
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
					<TableBody />
				</JoyTable>
				{
					data.length < 1000
						? <div ref={ referer } className="scrollReferer" style={ { position: 'relative', zIndex: -1, bottom: '30em' } }></div>
						: <div className="urlslab-table-rowLimit">{ __( 'Maximum rows showed, please use filters and sorting for better results' ) }</div>
				}
				{ children }
			</Sheet>
		</TableContext.Provider>
	);
}

// disableAddNewTableRecord: disable add button, used for tables in table popup panel when we cannot reset global table store as main table still use it.
const NoTable = memo( ( { disableAddNewTableRecord, children } ) => {
	const activeTable = useTableStore( ( state ) => state.activeTable );
	const title = useTableStore( ( state ) => state.tables[ activeTable ]?.title );
	const filters = useTableStore( ( state ) => state.tables[ activeTable ]?.filters || {} );
	const hasFilters = Object.keys( filters ).length ? true : false;

	return (
		<div className="urlslab-table-fake">
			<div className="urlslab-table-fake-inn">
				{ ( ! disableAddNewTableRecord && title && ! hasFilters ) && <AddNewTableRecord title={ title } /> }
				{ hasFilters && <div className="bg-white p-m c-saturated-red">{ __( 'No items are matching your search or filter conditions.' ) }</div> }
				{ children }
			</div>
		</div>
	);
} );
