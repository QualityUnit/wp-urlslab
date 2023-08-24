import { memo, useRef, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import Button from '@mui/joy/Button';

import useTableStore from '../hooks/useTableStore';
import useTablePanels from '../hooks/useTablePanels';
import useCloseModal from '../hooks/useCloseModal';

import ExportCSVButton from '../elements/ExportCSVButton';
import ProgressBar from '../elements/ProgressBar';

function ExportPanel( props ) {
	const { __ } = useI18n();
	const filters = useTableStore( ( state ) => state.filters );
	const paginationId = useTableStore( ( state ) => state.paginationId );
	const slug = useTableStore( ( state ) => state.slug );
	const deleteCSVCols = useTablePanels( ( state ) => state.deleteCSVCols );
	const header = useTableStore( ( state ) => state.header );
	const activefilters = filters ? Object.keys( filters ) : null;
	const [ exportStatus, setExportStatus ] = useState();
	const stopFetching = useRef( false );

	const { CloseIcon, handleClose } = useCloseModal( );

	const hidePanel = ( ) => {
		stopFetching.current = true;
		handleClose();
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
						<Button className="ma-left" variant="plain" color="neutral" onClick={ hidePanel }>{ __( 'Cancel' ) }</Button>
						{ activefilters?.length > 0 &&
							<ExportCSVButton className="ml-s" options={ { ...props, filters, paginationId, deleteCSVCols, slug, stopFetching } } withfilters onClick={ handleExportStatus } />
						}
						<ExportCSVButton
							className="ml-s"
							options={ { ...props, filters, paginationId, slug, deleteCSVCols, stopFetching } } onClick={ handleExportStatus }
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default memo( ExportPanel );
