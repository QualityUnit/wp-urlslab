/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useMemo, useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ReactTags } from 'react-tag-autocomplete';
import '../assets/styles/elements/_TagsMenu.scss';

import Tag from './Tag';

export default function TagsMenu( { tags, slug } ) {
	const queryClient = useQueryClient();
	const [ tagsMenuActive, setTagsMenu ] = useState( false );
	const assignedTagsArray = tags?.replace( /^\|(.+)\|$/, '$1' ).split( '|' );
	const tagsData = queryClient.getQueryData( [ 'tags' ] );
	const [ selected, setSelected ] = useState( [] );

	// Getting only tags/labels that have empty modules array or allowed slug
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

	const onAdd = useCallback(
		( newTag ) => {
			setSelected( ( selectedTags ) => [ ...selectedTags, newTag ] );
		},
		[]
	);

	const onDelete = useCallback(
		( tag ) => {
			setSelected( selected.filter( ( selectedTag ) => selectedTag.label_id !== tag.label_id ) );
		},
		[ selected ]
	);
	function CustomTag( { classNames, tag, ...tagProps } ) {
		const { label_id, className, bgcolor, label } = tag;
		return <Tag className={ `${ classNames.tag } ${ className }` } { ...tagProps } onClick={ () => onDelete( tag ) } style={ { backgroundColor: bgcolor } }>{ label }</Tag>;
	}

	function CustomOption( { children, classNames, option, ...optionProps } ) {
		const classes = [
			classNames.option,
			option.active ? 'is-active' : '',
			option.selected ? 'is-selected' : '',
		];

		return (
			<Tag className={ classes.join( ' ' ) } style={ { backgroundColor: option.bgcolor } } { ...optionProps }>
				{ children }
			</Tag>
		);
	}

	return (
		<div className="pos-relative urlslab-tagsmenu-wrapper">
			<div className="urlslab-tagsmenu-tags flex flex-align-center" onClick={ () => setTagsMenu( ! tagsMenuActive ) }>
				{ assignedTags.map( ( tag ) => {
					const { label_id, bgcolor, class: className, name } = tag;
					return <Tag type="circle" className={ `${ className || '' }` } style={ { backgroundColor: bgcolor } } key={ label_id }>{ name.charAt( 0 ) }</Tag>;
				} ) }
			</div>
			{ tagsMenuActive &&
				<div className="pos-absolute urlslab-tagsmenu">
					<ReactTags
					// activateFirstOption={ true }
						selected={ selected }
						allowNew
						placeholderText="Search…"
						// suggestionsFilter={ () => {} }
						suggestions={ availableTags }
						onDelete={ onDelete }
						onAdd={ onAdd }
						renderTag={ CustomTag }
						// renderOption={ CustomOption }
					/>

				</div>
			}
		</div>
	);

	// createdTags.map((tag) => {
	//   return <li key={label_id}><Tag style={{ backgroundColor: bgcolor }}>{name}</Tag></li>;
	// })
}
