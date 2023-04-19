import { useEffect, useMemo, useRef, useCallback, useState, useContext } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import { fetchData } from '../api/fetching';
import { deleteAll } from '../api/deleteTableData';
import HeaderHeightContext from '../lib/headerHeightContext';

import { useFilter } from '../hooks/filteringSorting';

import { ReactComponent as Trash } from '../assets/images/icon-trash.svg';
import { ReactComponent as PlusIcon } from '../assets/images/icon-plus.svg';
// import { ReactComponent as ImportIcon } from '../assets/images/icon-import.svg';
import { ReactComponent as RefreshIcon } from '../assets/images/icon-cron-refresh.svg';

import SortMenu from '../elements/SortMenu';
import ColumnsMenu from '../elements/ColumnsMenu';
import Button from '../elements/Button';
import InsertRowPanel from './InsertRowPanel';
import ExportPanel from './ExportPanel';
import ImportPanel from './ImportPanel';
import DangerPanel from './DangerPanel';
import TableFilter from './TableFilter';
import DetailsPanel from './DetailsPanel';

import TableFilterPanel from './TableFilterPanel';
import '../assets/styles/components/_TableFilter.scss';
import TableActionsMenu from '../elements/TableActionsMenu';
import IconButton from '../elements/IconButton';
import useResizeObserver from '../hooks/useResizeObserver';

export default function ModuleViewHeaderBottom( { slug, noImport, noInsert, noExport, noCount, noDelete, header, table, insertOptions, activatePanel, detailsOptions, exportOptions, selectedRows, onSort, onFilter, onDeleteSelected, onClearRow } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const didMountRef = useRef( false );
	const { headerBottomHeight, setHeaderBottomHeight } = useContext( HeaderHeightContext );

	const handleHeaderHeight = useCallback( ( elem ) => {
		const bottomHeight = elem?.getBoundingClientRect().height;
		if ( bottomHeight && bottomHeight !== headerBottomHeight ) {
			setHeaderBottomHeight( bottomHeight );
		}
	}, [] );
	const headerBottom = useResizeObserver( handleHeaderHeight );

	const [ activePanel, setActivePanel ] = useState( );
	const [ sortBy, setSortBy ] = useState();

	const initialRow = table?.getRowModel().rows[ 0 ];

	const { filters, currentFilters, state, dispatch, handleSaveFilter, handleRemoveFilter } = useFilter( { slug, header, initialRow } );

	const currentCountFilters = filters ? filters.replace( '&', '?' ) : '';

	const handleOnEdit = useCallback( ( returnObj ) => {
		if ( returnObj ) {
			handleSaveFilter( returnObj );
			onFilter( filters );
		}
		if ( ! returnObj ) {
			dispatch( { type: 'toggleEditFilter', editFilter: false } );
		}
	}, [ handleSaveFilter, filters, dispatch, onFilter ] );

	useEffect( () => {
		handleHeaderHeight();

		if ( onFilter && didMountRef.current ) {
			onFilter( filters );
		}
		didMountRef.current = true;

		if ( activatePanel ) {
			setActivePanel( activatePanel );
		}
		if ( detailsOptions ) {
			setActivePanel( 'details' );
		}
	}, [ slug, activatePanel, detailsOptions, filters, currentFilters, onFilter ] );

	const { data: rowCount } = useQuery( {
		queryKey: [ slug, `count${ currentCountFilters }` ],
		queryFn: () => fetchData( `${ slug }/count${ currentCountFilters }` ).then( ( count ) => {
			if ( ! noCount ) {
				return count;
			}
			return false;
		} ),
		refetchOnWindowFocus: false,
	} );

	const sortItems = useMemo( () => {
		const items = {};
		Object.entries( header ).map( ( [ key, value ] ) => {
			items[ `${ key }&ASC` ] = `${ value }<strong>&nbsp;(ascending)</strong>`;
			items[ `${ key }&DESC` ] = `${ value }<strong>&nbsp;(descending)</strong>`;
			return false;
		} );

		return items;
	}, [ header ]
	);

	const handleSorting = ( val ) => {
		setSortBy( val );
		onSort( val );
	};

	const handleDeleteAll = useMutation( {
		mutationFn: () => {
			return deleteAll( slug );
		},
		onSuccess: () => {
			queryClient.invalidateQueries( [ slug ] );
		},
	} );

	const handlePanel = ( key ) => {
		setActivePanel( key );

		if ( key === 'delete-all' ) {
			handleDeleteAll.mutate();
		}
		if ( key === 'delete-selected' ) {
			if ( onDeleteSelected ) {
				onDeleteSelected();
			}
		}

		if ( onClearRow ) {
			onClearRow( key );
		}
	};

	const handleRefresh = () => {
		queryClient.invalidateQueries( [ slug ] );
	};

	return (
		<>
			<div ref={ headerBottom } className="urlslab-moduleView-headerBottom">
				<div className="urlslab-moduleView-headerBottom__top flex flex-align-center">

					{ ! noDelete && selectedRows?.length > 0 &&
						<Button className="mr-s" onClick={ () => handlePanel( 'deleteSelected' ) }><Trash />{ __( 'Delete selected' ) }</Button>
					}
					{ insertOptions && ! noInsert &&
						<Button className="active" onClick={ () => handlePanel( 'addrow' ) }><PlusIcon />{ insertOptions.title }</Button>
					}

					<div className="pos-relative">
						<Button className="simple underline" onClick={ () => dispatch( { type: 'toggleEditFilter', editFilter: 'addFilter' } ) }>{ __( '+ Add filter' ) }
						</Button>

						{ state.editFilter === 'addFilter' && // Our main adding panel (only when Add button clicked)
							<TableFilterPanel props={ { slug, header, initialRow, possibleFilters: state.possibleFilters, currentFilters } } onEdit={ ( val ) => {
								handleHeaderHeight(); handleOnEdit( val );
							} } />
						}
					</div>

					<div className="ma-left flex flex-align-center">
						{ ( ! noImport && ! noExport && ! noDelete ) &&
							<TableActionsMenu onAction={ handlePanel } options={ { noImport, noExport, noDelete } } />
						}

						{
							table &&
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
				{ Object.keys( currentFilters ).length !== 0 &&
					<div className="urlslab-moduleView-headerBottom__bottom mt-l flex flex-align-center">
						<TableFilter props={ { currentFilters, state, slug, header, initialRow } } onEdit={ handleOnEdit } onRemove={ ( key ) => {
							handleHeaderHeight(); handleRemoveFilter( key );
						} } />
						<div className="ma-left flex flex-align-center">
							{
								! noCount && rowCount &&
								<small className="urlslab-rowcount fadeInto flex flex-align-center">
									{ __( 'Rows: ' ) }
									<strong className="ml-s">{ rowCount }</strong>
								</small>
							}

							<SortMenu className="menu-left ml-m" isFilter checkedId={ sortBy } items={ sortItems } name="sorting" onChange={ handleSorting }>{ `Sort by${ sortBy ? ': ' + sortItems[ sortBy ] : '' }` }</SortMenu>

						</div>
					</div>
				}

			</div>
			{
				activePanel === 'deleteall' &&
				<DangerPanel title={ __( 'Delete All?' ) }
					text={ __( 'Are you sure you want to delete all rows? Deleting rows will remove them from all modules where this table occurs.' ) }
					button={ <><Trash />{ __( 'Delete All' ) }</> }
					handlePanel={ handlePanel }
					action="delete-all"
				/>
			}

			{
				activePanel === 'deleteSelected' &&
				<DangerPanel title={ __( 'Delete Selected?' ) }
					text={ __( 'Are you sure you want to delete selected rows? Deleting rows will remove them from all modules where this table occurs.' ) }
					button={ <><Trash />{ __( 'Delete selected' ) }</> }
					handlePanel={ handlePanel }
					action="delete-selected"
				/>
			}
			{
				activePanel === 'addrow' &&
				<InsertRowPanel insertOptions={ insertOptions } handlePanel={ handlePanel } />
			}

			{ activePanel === 'export' &&
			<ExportPanel options={ exportOptions }
				currentFilters={ currentFilters }
				header={ header }
				handlePanel={ handlePanel }
			/>
			}
			{ activePanel === 'import' &&
				<ImportPanel props={ { slug, header, initialRow } } handlePanel={ handlePanel } />
			}
			{ activePanel === 'details' &&
				<DetailsPanel options={ detailsOptions } handlePanel={ handlePanel } />
			}
		</>
	);
}
