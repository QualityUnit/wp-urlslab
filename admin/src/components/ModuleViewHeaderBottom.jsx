import { useMemo, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import { fetchData } from '../api/fetching';
import { deleteAll } from '../api/deleteTableData';

import { ReactComponent as Trash } from '../assets/images/icon-trash.svg';
import { ReactComponent as ImportIcon } from '../assets/images/icon-import.svg';
import { ReactComponent as ExportIcon } from '../assets/images/icon-export.svg';
import { ReactComponent as CloseIcon } from '../assets/images/icon-close.svg';

import SortMenu from '../elements/SortMenu';
import Loader from './Loader';
import Button from '../elements/Button';
import ExportPanel from './ExportPanel';
import ImportPanel from './ImportPanel';
import DangerPanel from './DangerPanel';

export default function ModuleViewHeaderBottom( { currentFilters, noImport, noExport, noCount, noDelete, header, removeFilters, slug, exportOptions, defaultSortBy, onSort } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const activeFilters = Object.keys( currentFilters );
	const [ activePanel, setActivePanel ] = useState();

	const currentCountFilters = exportOptions?.filters?.replace( '&', '?' );

	const { data: rowCount } = useQuery( {
		queryKey: [ slug, `count${ currentCountFilters }` ],
		queryFn: () => {
			if ( ! noCount ) {
				fetchData( `${ slug }/count${ currentCountFilters }` ).then( ( count ) => {
					return count;
				} );
			}
		},
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

	const handleDelete = useMutation( {
		mutationFn: () => {
			return deleteAll( slug );
		},
		onSuccess: () => {
			queryClient.invalidateQueries( [ slug ] );
		},
	} );

	const handlePanel = ( key ) => {
		setActivePanel( key );

		if ( key === 'danger' ) {
			handleDelete.mutate();
		}
	};

	return (
		<>
			<div className="urlslab-moduleView-headerBottom flex">

				{ ! noDelete &&
				<Button onClick={ () => handlePanel( 'delete' ) }><Trash />{ __( 'Delete All' ) }</Button>
				}
				{ ! noExport &&
				<Button className="ml-s-tablet" onClick={ () => handlePanel( 'export' ) }><ExportIcon />{ __( 'Export CSV' ) }</Button>
				}
				{ ! noImport &&
				<Button className="ml-s-tablet" onClick={ () => handlePanel( 'import' ) }><ImportIcon />{ __( 'Import CSV' ) }</Button>
				}
				{
					( activeFilters?.length > 0 && header ) &&
					<div className="flex flex-align-center">
						{ activeFilters.map( ( key ) => {
							return ( <Button className="outline ml-s" key={ key } onClick={ () => removeFilters( [ key ] ) }>{ header[ key ] }<CloseIcon className="close" /></Button> );
						} ) }

						<Button className="simple underline" onClick={ () => removeFilters( activeFilters ) }>Clear filters</Button>
					</div>
				}
				<div className="ma-left flex flex-align-center">
					<strong>{ __( 'Sort by:' ) }</strong>
					<SortMenu className="menu-left ml-s" checkedId={ defaultSortBy } items={ sortItems } name="sorting" onChange={ ( val ) => onSort( val ) } />
					{
						! noCount &&
						<small className="urlslab-rowcount ml-l flex flex-align-center">
							{ __( 'Rows: ' ) }
							{ rowCount
								? rowCount
								: <Loader className="noText small" />
							}
						</small>
					}
				</div>
			</div>
			{
				activePanel === 'delete' &&
				<DangerPanel title={ __( 'Delete All?' ) }
					text={ __( 'Are you sure you want to delete all rows? Deleting rows will remove them from all modules where this table occurs.' ) }
					button={ <><Trash />{ __( 'Delete All' ) }</> }
					handlePanel={ ( val ) => handlePanel( val ) }
				/>
			}

			{ activePanel === 'export' &&
			<ExportPanel options={ exportOptions }
				currentFilters={ currentFilters }
				header={ header }
				handlePanel={ () => handlePanel() }
			/>
			}
			{ activePanel === 'import' &&
				<ImportPanel slug={ slug } handlePanel={ () => handlePanel() } />
			}
		</>
	);
}
