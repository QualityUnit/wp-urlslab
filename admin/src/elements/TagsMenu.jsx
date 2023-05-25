/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useMemo, useCallback, useState, useRef } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { ReactTags } from 'react-tag-autocomplete';
import { useI18n } from '@wordpress/react-i18n/';

import useClickOutside from '../hooks/useClickOutside';
import { postFetch } from '../api/fetching';
import hexToHSL from '../lib/hexToHSL';

import Tag from './Tag';
import '../assets/styles/elements/_TagsMenu.scss';
import Tooltip from './Tooltip';
import IconButton from './IconButton';

export default function TagsMenu( { label, description, defaultValue: tags, slug, hasActivator, onChange } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const tagsMenuWrap = useRef();
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
		cacheTime: Infinity,
		staleTime: Infinity,
	} );

	const [ selected, setSelected ] = useState( () => {
		let tagsArray = [];
		if ( assignedTagsArray?.length && assignedTagsArray[ 0 ] ) {
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

	useClickOutside( tagsMenuWrap, close );

	const openTagsMenu = useCallback( () => {
		setTagsMenu( true );
		tagsMenu.current.listBox.expand();
	}, [] );

	const onAdd = useCallback(

		async ( newTag ) => {
			if ( newTag.label_id ) {
				setSelected( ( selectedTags ) => [ ...selectedTags, newTag ] );
				return false;
			}

			const newTagToInsert = { name: newTag.label, bgcolor: '#EDEFF3' };
			setSelected( ( selectedTags ) => [ ...selectedTags, { ...newTagToInsert, value: newTag.label, label: newTagToInsert.name } ] );
			const response = await postFetch( `label/create`, newTagToInsert );
			const { ok } = await response;
			if ( ok ) {
				let returnedTag = await response.json();
				returnedTag = { value: returnedTag.label_id, label: returnedTag.name, ...returnedTag };
				queryClient.invalidateQueries( [ 'label' ], { refetchType: 'all' } );
				onChange( `${ selectedToString }${ returnedTag.label_id }|` );
			}
		}, [ onChange, selectedToString, queryClient ] );

	const onDelete = useCallback(
		( tag ) => {
			setSelected( selected.filter( ( selectedTag ) => selectedTag.label_id !== tag.label_id ) );
		},
		[ selected ]
	);

	function CustomInput( { classNames, inputWidth, ...inputProps } ) {
		return (
			<>
				<input className={ classNames.input } style={ { width: inputWidth } } { ...inputProps } />
				{ selected?.length === 5 &&
				<div className="fs-s c-saturated-red bg-desaturated-red p-m">{ __( '5 tags is max limit' ) }</div>
				}
			</>
		);
	}

	function CustomTag( { classNames, tag, ...tagProps } ) {
		const { label_id, className, bgcolor } = tag;
		return <Tag fullSize={ hasActivator || tagsMenuActive } shape={ ! hasActivator && ! tagsMenuActive && 'circle' } onDelete={ tagsMenuActive ? () => onDelete( tag ) : false } key={ label_id } className={ `${ classNames.tag } ${ className }` } { ...tagProps } style={ { backgroundColor: bgcolor, cursor: tagsMenuActive ? 'default' : 'pointer' } }>
			{ hasActivator || tagsMenuActive ? tag.label : tag.label.charAt( 0 ) }
		</Tag>;
	}

	function CustomOption( { children, classNames, option, ...optionProps } ) {
		const classes = [
			classNames.option,
			option.active ? 'is-active' : '',
			option.selected ? 'is-selected' : '',
			option.className ? option.className : '',
		];

		if ( selected?.length === 5 ) {
			optionProps[ 'aria-disabled' ] = true;
			delete optionProps.onClick;
			delete optionProps.onMouseDown;
		}

		return (
			<Tag fullSize className={ classes.join( ' ' ) } style={ { backgroundColor: option.bgcolor } } props={ optionProps }>
				{ children }
			</Tag>
		);
	}

	return (
		<div className={ `urlslab-TagsMenu-wrapper pos-relative ${ tagsMenuActive ? 'active' : '' }` }>
			{ label && <div className="urlslab-TagsMenu-label">{ label }</div> }
			<div onClick={ ! hasActivator && openTagsMenu } className={ `urlslab-TagsMenu ${ ! hasActivator ? 'noActivator' : '' } ${ tagsMenuActive ? 'active' : '' }` } ref={ tagsMenuWrap }>
				{ ! hasActivator && ! tagsMenuActive === true && <Tooltip className="showOnHover">{ __( 'Click to Add/remove tags' ) }</Tooltip> }
				<ReactTags
					ref={ tagsMenu }
					activateFirstOption={ true }
					selected={ selected }
					allowNew
					placeholderText="Search…"
					suggestions={ availableTags }
					onDelete={ onDelete }
					onAdd={ onAdd }
					renderInput={ CustomInput }
					renderTag={ CustomTag }
					renderOption={ CustomOption }
				/>
				{
					hasActivator &&
					<IconButton onClick={ openTagsMenu }
						className="urlslab-TagsMenu-activator"
						tooltip="Add new tag"
						tooltipStyle={ { width: '10em' } }
					>
						+
					</IconButton>
				}
			</div>

			{ description && <p className="urlslab-TagsMenu-description">{ description }</p> }
		</div>

	);
}
