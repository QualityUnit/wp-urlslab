import { useEffect, useRef, useCallback } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import Button from '@mui/joy/Button';

import { useFilter } from '../hooks/filteringSorting';
import useResizeObserver from '../hooks/useResizeObserver';
import useHeaderHeight from '../hooks/useHeaderHeight';
import useClickOutside from '../hooks/useClickOutside';
import useTableStore from '../hooks/useTableStore';

import TableFilter from './TableFilter';
import TableFilterPanel from './TableFilterPanel';
import TablePanels from './TablePanels';
import RowCounter from './RowCounter';

import ColumnsMenu from '../elements/ColumnsMenu';
import TableActionsMenu from '../elements/TableActionsMenu';
import AddNewTableRecord from '../elements/AddNewTableRecord';
import RefreshTableButton from '../elements/RefreshTableButton';
import DeleteSelectedButton from '../elements/DeleteSelectedButton';

export default function ModuleViewHeaderBottom( { noColumnsMenu, noFiltering, hideActions, noImport, noInsert, noExport, noCount, noDelete, options, customPanel } ) {
	const { __ } = useI18n();
	const didMountRef = useRef( false );
	const panelPopover = useRef();
	const headerBottomHeight = useHeaderHeight( ( state ) => state.headerBottomHeight );
	const setHeaderBottomHeight = useHeaderHeight( ( state ) => state.setHeaderBottomHeight );
	const activeTable = useTableStore( ( state ) => state.activeTable );
	const filters = useTableStore( ( state ) => state.tables[ activeTable ]?.filters || {} );

	const handleHeaderHeight = useCallback( ( elem ) => {
		let bottomHeight = elem?.getBoundingClientRect().height;

		// extend bottom height with possible table description toggle
		const descriptionElement = elem?.closest( '.urlslab-tableView' )?.querySelector( '.urlslab-DescriptionBox-header' );
		if ( descriptionElement ) {
			bottomHeight = bottomHeight + descriptionElement.getBoundingClientRect().height;
		}

		if ( bottomHeight && bottomHeight !== headerBottomHeight ) {
			setHeaderBottomHeight( bottomHeight );
		}
	}, [ headerBottomHeight, setHeaderBottomHeight ] );

	const headerBottom = useResizeObserver( handleHeaderHeight );

	const { state, dispatch, handleSaveFilter, handleRemoveFilter } = useFilter( );

	const close = useCallback( () => {
		dispatch( { type: 'toggleEditFilter', editFilter: false } );
	}, [] );
	useClickOutside( panelPopover, close );

	const handleOnEdit = useCallback( ( returnObj ) => {
		if ( returnObj ) {
			handleSaveFilter( returnObj );
		}
		if ( ! returnObj ) {
			dispatch( { type: 'toggleEditFilter', editFilter: false } );
		}
	}, [ handleSaveFilter, dispatch ] );

	useEffect( () => {
		handleHeaderHeight();

		didMountRef.current = true;
	}, [ ] );

	return (
		<>
			<div ref={ headerBottom } className="urlslab-moduleView-headerBottom">
				<div className="urlslab-moduleView-headerBottom__top flex flex-align-center">

					{ ! noDelete &&
						<DeleteSelectedButton />
					}
					{ ! noInsert &&
						<AddNewTableRecord />
					}

					{
						! noFiltering &&
						<div className="pos-relative">
							<Button
								className="underline"
								variant="plain"
								color="neutral"
								onClick={ () => dispatch( { type: 'toggleEditFilter', editFilter: 'addFilter' } ) }
							>
								{ __( '+ Add filter' ) }
							</Button>

							{ state.editFilter === 'addFilter' && // Our main adding panel (only when Add button clicked)
							<TableFilterPanel ref={ panelPopover } onEdit={ ( val ) => {
								handleHeaderHeight();
								handleOnEdit( val );
							} } />
							}
						</div>
					}

					<div className="ma-left flex flex-align-center">
						{ ! noCount &&
						<RowCounter />
						}
						{ hideActions &&
							<TableActionsMenu options={ { noImport, noExport, noDelete } } />
						}

						{
							! noColumnsMenu &&
							<ColumnsMenu
								className="menu-left ml-m"
							/>
						}
						<RefreshTableButton noCount={ noCount } />
					</div>
				</div>
				{ Object.keys( filters ).length !== 0 &&
				<div className="urlslab-moduleView-headerBottom__bottom mt-l flex flex-align-center">
					<TableFilter props={ { state } } onEdit={ handleOnEdit } onRemove={ ( key ) => {
						handleHeaderHeight();
						handleRemoveFilter( key );
					} } />
				</div>
				}
			</div>
			{ customPanel && <div className="urlslab-moduleView-headerBottom__customPanel">{ customPanel }</div> }

			<TablePanels props={ { options } } />
		</>
	);
}
