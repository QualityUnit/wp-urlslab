/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Tags from '@yaireo/tagify/dist/react.tagify';
import '@yaireo/tagify/src/tagify.scss';

// import Tag from './Tag';

export default function TagsMenu( { tags, slug } ) {
	const queryClient = useQueryClient();
	const [ tagsMenuActive, setTagsMenu ] = useState( false );
	const assignedTagsArray = tags.replace( /^\|(.+)\|$/, '$1' ).split( '|' );
	const tagsData = queryClient.getQueryData( [ 'tags' ] );

	// Getting only tags/labels that have empty modules array or assigned slug
	const availableTags = useMemo( () => {
		return tagsData.filter( ( tag ) => tag.modules.indexOf( slug ) !== -1 || tag.modules.length || ( tag.modules.length === 1 && tag.modules[ 0 ] === '' ) );
	}, [ tagsData, slug ] );

	const assignedTags = useMemo( () => {
		return tagsData.filter( ( tag ) => assignedTagsArray.some( ( d ) => Number( d ) === tag.label_id ) );
	}, [ assignedTagsArray, tagsData ] );

	// const { label_id, bgcolor, name, modules } = tag;

	return (
		<div className="pos-relative">
			<div className="tags" onClick={ () => setTagsMenu( ! tagsMenuActive ) }>
				{ assignedTags.map( ( tagObj ) => {
					return <span key={ tagObj.label_id }>{ tagObj.name.charAt( 0 ) }</span>;
				} ) }
			</div>
			{ tagsMenuActive &&
			<div className="pos-absolute">
				<Tags
					showFilteredDropdown={ true }
					settings={ {
						whitelist: availableTags,
						dropdown: {
							enabled: 0, // a;ways show suggestions dropdown
							searchKeys: [ 'name' ],
							mapValueTo: 'name',
							maxItems: Infinity,
							highlightFirst: true,
						},
						transformTag: ( tagData ) => {
							tagData.style = '--tag-bg:' + tagData.bgcolor;
						},
						tagTextProp: 'name',
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
