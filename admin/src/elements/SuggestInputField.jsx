import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';

import { delay } from '../lib/helpers';
import { postFetch } from '../api/fetching';
import useTablePanels from '../hooks/useTablePanels';
import InputField from './InputField';
import '../assets/styles/elements/_SuggestedInputField.scss';

export default function SuggestInputField( props ) {
	const { __ } = useI18n();
	const { showInputAsSuggestion, convertComplexSuggestion, defaultValue, suggestInput, maxItems, description, referenceVal, fetchUrl, required, onChange, onSelect } = props;
	const disabledKeys = { 38: 1, 40: 1 };
	const ref = useRef();
	const inputRef = useRef();
	const [ index, setIndex ] = useState( );
	const [ input, setInput ] = useState( inputRef.current );
	const [ suggestion, setSuggestion ] = useState( input ? input : defaultValue );
	const [ suggestionsVisible, showSuggestions ] = useState( );
	const valFromRow = useTablePanels( ( state ) => state.rowToEdit[ referenceVal ] );
	const setPanelOverflow = useTablePanels( ( state ) => state.setPanelOverflow );
	const suggestFieldData = useTablePanels( ( state ) => state.suggestFieldData );
	const descriptionHeight = useRef();
	let suggestionsPanel;

	const suggestedDomains = useMemo( () => {
		if ( input ) {
			return [ input ];
		}
		return [];
	}, [ input ] );

	const scrollTo = () => {
		if ( index || index === 0 ) {
			suggestionsPanel.scrollTop = suggestionsPanel.querySelectorAll( 'li' )[ index ].offsetTop - suggestionsPanel.offsetTop;
		}
	};

	const handleTyping = ( val, type ) => {
		if ( ! type || ! val ) {
			return false;
		}

		// arrow up/down button should select next/previous list element
		if ( val.keyCode === 38 ) {
			if ( index > 0 ) {
				setIndex( ( i ) => i - 1 );
				scrollTo();
			}
			return false;
		} else if ( val.keyCode === 40 ) {
			if ( index < suggestionsList.length - 1 ) {
				setIndex( ( i ) => i + 1 );
			} else {
				setIndex( 0 );
			}
			scrollTo();
			return false;
		}
		inputRef.current = val;
		if ( type === 'onchange' ) {
			if ( onChange ) {
				onChange( val );
			}
		} else {
			delay( () => {
				setInput( val.target.value );
			}, 800 )();
		}
		return false;
	};

	const handleEnter = ( ) => {
		showSuggestions( false );
		if ( index >= 0 && suggestionsList?.length ) {
			setSuggestion( suggestionsList[ index ] );
			onChange( suggestionsList[ index ] );
		}
	};

	const { data, isLoading } = useQuery( {
		queryKey: [ input ],
		queryFn: async () => {
			if ( input ) {
				let result;
				if ( referenceVal ) {
					result = await postFetch( 'keyword/suggest', {
						count: maxItems || 15,
						keyword: valFromRow,
						url: input,
					} );
				}
				if ( fetchUrl ) {
					result = await postFetch( fetchUrl, {
						count: maxItems || 15,
						url: input,
					} );
				}

				if ( result?.ok ) {
					showSuggestions( true );
					return result.json();
				}
				return [];
			}
		},
		refetchOnWindowFocus: false,
	} );

	if ( suggestionsVisible ) {
		function preventDefault( e ) {
			e.preventDefault();
		}

		function preventDefaultForScrollKeys( e ) {
			if ( disabledKeys[ e.keyCode ] ) {
				preventDefault( e );
				return false;
			}
		}

		suggestionsPanel = ref.current.querySelector( '.urlslab-suggestInput-suggestions-inn' );
		setPanelOverflow( true );

		window.addEventListener( 'keydown', preventDefaultForScrollKeys, false );
	}

	const suggestionsList = useMemo( () => {
		let newSuggestionsList = [];
		if ( input && suggestFieldData?.length ) {
			if ( showInputAsSuggestion ) {
				newSuggestionsList = [ ...suggestedDomains ];
			}
			newSuggestionsList = [ ...newSuggestionsList, ...suggestFieldData ];
		}
		return newSuggestionsList;
	}, [ suggestFieldData, input, showInputAsSuggestion, suggestedDomains ] );

	// Saving all variables into state managers
	useEffect( () => {
		useTablePanels.setState( () => (
			{
				suggestFieldData: data,
			}
		) );
	}, [ data ] );

	useEffect( () => {
		descriptionHeight.current = description && ref.current.querySelector( '.urlslab-inputField-description' ).getBoundingClientRect().height;

		const handleClickOutside = ( event ) => {
			if ( ! ref.current?.contains( event.target ) && suggestionsVisible ) {
				showSuggestions( false );
			}
		};

		document.addEventListener( 'click', handleClickOutside, true );
	}, [ description, suggestionsVisible ] );

	return (
		<div className="urlslab-suggestInput pos-relative" key={ suggestInput } ref={ ref } style={ { zIndex: suggestionsVisible ? '10' : '0' } }>
			<InputField { ...props } key={ suggestion } defaultValue={ suggestion } isLoading={ isLoading } onChange={ ( event ) => handleTyping( event, 'onchange' ) } onKeyDown={ ( event ) => {
				if ( event.key === 'Enter' ) {
					handleEnter( event );
				}
			} } onKeyUp={ ( event ) => handleTyping( event, 'keyup' ) } onFocus={ () => {
				setIndex( ); showSuggestions( true );
			} }
			required={ required } />
			{
				suggestionsVisible && suggestionsList?.length > 0 &&
				<div className="urlslab-suggestInput-suggestions pos-absolute fadeInto" style={ descriptionHeight.current && { top: `calc(100% - ${ descriptionHeight.current + 3 }px)` } }>
					<strong className="fs-s">{ __( 'Suggested' ) }:</strong>
					<ul className="urlslab-suggestInput-suggestions-inn fs-s">
						{
							suggestionsList.map( ( suggest, id ) => {
								return suggest && <li key={ suggest } className={ id === index ? 'active' : '' } ><button onClick={ () => {
									handleTyping( suggest, 'onchange' );
									setSuggestion( convertComplexSuggestion ? convertComplexSuggestion( suggest ) : suggest );
									showSuggestions( false );
									if ( onSelect ) {
										onSelect( suggest );
										setPanelOverflow( false );
									}
								} }
								>{ convertComplexSuggestion ? convertComplexSuggestion( suggest ) : suggest }</button></li>;
							} )
						}
					</ul>
				</div>
			}
		</div>
	);
}
