import { useCallback, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import { langName } from '../lib/helpers';

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

	return (
		<div className="flex flex-align-center flex-wrap">
			{ header && activeFilters?.map( ( key, index ) => { // Iterating active filters
				return ( <Button
					key={ key }
					active={ editFilter === key ? true : false }
					className={ `outline ${ index > 0 && 'ml-s' } pos-relative` }
					onClick={ () => ! state.editFilter && activateEditing( key ) }
				>
					<div className="flex">
						{ header[ key ] }:&nbsp;
						<span className="regular flex">“<span className="limit-20">
							{ currentFilters[ key ]?.op === 'BETWEEN' && ! currentFilters?.lang
								? `min: ${ currentFilters[ key ]?.val.min }, max: ${ currentFilters[ key ]?.val.max }`
								: ! currentFilters?.lang && currentFilters[ key ]?.val
							}
							{ currentFilters?.lang &&
							langName( currentFilters?.lang?.val )
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
						<TableFilterPanel key={ key } props={ { key, slug, header, initialRow, possibleFilters: state.possibleFilters, currentFilters } } onEdit={ ( val ) => {
							activateEditing(); onEdit( val );
						} } />
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
