import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n/';

import { postFetch } from '../api/fetching';
import { delay } from '../lib/helpers';
import InputField from './InputField';
import '../assets/styles/elements/_SuggestedInputField.scss';

export default function SuggestInputField( props ) {
	const { defaultValue, suggestInput, maxItems, description, onChange } = props;
	const { __ } = useI18n();
	const disabledKeys = { 38: 1, 40: 1 };
	const ref = useRef();
	const inputRef = useRef();
	const [ index, setIndex ] = useState( );
	const [ input, setInput ] = useState( replaceChars( suggestInput ) );
	const [ suggestion, setSuggestion ] = useState( defaultValue );
	const [ suggestionsList, setSuggestionsList ] = useState( [] );
	const [ suggestionsVisible, showSuggestions ] = useState( );
	const descriptionHeight = useRef();
	let suggestionsPanel;
	const activeDomain = suggestInput.includes( 'http' ) ? suggestInput : '';
	let baseDomain = activeDomain?.replace( /(https?:\/\/)?([^\.]+?\.)?([^\/]+?\..+?)\/.+$/, '$3' );
	if ( input?.includes( 'http' ) ) {
		baseDomain = input?.replace( /(https?:\/\/)?(www\.)?(.+?)$/, '$3' );
	}
	baseDomain = baseDomain?.replace( '.local', '.com' );

	const suggestedDomains = useMemo( () => {
		if ( activeDomain ) {
			return [
				activeDomain?.replace( /(https?:\/\/)([^\.]+?\.)?([^\/]+?\...+?\/).+$/, `$1${ ! activeDomain.includes( '.local' ) ? 'www.' : '' }$3` ),
				activeDomain?.replace( /(https?:\/\/).+/, `$1${ baseDomain }` ),
			];
		}
		return [];
	}, [ activeDomain, baseDomain ] );

	const handleTyping = ( val, type ) => {
		inputRef.current = val;

		if ( type !== 'keyup' ) {
			onChange( val );
		}

		//on keyup, start the countdown
		if ( type === 'keyup' && ! disabledKeys[ val.keyCode ] ) {
			const value = val.target.value;

			delay( () => {
				if ( value === inputRef.current ) {
					setInput( value );
				}
			}, 2000 )();
			return false;
		}

		// arrow up/down button should select next/previous list element
		const scrollTo = () => {
			suggestionsPanel.scrollTop = suggestionsPanel.querySelectorAll( 'li' )[ index ].offsetTop - suggestionsPanel.offsetTop;
		};
		if ( val.keyCode === 38 && index > 0 ) {
			setIndex( ( i ) => i - 1 );
			scrollTo();
		}
		if ( val.keyCode === 40 && ! index ) {
			setIndex( 0 );
		}
		if ( val.keyCode === 40 && index < suggestionsList.length - 1 ) {
			setIndex( ( i ) => i + 1 );
			scrollTo();
		}
	};

	const handleEnter = ( ) => {
		showSuggestions( false );
		if ( index >= 0 && suggestionsList.length ) {
			setSuggestion( suggestionsList[ index ] );
			onChange( suggestionsList[ index ] );
		}
	};

	const { data, isLoading } = useQuery( {
		queryKey: [ input ],
		queryFn: async () => {
			if ( input ) {
				const result = await postFetch( 'keyword/suggest', {
					count: maxItems || 10, keyword: ! suggestInput?.includes( 'http' ) ? suggestInput : replaceChars( input ), domain: baseDomain } );
				if ( result.ok ) {
					return result.json();
				}
				return [];
			}
		},
		refetchOnWindowFocus: false,
	} );

	function replaceChars( inputVal ) {
		const valToReplace = inputVal.replace( /^(https?:\/\/)[^\/]+?\//, '' );
		return valToReplace.replaceAll( /[\/\|\-_\*\+:\!,;&\?=\%]/g, ' ' );
	}

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

		window.addEventListener( 'keydown', preventDefaultForScrollKeys, false );
	}

	useEffect( () => {
		descriptionHeight.current = description && ref.current.querySelector( '.urlslab-inputField-description' ).getBoundingClientRect().height;
		setSuggestionsList( () => {
			if ( data?.length ) {
				return [ ...suggestedDomains, ...data ];
			}
			return [ ...suggestedDomains ];
		} );

		// setSuggestion( suggestionsList[ index ] );
		const handleClickOutside = ( event ) => {
			if ( ! ref.current?.contains( event.target ) && suggestionsVisible ) {
				showSuggestions( false );
			}
		};

		document.addEventListener( 'click', handleClickOutside, true );
	}, [ data, index, suggestionsList, suggestedDomains, suggestionsVisible ] );

	return (
		<div className="urlslab-suggestInput pos-relative" key={ suggestInput } ref={ ref } style={ { zIndex: suggestionsVisible ? '10' : '0' } }>
			<InputField { ...props } key={ suggestion } defaultValue={ suggestion } isLoading={ isLoading } onChange={ ( event ) => handleTyping( event ) } onKeyDown={ ( event ) => {
				if ( event.key === 'Enter' ) {
					handleEnter( event );
				}
			} } onKeyUp={ ( event ) => handleTyping( event, 'keyup' ) } onFocus={ () => {
				setIndex( ); showSuggestions( true );
			} } />
			{
				suggestionsVisible && suggestionsList?.length > 0 &&
				<div className="urlslab-suggestInput-suggestions pos-absolute fadeInto" style={ descriptionHeight.current && { top: `calc(100% - ${ descriptionHeight.current + 3 }px)` } }>
					<strong className="fs-s">{ __( 'Suggested' ) }:</strong>
					<ul className="urlslab-suggestInput-suggestions-inn fs-s">
						{
							suggestionsList.map( ( suggest, id ) => {
								return suggest && <li key={ suggest } className={ id === index ? 'active' : '' } ><button onClick={ () => {
									handleTyping( suggest ); setSuggestion( suggest ); showSuggestions( false );
								} }
								>{ suggest }</button></li>;
							} )
						}
					</ul>
				</div>
			}
		</div>
	);
}
