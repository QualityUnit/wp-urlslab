/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useMemo, useCallback, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ReactTags } from 'react-tag-autocomplete';
import { useI18n } from '@wordpress/react-i18n/';

import useClickOutside from '../hooks/useClickOutside';
import { postFetch } from '../api/fetching';
import hexToHSL from '../lib/hexToHSL';

import Tag from './Tag';
import '../assets/styles/elements/_TagsMenu.scss';
import Tooltip from './Tooltip';

export default function TagsMenu( { tags, slug, onChange } ) {
	const { __ } = useI18n();
	const tagsMenu = useRef();
	const [ tagsMenuActive, setTagsMenu ] = useState( false );

	const assignedTagsArray = tags?.replace( /^\|(.+)\|$/, '$1' ).split( '|' );

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

	const [ selected, setSelected ] = useState( () => {
		let tagsArray = [];
		if ( assignedTagsArray.length && assignedTagsArray[ 0 ] ) {
			assignedTagsArray?.map( ( id ) => tagsData?.map( ( tag ) => {
				if ( tag.label_id === Number( id ) ) {
					tagsArray = [ ...tagsArray, tag ];
				}
				return false;
			} ) );
		}
		return tagsArray;
	} );

	// Getting only tags/labels that have empty modules array or allowed slug
	const availableTags = useMemo( () => {
		return tagsData?.filter( ( tag ) => tag.modules.indexOf( slug ) !== -1 || tag.modules.length || ( tag.modules.length === 1 && tag.modules[ 0 ] === '' ) );
	}, [ tagsData, slug ] );

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

	const onAdd = useCallback(
		async ( newTag ) => {
			if ( newTag.label_id ) {
				setSelected( ( selectedTags ) => [ ...selectedTags, newTag ] );
				return false;
			}

			const newTagToInsert = { name: newTag.label, bgcolor: '#EDEFF3' };
			const response = await postFetch( `label/create`, newTagToInsert );
			const { ok } = await response;
			if ( ok ) {
				let returnedTag = await response.json();
				returnedTag = { value: returnedTag.label_id, label: returnedTag.name, ...returnedTag };
				setSelected( ( selectedTags ) => [ ...selectedTags, returnedTag ] );
			}
			onChange( selectedToString );
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
		return <Tag fullSize={ tagsMenuActive } shape={ ! tagsMenuActive && 'circle' } onDelete={ () => tagsMenuActive && onDelete( tag ) } key={ label_id } className={ `${ classNames.tag } ${ className }` } { ...tagProps } style={ { backgroundColor: bgcolor, cursor: tagsMenuActive ? 'default' : 'pointer' } }>
			{ tagsMenuActive ? label : label.charAt( 0 ) }
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
		<div onClick={ () => setTagsMenu( true ) } className={ `urlslab-tagsmenu ${ tagsMenuActive === true && 'active' }` } ref={ tagsMenu }>
			{ ! tagsMenuActive === true && <Tooltip className="showOnHover">{ __( 'Click to Add/remove tags' ) }</Tooltip> }
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
	);
}
