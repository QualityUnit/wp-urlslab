import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';

import { delay } from '../lib/helpers';
import { postFetch } from '../api/fetching';
import useTablePanels from '../hooks/useTablePanels';
import InputField from './InputField';
import '../assets/styles/elements/_SuggestedInputField.scss';

const disabledKeys = { 38: 1, 40: 1 };

export default function SuggestInputField( props ) {
	const { __ } = useI18n();
	const { showInputAsSuggestion, label, convertComplexSuggestion, defaultValue, maxItems, description, referenceVal, fetchUrl, required, onChange, onSelect } = props;
	const ref = useRef();
	const inputRef = useRef();
	const [ index, setIndex ] = useState();
	const [ input, setInput ] = useState( inputRef.current );
	const [ suggestion, setSuggestion ] = useState( input ? input : defaultValue );
	const [ suggestionsVisible, showSuggestions ] = useState();
	const setPanelOverflow = useTablePanels( ( state ) => state.setPanelOverflow );
	const valFromRow = useTablePanels.getState().rowToEdit[ referenceVal ];
	const descriptionHeight = useRef();
	const suggestionsPanel = useRef();

	const suggestedDomains = useMemo( () => input ? [ input ] : [], [ input ] );

	const { data, isLoading } = useQuery( {
		queryKey: [ input ],
		queryFn: async () => {
			let result;
			if ( input ) {
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
			}
			if ( result?.ok ) {
				showSuggestions( true );
				return result.json();
			}
			return [];
		},
		refetchOnWindowFocus: false,
	} );

	const suggestionsList = useMemo( () => {
		let newSuggestionsList = [];
		if ( input && data?.length ) {
			if ( showInputAsSuggestion ) {
				newSuggestionsList = [ ...suggestedDomains ];
			}
			newSuggestionsList = [ ...newSuggestionsList, ...data ];
		}
		return newSuggestionsList;
	}, [ data, input, showInputAsSuggestion, suggestedDomains ] );

	const scrollTo = useCallback( () => {
		if ( index || index === 0 ) {
			suggestionsPanel.current.scrollTop = suggestionsPanel.current.querySelectorAll( 'li' )[ index ].offsetTop - suggestionsPanel.current.offsetTop;
		}
	}, [ index ] );

	const handleTyping = useCallback( ( val, type ) => {
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
	}
	// do not add onChange dependency until we're not sure that all passed onChange functions are memoized and reference stable
	// eslint-disable-next-line react-hooks/exhaustive-deps
	, [ index, scrollTo, suggestionsList.length ] );

	const handleEnter = useCallback( () => {
		showSuggestions( false );
		if ( index >= 0 && suggestionsList?.length ) {
			setSuggestion( suggestionsList[ index ] );
			onChange( suggestionsList[ index ] );
		}
	}
	// do not add onChange dependency until we're not sure that all passed onChange functions are memoized and reference stable
	// eslint-disable-next-line react-hooks/exhaustive-deps
	, [ index, suggestionsList ] );

	const preventDefaultForScrollKeys = useCallback( ( e ) => {
		if ( disabledKeys[ e.keyCode ] ) {
			e.preventDefault();
			return false;
		}
	}, [] );

	const handleClickOutside = useCallback( ( e ) => {
		if ( ! ref.current?.contains( e.target ) && suggestionsVisible ) {
			showSuggestions( false );
		}
	}, [ suggestionsVisible ] );

	useEffect( () => {
		descriptionHeight.current = description && ref.current.querySelector( '.urlslab-inputField-description' ).getBoundingClientRect().height;
		if ( suggestionsVisible ) {
			suggestionsPanel.current = ref.current.querySelector( '.urlslab-suggestInput-suggestions-inn' );
			setPanelOverflow( true );
			document.addEventListener( 'keydown', preventDefaultForScrollKeys, false );
			document.addEventListener( 'click', handleClickOutside, true );
		}
		return () => {
			if ( suggestionsVisible ) {
				document.removeEventListener( 'keydown', preventDefaultForScrollKeys );
				document.removeEventListener( 'click', handleClickOutside, true );
			}
		};
	}, [ description, suggestionsVisible, preventDefaultForScrollKeys, setPanelOverflow, handleClickOutside ] );

	return (
		<div className="urlslab-suggestInput pos-relative" ref={ ref } style={ { zIndex: suggestionsVisible ? '10' : '0' } }>
			<InputField label={ label } key={ suggestion } description={ description } defaultValue={ suggestion } isLoading={ isLoading } onChange={ ( event ) => handleTyping( event, 'onchange' ) } onKeyDown={ ( event ) => {
				if ( event.key === 'Enter' ) {
					handleEnter( event );
				}
			} } onKeyUp={ ( event ) => handleTyping( event, 'keyup' ) } onFocus={ ( event ) => {
				setInput( event.target.value );
				setIndex(); showSuggestions( true );
			} }
			required={ required } />

			{
				suggestionsVisible && suggestionsList?.length > 0 &&
				<div className="urlslab-suggestInput-suggestions pos-absolute fadeInto" style={ descriptionHeight.current && { top: `calc(100% - ${ descriptionHeight.current + 3 }px)` } }>
					<strong className="fs-s">{ __( 'Suggested', 'urlslab' ) }:</strong>
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
