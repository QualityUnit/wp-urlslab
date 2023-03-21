import { useMemo, useRef, useEffect, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { useFilter } from '../hooks/filteringSorting';

import Button from '../elements/Button';
import SortMenu from '../elements/SortMenu';
import { ReactComponent as CloseIcon } from '../assets/images/icon-close.svg';

import '../assets/styles/components/_TableFilter.scss';

export default function TableFilter( { slug, header, onFilter } ) {
	const { __ } = useI18n();
	const { filters, currentFilters, addFilter, removeFilters } = useFilter( { slug } );
	const ref = useRef( null );
	const currentFilter = useRef( );
	const [ panelActive, activatePanel ] = useState( false );
	// const [ possibleFilters, setPossibleFilters ] = useState( header );
	const activeFilters = Object.keys( currentFilters );

	useEffect( () => {
		const handleClickOutside = ( event ) => {
			if ( ! ref.current?.contains( event.target ) && panelActive ) {
				activatePanel( false );
			}
		};

		document.addEventListener( 'click', handleClickOutside, false );
	}, [ panelActive ] );

	const filtering = useMemo( () => {
		return {
			usedFilters: [], possibleFilters: { ...header } };
	}, [ header ] );

	const handleSaveFilter = () => {
		let key = currentFilter.current;
		if ( ! key ) {
			key = Object.keys( filtering.possibleFilters )[ 0 ];
		}
		filtering.usedFilters.push( key );
		delete filtering.possibleFilters[ key ];
		activatePanel( false );

		addFilter( key, 'M' );

		// if (onFilter && filters) {
		// 	onFilter({ filters, currentFilters });
		// }
	};

	const handleEditFilter = () => {
		activatePanel( true );
	};

	const handleRemoveFilter = ( keysArray ) => {
		if ( keysArray.length === 1 ) {
			const key = keysArray[ 0 ];
			const val = header[ key ];
			filtering.usedFilters = filtering.usedFilters.filter( ( k ) => k !== key );
			filtering.possibleFilters = { [ key ]: `${ val }`, ...filtering.possibleFilters };
		}
		if ( keysArray.length > 1 ) {
			filtering.usedFilters = [];
			filtering.possibleFilters = { ...header };
		}
		removeFilters( keysArray );
	};

	console.log( filtering.usedFilters );
	console.log( filtering.possibleFilters );
	// console.log( header );

	return (
		<div className="flex flex-align-center flex-wrap">
			{ header && activeFilters.map( ( key ) => {
				return <div className="urlslab-button outline ml-s" key={ key }>
					<Button
						className="simple"
						onClick={ () => handleEditFilter() }>
						{ header[ key ] }
					</Button>
					<CloseIcon className="close" onClick={ () => handleRemoveFilter( [ key ] ) } />
				</div>;
			} ) }

			<div ref={ ref } className="pos-relative">
				<Button className="simple underline" onClick={ () => activatePanel( ! panelActive ) }>{ __( '+ Add filter' ) }
				</Button>

				{ panelActive &&
					<div className="urlslab-panel urslab-TableFilter-panel pos-absolute">
						<SortMenu
							items={ filtering.possibleFilters }
							name="filters"
							ref={ currentFilter }
							checkedId={ Object.keys( filtering.possibleFilters )[ 0 ] }
							onChange={ ( val ) => currentFilter.current = val }
						/>

						<div className="Buttons flex flex-align-center">
							<Button className="simple" onClick={ () => activatePanel( false ) }>{ __( 'Cancel' ) }</Button>
							<Button active onClick={ handleSaveFilter }>{ __( 'Save' ) }</Button>
						</div>
					</div>
				}
			</div>

			{ activeFilters?.length > 0 &&
				<Button className="simple underline" onClick={ () => handleRemoveFilter( activeFilters ) }>{ __( 'Clear filters' ) }</Button>
			}

		</div>
	);
}
