const { __, _n, sprintf } = wp.i18n;

window.addEventListener('load', () => {
	if (typeof window.WPML_TM !== 'undefined' && typeof window.WPML_TM.editorJobFieldView !== 'undefined') {
		let scheduledTranslations = {};
		let isCancelledTranslations = false;

		const rowSelectors = ".wpml-form-row, .wpml-form-row-nolabel";

		const copyBtns = document.querySelectorAll('.icl_tm_copy_link');

		const buttonsContainer = document.querySelector('.wpml-copy-container');

		const undoAllTranslationsButton = document.createElement('button');
		undoAllTranslationsButton.innerText = __('Uncomplete all translations', 'urlslab');
		undoAllTranslationsButton.classList.add('button-secondary');
		undoAllTranslationsButton.style.margin = '0 0 10px 10px';
		undoAllTranslationsButton.addEventListener('click', () => toggleTranslationCompleteCheckboxes());

		const completeAllTranslationsButton = document.createElement('button');
		completeAllTranslationsButton.innerText = __('Complete all translations', 'urlslab');
		completeAllTranslationsButton.classList.add('button-secondary');
		completeAllTranslationsButton.style.margin = '0 0 10px 10px';
		completeAllTranslationsButton.addEventListener('click', () => toggleTranslationCompleteCheckboxes(true));

		const translateEmptyBtn = document.createElement('button');
		translateEmptyBtn.innerText = __('Translate empty', 'urlslab');
		translateEmptyBtn.classList.add('button-primary');
		translateEmptyBtn.style.margin = '0 0 10px 10px';
		translateEmptyBtn.addEventListener('click', translateAllEmpty);

		const translateNotCompleteBtn = document.createElement('button');
		translateNotCompleteBtn.innerText = __('Translate not completed', 'urlslab');
		translateNotCompleteBtn.classList.add('button-primary');
		translateNotCompleteBtn.style.margin = '0 0 10px 10px';
		translateNotCompleteBtn.addEventListener('click', () => translateAll(false));

		const translateAllButton = document.createElement('button');
		translateAllButton.innerText = __('Translate All', 'urlslab');
		translateAllButton.classList.add('button-primary');
		translateAllButton.style.margin = '0 0 10px 10px';
		translateAllButton.addEventListener('click', translateAll);

		const cancelAllTranslationsButton = document.createElement('button');
		cancelAllTranslationsButton.innerText = __('Cancel translations', 'urlslab');
		cancelAllTranslationsButton.classList.add('button-secondary');
		cancelAllTranslationsButton.style.cssText = 'float: right; visibility: hidden; color: #ee1c1c!important; border-color:#ee1c1c!important; ';
		cancelAllTranslationsButton.addEventListener('click', cancelAll);

		buttonsContainer.append(
			createSeparator(),
			completeAllTranslationsButton,
			undoAllTranslationsButton,
			createSeparator(),
			translateEmptyBtn,
			translateNotCompleteBtn,
			translateAllButton,
			createSeparator(false),
			cancelAllTranslationsButton
		);

		// Creating separate Translate buttons
		copyBtns.forEach((btnCopy) => {
			const parent = btnCopy.parentNode;
			const row = btnCopy.closest(rowSelectors);

			btnCopy.style.cssText = "width: 40px; margin: 0 12px;";
			const btnsWrapper = document.createElement('div');
			btnsWrapper.classList.add('translateButtons');
			btnsWrapper.style.cssText = 'display: inline-flex; flex-direction: column;';

			const btnTranslate = document.createElement('button');
			btnTranslate.innerText = __('Translate', 'urlslab');
			btnTranslate.classList.add('runTranslation');
			btnTranslate.style.cssText = 'margin-bottom: 1em; cursor: pointer; padding: 1px;';
			btnTranslate.addEventListener('click', singleTranslate);

			const btnCancel = document.createElement('button');
			btnCancel.innerText = __('Cancel', 'urlslab');
			btnCancel.classList.add('cancelTranslation', 'hidden');
			btnCancel.style.cssText = 'margin-bottom: 1em; cursor: pointer; color: #ee1c1c;';
			btnCancel.dataset.rowId = row.getAttribute("id");
			btnCancel.addEventListener('click', cancelTranslation);

			btnsWrapper.appendChild(btnCancel);
			btnsWrapper.appendChild(btnTranslate);
			parent.insertBefore(btnsWrapper, btnCopy);
			btnsWrapper.appendChild(btnCopy);
		});

		// Function to get original field (or tinyMCE editor) and return target field
		function getRowData(row) {
			const orig = row.querySelector('.original_value');
			const isCompleteCheckbox = row.querySelector('.field_translation_complete input.icl_tm_finished');
			const rowId = row.getAttribute('id');

			let origFieldValue = orig.value;
			let tinymceOrigId;
			let tinymceTransId;
			let tinymceTransIdValue;
			let isTranslated = false;

			if (orig.classList.contains('mce_editor_origin')) {
				const textareaOriginal = orig.querySelector('textarea.original_value');
				tinymceOrigId = textareaOriginal.getAttribute('name');
				tinymceTransId = tinymceOrigId.replace('_original', '');
				const textareaTranslated = row.querySelector(`textarea#${tinymceTransId}`);

				// if tinyMCE editors not initialized by click on "Visual" tab or editors not stored in window object, fallback to default textarea
				if (window.tinyMCE) {
					if (window.tinyMCE.get(tinymceOrigId)) {
						origFieldValue = window.tinyMCE.get(tinymceOrigId).getContent();
					} else {
						origFieldValue = textareaOriginal.value;
					}

					if (window.tinyMCE.get(tinymceTransId)) {
						tinymceTransIdValue = window.tinyMCE.get(tinymceTransId).getContent();
					} else {
						tinymceTransIdValue = textareaTranslated.value;
					}
				}

				if (tinymceTransIdValue) {
					isTranslated = true;
				}

				return { row, rowId, origFieldValue, translatedField: tinymceTransId, isTranslated, isCompleteCheckbox, translatedFieldValue: tinymceTransIdValue };
			}

			const translatedField = row.querySelector('.translated_value');

			if (translatedField.value) {
				isTranslated = true;
			}

			return { row, rowId, origFieldValue: orig.value, translatedField, isTranslated, isCompleteCheckbox, translatedFieldValue: translatedField.value };
		}


		// run translation only for empty not translated fields
		async function translateAllEmpty() {
			resetScheduledTranslations();
			const allRows = document.querySelectorAll(rowSelectors);
			const rows = [...allRows].filter((row) => {
				const { origFieldValue, isTranslated } = getRowData(row);
				return origFieldValue && !isTranslated;
			});

			if (!rows.length) {
				notify(__('No empty rows for translation.', 'urlslab'), 'error');
				return;
			}
			toggleTranslationButtonsDisable();
			showCancelAllButton(true);
			await batchTranslate(rows).then((results) => {
				handleSuccessFinish(results, rows);
			});
			toggleTranslationButtonsDisable(false);
			showCancelAllButton(false);
		}

		// run translation for all fields not marked as complete
		async function translateAll(translateCompleted = true) {
			resetScheduledTranslations();
			const allRows = document.querySelectorAll(rowSelectors);
			const rows = [...allRows].filter((row) => {
				const { origFieldValue, isCompleteCheckbox } = getRowData(row);

				if (translateCompleted) {
					return origFieldValue ? true : false;
				}
				return origFieldValue && !isCompleteCheckbox.checked;
			});

			if (!rows.length) {
				notify(__('No fields for translation.', 'urlslab'), 'error');
				return;
			}
			toggleTranslationButtonsDisable();
			showCancelAllButton(true);
			await batchTranslate(rows).then((results) => {
				handleSuccessFinish(results, rows);
			});
			toggleTranslationButtonsDisable(false);
			showCancelAllButton(false);
		}

		// Single row translation
		async function singleTranslate(event) {
			const wpmlRow = event.target.closest(rowSelectors);
			if (wpmlRow) {
				//toggleTranslationButtonsDisable();
				await batchTranslate([wpmlRow]);
				//toggleTranslationButtonsDisable(false);
			}
		}

		// Batch translation of rows array
		async function batchTranslate(rows, batchSize = 20, retryDelay = 5000) {
			const successResults = [];

			notify(
				sprintf(
					/* translators: 1: total items for translation */
					_n('Translating %1$d item.', 'Translating %1$d items.', rows.length, 'urlslab'),
					rows.length
				)
			);

			const rowsData = [];
			rows.forEach(row => {
				const rowData = getRowData(row);
				setRunningTranslation(rowData)
				rowsData.push(rowData);
			});

			for (let i = 0; i < rowsData.length; i += batchSize) {
				let batch = rowsData.slice(i, i + batchSize);

				// make sure translated will be only wanted rows, user maybe cancelled some translation before it comes to order
				batch = filterScheduledTranslations(batch);

				while (batch.length > 0) {
					const batchResults = await Promise.all(batch.map((rowData) => translate(rowData)));

					// filter success transaltions and add to results
					batchResults.forEach((result) => {
						if (result?.status !== 429 && result?.pending !== true && result?.ok) {
							successResults.push(result);
						}
					});

					// filter translations which needs to be repeated
					// 429 response or translation in progress
					batch = batchResults
						.filter((result) => {
							if (result?.rowData) {
								return (result?.status === 429 || result?.pending === true) && scheduledTranslations[result.rowData.rowId] !== undefined
							}
							return (result?.status === 429 || result?.pending === true)

						})
						.map((result) => result?.rowData);

					// batch includes rows to repeat translation, continue after delay
					if (batch.length > 0) {
						notify(
							sprintf(
								/* translators: 1: retry delay in seconds */
								__('Pending translation.<br/>Will retry translation after %1$d seconds.', 'urlslab'),
								retryDelay / 1000
							)
						);
						await new Promise((resolve) => setTimeout(resolve, retryDelay));

						// filter rows in batch, during waiting could be some rows cancelled
						batch = filterScheduledTranslations(batch);
					}
				}

				if (!isCancelledTranslations) {
					notify(
						sprintf(
							/* translators: 1: number of successful translations, 2: total rows for translation */
							__('%1$d of %2$d translated.', 'urlslab'),
							successResults.length,
							rows.length,
						)
					);
				}
			}
			return successResults;
		}

		// select/deselect all checkboxes "Translation is complete"
		function toggleTranslationCompleteCheckboxes(setSelected = false) {
			const allRows = document.querySelectorAll(rowSelectors);
			allRows.forEach((row) => {
				const { isCompleteCheckbox } = getRowData(row);
				if (setSelected && !isCompleteCheckbox.checked) {
					isCompleteCheckbox.click();
					return;
				}
				if (!setSelected && isCompleteCheckbox.checked) {
					isCompleteCheckbox.click();
				}
			});
		}

		// Fetching function that returns translation from ChatGPT
		async function translate(rowData) {
			try {

				const { rowId, origFieldValue, translatedField, isCompleteCheckbox } = rowData;

				if (!scheduledTranslations[rowId] || origFieldValue === '') {
					return null;
				}
				const abortController = new AbortController();

				scheduledTranslations[rowId].abortController = abortController;

				setFieldInProgress(rowData, __('Translating…', 'urlslab'))

				const response = await fetch(window.wpApiSettings.root + 'urlslab/v1/generator/translate', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						accept: 'application/json',
						'X-WP-Nonce': window.wpApiSettings.nonce,
					},
					body: JSON.stringify({
						source_lang: window.WpmlTmEditorModel.languages.source_lang,
						target_lang: window.WpmlTmEditorModel.languages.target_lang,
						original_text: origFieldValue,
					}),
					credentials: 'include',
					signal: abortController.signal
				});

				// too many requests, return row information to rerun translation
				if (response.status === 429) {
					return { status: response.status, rowData: rowData };
				}

				if (response.ok) {
					const data = await response.json();

					if (data?.pending) {
						setFieldInProgress(rowData, data?.translation || rowData.translatedFieldValue || '');
					}

					//remove success translation form running translations
					if (!data?.pending && scheduledTranslations[rowData.rowId]) {
						setFieldValue(translatedField, data?.translation || rowData.translatedFieldValue || '', rowData);
						unsetRunningTranslation(rowData);
					}

					if (data?.translation) {
						isCompleteCheckbox.disabled = false;
					}

					data.rowData = rowData
					data.ok = true;
					return data;
				}

				translationErrorCallback(rowData);
				showError();
				return null;
			} catch (error) {
				translationErrorCallback(rowData);
				if (error.name === "AbortError") {
					// translation request cancelled by user
					return error;
				}
				showError();
				console.error(error)
				return error;
			}
		}

		/**
		 * Helpers
		 */

		function notify(message, type = 'info') {
			if (window.urlsLab) {
				window.urlsLab.setNotification({ message, status: type });
				return;
			}
			// eslint-disable-next-line no-console
			console.warn(message);
		}

		function showError() {
			notify(__('Translation failed!', 'urlslab'), "error");
		}

		// set text to translation field
		function setFieldValue(field, value, rowData = null) {
			if (!field) {
				return;
			}

			// when empty value, disable translation completed checkbox
			if (value === '' && rowData?.isCompleteCheckbox?.checked) {
				rowData.isCompleteCheckbox.click();
			}

			if (typeof field === 'string') {
				const editor = window.tinyMCE?.get(field);
				if (editor) {
					editor.setContent(value);
					editor.setProgressState(false);
					// synch editor content with related <textarea>, to really save updated value
					editor.save();

					if (editor.hidden) {
						editor.targetElm.value = value;
						editor.targetElm.placeholder = "";
						editor.targetElm.disabled = false;
					}
					return;
				}
				const fieldElm = document.getElementById(field);
				if (fieldElm) {
					fieldElm.value = value;
					fieldElm.placeholder = "";
					fieldElm.disabled = false;
					return;
				}
			}

			field.value = value;
			field.placeholder = "";
			field.disabled = false;
		}

		function setFieldInProgress(rowData, value) {
			const field = rowData.translatedField;
			if (!field) {
				return;
			}

			if (typeof field === 'string') {
				const editor = window.tinyMCE?.get(field);
				if (editor) {
					editor.setContent(value);
					editor.setProgressState(true);

					if (editor.hidden) {
						editor.targetElm.value = "";
						editor.targetElm.placeholder = value;
						editor.targetElm.disabled = true;
					}
					return;
				}
				const fieldElm = document.getElementById(field);
				if (fieldElm) {
					fieldElm.value = "";
					fieldElm.placeholder = value;
					fieldElm.disabled = true;
					return;
				}
			}

			field.value = "";
			field.placeholder = value;
			field.disabled = true;
		}

		function filterScheduledTranslations(batch) {
			return batch.filter(rowData => scheduledTranslations[rowData.rowId] !== undefined);
		}

		function createSeparator(inline = true) {
			const divSeparator = document.createElement('div');
			if (inline) {
				divSeparator.style.cssText = 'display: inline-block; margin-right: 20px;';
			}
			return divSeparator;
		}

		function toggleTranslationButtonsDisable(forceState) {
			const buttons = [translateEmptyBtn,
				translateNotCompleteBtn,
				translateAllButton];

			buttons.forEach((btn) => {
				if (forceState !== undefined) {
					btn.disabled = forceState;
					return;
				}

				if (!btn.disabled) {
					btn.disabled = true;
					return;
				}
				btn.disabled = false;
			});
		}

		function showCancelAllButton(show) {
			cancelAllTranslationsButton.style.visibility = show ? "visible" : "hidden";
			if (!show) {
				isCancelledTranslations = false;
			}
		}

		function cancelAll() {
			isCancelledTranslations = true;
			Object.keys(scheduledTranslations).forEach(rowId => cancelTranslation(undefined, rowId));
		}

		function cancelTranslation(event, _rowId = null) {
			const rowId = event ? event.target.dataset.rowId : _rowId;
			const rowData = scheduledTranslations[rowId]?.rowData

			if (rowData) {
				setFieldValue(rowData.translatedField, rowData.translatedFieldValue, rowData);
				unsetRunningTranslation(rowData);
			}

		}

		function setRunningTranslation(rowData) {
			const rowButtons = rowData.row.querySelector('.translateButtons');
			const buttonRun = rowButtons.querySelector('.runTranslation')
			const buttonCancel = rowButtons.querySelector('.cancelTranslation')

			buttonRun?.classList.add("hidden");
			buttonRun.disabled = true;

			buttonCancel?.classList.remove("hidden");

			scheduledTranslations[rowData.rowId] = { rowData };
		}

		function unsetRunningTranslation(rowData) {
			if (scheduledTranslations[rowData.rowId]) {
				scheduledTranslations[rowData.rowId].abortController?.abort();
				delete scheduledTranslations[rowData.rowId];
			}
			const rowButtons = rowData.row.querySelector('.translateButtons');
			const buttonRun = rowButtons.querySelector('.runTranslation')
			const buttonCancel = rowButtons.querySelector('.cancelTranslation')

			buttonCancel?.classList.add("hidden");

			buttonRun?.classList.remove("hidden");
			buttonRun.disabled = false;
		}

		function resetScheduledTranslations() {
			scheduledTranslations = {};
		}

		function translationErrorCallback(rowData) {
			cancelTranslation(undefined, rowData.rowId);
		}

		function handleSuccessFinish(results, rows) {
			if (results.length && !isCancelledTranslations) {
				notify(__('Translation finished.', 'urlslab'), 'success');
				return;
			}
			if (isCancelledTranslations) {
				// if cancelled translation, show only final number of translation, do not show partial result for every batch
				notify(
					sprintf(
						/* translators: 1: number of successful translations, 2: total rows for translation */
						__('%1$d of %2$d translated.', 'urlslab'),
						results.length,
						rows.length,
					)
				);
			}
		}

	}
});
