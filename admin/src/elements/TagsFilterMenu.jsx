import { useEffect, useState, useRef } from 'react';
import useTags from '../hooks/useTags';
import Checkbox from './Checkbox';
import Tag from './Tag';

import '../assets/styles/elements/_MultiSelectMenu.scss';

export default function TagsFilterMenu( {
	className, style, description, defaultValue, disabled, onChange,
} ) {
	const [ isActive, setActive ] = useState( false );
	const [ isVisible, setVisible ] = useState( false );
	const [ checked, setChecked ] = useState( defaultValue?.toString().replace( /\|(\d+)\|/, '$1' ) ); // Clean from | to get ID
	const didMountRef = useRef( false );
	const ref = useRef( 'tags_filter' );
	const { tagsData } = useTags();

	useEffect( () => {
		const handleClickOutside = ( event ) => {
			if ( ! ref.current?.contains( event.target ) && isActive ) {
				setActive( false );
				setVisible( false );
			}
		};
		if ( onChange && didMountRef.current && ! isActive ) { // Accepts change back to default key
			onChange( checked?.replace( /(\d+)/g, '|$1|' ) ); // Wrapping sended value to |number| to not find also ie 12 in case 'contains id 2'
		}
		didMountRef.current = true;
		document.addEventListener( 'click', handleClickOutside, true );
	}, [ isActive ] );

	const checkedCheckbox = ( targetId ) => {
		setChecked( targetId.toString() );
		setActive( false );
		setVisible( false );
	};

	const handleMenu = () => {
		setActive( ! isActive );

		setTimeout( () => {
			setVisible( ! isVisible );
		}, 100 );
	};

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
							return <Tag key={ label_id } color={ bgcolor }>{ name }</Tag>;
						}
						return null;
					} )
					}
				</div>
				<div className={ `urlslab-MultiSelectMenu__items ${ isActive ? 'active' : '' } ${ isVisible ? 'visible' : '' }` }>
					<div className={ `urlslab-MultiSelectMenu__items--inn ${ tagsData.length > 8 ? 'has-scrollbar' : '' }` }>
						{ tagsData.map( ( { label_id: id, name, bgcolor } ) => {
							return (
								<Checkbox
									hasComponent
									key={ id }
									className="urlslab-MultiSelectMenu__item"
									id={ id }
									onChange={ () => checkedCheckbox( id ) }
									name="tags_filter"
									defaultValue={ id.toString() === checked }
									radial
								>
									<Tag color={ bgcolor } sx={ { ml: 1 } }>{ name }</Tag>
								</Checkbox>
							);
						} ) }
					</div>
				</div>
			</div>
			{ description && <p className="urlslab-inputField-description" dangerouslySetInnerHTML={ { __html: description.replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } /> }
		</>
	);
}
