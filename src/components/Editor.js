import {
	BlockEditorKeyboardShortcuts,
	BlockEditorProvider,
	BlockList,
	WritingFlow,
	BlockTools,
	ObserveTyping,
} from '@wordpress/block-editor';
import '@wordpress/format-library';
import { uploadMedia } from '@wordpress/media-utils';

const {
	serialize,
	parse,
	getBlockVariations,
	unregisterBlockVariation,
} = wp.blocks;
const { Popover, SlotFillProvider } = wp.components;
const { isRTL, __ } = wp.i18n;
const { useEffect, useState, useMemo } = wp.element;
const { useSelect } = wp.data;

const Editor = ( props ) => {
	const { attributes, setAttributes } = props;
	const { content } = attributes;
	const [ blocks, updateBlocks ] = useState( [] );
	const [ showAddContent, setShowAddContent ] = useState( true );

	const textHtml = document.createElement( 'span' );
	const maxContentLength = 2048;

	// We get the text content entered
	const getBlocksContent = () => {
		let text = [];
		text += blocks.map( ( thisBlock ) => {
			if ( thisBlock.name === 'core/list' ) {
				return thisBlock.attributes.values;
			}
			return thisBlock.attributes.content;
		} );
		textHtml.innerHTML = text;
		return textHtml.innerText;
	};

	const canUserCreateMedia = useSelect( ( select ) => {
		const canCreateMedia = select( 'core' ).canUser( 'create', 'media' );
		return canCreateMedia || canCreateMedia !== false;
	}, [] );

	const editorSettings = {
		allowedBlockTypes: [ 'core/heading', 'core/paragraph', 'core/list' ],
		isRTL: isRTL(),
	};

	// We want only youtube
	const allowedEmbedVariants = [ 'youtube' ];

	getBlockVariations( 'core/embed' ).forEach( ( variant ) => {
		if ( ! allowedEmbedVariants.includes( variant.name ) ) {
			unregisterBlockVariation( 'core/embed', variant.name );
		}
	} );

	// Extending our settings for support for Media library in Image block type
	const settings = useMemo( () => {
		if ( ! canUserCreateMedia ) {
			return editorSettings;
		}
		return {
			...editorSettings,
			mediaUpload( { onError, ...rest } ) {
				uploadMedia( {
					wpAllowedMimeTypes: editorSettings.allowedMimeTypes,
					onError: ( { message } ) => onError( message ),
					...rest,
				} );
			},
		};
	}, [ canUserCreateMedia, editorSettings ] );

	// Functions to update content in the editor from Block Editor component

	const handleUpdateBlocks = ( bloky ) => {
		updateBlocks( bloky );
	};

	const handlePersistBlocks = ( newBlocks ) => {
		updateBlocks( newBlocks );
		setAttributes( { content: serialize( newBlocks ) } );
	};

	useEffect( () => {
		if ( content?.length ) {
			handleUpdateBlocks( () => parse( content ) );
		}
	}, [] );

	return (
		<div className="qu-enhancedFAQ__item--inn relative">
			<SlotFillProvider>
				<BlockEditorProvider
					value={ blocks }
					onInput={ handleUpdateBlocks }
					onChange={ handlePersistBlocks }
					onFocus={ () => setShowAddContent( false ) }
					settings={ settings }
				>
					<div className="qu-enhancedFAQ__item--answer">
						<BlockTools>
							<div className="editor-styles-wrapper">
								<BlockEditorKeyboardShortcuts />
								<WritingFlow>
									<ObserveTyping>
										<BlockList />
									</ObserveTyping>
								</WritingFlow>
							</div>
						</BlockTools>
					</div>
					<Popover.Slot />
				</BlockEditorProvider>
			</SlotFillProvider>
			{ showAddContent && blocks.length === 0 ? (
				<div>{ __( ' Add content here', 'qu-enhanced-faq' ) }</div>
			) : null }
			{ getBlocksContent().length >= maxContentLength ? (
				<div className="input__limit">
					{ __(
						"Maximum length of an answer shouldn't exceed 2048 characters",
						'qu-enhanced-faq'
					) }
				</div>
			) : null }
		</div>
	);
};

export default Editor;
