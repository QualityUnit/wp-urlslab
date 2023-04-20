import { useRef } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import useChangeRow from '../hooks/useChangeRow';
import useCloseModal from '../hooks/useCloseModal';
import Button from '../elements/Button';

export default function InsertRowPanel( { insertOptions, handlePanel } ) {
	const { __ } = useI18n();
	const enableAddButton = useRef( false );
	const { CloseIcon, handleClose } = useCloseModal( handlePanel );

	const { inserterCells, title, text, data, slug, url, paginationId, rowToInsert } = insertOptions || {};
	const flattenedData = data?.pages?.flatMap( ( page ) => page ?? [] );
	const { insertRowResult, insertRow } = useChangeRow( { data: flattenedData, url, slug, paginationId } );
	const requiredFields = inserterCells && Object.keys( inserterCells ).filter( ( cell ) => inserterCells[ cell ].props.required === true );

	// Checking if all required fields are filled in rowToInsert object
	if ( rowToInsert ) {
		enableAddButton.current = requiredFields?.every( ( key ) => Object.keys( rowToInsert ).includes( key ) );
	}
	if ( ! rowToInsert ) {
		enableAddButton.current = false;
	}

	function hidePanel( response ) {
		handleClose();
		enableAddButton.current = false;
		if ( handlePanel && ! response ) {
			handlePanel( 'clearRow' );
		}
		if ( handlePanel && response ) {
			handlePanel( response );
		}
	}

	function handleInsert() {
		insertRow( { rowToInsert } );
	}

	if ( insertRowResult?.ok ) {
		setTimeout( () => {
			hidePanel( 'rowInserted' );
		}, 100 );
	}

	return (
		<div className="urlslab-panel-wrap urlslab-panel-floating fadeInto">
			<div className="urlslab-panel">
				<div className="urlslab-panel-header">
					<h3>{ title }</h3>
					<button className="urlslab-panel-close" onClick={ hidePanel }>
						<CloseIcon />
					</button>
					<p>{ text }</p>
				</div>
				<div className="mt-l">
					{
						inserterCells && Object.entries( inserterCells ).map( ( [ cellId, cell ] ) => {
							return <div className="mb-l" key={ cellId }>
								{ cell }
							</div>;
						} )
					}
					<div className="flex">
						<Button className="ma-left simple" onClick={ hidePanel }>{ __( 'Cancel' ) }</Button>
						<Button active disabled={ ! enableAddButton.current } onClick={ handleInsert }>{ title }</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
