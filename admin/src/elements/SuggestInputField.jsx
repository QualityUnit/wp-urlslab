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
	const [ input, setInput ] = useState( replaceChars( suggestInput ) );
	const [ suggestion, setSuggestion ] = useState( );
	const [ suggestionsList, setSuggestionsList ] = useState( [] );
	const [ suggestionsVisible, showSuggestions ] = useState( );
	const activeDomain = suggestInput;
	let baseDomain = activeDomain.replace( /(https?:\/\/)?([^\.]+?\.)?([^\/]+?\..+?)\/.+$/, '$3' );

	if ( baseDomain.includes( '.local' ) ) {
		baseDomain = baseDomain.replace( '.local', '.com' );
	}

	const suggestedDomains = useMemo( () => [
		activeDomain.replace( /(https?:\/\/)([^\.]+?\.)?([^\/]+?\...+?\/).+$/, `$1${ ! activeDomain.includes( '.local' ) ? 'www.' : '' }$3` ),
		activeDomain.replace( /(https?:\/\/).+/, `$1${ baseDomain }` ),
	], [ activeDomain, baseDomain ] );

	const handleTyping = ( val, type ) => {
		// const value = val.target.value || val;
		if ( type ) {
			setInput( val );
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
				const result = await postFetch( 'keyword/suggest', { count: maxItems || 5, keyword: input, domain: domain || baseDomain } );
				return result.json();
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
		<div className="urlslab-suggestInput pos-relative" ref={ ref }>
			<InputField { ...props } key={ suggestion } defaultValue={ suggestion } isLoading={ isLoading } onChange={ ( event ) => delay( () => handleTyping( event, true ), 3000 )() } onFocus={ () => {
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
								return <li key={ suggest }><button onClick={ () => {
									handleTyping( suggest ); showSuggestions( false );
								} }>{ suggest }</button></li>;
							} )
						}
					</ul>
				</div>
			}
		</div>
	);
}
