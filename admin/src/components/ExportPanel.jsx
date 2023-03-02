import { useI18n } from '@wordpress/react-i18n';
import ExportCSVButton from '../elements/ExportCSVButton';
import BackButton from '../elements/BackButton';

export default function ExportPanel( { options, currentFilters, header, backToTable } ) {
	const { __ } = useI18n();
	const activeFilters = Object.keys( currentFilters );

	return (
		<div className="urlslab-panel-importexport">
			<BackButton className="mb-l" onClick={ () => backToTable() }>{ __( 'Back to table' ) }</BackButton>

			<div className="urlslab-panel">
				<h4 className="mb-l">{ __( 'Export data' ) }</h4>
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
					{ activeFilters?.length > 0 &&
					<ExportCSVButton className="ma-left" options={ options } withFilters onClick />
					}
					<ExportCSVButton
						className={ `${ activeFilters?.length ? 'ml-s-tablet' : 'ma-left' }` }
						options={ options } onClick
					/>
				</div>
			</div>
		</div>
	);
}
