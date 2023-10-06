import { useMemo, useCallback, useState, useRef, useEffect, memo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { __ } from '@wordpress/i18n/';

import useClickOutside from '../hooks/useClickOutside';
import useTags from '../hooks/useTags';
import { postFetch } from '../api/fetching';

import SvgIcon from './SvgIcon';

import Chip from '@mui/joy/Chip';
import ChipDelete from '@mui/joy/ChipDelete';
import Tooltip from '@mui/joy/Tooltip';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import Alert from '@mui/joy/Alert';
import CircularProgress from '@mui/joy/CircularProgress';
import Sheet from '@mui/joy/Sheet';

//import '../assets/styles/elements/_TagsMenu.scss';

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

/*
	noOverflow used in CustomHtmlTable when adding new row
*/
const TagsMenu = ( { label, defaultValue: tags, slug, showShortened, onChange } ) => {
	const { tagsData, isSuccess: isSuccessTags, isLoading: isLoadingTags, isError: isErrorTags } = useTags();
	const tagsWrapperRef = useRef();
	const selectedTagsInitialized = useRef( false );

	const [ tagsPopupOpened, setTagsPopupOpened ] = useState( false );
	const [ selectedTags, setSelectedTags ] = useState( [] ); // do not use getInitialSelectedTags, state is not updated after query returns fetched data

	// Getting only tags/labels that have empty modules array or allowed slug
	const allAvailableTags = useMemo( () => {
		return tagsData?.filter( ( tag ) => ( tag.modules.indexOf( slug ) !== -1 && tag.modules.length ) || ( tag.modules.length === 1 && ( tag.modules[ 0 ] === '' || tag.modules[ 0 ] === 'all' ) ) );
	}, [ tagsData, slug ] );

	const closePopup = useCallback( () => {
		setTagsPopupOpened( false );

		const selectedTagsIdsString = tagsToString( selectedTags );
		if ( onChange && selectedTagsIdsString !== tags ) {
			onChange( selectedTagsIdsString );
		}
	}, [ onChange, selectedTags, tags ] );

	useClickOutside( tagsWrapperRef, closePopup );

	// once tags are fetched, define selected tags
	useEffect( () => {
		if ( tagsData && ! selectedTagsInitialized.current ) {
			setSelectedTags( getInitialSelectedTags( { tagsData, tags } ) );
			selectedTagsInitialized.current = true;
		}
	}, [ tagsData, tags ] );

	useEffect( () => {
		const closeEventListener = ( event ) => {
			if ( event.key === 'Escape' ) {
				closePopup();
			}
		};
		window.addEventListener( 'keyup', closeEventListener );
		return () => {
			document.removeEventListener( 'keyup', closeEventListener );
		};
	}, [ closePopup ] );

	const TagsPopup = () => (
		<Box ref={ tagsWrapperRef } sx={ { p: 1.5, position: 'relative' } }>
			{ isLoadingTags &&
				// first tags loading
				<Sheet variant="plain" className="flex flex-align-center flex-justify-center fs-m">
					<CircularProgress size="sm" sx={ { mr: 1 } } />
					{ __( 'Loading tags…' ) }
				</Sheet>
			}
			{ isErrorTags &&
				<Sheet color="danger" variant="plain" className="flex flex-align-center flex-justify-center fs-m">
					{ __( 'Failed to load tags…' ) }
				</Sheet>
			}
			{ isSuccessTags &&
				<TagsPopupContent allAvailableTags={ allAvailableTags } setSelectedTags={ setSelectedTags } selectedTags={ selectedTags } tagsWrapperRef={ tagsWrapperRef } />
			}
		</Box>
	);

	return (
		<Box className="urlslab-TagsMenu-wrapper" sx={ { position: 'relative' } }>
			{ label && <div className="urlslab-inputField-label">{ label }</div> }
			<Tooltip
				placement="bottom"
				variant="outlined"
				title={ <TagsPopup /> }
				open={ tagsPopupOpened }
				disablePortal
				sx={ { width: '100%', minWidth: '18rem' } }
			>
				<Box
					onClick={ () => {
						if ( tagsPopupOpened ) {
							closePopup();
							return;
						}
						setTagsPopupOpened( ( s ) => ! s );
					} }
					sx={ { p: 0 } }
				>

					{ selectedTags.length
						? <Stack
							direction="row"
							alignItems="center"
							spacing={ 0.5 }
							sx={ { cursor: 'pointer' } }
						>
							{ selectedTags.map( ( tag ) => {
								return <Chip
									key={ tag.label_id }
									size="sm"
									data-color={ tag.bgcolor ?? null }
									isCircle={ selectedTags.length > 1 }
									isDark={ tag.isDark }
									isTag
								>
									{ ( showShortened && selectedTags.length > 1 ) ? tag.label.charAt( 0 ) : tag.label }
								</Chip>;
							} )
							}
						</Stack>
						: <Button
							className="add-tags-button"
							variant="plain"
							color="neutral"
							size="xs"
							startDecorator={ <SvgIcon name="plus" /> }
							sx={ ( theme ) => ( {
								'--Icon-fontSize': theme.vars.fontSize.xs,
								...( tagsPopupOpened ? { visibility: 'hidden' } : null ),

							} ) }
						>
							{ __( 'Add tags' ) }
						</Button>
					}
				</Box>
			</Tooltip>
		</Box>

	);
};

const TagsPopupContent = ( { allAvailableTags, selectedTags, setSelectedTags, maxTags = 5 } ) => {
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

	const onDeleteTag = useCallback( ( tag ) => {
		setSelectedTags( selectedTags.filter( ( selectedTag ) => selectedTag.label_id !== tag.label_id ) );
	}, [ selectedTags, setSelectedTags ] );

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
			{ selectedTags.length > 0 &&
			<>
				<Box
					display="flex"
					flexDirection="row"
					alignItems="center"
					flexWrap="wrap"
				>
					{
						selectedTags.map( ( tag ) => {
							return <Chip
								key={ tag.label_id }
								size="sm"
								endDecorator={ <ChipDelete onDelete={ () => onDeleteTag( tag ) } /> }
								data-color={ tag.bgcolor ?? null }
								isDark={ tag.isDark }
								isTag
								sx={ {
									mt: 0.5,
									mr: 0.5,
									':last-child': {
										mr: 0,
									},
								} }
							>
								{ tag.label }
							</Chip>;
						} )
					}
				</Box>
				<Divider />
			</>
			}
			<Box>
				<Typography level="body-xs" sx={ { textTransform: 'uppercase', fontWeight: 600, mb: 1 } }>{ __( 'Add tags:' ) }</Typography>
				{ maxTagsReached
				// translators: %i is integer of maximum allowed tags, do not change it.
					? <Alert size="sm" variant="soft" color="danger">{ __( 'Maximum of %i tags are allowed.' ).replace( '%i', maxTags ) }</Alert>
					: <>
						<Input
							value={ searchText }
							size="sm"
							color="neutral"
							variant="outlined"
							placeholder={ __( 'Filter available tags…' ) }
							onChange={ ( event ) => setSearchText( event.target.value ) }
							endDecorator={
								<Button
									size="xs"
									variant="plain"
									disabled={ searchText === '' }
									onClick={ () => setSearchText( '' ) }
								>
									{ __( 'Clear' ) }
								</Button>
							}
							sx={ { mb: 1 } }
						/>

						<Box
							display="flex"
							flexDirection="row"
							alignItems="center"
							flexWrap="wrap"
						>
							{ availableTagsForSelect.map( ( tag ) => {
								return <Chip
									key={ tag.label_id }
									size="sm"
									onClick={ maxTagsReached ? null : () => onSelectTag( tag ) }
									sx={ {
										mt: 0.5,
										mr: 0.5,
										':last-child': {
											mr: 0,
										},
										...( maxTagsReached ? { opacity: 0.5 } : null ),
									} }
									data-color={ tag.bgcolor ?? null }
									isDark={ tag.isDark }
									isTag
								>
									{ tag.label }
								</Chip>;
							} ) }
						</Box>

						{ allowAddNewTag &&
						<>
							<Divider sx={ { marginY: 1.5 } } />
							<Button
								size="xs"
								variant="plain"
								color="neutral"
								onClick={ onCreateTag }
								loading={ addingNewTag }
							>
								{
									/* translators: %s is string with name of the new tag */
									__( 'Create new tag %s' ).replace( '%s', `"${ searchText }"` )
								}
							</Button>
						</>
						}
					</>
				}
			</Box>
		</Stack>
	);
};

export default memo( TagsMenu );
