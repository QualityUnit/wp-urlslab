import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import Button from '@mui/joy/Button';

import useChangeRow from '../hooks/useChangeRow';
import useCloseModal from '../hooks/useCloseModal';
import useTablePanels from '../hooks/useTablePanels';

import UnifiedPanelMenu from './UnifiedPanelMenu';
import useTableStore from '../hooks/useTableStore';

function EditRowPanel( { editorMode, noScrollbar, notWide, text } ) {
	const { __ } = useI18n();
	const enableAddButton = useRef( false );
	const { CloseIcon, handleClose } = useCloseModal( );

	const activeTable = useTableStore( ( state ) => state.activeTable );
	const { optionalSelector, title, id } = useTableStore( ( state ) => state.tables[ activeTable ] );
	const options = useTablePanels( ( state ) => state.options );
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );
	const rowEditorCells = useTablePanels( ( state ) => state.rowEditorCells );
	const panelOverflow = useTablePanels( ( state ) => state.panelOverflow );
	const customSubmitAction = useTablePanels( ( state ) => state.customSubmitAction );
	const successCallbacks = useTablePanels( ( state ) => state.successCallbacks );

	const { insertRow, saveEditedRow } = useChangeRow( { ...( successCallbacks ? { successCallbacks } : null ) } );

	const requiredFields = rowEditorCells && Object.keys( rowEditorCells ).filter( ( cell ) => rowEditorCells[ cell ]?.props.required === true );

	const cellsFinal = useMemo( () => {
		let cells = { ...rowEditorCells };
		Object.entries( cells ).map( ( [ cellId, cell ] ) => {
			const cellProps = cell.props;

			cells = { ...cells, [ cellId ]: ( { ...cell, props: { ...cellProps, defaultValue: rowToEdit[ cellId ] !== undefined ? rowToEdit[ cellId ] : cellProps.defaultValue, disabled: cellProps.disabledOnEdit || cellProps.disabled } } ) };
			return false;
		} );
		return cells;
	}, [ rowToEdit, rowEditorCells ] );

	let rowToEditWithDefaults = useMemo( () => {
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

	// Enable submit/add button if all required fields have value
	if ( Object.keys( rowToEditWithDefaults ).length ) {
		enableAddButton.current = requiredFields?.every( ( key ) => Object.keys( rowToEditWithDefaults ).includes( key ) && rowToEditWithDefaults[ key ] );
	}
	if ( ! Object.keys( rowToEdit ).length ) {
		enableAddButton.current = false;
	}

	if ( editorMode || ! Object.keys( requiredFields ).length ) {
		enableAddButton.current = true;
	}

	function hidePanel( response ) {
		handleClose();

		// Resetting states on updating/adding row
		useTablePanels.setState( {
			rowToEdit: {},
			customSubmitAction: null,
			successCallbacks: null,
		} );

		rowToEditWithDefaults = {};
		enableAddButton.current = false;
		if ( response ) {
			useTablePanels.setState( { actionComplete: true } );

			setTimeout( () => {
				useTablePanels.setState( { actionComplete: false } );
			}, 100 );
		}
	}

	function handleEdit() {
		if ( editorMode ) {
			saveEditedRow( { editedRow: rowToEdit, optionalSelector, id } );
			hidePanel( );
			return false;
		}
		insertRow( { editedRow: rowToEditWithDefaults } );
		hidePanel( 'rowInserted' );
	}

	function handleCustomAction() {
		customSubmitAction();
		hidePanel( 'rowInserted' );
	}

	return (
		<div className={ `urlslab-panel-wrap urlslab-panel-modal ${ ! notWide ? 'ultrawide' : '' } fadeInto` } data-table={ activeTable } >
			<div className="urlslab-panel">
				<div className="urlslab-panel-header">
					<h3>{ editorMode ? __( 'Edit row', 'urlslab' ) : title } { activeTable }</h3>
					<button className="urlslab-panel-close" onClick={ hidePanel }>
						<CloseIcon />
					</button>
					{ editorMode && options.length > 0 && <UnifiedPanelMenu /> }
				</div>
				<div className={ `mt-l urlslab-panel-content ${ ( noScrollbar || panelOverflow ) ? 'no-scrollbar' : '' }` }>
					{ text && <p className="fs-m">{ text }</p> }
					{
						cellsFinal && Object.values( cellsFinal ).map( ( cell ) => {
							return ! cell.props.hidden &&
							<OptionItem cell={ cell } />;
						} )
					}
				</div>
				<div className="flex mt-l">
					<Button variant="plain" color="neutral" onClick={ hidePanel } sx={ { ml: 'auto', mr: 1 } }>{ __( 'Cancel', 'urlslab' ) }</Button>
					<Button disabled={ ! enableAddButton.current } onClick={ customSubmitAction ? handleCustomAction : handleEdit }>
						{ editorMode
							? __( 'Save changes', 'urlslab' )
							: title
						}
					</Button>
				</div>
			</div>
		</div>
	);
}

const OptionItem = memo( ( { cell } ) => 	{
	const ref = useRef( null );

	const handleResizeFullHeightOption = useCallback( ( panel, optionItem ) => {
		const textarea = optionItem.querySelector( 'textarea.urlslab-input' );
		if ( textarea ) {
			const panelHeight = panel.clientHeight;
			const options = panel.querySelectorAll( '.urlslab-panel-content__item' );

			let optionsHeight = 0;
			if ( options ) {
				options.forEach( ( element ) => {
					if ( ! element.classList.contains( 'fullHeight' ) ) {
						optionsHeight += ( element.offsetHeight + ( 1.5 * 16 ) ); // + bottom margin
					}
				} );
			}
			const label = optionItem.querySelector( '.urlslab-inputField-label' );

			textarea.style.height = `calc(${ panelHeight - ( optionsHeight ? optionsHeight : 0 ) - ( label ? label.offsetHeight : 0 ) }px - 2rem)`;
		}
	}, [] );

	useEffect( () => {
		let wrapperResizeObserver = null;
		let panel = null;
		if ( cell.props.fullHeight ) {
			const optionItem = ref.current;
			panel = optionItem?.closest( '.urlslab-panel-content' );
			if ( panel ) {
				wrapperResizeObserver = new ResizeObserver( () => handleResizeFullHeightOption( panel, optionItem ) );
				wrapperResizeObserver.observe( panel );
			}
		}
		return () => {
			if ( wrapperResizeObserver && panel ) {
				wrapperResizeObserver.unobserve( panel );
				wrapperResizeObserver.disconnect();
			}
		};
	}, [ cell.props.fullHeight, handleResizeFullHeightOption ] );

	return (
		<>
			{ cell.props.section && <h4>{ cell.props.section }</h4> }
			<div ref={ ref } className={ `mb-l urlslab-panel-content__item ${ cell.props.hidden ? 'hidden' : '' } ${ cell.props.fullWidth ? 'fullWidth' : '' } ${ cell.props.fullHeight ? 'fullHeight' : '' }` }>
				{ cell }
			</div>
		</>
	);
} );
export default memo( EditRowPanel );
