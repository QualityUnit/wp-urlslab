import { useEffect, useState, useRef, useCallback } from 'react';
import useTags from '../hooks/useTags';
import Tag from './Tag';

import '../assets/styles/elements/_MultiSelectMenu.scss';

export default function TagsFilterMenu( { className, style, description, defaultValue, disabled, onChange } ) {
	const [ isActive, setActive ] = useState( false );
	const [ isVisible, setVisible ] = useState( false );
	const [ checked, setChecked ] = useState( defaultValue?.toString().replace( /\|(\d+)\|/, '$1' ) ); // Clean from | to get ID
	const didMountRef = useRef( false );
	const ref = useRef( 'tags_filter' );
	const { tagsData } = useTags();

	const handleClickOutside = useCallback( ( event ) => {
		if ( ! ref.current?.contains( event.target ) && isActive ) {
			setActive( false );
			setVisible( false );
		}
	}, [ isActive ] );

	useEffect( () => {
		if ( onChange && didMountRef.current && ! isActive ) { // Accepts change back to default key
			onChange( checked?.replace( /(\d+)/g, '|$1|' ) ); // Wrapping sended value to |number| to not find also ie 12 in case 'contains id 2'
		}
		didMountRef.current = true;
		if ( isActive && isVisible ) {
			document.addEventListener( 'click', handleClickOutside, true );
		}

		return () => {
			if ( isActive && isVisible ) {
				document.removeEventListener( 'click', handleClickOutside, true );
			}
		};
	}
	// do not add onChange dependency until we're not sure that all passed onChange functions are memoized and reference stable
	// eslint-disable-next-line react-hooks/exhaustive-deps
	, [ checked, isActive, isVisible, handleClickOutside ] );

	const checkedCheckbox = useCallback( ( targetId ) => {
		setChecked( targetId.toString() );
		setActive( false );
		setVisible( false );
	}, [] );

	const handleMenu = useCallback( () => {
		setActive( ! isActive );

		setTimeout( () => {
			setVisible( ! isVisible );
		}, 100 );
	}, [ isActive, isVisible ] );

	return (
		<>
			<div className={ `urlslab-MultiSelectMenu urlslab-SortMenu ${ disabled && 'disabled' } ${ className || '' } ${ isActive ? 'active' : '' }` } style={ style } ref={ ref }>
				<div
					className={ `urlslab-MultiSelectMenu__title ${ isActive ? 'active' : '' }` }
					onClick={ ! disabled && handleMenu }
					onKeyUp={ ( event ) => {
						if ( ! disabled ) {
							handleMenu( event );
						}
					} }
					role="button"
					tabIndex={ 0 }
				>
					{ tagsData.map( ( tag ) => {
						if ( tag.label_id.toString() === checked ) {
							const { label_id, name, bgcolor } = tag;
							return <Tag key={ label_id } color={ bgcolor } fitText thinFont>{ name }</Tag>;
						}
						return null;
					} )
					}
				</div>
				<div className={ `urlslab-MultiSelectMenu__items ${ isActive ? 'active' : '' } ${ isVisible ? 'visible' : '' }` }>
					<div className={ `urlslab-MultiSelectMenu__items--inn ${ tagsData.length > 8 ? 'has-scrollbar' : '' }` }>
						{ tagsData.map( ( { label_id: id, name, bgcolor } ) => {
							return (
								<button
									key={ id }
									id={ id }
									onClick={ () => checkedCheckbox( id ) }
								>
									<Tag color={ bgcolor } sx={ { ml: 1 } } fitText thinFont>{ name }</Tag>
								</button>
							);
						} ) }
					</div>
				</div>
			</div>
			{ description && <p className="urlslab-inputField-description" dangerouslySetInnerHTML={ { __html: description.replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } /> }
		</>
	);
}
