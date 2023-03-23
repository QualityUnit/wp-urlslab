import { useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import useCloseModal from '../hooks/useCloseModal';

import Button from '../elements/Button';
import ExportCSVButton from '../elements/ExportCSVButton';
import ProgressBar from '../elements/ProgressBar';

export default function ExportPanel( { options, currentFilters, header, handlePanel } ) {
	const { __ } = useI18n();
	const activeFilters = currentFilters ? Object.keys( currentFilters ) : null;
	const [ exportStatus, setExportStatus ] = useState();

	const { CloseIcon, handleClose } = useCloseModal( handlePanel );

	const hidePanel = ( operation ) => {
		handleClose();
		if ( handlePanel ) {
			handlePanel( operation );
		}
	};

	const handleExportStatus = ( val ) => {
		setExportStatus( val );
		if ( val === 100 ) {
			setTimeout( () => {
				setExportStatus();
				hidePanel();
			}, 1000 );
		}
	};

	return (
		<div className="urlslab-panel-wrap urlslab-panel-floating fadeInto">
			<div className="urlslab-panel">
				<div className="urlslab-panel-header">
					<h3>{ __( 'Export data' ) }</h3>
					<button className="urlslab-panel-close" onClick={ () => hidePanel() }>
						<CloseIcon />
					</button>
				</div>
				{ ( activeFilters?.length > 0 && header ) &&
				<div className="urlslab-panel-section">
					<p><strong>{ __( 'Active Filters:' ) }</strong></p>
					<p>
						<ul className="columns-2">
							{ activeFilters.map( ( key ) => {
								return ( <li key={ key }>{ header[ key ] }</li> );
							} ) }
						</ul>
					</p>
				</div>
				}
				<div className="mt-l">
					{ exportStatus
						? <ProgressBar className="mb-m" notification="Exporting…" value={ exportStatus } />
						: null
					}
					<div className="flex">
						<Button className="ma-left simple" onClick={ () => hidePanel() }>{ __( 'Cancel' ) }</Button>
						{ activeFilters?.length > 0 &&
						<ExportCSVButton className="ml-s" options={ options } withFilters onClick={ ( status ) => handleExportStatus( status ) } />
						}
						<ExportCSVButton
							className="ml-s"
							options={ options } onClick={ ( status ) => handleExportStatus( status ) }
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
