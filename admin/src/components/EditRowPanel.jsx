import { useRef, useMemo, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import useChangeRow from '../hooks/useChangeRow';
import useCloseModal from '../hooks/useCloseModal';
import Button from '../elements/Button';

export default function EditRowPanel( { rowEditorOptions, handlePanel } ) {
	const { __ } = useI18n();
	const enableAddButton = useRef( false );
	const { CloseIcon, handleClose } = useCloseModal( handlePanel );

	const { editorMode, rowEditorCells, notWide, title, text, data, slug, url, paginationId, rowToEdit } = rowEditorOptions || {};
	const flattenedData = data?.pages?.flatMap( ( page ) => page ?? [] );
	const { insertRowResult, insertRow, saveEditedRow } = useChangeRow( { data: flattenedData, url, slug, paginationId } );
	const requiredFields = rowEditorCells && Object.keys( rowEditorCells ).filter( ( cell ) => rowEditorCells[ cell ].props.required === true );

	let cellsFinal = { ...rowEditorCells };
	const [ editMode ] = useState( rowToEdit && editorMode );

	const rowToEditWithDefaults = useMemo( () => {
		let defaults = { ...rowToEdit };
		Object.entries( rowEditorCells ).map( ( [ cellId, cell ] ) => {
			const cellProps = cell.props;

			if ( ! defaults[ cellId ] ) {
				defaults = { ...defaults, [ cellId ]: cellProps.defaultValue };
			}
			return false;
		} );
		return defaults;
	}, [ rowEditorCells, rowToEdit ] );

	// Checking if all required fields are filled in rowToEdit object
	if ( rowToEdit ) {
		enableAddButton.current = requiredFields?.every( ( key ) => Object.keys( rowToEdit ).includes( key ) );
	}
	if ( ! rowToEdit ) {
		enableAddButton.current = false;
	}

	if ( editMode ) {
		enableAddButton.current = true;
		Object.entries( cellsFinal ).map( ( [ cellId, cell ] ) => {
			const cellProps = cell.props;

			cellsFinal = { ...cellsFinal, [ cellId ]: ( { ...cell, props: { ...cellProps, defaultValue: rowToEdit[ cellId ], disabled: cellProps.disabledOnEdit } } ) };
			return false;
		} );
	}

	function hidePanel( response ) {
		handleClose();
		enableAddButton.current = false;
		if ( handlePanel && ! response ) {
			handlePanel( );
		}
		if ( handlePanel && response ) {
			handlePanel( response );
		}
	}

	function handleEdit() {
		if ( editMode ) {
			setTimeout( () => {
				hidePanel( 'rowChanged' );
			}, 100 );
			saveEditedRow( { editedRow: rowToEdit } );
			return false;
		}
		insertRow( { editedRow: rowToEditWithDefaults } );
	}

	if ( insertRowResult?.ok ) {
		setTimeout( () => {
			if ( ! editMode ) {
				hidePanel( 'rowInserted' );
			}
		}, 100 );
	}

	return (
		<div className={ `urlslab-panel-wrap urlslab-panel-modal ${ ! notWide ? 'ultrawide' : '' } fadeInto` }>
			<div className="urlslab-panel">
				<div className="urlslab-panel-header">
					<h3>{ editMode ? 'Edit row' : title }</h3>
					<button className="urlslab-panel-close" onClick={ hidePanel }>
						<CloseIcon />
					</button>
					<p>{ text }</p>
				</div>
				<div className="mt-l urlslab-panel-content">
					{
						cellsFinal && Object.entries( cellsFinal ).map( ( [ cellId, cell ] ) => {
							return <div className={ `mb-l urlslab-panel-content__item ${ cell.props.hidden ? 'hidden' : '' }` } key={ cellId }>
								{ cell }
							</div>;
						} )
					}
				</div>
				<div className="flex ">
					<Button className="ma-left mr-s" onClick={ hidePanel }>{ __( 'Cancel' ) }</Button>
					<Button active disabled={ ! enableAddButton.current } onClick={ handleEdit }>
						{ editMode
							? __( 'Save changes' )
							: title
						}
					</Button>
				</div>
			</div>
		</div>
	);
}
