import { useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deleteAll } from '../api/deleteTableData';

import Button from '../elements/Button';
import SimpleButton from '../elements/SimpleButton';

import '../assets/styles/components/_TableViewHeader.scss';

export default function TableViewHeader( { slug, activeMenu } ) {
	const { __ } = useI18n();
	const [ active, setActive ] = useState( 'overview' );
	const queryClient = useQueryClient();

	const handleDelete = useMutation( {
		mutationFn: () => {
			return deleteAll( slug );
		},
		onSuccess: () => {
			queryClient.invalidateQueries( [ slug ] );
		},
	} );

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
				<Button onClick={ () => handleDelete.mutate() }>{ __( 'Delete All' ) }</Button>
			</div>
		</div>
	);
}
