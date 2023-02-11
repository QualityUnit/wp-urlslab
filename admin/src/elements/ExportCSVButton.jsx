import { jsonData, exportCSV } from '../api/import-export-csv';
import { useI18n } from '@wordpress/react-i18n';
import Button from './Button';

export default function ExportCSVButton( { options, onClick } ) {
	const { __ } = useI18n();

	const handleExport = () => {
		if ( onClick ) {
			onClick( jsonData );
		}
		exportCSV( options ).then( ( response ) => {
			if ( onClick ) {
				onClick( response );
			}
		} );
	};
	return (
		<Button className="active"
			onClick={ handleExport }>
			{ __( 'Export CSV' ) }
		</Button>
	);
}
