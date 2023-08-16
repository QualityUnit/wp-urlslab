import { useI18n } from '@wordpress/react-i18n';
import { memo, useRef, useState } from 'react';
import '../../assets/styles/components/_ContentGeneratorPanel.scss';
import { SingleSelectMenu } from '../../lib/tableImports';
import Loader from '../Loader';
import Button from '../../elements/Button';
import {
	createPost,
	getPostTypes,
} from '../../api/generatorApi';
import { Editor as TinyMCE } from '@tinymce/tinymce-react/lib/cjs/main/ts/components/Editor';
import { useQuery } from '@tanstack/react-query';
import ContentGeneratorConfigPanel from './ContentGeneratorConfigPanel';
import useAIGenerator from '../../hooks/useAIGenerator';

function ContentGeneratorPanel() {
	const { __ } = useI18n();
	const editorRef = useRef( null );
	const [ editorVal, setEditorVal ] = useState( '' );
	const [ editorLoading, setEditorLoading ] = useState( true );
	const [ postType, setPostType ] = useState( 'post' );
	const [ generatedPostLink, setGeneratedPostLink ] = useState( '' );

	const postTypesData = useQuery( {
		queryKey: [ 'post_types' ],
		queryFn: async () => {
			const result = await getPostTypes();
			if ( result.ok ) {
				return await result.json();
			}
			return {};
		},
		refetchOnWindowFocus: false,
	} );

	const handleCreatePost = async () => {
		const createPostData = await createPost( editorVal, useAIGenerator.getState().aiGeneratorConfig.title, postType );
		const rsp = await createPostData.json();
		setGeneratedPostLink( rsp.edit_post_link );
	};

	return (
		<div className="urlslab-content-gen-panel">
			<div className="urlslab-content-gen-panel-control">
				<h2>Content Generator</h2>
				<ContentGeneratorConfigPanel
					onGenerateComplete={ ( val ) => setEditorVal( val ) }
				/>
			</div>
			<div className="urlslab-content-gen-panel-editor">
				{
					editorLoading && <Loader />
				}
				<TinyMCE
					onInit={ ( evt, editor ) => {
						editorRef.current = editor;
						setEditorLoading( false );
					} }
					value={ editorVal }
					onEditorChange={ ( input ) => setEditorVal( input ) }
					init={ {
						skin: false,
						content_css: false,
						height: '80vh',
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
					! postTypesData.isLoading && ! editorLoading && Object.keys( postTypesData.data ).length !== 0 && (
						<div>
							<SingleSelectMenu
								key={ postType }
								items={ postTypesData.data }
								name="post_type_menu"
								defaultAccept
								autoClose
								defaultValue={ postType }
								onChange={ ( val ) => setPostType( val ) }
							/>

							<Button onClick={ handleCreatePost }>{ __( 'Create Post' ) }</Button>
						</div>
					)
				}

				{
					generatedPostLink !== '' && (
						<Button href={ generatedPostLink }>{ __( 'Edit Generated Post' ) }</Button>
					)
				}
			</div>
		</div>
	);
}

export default memo( ContentGeneratorPanel );
