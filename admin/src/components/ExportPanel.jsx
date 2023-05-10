import { useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import useCloseModal from '../hooks/useCloseModal';

import Button from '../elements/Button';
import ExportCSVButton from '../elements/ExportCSVButton';
import ProgressBar from '../elements/ProgressBar';

export default function ExportPanel( { options, filters, header, handlePanel } ) {
	const { __ } = useI18n();
	const activefilters = filters ? Object.keys( filters ) : null;
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
		<div className="urlslab-panel-wrap urlslab-panel-modal fadeInto">
			<div className="urlslab-panel">
				<div className="urlslab-panel-header">
					<h3>{ __( 'Export data' ) }</h3>
					<button className="urlslab-panel-close" onClick={ hidePanel }>
						<CloseIcon />
					</button>
				</div>
				{ ( activefilters?.length > 0 && header ) &&
				<div className="urlslab-panel-section">
					<p><strong>{ __( 'Active filters:' ) }</strong></p>
					<p>
						<ul className="columns-2">
							{ activefilters.map( ( key ) => {
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
						<Button className="ma-left" onClick={ hidePanel }>{ __( 'Cancel' ) }</Button>
						{ activefilters?.length > 0 &&
						<ExportCSVButton className="ml-s" options={ options } withfilters onClick={ handleExportStatus } />
						}
						<ExportCSVButton
							className="ml-s"
							options={ options } onClick={ handleExportStatus }
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
