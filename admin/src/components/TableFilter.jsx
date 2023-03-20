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
	const [ panelActive, activatePanel ] = useState( false );
	const activeFilters = Object.keys( currentFilters );

	useEffect( () => {
		const handleClickOutside = ( event ) => {
			if ( ! ref.current?.contains( event.target ) && panelActive ) {
				activatePanel( false );
			}
		};

		document.addEventListener( 'click', handleClickOutside, false );
	}, [ panelActive ] );

	if ( onFilter && filters ) {
		onFilter( { filters, currentFilters } );
	}

	const possibleFilters = useMemo( () => {
		if ( header ) {
			return header;
		}
		return undefined;
	}, [ header ] );
	// addFilter('kwType', 'M')
	return (
		<div className="flex flex-align-center">
			{ possibleFilters && activeFilters.map( ( key ) => {
				return ( <Button className="outline ml-s" key={ key } onClick={ () => removeFilters( [ key ] ) }>{ possibleFilters[ key ] }<CloseIcon className="close" /></Button> );
			} ) }

			<div ref={ ref } className="pos-relative">
				<Button className="simple underline" onClick={ () => activatePanel( ! panelActive ) }>{ __( '+ Add filter' ) }
				</Button>

				{ panelActive &&
					<div className="urlslab-panel urslab-TableFilter-panel pos-absolute">
						<SortMenu
							items={ possibleFilters }
							name="filters"
							checkedId={ Object.keys( possibleFilters )[ 0 ] }
							onChange={ ( val ) => val }
						/>

						<div className="Buttons flex flex-align-center">
							<Button className="simple" onClick={ () => activatePanel( false ) }>{ __( 'Cancel' ) }</Button>
							<Button active>{ __( 'Save' ) }</Button>
						</div>
					</div>
				}
			</div>

			{ activeFilters?.length > 0 &&
			<Button className="simple underline" onClick={ () => removeFilters( activeFilters ) }>{ __( 'Clear filters' ) }</Button>
			}

		</div>
	);
}
