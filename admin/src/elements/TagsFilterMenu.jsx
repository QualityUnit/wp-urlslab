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
	const [ checked, setChecked ] = useState( defaultValue );
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
			onChange( checked );
		}
		didMountRef.current = true;
		document.addEventListener( 'click', handleClickOutside, true );
	}, [ isActive ] );

	const checkedCheckbox = ( targetId ) => {
		setChecked( targetId );
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
						if ( tag.label_id === checked ) {
							const { label_id, name, bgcolor, className: tagClass } = tag;
							return <Tag key={ label_id } fullSize className={ tagClass } style={ { width: 'min-content', backgroundColor: bgcolor } }>
								{ name }
							</Tag>;
						}
						return null;
					} )
					}
				</div>
				<div className={ `urlslab-MultiSelectMenu__items ${ isActive ? 'active' : '' } ${ isVisible ? 'visible' : '' }` }>
					<div className={ `urlslab-MultiSelectMenu__items--inn ${ tagsData.length > 8 ? 'has-scrollbar' : '' }` }>
						{ tagsData.map( ( { label_id: id, name, bgcolor, className: tagClass } ) => {
							return (
								<Checkbox
									hasComponent
									key={ id }
									className="urlslab-MultiSelectMenu__item"
									id={ id }
									onChange={ () => checkedCheckbox( id ) }
									name="tags_filter"
									defaultValue={ id === checked }
									radial
								>
									<Tag fullSize className={ `ml-s ${ tagClass }` } style={ { backgroundColor: bgcolor } }>
										{ name }
									</Tag>
								</Checkbox>
							);
						} ) }
					</div>
				</div>
			</div>
			{ description && <p className="urlslab-inputField-description">{ description }</p> }
		</>
	);
}
