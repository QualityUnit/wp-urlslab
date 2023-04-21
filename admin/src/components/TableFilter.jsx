import { useCallback, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import { langName } from '../lib/helpers';

import { dateOp, stringOp, numericOp, langOp, menuOp } from '../lib/filterOperators';

import Button from '../elements/Button';
import { ReactComponent as CloseIcon } from '../assets/images/icon-close.svg';

import '../assets/styles/components/_TableFilter.scss';
import TableFilterPanel from './TableFilterPanel';
import Tooltip from '../elements/Tooltip';

export default function TableFilter( { props, onEdit, onRemove } ) {
	const { __ } = useI18n();
	const { currentFilters, state, slug, header, initialRow } = props;
	const [ editFilter, activateEditing ] = useState( );
	const activeFilters = Object.keys( currentFilters ).length ? Object.keys( currentFilters ) : null;

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
			{ header && activeFilters?.map( ( key, index ) => { // Iterating active filters
				return ( <Button
					key={ key }
					active={ editFilter === key ? true : false }
					className={ `outline ${ index > 0 && 'ml-s' } pos-relative` }
					onClick={ () => ! state.editFilter && ! editFilter && activateEditing( key ) }
				>
					<div className="flex">
						{ header[ key ] }:&nbsp;
						<span className="regular flex flex-align-center">
							<span className="fs-xs">{ operatorTypes[ currentFilters[ key ]?.keyType ][ currentFilters[ key ]?.op ] }</span>
							&nbsp;
							“<span className="limit-20">
								{ currentFilters[ key ]?.op === 'BETWEEN' &&
								`min: ${ currentFilters[ key ]?.val.min }, max: ${ currentFilters[ key ]?.val.max }`
								}

								{ key === 'lang' &&
								langName( currentFilters?.lang?.val )
								}

								{ currentFilters[ key ]?.op !== 'BETWEEN' && key !== 'lang' &&
									currentFilters[ key ]?.filterValMenu
									? currentFilters[ key ]?.filterValMenu[ currentFilters[ key ]?.val ]
									: currentFilters[ key ]?.val
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
						<TableFilterPanel key={ key } props={ { key, slug, header, initialRow, possibleFilters: state.possibleFilters, currentFilters } } onEdit={ handleOnEdit } />
					}
				</Button> );
			} ) }

			{ activeFilters?.length > 0 && // Removes all used filters in given table
				<Button className="simple underline" onClick={ () => {
					onRemove( activeFilters );
				} }>{ __( 'Clear filters' ) }</Button>
			}
		</div>
	);
}
