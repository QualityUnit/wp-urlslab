import { useEffect, useRef, useCallback } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { useQueryClient, useMutation } from '@tanstack/react-query';

import { deleteAll } from '../api/deleteTableData';
import filtersArray from '../lib/filtersArray';

import { useFilter } from '../hooks/filteringSorting';
import useResizeObserver from '../hooks/useResizeObserver';
import useHeaderHeight from '../hooks/useHeaderHeight';
import useClickOutside from '../hooks/useClickOutside';
import useTablePanels from '../hooks/useTablePanels';

import { ReactComponent as Trash } from '../assets/images/icons/icon-trash.svg';
import { ReactComponent as PlusIcon } from '../assets/images/icons/icon-plus.svg';
import { ReactComponent as RefreshIcon } from '../assets/images/icons/icon-refresh.svg';

import TableFilter from './TableFilter';
import TableFilterPanel from './TableFilterPanel';
import TablePanels from './TablePanels';
import RowCounter from './RowCounter';

import ColumnsMenu from '../elements/ColumnsMenu';
import Button from '../elements/Button';
import TableActionsMenu from '../elements/TableActionsMenu';
import IconButton from '../elements/IconButton';

export default function ModuleViewHeaderBottom( props ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const didMountRef = useRef( false );
	const panelPopover = useRef();
	const headerBottomHeight = useHeaderHeight( ( state ) => state.headerBottomHeight );
	const setHeaderBottomHeight = useHeaderHeight( ( state ) => state.setHeaderBottomHeight );

	const { noColumnsMenu, noFiltering, hideActions, noImport, noInsert, noExport, noCount, noDelete, table, selectedRows, onFilter, onDeleteSelected, onUpdate, options } = props;
	const { header, slug, title } = options;

	const { activatePanel } = useTablePanels();

	const handleHeaderHeight = useCallback( ( elem ) => {
		const bottomHeight = elem?.getBoundingClientRect().height;
		if ( bottomHeight && bottomHeight !== headerBottomHeight ) {
			setHeaderBottomHeight( bottomHeight );
		}
	}, [ headerBottomHeight, setHeaderBottomHeight ] );

	const headerBottom = useResizeObserver( handleHeaderHeight );

	const initialRow = table?.getRowModel().rows[ 0 ];

	const { filters, possiblefilters, state, dispatch, handleSaveFilter, handleRemoveFilter } = useFilter( { slug, header, initialRow } );

	const sorting = queryClient.getQueryData( [ slug, 'sorting' ] );

	const close = useCallback( () => {
		dispatch( { type: 'toggleEditFilter', editFilter: false } );
	}, [] );
	useClickOutside( panelPopover, close );

	const handleOnEdit = useCallback( ( returnObj ) => {
		if ( returnObj ) {
			handleSaveFilter( returnObj );
			onFilter( filters );
		}
		if ( ! returnObj ) {
			dispatch( { type: 'toggleEditFilter', editFilter: false } );
		}
	}, [ handleSaveFilter, filters, dispatch, onFilter ] );

	const handleDeleteAll = useMutation( {
		mutationFn: () => {
			return deleteAll( slug );
		},
		onSuccess: () => {
			queryClient.invalidateQueries( [ slug ] );
		},
	} );

	const handlePanel = ( key ) => {
		activatePanel( key );

		if ( key === 'delete-all' ) {
			handleDeleteAll.mutate();
		}
		if ( key === 'delete-selected' ) {
			if ( onDeleteSelected ) {
				onDeleteSelected();
			}
		}

		if ( onUpdate ) {
			onUpdate( key );
		}
	};

	const handleRefresh = () => {
		queryClient.invalidateQueries( [ slug, filtersArray( filters ), sorting ? sorting : [] ] );
		if ( ! noCount ) {
			queryClient.invalidateQueries( [ slug, 'count', filtersArray( filters ) ] );
		}
	};

	useEffect( () => {
		handleHeaderHeight();

		if ( onFilter && didMountRef.current ) {
			onFilter( filters );
		}
		didMountRef.current = true;
	}, [ slug, filters, onFilter ] );

	return (
		<>
			<div ref={ headerBottom } className="urlslab-moduleView-headerBottom">
				<div className="urlslab-moduleView-headerBottom__top flex flex-align-center">

					{ ! noDelete && selectedRows?.length > 0 &&
						<Button className="mr-s" onClick={ () => handlePanel( 'deleteSelected' ) }><Trash />{ __( 'Delete selected' ) }</Button>
					}
					{ title && ! noInsert &&
						<Button className="active" onClick={ () => handlePanel( 'rowInserter' ) }><PlusIcon />{ title }</Button>
					}

					{
						! noFiltering &&
						<div className="pos-relative">
							<Button className="simple underline" onClick={ () => dispatch( { type: 'toggleEditFilter', editFilter: 'addFilter' } ) }>{ __( '+ Add filter' ) }
							</Button>

							{ state.editFilter === 'addFilter' && // Our main adding panel (only when Add button clicked)
							<TableFilterPanel ref={ panelPopover } props={ { slug, header, initialRow, possiblefilters, filters } } onEdit={ ( val ) => {
								handleHeaderHeight();
								handleOnEdit( val );
							} } />
							}
						</div>
					}

					<div className="ma-left flex flex-align-center">
						{ ! noCount &&
						<RowCounter filter={ filters } slug={ slug } />
						}
						{ ! hideActions &&
							<TableActionsMenu onAction={ handlePanel } options={ { noImport, noExport, noDelete } } />
						}

						{
							table && ! noColumnsMenu &&
							<ColumnsMenu
								className="menu-left ml-m"
								id="visibleColumns"
								slug={ slug }
								table={ table }
								columns={ header }
							/>
						}

						<IconButton className="ml-m" tooltip={ __( 'Refresh table' ) } tooltipClass="align-left-0" onClick={ handleRefresh }>
							<RefreshIcon />
						</IconButton>

					</div>
				</div>
				{ Object.keys( filters ).length !== 0 &&
				<div className="urlslab-moduleView-headerBottom__bottom mt-l flex flex-align-center">
					<TableFilter props={ { filters, possiblefilters, state, slug, header, initialRow } } onEdit={ handleOnEdit } onRemove={ ( key ) => {
						handleHeaderHeight();
						handleRemoveFilter( key );
					} } />
				</div>
				}

			</div>

			<TablePanels props={ { options, initialRow, handlePanel } } />
		</>
	);
}
