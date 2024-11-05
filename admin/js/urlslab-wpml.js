const { __, _n, sprintf } = wp.i18n;

window.addEventListener( 'load', () => {
	if ( typeof window.WPML_TM !== 'undefined' && typeof window.WPML_TM.editorJobFieldView !== 'undefined' ) {
		const copyBtns = document.querySelectorAll( '.icl_tm_copy_link' );

		const buttonsContainer = document.querySelector( '.wpml-copy-container' );

		const translateEmptyBtn = document.createElement( 'button' );
		translateEmptyBtn.innerText = __( 'Translate empty', 'urlslab' );
		translateEmptyBtn.classList.add( 'button-secondary' );
		translateEmptyBtn.style.marginLeft = '10px';
		translateEmptyBtn.addEventListener( 'click', translateAllEmpty );

		const translateNotCompleteBtn = document.createElement( 'button' );
		translateNotCompleteBtn.innerText = __( 'Translate not completed', 'urlslab' );
		translateNotCompleteBtn.classList.add( 'button-secondary' );
		translateNotCompleteBtn.style.marginLeft = '10px';
		translateNotCompleteBtn.addEventListener( 'click', () => translateAll( false ) );

		const translateAllButton = document.createElement( 'button' );
		translateAllButton.innerText = __( 'Translate All', 'urlslab' );
		translateAllButton.classList.add( 'button-secondary' );
		translateAllButton.style.marginLeft = '10px';
		translateAllButton.addEventListener( 'click', translateAll );

		buttonsContainer.append( translateEmptyBtn );
		buttonsContainer.append( translateNotCompleteBtn );
		buttonsContainer.append( translateAllButton );

		// Creating separate Translate buttons
		copyBtns.forEach( ( btn ) => {
			const parent = btn.parentNode;
			const btnsWrapper = document.createElement( 'div' );
			const btnTranslate = document.createElement( 'button' );
			btnTranslate.style.cssText = 'margin-bottom: 1em; cursor: pointer;';
			btnsWrapper.classList.add( 'translateButtons' );
			btnsWrapper.style.cssText = 'display: inline-flex; flex-direction: column;';

			btnTranslate.innerText = __( 'Translate', 'urlslab' );
			btnTranslate.addEventListener( 'click', singleTranslate );

			btnsWrapper.appendChild( btnTranslate );
			parent.insertBefore( btnsWrapper, btn );
			btnsWrapper.appendChild( btn );
		} );

		// Function to get original field (or tinyMCE editor) and return target field
		function getRowData( row ) {
			const orig = row.querySelector( '.original_value' );
			const isCompleteCheckbox = row.querySelector( '.field_translation_complete input.icl_tm_finished' );

			let origFieldValue = orig.value;
			let tinymceOrigId;
			let tinymceTransId;
			let tinymceTransIdValue;
			let isTranslated = false;

			if ( orig.classList.contains( 'mce_editor_origin' ) ) {
				const textareaOriginal = orig.querySelector( 'textarea.original_value' );
				tinymceOrigId = textareaOriginal.getAttribute( 'name' );
				tinymceTransId = tinymceOrigId.replace( '_original', '' );
				const textareaTranslated = row.querySelector( `textarea#${ tinymceTransId }` );

				// if tinyMCE editors not initialized by click on "Visual" tab or editors not stored in window object, fallback to default textarea
				if ( window.tinyMCE ) {
					if ( window.tinyMCE.get( tinymceOrigId ) ) {
						origFieldValue = window.tinyMCE.get( tinymceOrigId ).getContent();
					} else {
						origFieldValue = textareaOriginal.value;
					}

					if ( window.tinyMCE.get( tinymceTransId ) ) {
						tinymceTransIdValue = window.tinyMCE.get( tinymceTransId ).getContent();
					} else {
						tinymceTransIdValue = textareaTranslated.value;
					}
				}

				if ( tinymceTransIdValue ) {
					isTranslated = true;
				}

				return { origFieldValue, translateField: tinymceTransId, isTranslated, isCompleteCheckbox };
			}

			const translateField = row.querySelector( '.translated_value' );

			if ( translateField.value ) {
				isTranslated = true;
			}

			return { origFieldValue: orig.value, translateField, isTranslated, isCompleteCheckbox };
		}

		// run translation only for empty not translated fields
		async function translateAllEmpty() {
			const allRows = document.querySelectorAll( '.wpml-form-row' );
			const rows = [ ...allRows ].filter( ( row ) => {
				const { origFieldValue, isTranslated } = getRowData( row );
				return origFieldValue && ! isTranslated;
			} );

			if ( ! rows.length ) {
				notify( __( 'No empty rows for translation.', 'urlslab' ), 'error' );
				return;
			}
			toggleTranslationButtonsDisable();
			await batchTranslate( rows ).then( ( results ) => {
				if ( results.length ) {
					notify( __( 'Translation finished.', 'urlslab' ), 'success' );
				}
			} );
			toggleTranslationButtonsDisable();
		}

		// run translation for all fields not marked as complete
		async function translateAll( translateCompleted = true ) {
			const allRows = document.querySelectorAll( '.wpml-form-row' );
			const rows = [ ...allRows ].filter( ( row ) => {
				const { origFieldValue, isCompleteCheckbox } = getRowData( row );

				if ( translateCompleted ) {
					return origFieldValue	? true : false;
				}
				return origFieldValue && ! isCompleteCheckbox.checked;
			} );

			if ( ! rows.length ) {
				notify( __( 'No fields for translation.', 'urlslab' ), 'error' );
				return;
			}
			toggleTranslationButtonsDisable();
			await batchTranslate( rows ).then( ( results ) => {
				if ( results.length ) {
					notify( __( 'Translation finished.', 'urlslab' ), 'success' );
				}
			} );
			toggleTranslationButtonsDisable();
		}

		// Single row translation
		async function singleTranslate( event ) {
			const wpmlRow = event.target.closest( '.wpml-form-row' );
			if ( wpmlRow ) {
				await translate( wpmlRow );
			}
		}

		// Batch translation of rows array
		async function batchTranslate( rows, batchSize = 20, retryDelay = 5000 ) {
			const results = [];
			let message = sprintf(
				/* translators: 1: total items for translation */
				_n( 'Translating %1$d item.', 'Translating %1$d items.', rows.length, 'urlslab' ),
				rows.length
			);
			notify( message );

			for ( let i = 0; i < rows.length; i += batchSize ) {
				let batch = rows.slice( i, i + batchSize );

				while ( batch.length > 0 ) {
					const batchResults = await Promise.all( batch.map( ( row ) => translate( row ) ) );

					// filter success transaltions and add to results
					batchResults.forEach( ( result ) => {
						if ( result?.status !== 429 && result?.pending !== true ) {
							results.push( result );
						}
					} );

					// filter translations which needs to be repeated
					// 429 response or translation in progress
					batch = batchResults.filter( ( result ) => result?.status === 429 || result?.pending === true ).map( ( result ) => result.rowData );

					// batch includes rows to repeat translation, continue after delay
					if ( batch.length > 0 ) {
						message = sprintf(
							/* translators: 1: retry delay in seconds */
							__( 'Pending translation.<br/>Will retry translation after %1$d seconds.', 'urlslab' ),
							retryDelay / 1000
						);
						notify( message );
						await new Promise( ( resolve ) => setTimeout( resolve, retryDelay ) );
					}
				}

				message = sprintf(
					/* translators: 1: number of successful translations, 2: total rows for translation */
					__( '%1$d of %2$d translated.', 'urlslab' ),
					results.length,
					rows.length,
				);
				notify( message );
			}
			return results;
		}

		// Fetching function that returns translation from ChatGPT
		async function translate( row ) {
			try {
				const { origFieldValue, translateField, isCompleteCheckbox } = getRowData( row );

				if ( origFieldValue === '' ) {
					return origFieldValue;
				}

				setFieldValue( translateField, __( 'Translating…', 'urlslab' ) );
				const response = await fetch( window.wpApiSettings.root + 'urlslab/v1/generator/translate', {
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
				} );

				// too many requests, return row information to rerun translation
				if ( response.status === 429 ) {
					return { status: response.status, rowData: row };
				}

				if ( response.ok ) {
					const data = await response.json();
					setFieldValue( translateField, data?.translation || '' );

					// pending translation, return row information to rerun translation
					if ( data?.pending === true ) {
						data.rowData = row;
					}

					if ( data?.translation ) {
						isCompleteCheckbox.disabled = false;
					}

					return data;
				}

				toggleTranslationButtonsDisable( false );
				showError();
				return false;
			} catch ( error ) {
				toggleTranslationButtonsDisable( false );
				showError();
				return error;
			}
		}

		/**
		 * Helpers
		 */

		function notify( message, type = 'info' ) {
			if ( window.urlsLab ) {
				window.urlsLab.setNotification( { message, status: type } );
				return;
			}
			// eslint-disable-next-line no-console
			console.warn( message );
		}

		function showError() {
			// Stops translating on error
			const errorMessage = document.createElement( 'div' );
			errorMessage.innerText = __( 'Translation failed!', 'urlslab' );
			errorMessage.style.cssText = 'position: fixed; z-index: 10000; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 2em; border-radius: 1em; background-color: red; color: white; padding: 0.5em 1em;';
			document.body.appendChild( errorMessage );
			setTimeout( () => {
				errorMessage.remove();
			}, 3000 );
		}

		// set text to translation field
		function setFieldValue( field, value ) {
			if ( ! field ) {
				return;
			}

			if ( typeof field === 'string' ) {
				const editor = window.tinyMCE?.get( field );
				if ( editor ) {
					window.tinyMCE.get( field ).setContent( value );
					return;
				}
				const fieldElm = document.getElementById( field );
				if ( fieldElm ) {
					fieldElm.value = value;
					return;
				}
			}

			field.value = value;
		}

		function toggleTranslationButtonsDisable( forceState ) {
			const buttons = [ translateEmptyBtn,
				translateNotCompleteBtn,
				translateAllButton ];

			buttons.forEach( ( btn ) => {
				if ( forceState ) {
					btn.disabled = forceState;
					return;
				}

				if ( ! btn.disabled ) {
					btn.disabled = true;
					return;
				}
				btn.disabled = false;
			} );
		}
	}
} );
