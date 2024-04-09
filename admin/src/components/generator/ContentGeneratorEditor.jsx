import { memo, useRef, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { Editor as TinyMCE } from '@tinymce/tinymce-react/lib/cjs/main/ts/components/Editor';

import { createPost } from '../../api/generatorApi';
import useAIGenerator from '../../hooks/useAIGenerator';
import usePostTypesQuery from '../../queries/usePostTypesQuery';

import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Select from '@mui/joy/Select';
import Stack from '@mui/joy/Stack';
import Option from '@mui/joy/Option';

const ContentGeneratorEditor = () => {
	const { __ } = useI18n();
	const editorRef = useRef( null );
	const { aiGeneratorManualHelpers, setAIGeneratorManualHelpers } = useAIGenerator();
	const { isFetching: isFetchingPostTypes, data: postTypes } = usePostTypesQuery();

	const [ postType, setPostType ] = useState( 'post' );
	const [ generatedPostLink, setGeneratedPostLink ] = useState( '' );
	const [ creatingPost, setCreatingPost ] = useState( false );

	const handleCreatePost = async () => {
		setCreatingPost( true );
		const createPostData = await createPost( aiGeneratorManualHelpers.editorVal, useAIGenerator.getState().aiGeneratorConfig.title, postType );
		setGeneratedPostLink( createPostData ? createPostData?.edit_post_link : '' );
		setCreatingPost( false );
	};

	return (
		<>
			<TinyMCE
				onInit={ ( evt, editor ) => {
					editorRef.current = editor;
					setAIGeneratorManualHelpers( { editorLoading: false } );
				} }

				value={ aiGeneratorManualHelpers.editorVal }
				onEditorChange={ ( input ) => setAIGeneratorManualHelpers( { editorVal: input } ) }
				init={ {
					skin: false,
					content_css: false,
					max_height: '80vh',
					menubar: false,
					entity_encoding: 'raw',
					plugins: [
						'advlist', 'autolink', 'lists', 'link', 'image', 'anchor', 'media', 'table', 'code',
					],
					toolbar: [ 'blocks | bold italic forecolor | alignleft aligncenter',
						'alignright alignjustify | bullist numlist outdent indent | code help' ],
					content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:20px }',
				} }
			/>
			{
				! isFetchingPostTypes && ! aiGeneratorManualHelpers.editorLoading && Object.keys( postTypes ).length !== 0 && aiGeneratorManualHelpers.editorVal !== '' && (
					<Stack direction="row" alignItems="end" spacing={ 2 } sx={ { mt: 2 } }>
						<FormControl size="sm">
							<FormLabel>{ __( 'Select Post Type', 'urlslab' ) }</FormLabel>
							<Select
								value={ postType }
								onChange={ ( event, value ) => setPostType( value ) }
							>
								{ Object.entries( postTypes ).map( ( [ key, value ] ) => {
									return <Option key={ key } value={ key }>{ value }</Option>;
								} ) }
							</Select>
						</FormControl>

						<Button
							size="sm"
							loading={ creatingPost }
							onClick={ handleCreatePost }
						>{ __( 'Create Post', 'urlslab' ) }</Button>

						{ ! creatingPost && generatedPostLink !== '' && (
							<Button component="a" size="sm" variant="plain" href={ generatedPostLink }>{ __( 'Edit Generated Post', 'urlslab' ) }</Button>
						) }
					</Stack>
				)
			}
		</>
	);
};

export default memo( ContentGeneratorEditor );
