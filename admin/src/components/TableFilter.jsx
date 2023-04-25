import { useCallback, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import { langName } from '../lib/helpers';

import { dateOp, stringOp, numericOp, langOp, menuOp } from '../lib/filterOperators';

import Button from '../elements/Button';
import { ReactComponent as CloseIcon } from '../assets/images/icons/icon-close.svg';

import '../assets/styles/components/_TableFilter.scss';
import TableFilterPanel from './TableFilterPanel';
import Tooltip from '../elements/Tooltip';

export default function TableFilter( { props, onEdit, onRemove } ) {
	const { __ } = useI18n();
	const { filters, possiblefilters, state, slug, header, initialRow } = props;
	const [ editFilter, activateEditing ] = useState( );
	const activefilters = Object.keys( filters ).length ? Object.keys( filters ) : null;

	const operatorTypes = {
		date: dateOp,
		number: numericOp,
		string: stringOp,
		lang: langOp,
		menu: menuOp,
		boolean: menuOp,
	};

	const handleOnEdit = useCallback( ( val ) => {
		activateEditing();
		onEdit( val );
	}, [ onEdit ] );

	return (
		<div className="flex flex-align-center flex-wrap">
			{ header && activefilters?.map( ( key, index ) => { // Iterating active filters
				return ( <Button
					key={ key }
					active={ editFilter === key ? true : false }
					className={ `outline ${ index > 0 && 'ml-s' } pos-relative` }
					onClick={ () => ! state.editFilter && ! editFilter && activateEditing( key ) }
				>
					<div className="flex">
						{ header[ key ] }:&nbsp;
						<span className="regular flex flex-align-center">
							<span className="fs-xs">{ operatorTypes[ filters[ key ]?.keyType ][ filters[ key ]?.op ] }</span>
							&nbsp;
							“<span className="limit-20">
								{ filters[ key ]?.op === 'BETWEEN' &&
								`min: ${ filters[ key ]?.val.min }, max: ${ filters[ key ]?.val.max }`
								}

								{ key === 'lang' &&
								langName( filters?.lang?.val )
								}

								{ filters[ key ]?.op !== 'BETWEEN' && key !== 'lang' &&
									filters[ key ]?.filterValMenu
									? filters[ key ]?.filterValMenu[ filters[ key ]?.val ]
									: filters[ key ]?.val
								}
							</span>”</span>
						<Tooltip className="showOnHover">{ __( 'Edit filter' ) }</Tooltip>
					</div>
					<div className="flex flex-align-center">
						<CloseIcon className="close" onClick={ () => {
							onRemove( [ key ] );
						} } />
						<Tooltip className="showOnHover" style={ { width: '8em' } }>{ __( 'Delete filter' ) }</Tooltip>
					</div>
					{ editFilter === key && // Edit filter panel
						<TableFilterPanel key={ key } props={ { key, slug, header, initialRow, possiblefilters, filters } } onEdit={ handleOnEdit } />
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
