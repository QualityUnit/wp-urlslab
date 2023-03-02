import { useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { useQueryClient, useMutation } from '@tanstack/react-query';

import { deleteAll } from '../api/deleteTableData';

import { ReactComponent as ImportIcon } from '../assets/images/icon-import.svg';
import { ReactComponent as ExportIcon } from '../assets/images/icon-export.svg';
import { ReactComponent as CloseIcon } from '../assets/images/icon-close.svg';

import Button from '../elements/Button';
import ExportPanel from './ExportPanel';
import ImportPanel from './ImportPanel';

export default function ModuleViewHeaderBottom( { currentFilters, header, removedFilter, children, slug, exportOptions, hideTable } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const activeFilters = Object.keys( currentFilters );
	const [ activePanel, setActivePanel ] = useState();
	const handleDelete = useMutation( {
		mutationFn: () => {
			return deleteAll( slug );
		},
		onSuccess: () => {
			queryClient.invalidateQueries( [ slug ] );
		},
	} );

	const handleImportExportPanel = ( panel ) => {
		if ( panel ) {
			setActivePanel( panel );
			hideTable( true );
		}
		if ( panel === undefined ) {
			setActivePanel( panel );
			hideTable( false );
		}
	};

	return (
		<>
			<div className="urlslab-moduleView-headerBottom flex">

				<Button onClick={ () => handleDelete.mutate() }>{ __( 'Delete All' ) }</Button>

				<Button className="ml-s-tablet" onClick={ () => handleImportExportPanel( 'export' ) }><ExportIcon />{ __( 'Export CSV' ) }</Button>

				<Button className="ml-s-tablet" onClick={ () => handleImportExportPanel( 'import' ) }><ImportIcon />{ __( 'Import CSV' ) }</Button>

				{
					( activeFilters?.length > 0 && header ) &&
					<div className="flex flex-align-center">
						<strong>{ __( 'Filters:' ) }</strong>
						{ activeFilters.map( ( key ) => {
							return ( <button className="ml-s" key={ key } onClick={ () => removedFilter( key ) }>{ header[ key ] }</button> );
						} ) }
					</div>
				}
				{
					children
				}
			</div>

			{ activePanel === 'export' &&
			<ExportPanel options={ exportOptions }
				currentFilters={ currentFilters }
				header={ header }
				backToTable={ () => handleImportExportPanel() }
			/>
			}
			{ activePanel === 'import' &&
				<ImportPanel slug={ slug } backToTable={ () => handleImportExportPanel() } />
			}
		</>
	);
}
