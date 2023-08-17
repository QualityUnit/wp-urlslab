import { useCallback, useRef, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import { dateWithTimezone, langName } from '../lib/helpers';
import { operatorTypes } from '../lib/filterOperators';
import useClickOutside from '../hooks/useClickOutside';
import useTableStore from '../hooks/useTableStore';
import useTags from '../hooks/useTags';

import Button from '../elements/Button';
import { ReactComponent as CloseIcon } from '../assets/images/icons/icon-close.svg';

import TableFilterPanel from './TableFilterPanel';
import Tooltip from '../elements/Tooltip';
import DateTimeFormat from '../elements/DateTimeFormat';
import Tag from '../elements/Tag';

export default function TableFilter( { props, onEdit, onRemove } ) {
	const { __ } = useI18n();
	const panelPopover = useRef();
	const { possiblefilters, state, slug, header } = props;
	const { tagsData } = useTags();
	const filters = useTableStore( ( tableState ) => tableState.filters );
	const initialRow = useTableStore( ( tableState ) => tableState.initialRow );

	const [ editFilter, activateEditing ] = useState( );
	const activefilters = Object.keys( filters ).length ? Object.keys( filters ) : null;

	const close = useCallback( () => {
		activateEditing();
	}, [] );
	useClickOutside( panelPopover, close );

	const handleOnEdit = useCallback( ( val ) => {
		activateEditing();
		onEdit( val );
	}, [ onEdit ] );

	return (
		<div className="flex flex-align-center flex-wrap">
			{ header && activefilters?.map( ( key, index ) => { // Iterating active filters
				const isDate = filters[ key ]?.keyType === 'date' && true;
				let filterValue = filters[ key ]?.val;
				if ( isDate ) {
					const { correctedDate } = dateWithTimezone( filterValue );
					filterValue = new Date( correctedDate );
				}
				return ( <Button
					key={ key }
					active={ editFilter === key ? true : false }
					className={ `outline ${ index > 0 && 'ml-s' } pos-relative` }
					onClick={ () => ! state.editFilter && ! editFilter && activateEditing( key ) }
				>
					<div className="flex flex-align-center">
						{ header[ key ] }:&nbsp;
						<span className="regular flex flex-align-center">
							<span className="fs-xs">{ operatorTypes[ filters[ key ]?.keyType ][ filters[ key ]?.op ] }</span>
							&nbsp;

							{ key === 'labels'
								? tagsData.map( ( tag ) => {
									if ( tag.label_id === filters[ key ]?.val ) {
										const { label_id, name, bgcolor, className: tagClass } = tag;
										return <Tag key={ label_id } fullSize className={ `smallText ${ tagClass }` } style={ { width: 'min-content', backgroundColor: bgcolor } }>
											{ name }
										</Tag>;
									}
									return null;
								} )
								: <>“<span className="limit-20">
									{ filters[ key ]?.op === 'BETWEEN' &&
									`min: ${ filters[ key ]?.val.min }, max: ${ filters[ key ]?.val.max }`
									}

									{ key === 'lang' &&
									langName( filters?.lang?.val )
									}

									{ ( filters[ key ]?.op !== 'BETWEEN' && key !== 'lang' && key !== 'labels' ) &&
									filters[ key ]?.filterValMenu
										? filters[ key ]?.filterValMenu[ filters[ key ]?.val.toString() ]
										: filters[ key ]?.op !== 'BETWEEN' && ( ( ! isDate && filters[ key ]?.val.toString() ) || ( isDate && <DateTimeFormat oneLine datetime={ filterValue } /> ) )
									}
								</span>”</>
							}
						</span>
						<Tooltip className="showOnHover">{ __( 'Edit filter' ) }</Tooltip>
					</div>
					<div className="flex flex-align-center">
						<CloseIcon className="close" onClick={ () => {
							onRemove( [ key ] );
						} } />
						<Tooltip className="showOnHover" style={ { width: '8em' } }>{ __( 'Delete filter' ) }</Tooltip>
					</div>
					{ editFilter === key && // Edit filter panel
						<TableFilterPanel ref={ panelPopover } key={ key } props={ { key, slug, header, initialRow, possiblefilters, filters } } onEdit={ handleOnEdit } />
					}
				</Button> );
			} ) }

			{ activefilters?.length > 0 && // Removes all used filters in given table
				<Button className="simple underline" onClick={ () => {
					onRemove( activefilters );
				} }>{ __( 'Clear filters' ) }</Button>
			}
		</div>
	);
}
