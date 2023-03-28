import { useMemo, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import { fetchData } from '../api/fetching';
import { deleteAll } from '../api/deleteTableData';

import { ReactComponent as Trash } from '../assets/images/icon-trash.svg';
import { ReactComponent as ImportIcon } from '../assets/images/icon-import.svg';
import { ReactComponent as ExportIcon } from '../assets/images/icon-export.svg';
import { ReactComponent as RefreshIcon } from '../assets/images/icon-cron-refresh.svg';

import SortMenu from '../elements/SortMenu';
import ColumnsMenu from '../elements/ColumnsMenu';
import Loader from './Loader';
import Button from '../elements/Button';
import InsertRowPanel from './InsertRowPanel';
import ExportPanel from './ExportPanel';
import ImportPanel from './ImportPanel';
import DangerPanel from './DangerPanel';
import TableFilter from './TableFilter';

export default function ModuleViewHeaderBottom( { noImport, noExport, noCount, noDelete, header, table, insertOptions, slug, exportOptions, rowsSelected, defaultSortBy, onSort, onFilter, onRowAdded } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();

	const [ activePanel, setActivePanel ] = useState();
	const [ filtersObj, setFiltersObj ] = useState( );

	const initialRow = table?.getRowModel().rows[ 0 ]?.original;

	if ( filtersObj && onFilter ) {
		onFilter( filtersObj?.filters );
	}

	const currentCountFilters = filtersObj?.filters ? filtersObj?.filters?.replace( '&', '?' ) : '';

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

		if ( key === 'rowAdded' && onRowAdded ) {
			onRowAdded( true );
		}
	};

	const handleRefresh = () => {
		queryClient.invalidateQueries( [ slug ] );
	};

	return (
		<>
			<div className="urlslab-moduleView-headerBottom">
				<div className="urlslab-moduleView-headerBottom__top flex flex-align-center">

					<Button className="" onClick={ () => handleRefresh() }><RefreshIcon />{ __( 'Refresh table' ) }</Button>
					{ ! noDelete &&
						<Button className="ml-s" onClick={ () => handlePanel( 'deleteSelected' ) } disabled={ ! rowsSelected }><Trash />{ __( 'Delete selected' ) }</Button>
					}

					<div className="ma-left flex flex-align-center">
						{ ! noDelete &&
							<Button className="no-padding underline simple" onClick={ () => handlePanel( 'deleteall' ) }>{ __( 'Delete All' ) }</Button>
						}
						{ ! noExport &&
						<Button className="no-padding underline simple ml-m" onClick={ () => handlePanel( 'export' ) }>{ __( 'Export CSV' ) }</Button>
						}
						{ ! noImport &&
						<Button className="no-padding underline simple ml-m" onClick={ () => handlePanel( 'import' ) }>{ __( 'Import CSV' ) }</Button>
						}
						{ insertOptions &&
							<Button className="ml-m active" onClick={ () => handlePanel( 'addrow' ) }>+&nbsp;{ insertOptions.title }</Button>
						}
					</div>
				</div>
				<div className="urlslab-moduleView-headerBottom__bottom mt-l flex flex-align-center">

					<TableFilter slug={ slug } header={ header } initialRow={ initialRow } onFilter={ setFiltersObj } />
					<div className="ma-left flex flex-align-center">
						{
							! noCount && rowCount &&
							<small className="urlslab-rowcount fadeInto flex flex-align-center">
								{ __( 'Rows: ' ) }
								<strong className="ml-s">{ rowCount }</strong>
							</small>
						}

						<SortMenu className="menu-left ml-m" isFilter checkedId={ defaultSortBy } items={ sortItems } name="sorting" onChange={ handleSorting }>{ __( 'Sort by' ) }</SortMenu>

						<ColumnsMenu
							className="menu-left ml-m"
							id="visibleColumns"
							table={ table }
							items={ header }
						>
						</ColumnsMenu>
					</div>
				</div>

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
					action="deleteselected"
				/>
			}
			{
				activePanel === 'addrow' &&
				<InsertRowPanel insertOptions={ insertOptions } handlePanel={ handlePanel } />
			}

			{ activePanel === 'export' &&
			<ExportPanel options={ exportOptions }
				currentFilters={ filtersObj?.currentFilters }
				header={ header }
				handlePanel={ handlePanel }
			/>
			}
			{ activePanel === 'import' &&
				<ImportPanel slug={ slug } handlePanel={ handlePanel } />
			}
		</>
	);
}
