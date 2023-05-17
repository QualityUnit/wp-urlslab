window.addEventListener( 'load', () => {
	if ( typeof window.WPML_TM !== 'undefined' && typeof window.WPML_TM.editorJobFieldView !== 'undefined' ) {
		const copyBtns = document.querySelectorAll( '.icl_tm_copy_link' );
		const copyAllBtn = document.querySelector( '.wpml-translation-header .button-copy-all' );
		const translateAllBtn = document.createElement( 'button' );
		const allRows = document.querySelectorAll( '.wpml-form-row' );

		const rowsTotal = allRows.length;
		let rowIndex = 0;

		translateAllBtn.innerText = 'Translate all empty';
		translateAllBtn.addEventListener( 'click', () => batchTranslate( rowIndex ) );
		copyAllBtn.after( translateAllBtn );

		// Creating separate Translate buttons
		copyBtns.forEach( ( btn ) => {
			const parent = btn.parentNode;
			const btnsWrapper = document.createElement( 'div' );
			const btnTranslate = document.createElement( 'button' );
			btnTranslate.style.cssText = 'margin-bottom: 1em; cursor: pointer;';
			btnsWrapper.classList.add( 'translateButtons' );
			btnsWrapper.style.cssText = 'display: inline-flex; flex-direction: column;';

			btnTranslate.innerText = 'Translate';
			btnTranslate.addEventListener( 'click', singleTranslate );

			btnsWrapper.appendChild( btnTranslate );
			parent.insertBefore( btnsWrapper, btn );
			btnsWrapper.appendChild( btn );
		} );

		function showError() {
			// Stops translating on error
			const errorMessage = document.createElement( 'div' );
			errorMessage.innerText = 'Translation failed!';
			errorMessage.style.cssText = 'position: fixed; z-index: 10000; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 2em; border-radius: 1em; background-color: red; color: white; padding: 0.5em 1em;';
			document.body.appendChild( errorMessage );
			setTimeout( () => {
				errorMessage.remove();
			}, 3000 );
		}

		// Function to get original field (or tinyMCE editor) and return target field
		function rowSetter( row ) {
			const orig = row.querySelector( '.original_value' );
			const isCompleteCheckbox = row.querySelector( '.field_translation_complete input' );
			const isTranslating = 'Translating...';

			let origFieldValue = orig.value;
			let tinymceOrigId;
			let tinymceTransId;
			let tinymceTransIdValue;
			let isTranslated = false;

			if ( orig.classList.contains( 'mce_editor_origin' ) ) {
				tinymceOrigId = orig.querySelector( 'textarea.original_value' ).getAttribute( 'name' );
				origFieldValue = window.tinyMCE.get( tinymceOrigId ).getContent();
				tinymceTransId = tinymceOrigId.replace( '_original', '' );
				tinymceTransIdValue = window.tinyMCE.get( tinymceTransId ).getContent();

				if ( tinymceTransIdValue ) {
					isTranslated = true;
				}

				if ( ! isTranslated ) {
					window.tinyMCE.get( tinymceTransId ).setContent( isTranslating );
				}

				return { origFieldValue, translateField: tinymceTransId, type: 'tinymce', isTranslated, isCompleteCheckbox };
			}

			const translateField = row.querySelector( '.translated_value' );

			if ( translateField.value ) {
				isTranslated = true;
			}

			if ( ! isTranslated ) {
				translateField.value = isTranslating;
			}

			return { origFieldValue: orig.value, translateField, isTranslated, isCompleteCheckbox };
		}

		async function singleTranslate( event ) {
			const wpmlRow = event.target.closest( '.wpml-form-row' );

			if ( wpmlRow ) { // Single row translation
				const { origFieldValue, translateField, type, isCompleteCheckbox } = rowSetter( wpmlRow );
				if ( origFieldValue === '' ) {
					return '';
				}
				const response = await translate( { origFieldValue, translateField, type, isCompleteCheckbox } );
				if ( ! response ) {
					showError();
				}
				return response;
			}
		}

		// Function for translating all fields
		async function batchTranslate( index ) {
			if ( index === rowsTotal - 1 ) {
				// Stops translating when on the end
				return false;
			}
			const row = allRows[ index ];

			const { origFieldValue, translateField, type, isTranslated, isCompleteCheckbox } = rowSetter( row );

			let response = { translation: true };
			if ( ! isTranslated ) { // Do not translated filled fields
				if ( origFieldValue == '' ) {
					response = '';
				} else {
					response = await translate({origFieldValue, translateField, type, isCompleteCheckbox});
				}
			}
			if ( response?.translation || response?.translation === '') { // Continue if got response with translation
				rowIndex += 1;
				await batchTranslate( rowIndex );
				return response;
			}
			showError();
			return false;
		}

		// Fetching function that returns translation from ChatGPT
		async function translate( { origFieldValue, translateField, type, isCompleteCheckbox } ) {
			return await fetch( window.wpApiSettings.root + 'urlslab/v1/generator/translate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json',
					'X-WP-Nonce': window.wpApiSettings.nonce,
				},
				body: JSON.stringify( {
					source_lang: window.WpmlTmEditorModel.languages.source_lang,
					target_lang: window.WpmlTmEditorModel.languages.target_lang,
					original_text: origFieldValue,
				} ),
				credentials: 'include',
			} ).then( ( response ) => {
				if ( response.ok ) {
					return response.json();
				}
				// throw new Error( 'Translation request failed' );
				return false;
			} ).then( ( data ) => {
				if ( type && type === 'tinymce' ) {
					window.tinyMCE.get( translateField ).setContent( data?.translation || '' );
					return data;
				}
				translateField.value = data?.translation || '';
				if ( data?.translation ) {
					isCompleteCheckbox.disabled = false;
				}
				return data;
			} ).catch( ( error ) => {
				return error;
			} );
		}
	}
} );
