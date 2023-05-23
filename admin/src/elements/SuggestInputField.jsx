import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n/';

import { postFetch } from '../api/fetching';
import InputField from './InputField';
import '../assets/styles/elements/_SuggestedInputField.scss';

export default function SuggestInputField( props ) {
	const { suggestInput, maxItems, domain, onChange } = props;
	const { __ } = useI18n();
	const ref = useRef();
	const didMountRef = useRef( false );
	const [ input, setInput ] = useState( replaceChars( suggestInput ) );
	const [ suggestion, setSuggestion ] = useState( );
	const [ suggestionsList, setSuggestionsList ] = useState( [] );
	const [ suggestionsVisible, showSuggestions ] = useState( );
	const activeDomain = window.location.origin;
	let baseDomain = activeDomain.replace( /(https?:\/\/)?([^\.]+?\.)?([^\.]+?\..+?)$/, '$3' );

	if ( baseDomain.includes( '.local' ) ) {
		baseDomain = baseDomain.replace( '.local', '.com' );
	}

	const suggestedDomains = [
		activeDomain.replace( /(https?:\/\/)([^\.]+?\.)?([^\.]+?\..+?)$/, '$1www.$3' ),
		activeDomain.replace( /(https?:\/\/).+/, `$1${ baseDomain }` ),
	];

	const handleTyping = ( val ) => {
		// if ( ! suggestedDomains.includes( val ) || ! input.includes( val ) ) {
		// 	setTimeout( () => {
		// 		setInput( replaceChars( val ) );
		// 	}, 800 );
		// 	return false;
		// }
		setSuggestion( val );
		onChange( val );
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
		return valToReplace.replaceAll( /[\/\|,;&\?=\%]/g, ' ' );
	}

	console.log( suggestion );

	useEffect( () => {
		setSuggestionsList( data );
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
			<InputField { ...props } key={ suggestion } defaultValue={ suggestion } isLoading={ isLoading } onChange={ ( val ) => handleTyping( val ) } onFocus={ () => showSuggestions( true ) } />
			{
				suggestionsVisible &&
				<div className="urlslab-suggestInput-suggestions pos-absolute fadeInto">
					<strong className="fs-s">{ __( 'Suggested' ) }:</strong>
					<ul className="urlslab-suggestInput-suggestions-inn fs-s">
						{
							suggestedDomains.length > 0 &&
							suggestedDomains.map( ( sugDomain ) => {
								return <li key={ sugDomain } ><button onClick={ () => {
									handleTyping( sugDomain ); showSuggestions( false );
								} }>{ sugDomain }</button></li>;
							} )
						}
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
