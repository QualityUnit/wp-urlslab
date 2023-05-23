import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n/';

import { postFetch } from '../api/fetching';
import { delay } from '../lib/helpers';
import InputField from './InputField';
import '../assets/styles/elements/_SuggestedInputField.scss';

export default function SuggestInputField( props ) {
	const { suggestInput, maxItems, domain, onChange } = props;
	const { __ } = useI18n();
	const disabledKeys = { 37: 1, 38: 1, 39: 1, 40: 1 };
	const ref = useRef();
	const didMountRef = useRef( false );
	const [ index, setIndex ] = useState( 0 );
	const [ input, setInput ] = useState( suggestInput.includes( 'http' ) ? replaceChars( suggestInput ) : '' );
	const [ suggestion, setSuggestion ] = useState( );
	const [ suggestionsList, setSuggestionsList ] = useState( [] );
	const [ suggestionsVisible, showSuggestions ] = useState( );
	const activeDomain = suggestInput.includes( 'http' ) ? suggestInput : '';
	let baseDomain = activeDomain.replace( /(https?:\/\/)?([^\.]+?\.)?([^\/]+?\..+?)\/.+$/, '$3' );
	if ( input?.includes( 'http' ) ) {
		baseDomain = input?.replace( /(https?:\/\/)?(www\.)?(.+?)$/, '$3' );
	}
	baseDomain = baseDomain.replace( '.local', '.com' );

	const suggestedDomains = useMemo( () => [
		activeDomain.replace( /(https?:\/\/)([^\.]+?\.)?([^\/]+?\...+?\/).+$/, `$1${ ! activeDomain.includes( '.local' ) ? 'www.' : '' }$3` ),
		activeDomain.replace( /(https?:\/\/).+/, `$1${ baseDomain }` ),
	], [ activeDomain, baseDomain ] );

	const handleTyping = ( val, type ) => {
		// const value = val.target.value || val;

		if ( type ) {
			delay( () => {
				if ( val !== input ) {
					setInput( val );
				}
			}, 1000 )();
			return false;
		}
		setSuggestion( val );
		onChange( val );

		// arrow up/down button should select next/previous list element
		// if ( val.keyCode === 38 && index > 0 ) {
		// 	setIndex( ( i ) => i - 1 );
		// 	// setSuggestion( suggestionsList[ index ] );
		// 	// onChange( suggestionsList[ index ] );
		// 	return false;
		// } else if ( val.keyCode === 40 && index < suggestionsList.length - 1 ) {
		// 	setIndex( ( i ) => i + 1 );
		// 	// setSuggestion( suggestionsList[ index ] );
		// 	// onChange( suggestionsList[ index ] );
		// 	return false;
		// }

		// if ( val.key === 'Enter' ) {

		// }
	};

	const { data, isLoading } = useQuery( {
		queryKey: [ input ],
		queryFn: async () => {
			if ( input ) {
				const result = await postFetch( 'keyword/suggest', {
					count: maxItems || 10, keyword: ! suggestInput.includes( 'http' ) ? replaceChars( suggestInput ) : replaceChars( input ), domain: baseDomain } );
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

		window.addEventListener( 'keydown', preventDefaultForScrollKeys, false );
	}

	useEffect( () => {
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

		if ( onChange && didMountRef.current && ! suggestionsVisible ) {
			onChange( suggestion );
		}
		didMountRef.current = true;
		document.addEventListener( 'click', handleClickOutside, true );
	}, [ data, suggestion, suggestionsVisible ] );

	return (
		<div className="urlslab-suggestInput pos-relative" key={ suggestInput } ref={ ref }>
			<InputField { ...props } key={ suggestion ? suggestion : suggestionsList[ 0 ] } defaultValue={ suggestion ? suggestion : suggestionsList[ 0 ] } isLoading={ isLoading } onChange={ ( event ) => handleTyping( event, true ) } onFocus={ () => {
				setIndex( 0 ); showSuggestions( true );
			} } />
			{
				suggestionsVisible &&
				<div className="urlslab-suggestInput-suggestions pos-absolute fadeInto" >
					<strong className="fs-s">{ __( 'Suggested' ) }:</strong>
					<ul className="urlslab-suggestInput-suggestions-inn fs-s">
						{
							suggestionsList && suggestionsList.length > 0 &&
							suggestionsList.map( ( suggest ) => {
								return suggest && <li key={ suggest }><button onClick={ () => {
									setSuggestion( suggest ); showSuggestions( false );
								} }>{ suggest }</button></li>;
							} )
						}
					</ul>
				</div>
			}
		</div>
	);
}
