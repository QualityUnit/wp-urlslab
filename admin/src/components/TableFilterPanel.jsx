import { useI18n } from '@wordpress/react-i18n';

import { stringOp, numericOp } from '../constants/filterReducer';
import { useFilter } from '../hooks/filteringSorting';

import Button from '../elements/Button';
import SortMenu from '../elements/SortMenu';
import InputField from '../elements/InputField';
import RangeInputs from '../elements/RangeInputs';

export default function TableFilterPanel( { props, onEdit } ) {
	const { key, slug, header, possibleFilters, initialRow, filteringState } = props;
	const { __ } = useI18n();

	const { state, dispatch, handleType } = useFilter( { slug, header, possibleFilters, initialRow } );

	const { currentFilters } = filteringState || {};

	const notBetween = currentFilters && currentFilters[ key ]?.op ? currentFilters[ key ]?.op !== 'BETWEEN' : state.filterObj.filterOp !== 'BETWEEN';

	return (
		<div className="urlslab-panel urslab-TableFilter-panel pos-absolute">
			<div className="urlslab-panel-header urslab-TableFilter-panel-header">
				<strong>{ __( 'Edit filter' ) }{ key ? ` ${ header[ key ] }` : '' }</strong>
			</div>
			<div className="flex mt-m mb-m flex-align-center">
				<SortMenu
					className="mr-s"
					items={ key ? header : possibleFilters }
					name="filters"
					checkedId={ key || Object.keys( possibleFilters )[ 0 ] }
					autoClose
					disabled={ key ? true : false }
					onChange={ ( keyParam ) => {
						handleType( keyParam );
						if ( key !== 'undefined' ) {
							dispatch( { type: 'setFilterKey', keyParam } );
						}
					} }
				/>
				<SortMenu
					className="ml-s"
					items={ state.filterObj.isNumber ? numericOp : stringOp }
					name="filters"
					autoClose
					checkedId={ currentFilters ? currentFilters[ key ]?.op : Object.keys( state.filterObj.isNumber ? numericOp : stringOp )[ 0 ] }
					onChange={ ( op ) => dispatch( { type: 'setFilterOp', op } ) }
				/>
			</div>
			{ notBetween
				? <InputField liveUpdate defaultValue={ currentFilters ? currentFilters[ key ]?.val : '' } placeholder={ state.filterObj.filterOp === 'IN' && 'enter ie. 0,10,15,20' } onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) } />
				: <RangeInputs liveUpdate onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) } />
			}

			<div className="Buttons mt-m flex flex-align-center">
				<Button className="ma-left simple wide" onClick={ () => onEdit( false ) }>{ __( 'Cancel' ) }</Button>
				<Button active className="wide" disabled={ state.filterObj.filterVal ? false : true } onClick={ () => onEdit( state.filterObj ) }>{ __( 'Save' ) }</Button>
			</div>
		</div>
	);
}
