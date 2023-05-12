window.addEventListener( 'load', () => {
	if ( typeof window.WPML_TM !== 'undefined' && typeof window.WPML_TM.editorJobFieldView !== 'undefined' ) {
		const copyBtns = document.querySelectorAll( '.icl_tm_copy_link' );
		const copyAllBtn = document.querySelector( '.wpml-translation-header .button-copy-all' );
		const translateAllBtn = document.createElement( 'button' );
		const allRows = document.querySelectorAll( '.wpml-form-row' );

		translateAllBtn.innerText = 'Translate all empty';
		translateAllBtn.addEventListener( 'click', copyTranslate );
		copyAllBtn.after( translateAllBtn );

		copyBtns.forEach( ( btn ) => {
			const parent = btn.parentNode;
			const btnsWrapper = document.createElement( 'div' );
			const btnTranslate = document.createElement( 'button' );
			btnTranslate.style.cssText = 'margin-bottom: 1em; cursor: pointer;';
			btnsWrapper.classList.add( 'translateButtons' );
			btnsWrapper.style.cssText = 'display: inline-flex; flex-direction: column;';

			btnTranslate.innerText = 'Translate';
			btnTranslate.addEventListener( 'click', copyTranslate );

			btnsWrapper.appendChild( btnTranslate );
			parent.insertBefore( btnsWrapper, btn );
			btnsWrapper.appendChild( btn );
		} );

		function copyTranslate( event ) {
			const wpmlRow = event.target.closest( '.wpml-form-row' );
			const isTranslating = 'Translating...';
			const rowsTotal = allRows.length;
			let rowIndex = 0;

			if ( wpmlRow ) {
				const origFieldValue = wpmlRow.querySelector( '.original_value' ).value;
				const translationField = wpmlRow.querySelector( '.translated_value' );
				translationField.value = isTranslating;

				translate( origFieldValue, translationField );
				return false;
			}

			async function batchTranslate( index ) {
				const row = allRows[ index ];
				const origFieldValue = row.querySelector( '.original_value' ).value;
				const translationField = row.querySelector( '.translated_value' );

				if ( ! translationField.value ) {
					translationField.value = isTranslating;
					const response = await translate( origFieldValue, translationField );
					console.log( response );

					if ( index === rowsTotal - 1 ) {
						return false;
					}

					if ( response && index < rowsTotal ) {
						rowIndex += 1;
						await batchTranslate( rowIndex );
					}
					return response;
				}
				rowIndex += 1;
			}

			batchTranslate( rowIndex );
		}

		async function translate( origVal, targetField ) {
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
					original_text: origVal,
				} ),
				credentials: 'include',
			} ).then( ( response ) => {
				if ( response.status ) {
					return response.json();
				}
				throw new Error( 'Translation request failed' );
			} ).then( ( data ) => {
				targetField.value = data.translation;
				return data;
			} ).catch( ( error ) => {
				targetField.value = origVal;
				return error;
			} );
		}
	}
} );
