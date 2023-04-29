/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
// import Tagify from '@yaireo/tagify';
import Tags from '@yaireo/tagify/dist/react.tagify';
import '@yaireo/tagify/src/tagify.scss';

import '../assets/styles/elements/_TagsMenu.scss';

import Tag from './Tag';

export default function TagsMenu( { tags, slug } ) {
	const queryClient = useQueryClient();
	const tagifyRef = useRef();
	const [ tagsMenuActive, setTagsMenu ] = useState( false );
	const assignedTagsArray = tags.replace( /^\|(.+)\|$/, '$1' ).split( '|' );
	const tagsData = queryClient.getQueryData( [ 'tags' ] );

	// Getting only tags/labels that have empty modules array or assigned slug
	const availableTags = useMemo( () => {
		return tagsData.filter( ( tag ) => tag.modules.indexOf( slug ) !== -1 || tag.modules.length || ( tag.modules.length === 1 && tag.modules[ 0 ] === '' ) );
	}, [ tagsData, slug ] );

	const assignedTags = useMemo( () => {
		let tagsArray = [];
		assignedTagsArray.map( ( id ) => tagsData.map( ( tag ) => {
			if ( tag.label_id === Number( id ) ) {
				tagsArray = [ ...tagsArray, tag ];
			}
			return false;
		} ) );
		return tagsArray;
	}, [ assignedTagsArray, tagsData ] );

	function suggestionItemTemplate( tagData ) {
		return (
			`<div ${ this.getAttributes( tagData ) }
				title="${ tagData.value }"
				style="background-color: ${ tagData.bgcolor }"
				class="tagify__dropdown__item ${ this.settings.classNames.dropdownItem }"
				tabIndex="0"
				role="option">
				<strong>${ tagData.name }</strong>
			</div>`
		);
	}

	return (
		<div className="pos-relative urlslab-tagsmenu-wrapper">
			<div className="urlslab-tagsmenu-tags flex flex-align-center" onClick={ () => setTagsMenu( ! tagsMenuActive ) }>
				{ assignedTags.map( ( tag ) => {
					const { label_id, bgcolor, name } = tag;
					return <Tag type="circle" style={ { backgroundColor: bgcolor } } key={ label_id }>{ name.charAt( 0 ) }</Tag>;
				} ) }
			</div>
			{ tagsMenuActive &&
			<div className="pos-absolute">
				<Tags
					className="urlslab-tagsmenu"
					tagifyRef={ tagifyRef }
					onChange={ ( e ) => console.log( e ) }
					onAdd={ ( e ) => console.log( 'pridanie', e ) }
					showFilteredDropdown={ true }
					settings={ {
						whitelist: availableTags,
						dropdown: {
							enabled: 0,
							searchKeys: [ 'name' ],
							mapValueTo: 'name',
							maxItems: Infinity,
							closeOnSelect: false,
							highlightFirst: true,
						},
						transformTag: ( tagData ) => {
							tagData.style = '--tag-bg:' + tagData.bgcolor;
						},
						tagTextProp: 'name',
						placeholder: 'Search…',
						templates: {
							dropdownItem: suggestionItemTemplate,
						},
					} }
					defaultValue={ assignedTags }
				/>
			</div>
			}
		</div>
	);

	// createdTags.map((tag) => {
	//   return <li key={label_id}><Tag style={{ backgroundColor: bgcolor }}>{name}</Tag></li>;
	// })
}
