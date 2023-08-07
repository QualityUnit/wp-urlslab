import { memo, useEffect, useMemo, useRef } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import useChangeRow from '../hooks/useChangeRow';
import useCloseModal from '../hooks/useCloseModal';
import useTablePanels from '../hooks/useTablePanels';

import Button from '../elements/Button';
import UnifiedPanelMenu from './UnifiedPanelMenu';

function EditRowPanel( props ) {
	const { editorMode, handleOpenPanel, rowEditorCells, rowToEdit, noScrollbar, notWide, data, slug, paginationId, title, text, id, handlePanel } = props;
	const { __ } = useI18n();
	const enableAddButton = useRef( false );
	const { CloseIcon, handleClose } = useCloseModal( );
	const { options } = useTablePanels();
	const flattenedData = data?.pages?.flatMap( ( page ) => page ?? [] );
	const { insertRow, saveEditedRow } = useChangeRow( { data: flattenedData, url: { filters: {}, sortBy: [] }, slug, paginationId } );

	const requiredFields = rowEditorCells && Object.keys( rowEditorCells ).filter( ( cell ) => rowEditorCells[ cell ]?.props.required === true );

	let cellsFinal = { ...rowEditorCells };

	useEffect( () => {
		// panel is open
		if ( handleOpenPanel ) {
			handleOpenPanel( cellsFinal );
		}
	}, [] );

	const rowToEditWithDefaults = useMemo( () => {
		let defaults = { ...rowToEdit };
		Object.entries( rowEditorCells ).map( ( [ cellId, cell ] ) => {
			const cellProps = cell.props;

			if ( ! defaults[ cellId ] && cellProps.defaultValue ) {
				defaults = { ...defaults, [ cellId ]: cellProps.defaultValue };
			}
			return false;
		} );
		return defaults;
	}, [ rowEditorCells, rowToEdit ] );

	// Checking if all required fields are filled in rowToEdit object
	if ( Object.keys( rowToEditWithDefaults ).length ) {
		enableAddButton.current = requiredFields?.every( ( key ) => Object.keys( rowToEditWithDefaults ).includes( key ) );
	}
	if ( ! Object.keys( rowToEdit ).length ) {
		enableAddButton.current = false;
	}

	if ( editorMode ) {
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
		if ( editorMode ) {
			hidePanel( 'rowChanged' );
			saveEditedRow( { editedRow: rowToEdit, id } );
			return false;
		}
		insertRow( { editedRow: rowToEditWithDefaults } );
		hidePanel( 'rowInserted' );
	}

	return (
		<div className={ `urlslab-panel-wrap urlslab-panel-modal ${ ! notWide ? 'ultrawide' : '' } fadeInto` }>
			<div className="urlslab-panel">
				<div className="urlslab-panel-header">
					<h3>{ editorMode ? 'Edit row' : title }</h3>
					<button className="urlslab-panel-close" onClick={ hidePanel }>
						<CloseIcon />
					</button>
					{ editorMode && options.length > 0 && <UnifiedPanelMenu /> }
				</div>
				<div className={ `mt-l urlslab-panel-content ${ noScrollbar ? 'no-scrollbar' : '' }` }>
					{ text && <p className="fs-m">{ text }</p> }
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
						{ editorMode
							? __( 'Save changes' )
							: title
						}
					</Button>
				</div>
			</div>
		</div>
	);
}

export default memo( EditRowPanel );
