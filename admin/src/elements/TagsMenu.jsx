import { useMemo, useCallback, useState, useRef, useEffect, memo, createContext, useContext } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { __ } from '@wordpress/i18n/';

import useClickOutside from '../hooks/useClickOutside';
import useTags from '../hooks/useTags';
import { postFetch } from '../api/fetching';

import SvgIcon from './SvgIcon';
import Tag from './Tag';

import Tooltip from '@mui/joy/Tooltip';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import Alert from '@mui/joy/Alert';
import CircularProgress from '@mui/joy/CircularProgress';
import Sheet from '@mui/joy/Sheet';

const tagsToString = ( tags ) => {
	const ids = tags.map( ( tag ) => tag.label_id );
	return ids.join( '|' ).replace( /^(.+)$/, '|$1|' );
};

const getInitialSelectedTags = ( { tagsData, tags } ) => {
	const assignedTagsArray = tags?.replace( /^\|(.+)\|$/, '$1' ).split( '|' );
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
};

const TagsMenuContext = createContext( {} );

/*
* controlled: input value controlled by parent component using 'value' prop, defaultValue is 'value'
* uncontrolled: input value handled by inner state, default value is provided 'defaultValue' prop, change of default value doesn't affect inner stat of component
* optionItem - tags component for standard input style option in plugin settings
*/
const TagsMenu = memo( ( { label, value, defaultValue, slug, optionItem, onChange, maxTags = 5 } ) => {
	const { tagsData } = useTags();
	const tagsWrapperRef = useRef();
	const selectedTagsInitialized = useRef( false );
	const isControlledInit = useRef( true );
	const isControlled = value !== undefined;
	const tags = isControlled ? value : defaultValue;

	const [ tagsPopupOpened, setTagsPopupOpened ] = useState( false );
	// maybe set selected tags immediately if tagsData from query exists, otherwise are selected tags initialized later in effect when query returns data
	const [ selectedTags, setSelectedTags ] = useState( tagsData ? getInitialSelectedTags( { tagsData, tags } ) : [] );

	// Getting only tags/labels that have empty modules array or allowed slug
	const allAvailableTags = useMemo( () => {
		return tagsData?.filter( ( tag ) => ( tag.modules.indexOf( slug ) !== -1 && tag.modules.length ) || ( tag.modules.length === 1 && ( tag.modules[ 0 ] === '' || tag.modules[ 0 ] === 'all' ) ) );
	}, [ tagsData, slug ] );

	const runOnChange = useCallback( () => {
		const selectedTagsIdsString = tagsToString( selectedTags );
		if ( onChange && selectedTagsIdsString !== tags ) {
			onChange( selectedTagsIdsString );
		}
	}, [ onChange, selectedTags, tags ] );

	const closePopup = useCallback( () => {
		setTagsPopupOpened( false );
		runOnChange();
	}, [ runOnChange ] );

	const onDeleteTag = useCallback( ( tag ) => {
		setSelectedTags( selectedTags.filter( ( selectedTag ) => selectedTag.label_id !== tag.label_id ) );
	}, [ selectedTags, setSelectedTags ] );

	useClickOutside( tagsWrapperRef, closePopup );

	// once tags are fetched, define selected tags
	useEffect( () => {
		if ( tagsData && ! selectedTagsInitialized.current ) {
			setSelectedTags( getInitialSelectedTags( { tagsData, tags } ) );
			selectedTagsInitialized.current = true;
		}
	}, [ tagsData, tags ] );

	// if it's optionItem component in settings, run onChange when selectedTags changes
	// resolves problems in "add new row" popup when tags are selected and user immediately click on add row button
	useEffect( () => {
		if ( optionItem ) {
			runOnChange();
		}
	}, [ optionItem, runOnChange ] );

	useEffect( () => {
		// update value from parent and prevent double render on input mount
		if ( isControlled && ! isControlledInit.current ) {
			setSelectedTags( tagsData ? getInitialSelectedTags( { tagsData, tags: value } ) : [] );
		}
		isControlledInit.current = false;
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ isControlled, value ] ); // we do not want to run effect on tagsData change after adding new tag via popup

	return (
		<TagsMenuContext.Provider
			value={ {
				optionItem,
				allAvailableTags,
				selectedTags,
				tagsWrapperRef,
				setSelectedTags,
				setTagsPopupOpened,
				onDeleteTag,
				closePopup,
				maxTags,
			} }
		>
			<Box className="urlslab-TagsMenu-wrapper" sx={ { position: 'relative' } }>
				{ label && <div className="urlslab-inputField-label"><span dangerouslySetInnerHTML={ { __html: label.replace( /[\u00A0-\u9999<>\&]/g, ( i ) => '&#' + i.charCodeAt( 0 ) + ';' ).replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } /></div> }
				<Tooltip
					placement="bottom"
					variant="outlined"
					title={ <TagsPopup /> }
					open={ tagsPopupOpened }
					sx={ { width: '100%', minWidth: '18rem' } }
					disablePortal
				>
					<Box
						// click on wrapper available only in table, using optionItem is popup opened via TagInserterIcon in wrapper below
						onClick={
							! optionItem
								? () => {
									if ( tagsPopupOpened ) {
										closePopup();
										return;
									}
									setTagsPopupOpened( ( s ) => ! s );
								}
								: null
						}
						sx={ {
							p: 0,
							...( optionItem
								? { marginY: 1 }
								: { cursor: 'pointer' } ),
						} }
					>

						{ selectedTags.length > 0 &&
							<TagsRowWrapper className="table-cell-tags-wrapper" >
								{
									selectedTags.map( ( tag ) => {
										const shortenedTag = ! optionItem && selectedTags.length > 1;
										return (
											<Tag
												key={ tag.label_id }
												color={ tag.bgcolor ?? null }
												onDelete={ optionItem ? () => onDeleteTag( tag ) : null }
												isCircle={ ! optionItem && selectedTags.length > 1 }
												tooltip={ shortenedTag ? tag.label : null }
												sx={ ( theme ) => ( { fontWeight: theme.vars.fontWeight.md } ) }
												isTagCloud
												thinFont
												fitText
											>
												{ shortenedTag ? tag.label.charAt( 0 ) : tag.label }
											</Tag>
										);
									} )
								}
								{
									( optionItem && selectedTags.length < maxTags ) &&
									<TagInserterIcon />
								}
							</TagsRowWrapper>
						}

						{
							// inline tags inserter icon when tags are used in options
							( ! selectedTags.length && optionItem ) && <TagInserterIcon />
						}
						{
							// tags inserter as button, used in table row as placeholder in table cell
							( ! selectedTags.length && ! optionItem ) &&
							<Button
								className="add-tags-button"
								variant="plain"
								color="neutral"
								size="xs"
								onClick={ optionItem ? () => setTagsPopupOpened( true ) : null }
								startDecorator={ <SvgIcon name="plus" /> }
								sx={ ( theme ) => ( {
									'--Icon-fontSize': theme.vars.fontSize.xs,
									...( tagsPopupOpened ? { visibility: 'hidden' } : null ),

								} ) }
							>
								{ __( 'Add tags', 'wp-urlslab' ) }
							</Button>
						}
					</Box>
				</Tooltip>
			</Box>
		</TagsMenuContext.Provider>

	);
} );

const TagsPopup = memo( () => {
	const { isSuccess: isSuccessTags, isLoading: isLoadingTags, isError: isErrorTags } = useTags();
	const {
		closePopup,
		tagsWrapperRef,
	} = useContext( TagsMenuContext );

	useEffect( () => {
		const closeEventListener = ( event ) => {
			if ( event.key === 'Escape' ) {
				closePopup();
			}
		};
		document.addEventListener( 'keyup', closeEventListener );
		return () => {
			document.removeEventListener( 'keyup', closeEventListener );
		};
	}, [ closePopup ] );

	return (
		<Box ref={ tagsWrapperRef } sx={ { p: 1.5, position: 'relative' } }>
			{ isLoadingTags &&
			// first tags loading
			<Sheet variant="plain" className="flex flex-align-center flex-justify-center fs-m">
				<CircularProgress size="sm" sx={ { mr: 1 } } />
				{ __( 'Loading tags…', 'wp-urlslab' ) }
			</Sheet>
			}
			{ isErrorTags &&
			<Sheet color="danger" variant="plain" className="flex flex-align-center flex-justify-center fs-m">
				{ __( 'Failed to load tags…', 'wp-urlslab' ) }
			</Sheet>
			}
			{ isSuccessTags &&
			<TagsPopupContent />
			}
		</Box>
	);
} );

const TagsPopupContent = memo( () => {
	const {
		optionItem,
		allAvailableTags,
		setSelectedTags,
		selectedTags,
		onDeleteTag,
		maxTags,
	} = useContext( TagsMenuContext );
	const { isRefetching: isRefetchingTags } = useTags();

	const queryClient = useQueryClient();
	const [ searchText, setSearchText ] = useState( '' );
	const [ addingNewTag, setAddingNewTag ] = useState( false );

	const maxTagsReached = selectedTags.length >= maxTags;

	const availableTagsForSelect = useMemo( () => {
		const selectedIds = selectedTags.map( ( tag ) => tag.label_id );
		return allAvailableTags.filter( ( tag ) => {
			if ( searchText === '' ) {
				return ! selectedIds.includes( tag.label_id );
			}
			return ! selectedIds.includes( tag.label_id ) && tag.label.includes( searchText.trim() );
		} );
	}, [ allAvailableTags, searchText, selectedTags ] );

	const allowAddNewTag = useMemo( () => {
		if ( searchText === '' ) {
			return false;
		}
		return allAvailableTags.filter( ( tag ) => tag.name.toLowerCase() === searchText.toLowerCase() ).length === 0;
	}, [ allAvailableTags, searchText ] );

	const onSelectTag = useCallback( ( tag ) => {
		setSelectedTags( ( s ) => [ ...s, tag ] );
	}, [ setSelectedTags ] );

	// create new tag in tags table when it doesn't exists
	const onCreateTag = useCallback(
		async () => {
			setAddingNewTag( true );

			const newTagToInsert = { name: searchText, bgcolor: '#EDEFF3' };
			const response = await postFetch( `label/create`, newTagToInsert );
			if ( response.ok ) {
				let returnedTag = await response.json();
				returnedTag = { value: returnedTag.label_id, label: returnedTag.name, ...returnedTag };
				setSelectedTags( ( s ) => [ ...s, returnedTag ] );
				queryClient.invalidateQueries( [ 'label' ], { refetchType: 'all' } );
			}

			setAddingNewTag( false );
		}, [ queryClient, searchText, setSelectedTags ] );

	return (
		<Stack spacing={ 1.5 } >
			{ selectedTags.length > 0 && (
				! optionItem &&
				<>
					<TagsRowWrapper>
						{
							selectedTags.map( ( tag ) => {
								return <Tag
									key={ tag.label_id }
									color={ tag.bgcolor ?? null }
									onDelete={ () => onDeleteTag( tag ) }
									sx={ ( theme ) => ( { fontWeight: theme.vars.fontWeight.md } ) }
									isTagCloud
									thinFont
									fitText
								>
									{ tag.label }
								</Tag>;
							} )
						}
					</TagsRowWrapper>
					<Divider />
				</>
			) }
			<Box>
				<Typography level="body-xs" sx={ { textTransform: 'uppercase', fontWeight: 600, mb: 1 } }>{ __( 'Add tags:', 'wp-urlslab' ) }</Typography>
				{ maxTagsReached
					// translators: %i is number of maximum allowed tags, do not change it.
					? <Alert size="sm" variant="soft" color="danger">{ __( 'Maximum of %i tags are allowed.', 'wp-urlslab' ).replace( '%i', maxTags ) }</Alert>
					: <>
						<Input
							value={ searchText }
							size="sm"
							color="neutral"
							variant="outlined"
							placeholder={ __( 'Filter available tags…', 'wp-urlslab' ) }
							onChange={ ( event ) => setSearchText( event.target.value ) }
							endDecorator={
								<Button
									size="xs"
									variant="plain"
									disabled={ searchText === '' }
									onClick={ () => setSearchText( '' ) }
								>
									{ __( 'Clear', 'wp-urlslab' ) }
								</Button>
							}
							sx={ { mb: 1 } }
						/>

						<TagsRowWrapper>
							{ availableTagsForSelect.map( ( tag ) => {
								return <Tag
									key={ tag.label_id }
									onClick={ maxTagsReached ? null : () => onSelectTag( tag ) }
									color={ tag.bgcolor ?? null }
									sx={ ( theme ) => ( { fontWeight: theme.vars.fontWeight.md } ) }
									isTagCloud
									thinFont
									fitText
								>
									{ tag.label }
								</Tag>;
							} ) }
						</TagsRowWrapper>

						{ allowAddNewTag &&
						<>
							<Divider sx={ { marginY: 1.5 } } />
							<Button
								size="xs"
								variant="plain"
								color="neutral"
								onClick={ onCreateTag }
								loading={ addingNewTag || isRefetchingTags }
							>
								{
									/* translators: %s is string with name of the new tag */
									__( 'Create new tag %s', 'wp-urlslab' ).replace( '%s', `"${ searchText }"` )
								}
							</Button>
						</>
						}
					</>
				}
			</Box>
		</Stack>
	);
} );

const TagsRowWrapper = memo( ( { children, sx, className } ) => {
	return (
		<Box
			{ ...( className ? className : null ) }
			display="flex"
			flexDirection="row"
			alignItems="center"
			flexWrap="wrap"
			sx={ { ...( sx ? sx : null ) } }
		>{ children }</Box>
	);
} );

const TagInserterIcon = memo( () => {
	const {
		maxTags,
		setTagsPopupOpened,
	} = useContext( TagsMenuContext );

	return (
		<Tooltip
			title={
			// translators: %i is integer of maximum allowed tags, do not change it.
				__( 'Maximum of %i tags are allowed.', 'wp-urlslab' ).replace( '%i', maxTags )
			}
		>
			<IconButton size="xs" variant="plain" color="neutral" onClick={ () => setTagsPopupOpened( true ) }>
				<SvgIcon name="addTag" />
			</IconButton>
		</Tooltip>
	);
} );

export default memo( TagsMenu );
