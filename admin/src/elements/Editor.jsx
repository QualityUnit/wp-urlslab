import { useState, useEffect, useCallback, useRef } from 'react';
import { Editor as TinyMCE } from '@tinymce/tinymce-react';
import { useI18n } from '@wordpress/react-i18n';

import 'tinymce/tinymce';
// DOM model
import 'tinymce/models/dom/model';

/* Default icons are required for TinyMCE 5.3 or above */
import 'tinymce/icons/default';

/* A theme is also required */
import 'tinymce/themes/silver';

/* Import the skin */
import 'tinymce/skins/ui/oxide/skin.min.css';

/* Import plugins */
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
// import 'tinymce/plugins/autoresize';
// import 'tinymce/plugins/autosave';
// import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
// import 'tinymce/plugins/codesample';
// import 'tinymce/plugins/directionality';
// import 'tinymce/plugins/emoticons';
// import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/image';
// import 'tinymce/plugins/importcss';
// import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
// import 'tinymce/plugins/media';
// import 'tinymce/plugins/nonbreaking';
// import 'tinymce/plugins/pagebreak';
// import 'tinymce/plugins/preview';
// import 'tinymce/plugins/quickbars';
// import 'tinymce/plugins/save';
// import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
// import 'tinymce/plugins/template';
// import 'tinymce/plugins/visualblocks';
// import 'tinymce/plugins/visualchars';
// import 'tinymce/plugins/wordcount';

import '../assets/styles/elements/_Inputs.scss';
import Tooltip from './Tooltip';

export default function Editor( { defaultValue, className, style, label, description, required, onChange, initCallback } ) {
	const editorRef = useRef( null );
	const { __ } = useI18n();
	const [ val, setVal ] = useState( defaultValue ?? '' );
	useEffect( () => {
		setVal( defaultValue ?? '' );
	}, [ defaultValue ] );

	const handleVal = useCallback( ( input ) => {
		if ( onChange && ( defaultValue !== input || ! input ) ) {
			setVal( input );
			onChange( input );
		}
	}, [ onChange, defaultValue ] );

	return (
		<div className={ `urlslab-inputField-wrap ${ className || '' }` } style={ style }>
			{
				label
					? <span className={ `urlslab-inputField-label ${ required ? 'required' : '' }` }>{ label }</span>
					: null
			}

			<TinyMCE
				onInit={ ( evt, editor ) => {
					editorRef.current = editor;
					if ( initCallback ) {
						initCallback();
					}
				} }
				value={ val }
				onEditorChange={ ( input ) => handleVal( input ) }
				init={ {
					skin: false,
					content_css: false,
					height: 400,
					menubar: false,
					entity_encoding: 'raw',
					plugins: [
						'advlist', 'autolink', 'lists', 'link', 'image', 'anchor', 'media', 'table', 'code',
					],
					toolbar: [ 'blocks | bold italic forecolor | alignleft aligncenter',
						'alignright alignjustify | bullist numlist outdent indent | code help' ],
					content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
				} }
			/>
			{ required && <Tooltip className="showOnHover">{ __( 'Required field' ) }</Tooltip> }
			{ description && <p className="urlslab-inputField-description">{ description }</p> }
		</div>
	);
}
