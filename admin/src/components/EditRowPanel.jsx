import { memo, useMemo, useRef } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import useChangeRow from '../hooks/useChangeRow';
import useCloseModal from '../hooks/useCloseModal';
import useTablePanels from '../hooks/useTablePanels';

import Button from '../elements/Button';
import UnifiedPanelMenu from './UnifiedPanelMenu';
import useTableStore from '../hooks/useTableStore';

function EditRowPanel( props ) {
	const { editorMode, noScrollbar, notWide, text, handlePanel } = props;
	const { __ } = useI18n();
	const enableAddButton = useRef( false );
	const { CloseIcon, handleClose } = useCloseModal( );

	const { slug, paginationId, optionalSelector, title, id } = useTableStore();
	const data = useTableStore( ( state ) => state.data );
	const options = useTablePanels( ( state ) => state.options );
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );
	const rowEditorCells = useTablePanels( ( state ) => state.rowEditorCells );
	const panelOverflow = useTablePanels( ( state ) => state.panelOverflow );
	const flattenedData = data?.pages?.flatMap( ( page ) => page ?? [] );
	const { insertRow, saveEditedRow } = useChangeRow( { data: flattenedData, url: { filters: {}, sortBy: [] }, slug, paginationId } );

	console.log( rowToEdit );

	const requiredFields = rowEditorCells && Object.keys( rowEditorCells ).filter( ( cell ) => rowEditorCells[ cell ]?.props.required === true );

	let cellsFinal = { ...rowEditorCells };

	const rowToEditWithDefaults = useMemo( () => {
		let defaults = { ...rowToEdit };
		Object.entries( rowEditorCells ).map( ( [ cellId, cell ] ) => {
			const cellProps = cell.props;

			if ( cellProps.hideOnAdd && ! editorMode ) {
				delete rowEditorCells[ cellId ];
			}

			if ( ! defaults[ cellId ] && cellProps.defaultValue ) {
				defaults = { ...defaults, [ cellId ]: cellProps.defaultValue };
			}
			return false;
		} );
		return defaults;
	}, [ editorMode, rowEditorCells, rowToEdit ] );

	// Checking if all required fields are filled in rowToEdit object
	if ( Object.keys( rowToEditWithDefaults ).length ) {
		enableAddButton.current = requiredFields?.every( ( key ) => Object.keys( rowToEditWithDefaults ).includes( key && rowToEditWithDefaults[ key ] ) );
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
			saveEditedRow( { editedRow: rowToEdit, optionalSelector, id } );
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
				<div className={ `mt-l urlslab-panel-content ${ ( noScrollbar || panelOverflow ) ? 'no-scrollbar' : '' }` }>
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
