import { useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { useQueryClient, useMutation } from '@tanstack/react-query';

import { deleteAll } from '../api/deleteTableData';

import { ReactComponent as Trash } from '../assets/images/icon-trash.svg';
import { ReactComponent as ImportIcon } from '../assets/images/icon-import.svg';
import { ReactComponent as ExportIcon } from '../assets/images/icon-export.svg';

import Button from '../elements/Button';
import ExportPanel from './ExportPanel';
import ImportPanel from './ImportPanel';
import DangerPanel from './DangerPanel';

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

	const handlePanel = ( panel ) => {
		setActivePanel( panel );
		hideTable( true );

		if ( panel === undefined ) {
			setActivePanel( panel );
			hideTable( false );
		}
		if ( panel === 'delete' ) {
			setActivePanel( panel );
			hideTable( false );
		}
		if ( panel === 'danger' ) {
			handleDelete.mutate();
			hideTable( false );
		}
	};

	return (
		<>
			<div className="urlslab-moduleView-headerBottom flex">

				<Button onClick={ () => handlePanel( 'delete' ) }><Trash />{ __( 'Delete All' ) }</Button>

				<Button className="ml-s-tablet" onClick={ () => handlePanel( 'export' ) }><ExportIcon />{ __( 'Export CSV' ) }</Button>

				<Button className="ml-s-tablet" onClick={ () => handlePanel( 'import' ) }><ImportIcon />{ __( 'Import CSV' ) }</Button>

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
			{
				activePanel === 'delete' &&
				<DangerPanel title={ __( 'Delete All?' ) }
					text={ __( 'Are you sure you want to delete all rows? Deleting rows will remove them from all modules where this table occurs.' ) }
					button={ <><Trash />{ __( 'Delete All' ) }</> }
					handleDanger={ ( val ) => handlePanel( val ) }
				/>
			}

			{ activePanel === 'export' &&
			<ExportPanel options={ exportOptions }
				currentFilters={ currentFilters }
				header={ header }
				backToTable={ () => handlePanel() }
			/>
			}
			{ activePanel === 'import' &&
				<ImportPanel slug={ slug } backToTable={ () => handlePanel() } />
			}
		</>
	);
}
