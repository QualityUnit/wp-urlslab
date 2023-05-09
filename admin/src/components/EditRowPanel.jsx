import { useRef } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import useChangeRow from '../hooks/useChangeRow';
import useCloseModal from '../hooks/useCloseModal';
import Button from '../elements/Button';

export default function EditRowPanel( { rowEditorOptions, handlePanel } ) {
	const { __ } = useI18n();
	const enableAddButton = useRef( false );
	const { CloseIcon, handleClose } = useCloseModal( handlePanel );

	const { editorMode, rowEditorCells, title, text, data, slug, url, paginationId, rowToEdit } = rowEditorOptions || {};
	const flattenedData = data?.pages?.flatMap( ( page ) => page ?? [] );
	const { insertRowResult, insertRow, saveEditedRow } = useChangeRow( { data: flattenedData, url, slug, paginationId } );
	const requiredFields = rowEditorCells && Object.keys( rowEditorCells ).filter( ( cell ) => rowEditorCells[ cell ].props.required === true );

	let cellsFinal = { ...rowEditorCells };

	// Checking if all required fields are filled in rowToEdit object
	if ( rowToEdit && ! rowToEdit[ paginationId ] ) {
		enableAddButton.current = requiredFields?.every( ( key ) => Object.keys( rowToEdit ).includes( key ) );
	}
	if ( ! rowToEdit ) {
		enableAddButton.current = false;
	}

	if ( editorMode ) {
		enableAddButton.current = true;
		Object.entries( cellsFinal ).map( ( [ cellId, cell ] ) => {
			// console.log( { defaultValue: rowToEdit[ cellId ] } );
			const cellProps = cell.props;

			cellsFinal = { ...cellsFinal, [ cellId ]: ( { ...cell, props: { ...cellProps, defaultValue: rowToEdit[ cellId ], disabled: cellProps.disabledOnEdit } } ) };
			return false;
		} );
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

	function handleEdit() {
		if ( editorMode ) {
			saveEditedRow( { rowToEdit } );
			return false;
		}
		insertRow( { rowToEdit } );
	}

	if ( insertRowResult?.ok ) {
		setTimeout( () => {
			hidePanel( 'rowInserted' );
		}, 100 );
	}

	return (
		<div className="urlslab-panel-wrap urlslab-panel-modal fadeInto">
			<div className="urlslab-panel">
				<div className="urlslab-panel-header">
					<h3>{ editorMode ? 'Edit row' : title }</h3>
					<button className="urlslab-panel-close" onClick={ hidePanel }>
						<CloseIcon />
					</button>
					<p>{ text }</p>
				</div>
				<div className="mt-l">
					{
						cellsFinal && Object.entries( cellsFinal ).map( ( [ cellId, cell ] ) => {
							return <div className="mb-l" key={ cellId }>
								{ cell }
							</div>;
						} )
					}
					<div className="flex">
						<Button className="ma-left simple" onClick={ hidePanel }>{ __( 'Cancel' ) }</Button>
						<Button active disabled={ ! enableAddButton.current } onClick={ handleEdit }>
							{ editorMode
								? __( 'Save changes' )
								: title
							}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
