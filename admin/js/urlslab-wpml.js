const { __, _n, sprintf } = wp.i18n;

window.addEventListener('load', () => {
	if (typeof window.WPML_TM !== 'undefined' && typeof window.WPML_TM.editorJobFieldView !== 'undefined') {
		let runningTranslations = {};
		const ROW_SELECTORS = ".wpml-form-row, .wpml-form-row-nolabel";

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



		buttonsContainer.append(
			createSeparator(),
			completeAllTranslationsButton,
			undoAllTranslationsButton,
			createSeparator(),
			translateEmptyBtn,
			translateNotCompleteBtn,
			translateAllButton
		);

		// Creating separate Translate buttons
		copyBtns.forEach((btnCopy) => {
			const parent = btnCopy.parentNode;
			const row = btnCopy.closest(ROW_SELECTORS);

			btnCopy.style.cssText = "width: 40px;";
			const btnsWrapper = document.createElement('div');
			btnsWrapper.classList.add('translateButtons');
			btnsWrapper.style.cssText = 'display: inline-flex; flex-direction: column;';

			const btnTranslate = document.createElement('button');
			btnTranslate.innerText = __('Translate', 'urlslab');
			btnTranslate.classList.add('runTranslation');
			btnTranslate.style.cssText = 'margin-bottom: 1em; cursor: pointer;';
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

				return { row, rowId, origFieldValue, translateField: tinymceTransId, isTranslated, isCompleteCheckbox };
			}

			const translateField = row.querySelector('.translated_value');

			if (translateField.value) {
				isTranslated = true;
			}

			return { row, rowId, origFieldValue: orig.value, translateField, isTranslated, isCompleteCheckbox };
		}

		// run translation only for empty not translated fields
		async function translateAllEmpty() {
			resetRunningTranslation();
			const allRows = document.querySelectorAll(ROW_SELECTORS);
			const rows = [...allRows].filter((row) => {
				const { origFieldValue, isTranslated } = getRowData(row);
				return origFieldValue && !isTranslated;
			});

			if (!rows.length) {
				notify(__('No empty rows for translation.', 'urlslab'), 'error');
				return;
			}
			toggleTranslationButtonsDisable();
			await batchTranslate(rows).then((results) => {
				if (results.filter(r => r?.ok).length) {
					notify(__('Translation finished.', 'urlslab'), 'success');
				}
			});
			toggleTranslationButtonsDisable(false);
		}

		// run translation for all fields not marked as complete
		async function translateAll(translateCompleted = true) {
			resetRunningTranslation();
			const allRows = document.querySelectorAll(ROW_SELECTORS);
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
			await batchTranslate(rows).then((results) => {
				if (results.filter(r => r?.ok).length) {
					notify(__('Translation finished.', 'urlslab'), 'success');
				}
			});
			toggleTranslationButtonsDisable(false);
		}

		// Single row translation
		async function singleTranslate(event) {
			const wpmlRow = event.target.closest(ROW_SELECTORS);
			if (wpmlRow) {
				toggleTranslationButtonsDisable();
				await batchTranslate([wpmlRow]);
				toggleTranslationButtonsDisable(false);
			}
		}

		// Batch translation of rows array
		async function batchTranslate(rows, batchSize = 20, retryDelay = 5000) {
			const results = [];

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
				batch = filterRunningTranslations(batch);

				while (batch.length > 0) {
					const batchResults = await Promise.all(batch.map((rowData) => translate(rowData)));

					// filter success transaltions and add to results
					batchResults.forEach((result) => {
						if (result?.status !== 429 && result?.pending !== true) {
							results.push(result);
						}
					});

					// filter translations which needs to be repeated
					// 429 response or translation in progress
					batch = batchResults
						.filter((result) => {
							if (result?.rowData) {
								return (result?.status === 429 || result?.pending === true) && runningTranslations[result.rowData.rowId] !== undefined
							}
							return (result?.status === 429 || result?.pending === true)

						})
						.map((result) => result?.rowData);

					// batch includes rows to repeat translation, continue after delay
					if (batch.length > 0) {
						message = sprintf(
							/* translators: 1: retry delay in seconds */
							__('Pending translation.<br/>Will retry translation after %1$d seconds.', 'urlslab'),
							retryDelay / 1000
						);
						notify(message);
						await new Promise((resolve) => setTimeout(resolve, retryDelay));

						// filter rows in batch, during waiting could be some rows cancelled
						batch = filterRunningTranslations(batch);
					}
				}

				const successResults = results.filter(r => r?.ok);
				message = sprintf(
					/* translators: 1: number of successful translations, 2: total rows for translation */
					__('%1$d of %2$d translated.', 'urlslab'),
					successResults.length,
					rows.length,
				);
				notify(message);
			}
			return results;
		}

		// select/deselect all checkboxes "Translation is complete"
		function toggleTranslationCompleteCheckboxes(setSelected = false) {
			const allRows = document.querySelectorAll(ROW_SELECTORS);
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

				const { rowId, origFieldValue, translateField, isCompleteCheckbox } = rowData;

				if (origFieldValue === '') {
					return origFieldValue;
				}
				const abortController = new AbortController();
				if (runningTranslations[rowId]) {
					runningTranslations[rowId].abortController = abortController;
				}

				setFieldValue(translateField, __('Translating…', 'urlslab'), rowData);
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
					setFieldValue(translateField, data?.translation || '', rowData);

					//remove success translation form running translations
					if (!data?.pending && runningTranslations[rowData.rowId]) {
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
					window.tinyMCE.get(field).setContent(value);
					return;
				}
				const fieldElm = document.getElementById(field);
				if (fieldElm) {
					fieldElm.value = value;
					return;
				}
			}

			field.value = value;
		}

		function filterRunningTranslations(batch) {
			return batch.filter(rowData => runningTranslations[rowData.rowId] !== undefined);
		}

		function createSeparator() {
			const divSeparator = document.createElement('div');
			divSeparator.style.display = 'inline-block';
			divSeparator.style.marginRight = '20px';

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

		function cancelTranslation(event, _rowData = null) {
			const rowId = event ? event.target.dataset.rowId : _rowData?.rowId;
			const rowData = runningTranslations[rowId]?.rowData

			if (rowData) {
				unsetRunningTranslation(rowData);
				setFieldValue(rowData.translateField, '', rowData);
			}

		}

		function setRunningTranslation(rowData) {
			const rowButtons = rowData.row.querySelector('.translateButtons');
			const buttonRun = rowButtons.querySelector('.runTranslation')
			const buttonCancel = rowButtons.querySelector('.cancelTranslation')

			buttonRun?.classList.add("hidden");
			buttonRun.disabled = true;

			buttonCancel?.classList.remove("hidden");

			runningTranslations[rowData.rowId] = { rowData };
		}

		function unsetRunningTranslation(rowData) {
			if (runningTranslations[rowData.rowId]) {
				runningTranslations[rowData.rowId].abortController?.abort();
				delete runningTranslations[rowData.rowId];
			}
			const rowButtons = rowData.row.querySelector('.translateButtons');
			const buttonRun = rowButtons.querySelector('.runTranslation')
			const buttonCancel = rowButtons.querySelector('.cancelTranslation')

			buttonCancel?.classList.add("hidden");

			buttonRun?.classList.remove("hidden");
			buttonRun.disabled = false;
		}

		function resetRunningTranslation() {
			runningTranslations = {};
		}

		function translationErrorCallback(rowData) {
			toggleTranslationButtonsDisable(false);
			cancelTranslation(undefined, rowData);
		}

	}
});
