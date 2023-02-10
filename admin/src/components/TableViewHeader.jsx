import { useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import { jsonData, exportCSV } from '../api/import-export-csv';
import Button from '../elements/Button';
import SimpleButton from '../elements/SimpleButton';

export default function TableViewHeader( { activeMenu } ) {
	const { __ } = useI18n();
	const [ active, setActive ] = useState( 'overview' );

	const menuItems = new Map( [
		[ 'overview', __( 'Overview' ) ],
		[ 'settings', __( 'Settings' ) ],
		[ 'importexport', __( 'Import/Export' ) ],
	] );

	const handleMenu = ( menukey ) => {
		setActive( menukey );
		if ( activeMenu ) {
			activeMenu( menukey );
		}
	};

	const activator = ( menukey ) => {
		if ( menukey === active ) {
			return 'active';
		}
		return '';
	};

	const handleDownload = () => {
		exportCSV( {
			url: 'keyword',
			fromId: 'from_kw_id',
			pageId: 'kw_id',
			deleteFields: [ 'kw_id', 'destUrlMd5' ],
		} ).then(
			( b ) => {
				console.log( b );
			}
		);

		// console.log( jsonData );
		// if ( jsonData.status !== 'downloading' ) {
		// }
	};
	return (

		<div className="urlslab-tableView-header">
			<div className="urlslab-tableView-headerTop">
				{
					Array.from( menuItems ).map( ( [ key, value ] ) => {
						return <SimpleButton key={ key }
							className={ activator( key ) }
							onClick={ () => handleMenu( key ) }
						>
							{ value }
						</SimpleButton>;
					} )
				}
			</div>
			<div className="urlslab-tableView-headerBottom">
				<Button onClick={ handleDownload }>Download CSV</Button>
			</div>
		</div>
	);
}
