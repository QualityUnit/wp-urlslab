/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ReactTags } from 'react-tag-autocomplete';
import { useI18n } from '@wordpress/react-i18n/';

import useClickOutside from '../hooks/useClickOutside';
import useTablePanels from '../hooks/useTablePanels';
import useTags from '../hooks/useTags';
import { postFetch } from '../api/fetching';

import Tag from './Tag';
import '../assets/styles/elements/_TagsMenu.scss';
import Tooltip from './Tooltip';
import IconButton from './IconButton';
import { ReactComponent as AddTagIcon } from '../assets/images/icons/icon-addTag.svg';

export default function TagsMenu( { label, description, required, defaultValue: tags, slug, hasActivator, onChange } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const tagsMenuWrap = useRef();
	const tagsMenu = useRef();
	const [ tagsMenuActive, setTagsMenu ] = useState( false );
	const { tagsData } = useTags();
	const setPanelOverflow = useTablePanels( ( state ) => state.setPanelOverflow );

	const assignedTagsArray = tags?.replace( /^\|(.+)\|$/, '$1' ).split( '|' );

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
		return tagsData?.filter( ( tag ) => ( tag.modules.indexOf( slug ) !== -1 && tag.modules.length ) || ( tag.modules.length === 1 && ( tag.modules[ 0 ] === '' || tag.modules[ 0 ] === 'all' ) ) );
	}, [ tagsData, slug ] );

	const selectedToString = useMemo( () => {
		const selectedIds = [];
		selected.map( ( tag ) => selectedIds.push( tag.label_id ) );
		return selectedIds.join( '|' ).replace( /^(.+)$/, '|$1|' );
	}, [ selected ] );

	const close = useCallback( () => {
		setTagsMenu( false );
		if ( hasActivator ) {
			setPanelOverflow( false );
		}
		if ( onChange && selectedToString !== tags ) {
			onChange( selectedToString );
		}
	}, [ onChange, hasActivator, setPanelOverflow, selectedToString, tags ] );

	useClickOutside( tagsMenuWrap, close );

	useEffect( () => {
		window.addEventListener( 'keyup', ( event ) => {
			if ( event.key === 'Escape' ) {
				close();
			}
		} );
	}, [ close ] );

	const openTagsMenu = useCallback( () => {
		setTagsMenu( true );
		tagsMenu.current.listBox.expand();
	}, [ ] );

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
		return <Tag fullSize={ hasActivator || tagsMenuActive || ( ! hasActivator && ! tagsMenuActive && selected.length === 1 ) } shape={ ! hasActivator && ! tagsMenuActive && ( selected.length > 1 ) && 'circle' } onDelete={ tagsMenuActive ? () => onDelete( tag ) : false } key={ label_id } className={ `${ classNames.tag } ${ className }` } { ...tagProps } style={ { backgroundColor: bgcolor, cursor: tagsMenuActive ? 'default' : 'pointer' } }>
			{ hasActivator || tagsMenuActive || ( ! hasActivator && ! tagsMenuActive && selected.length === 1 ) ? tag.label : tag.label.charAt( 0 ) }
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
			{ label && <div className={ `urlslab-TagsMenu-label ${ required ? 'required' : '' }` }>{ label }</div> }
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
					<IconButton onClick={ () => {
						openTagsMenu(); setPanelOverflow( true );
					} }
					className="urlslab-TagsMenu-activator"
					tooltip="Add New Tags (maximum 5)"
					tooltipStyle={ { width: '15em' } }
					>
						<AddTagIcon />
					</IconButton>
				}
			</div>

			{ description && <p className="urlslab-TagsMenu-description">{ description }</p> }
		</div>

	);
}
