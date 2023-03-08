import { useI18n } from '@wordpress/react-i18n';

import useCloseModal from '../hooks/useCloseModal';

import Button from '../elements/Button';
import ExportCSVButton from '../elements/ExportCSVButton';

export default function ExportPanel( { options, currentFilters, header, handlePanel } ) {
	const { __ } = useI18n();
	const activeFilters = Object.keys( currentFilters );

	const { CloseIcon, handleClose } = useCloseModal( handlePanel );

	const hidePanel = ( operation ) => {
		handleClose();
		if ( handlePanel ) {
			handlePanel( operation );
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
				<div className="flex">
					<Button className="ma-left simple" onClick={ () => hidePanel() }>{ __( 'Cancel' ) }</Button>
					{ activeFilters?.length > 0 &&
					<ExportCSVButton className="ml-s" options={ options } withFilters onClick />
					}
					<ExportCSVButton
						className="ml-s"
						options={ options } onClick
					/>
				</div>
			</div>
		</div>
	);
}
