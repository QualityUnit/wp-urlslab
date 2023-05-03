/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useMemo, useCallback, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ReactTags } from 'react-tag-autocomplete';

import useClickOutside from '../hooks/useClickOutside';
import { postFetch } from '../api/fetching';
import hexToHSL from '../lib/hexToHSL';

import Tag from './Tag';
import '../assets/styles/elements/_TagsMenu.scss';

export default function TagsMenu( { tags, slug, onChange } ) {
	const tagsMenu = useRef();
	const [ tagsMenuActive, setTagsMenu ] = useState( false );
	const assignedTagsArray = tags?.replace( /^\|(.+)\|$/, '$1' ).split( '|' );
	const [ selected, setSelected ] = useState( [] );
	const selectedToString = useMemo( () => {
		const selectedIds = [];
		selected.map( ( tag ) => selectedIds.push( tag.label_id ) );
		return selectedIds.join( '|' ).replace( /^(.+)$/, '|$1|' );
	}, [ selected ] );

	const close = useCallback( () => {
		setTagsMenu( false );
		if ( onChange && selectedToString !== tags ) {
			onChange( selectedToString );
		}
	}, [ onChange, selectedToString, tags ] );
	useClickOutside( tagsMenu, close );

	const { data: tagsData } = useQuery( {
		queryKey: [ 'label', 'menu' ],
		queryFn: async () => {
			const tagsFetch = await postFetch( 'label', { rows_per_page: 50 } );
			const tagsArray = await tagsFetch.json();
			tagsArray?.map( ( tag ) => {
				const { lightness } = hexToHSL( tag.bgcolor );
				if ( lightness < 70 ) {
					return tag.className = 'dark';
				}
				return tag;
			} );
			return tagsArray;
		},
		refetchOnWindowFocus: false,
	} );

	// Getting only tags/labels that have empty modules array or allowed slug
	const availableTags = useMemo( () => {
		return tagsData?.filter( ( tag ) => tag.modules.indexOf( slug ) !== -1 || tag.modules.length || ( tag.modules.length === 1 && tag.modules[ 0 ] === '' ) );
	}, [ tagsData, slug ] );

	const assignedTags = useMemo( () => {
		let tagsArray = [];
		assignedTagsArray.map( ( id ) => tagsData?.map( ( tag ) => {
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
		return <Tag fullSize onDelete={ () => onDelete( tag ) } key={ label_id } className={ `${ classNames.tag } ${ className }` } { ...tagProps } style={ { backgroundColor: bgcolor } }>
			{ label }
		</Tag>;
	}

	function CustomOption( { children, classNames, option, ...optionProps } ) {
		const classes = [
			classNames.option,
			option.active ? 'is-active' : '',
			option.selected ? 'is-selected' : '',
			option.className ? option.className : '',
		];

		return (
			<Tag fullSize className={ classes.join( ' ' ) } style={ { backgroundColor: option.bgcolor } } props={ optionProps }>
				{ children }
			</Tag>
		);
	}

	return (
		<div className="pos-relative urlslab-tagsmenu-wrapper">
			<div className="urlslab-tagsmenu-tags flex flex-align-center" onClick={ () => setTagsMenu( ! tagsMenuActive ) }>
				{ assignedTags.map( ( tag ) => {
					const { label_id, bgcolor, className, name } = tag;
					return <Tag shape="circle" className={ `${ className || '' }` } style={ { backgroundColor: bgcolor } } key={ label_id }>{ name.charAt( 0 ) }</Tag>;
				} ) }
			</div>
			{ tagsMenuActive &&
				<div className="pos-absolute urlslab-tagsmenu" ref={ tagsMenu }>
					<ReactTags
						activateFirstOption={ true }
						selected={ selected }
						allowNew
						placeholderText="Search…"
						suggestions={ availableTags }
						onDelete={ onDelete }
						onAdd={ onAdd }
						renderTag={ CustomTag }
						renderOption={ CustomOption }
					/>
				</div>
			}
		</div>
	);

	// createdTags.map((tag) => {
	//   return <li key={label_id}><Tag style={{ backgroundColor: bgcolor }}>{name}</Tag></li>;
	// })
}
