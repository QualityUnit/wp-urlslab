import { createContext, memo, useCallback, useEffect, useRef, useState } from 'react';
import { __ } from '@wordpress/i18n';
import Button from '@mui/joy/Button';

import useTablePanels from '../../hooks/useTablePanels';

import Box from '@mui/joy/Box';

import { emptyUrls, preprocessUrls } from '../../lib/serpContentGapHelpers';
import { MainWrapper } from '../styledComponents/gapDetail';
import GapDetailMainSettings from './gapDetailPanelParts/GapDetailMainSettings';
import GapDetailUrlsSettings from './gapDetailPanelParts/GapDetailUrlsSettings';

// option keys that trigger necessary urls preprocess on next options submit
const processingTriggers = [ 'ngrams', 'parse_headers', 'urls' ];

export const maxGapUrls = 15;
export const parseHeadersValues = {
	title: __( 'Title', 'urlslab' ),
	h1: 'H1',
	h2: 'H2',
	h3: 'H3',
	h4: 'H4',
	h5: 'H5',
	h6: 'H6',
	p: __( 'Paragraphs', 'urlslab' ),
};

export const ngramsValues = [ 1, 2, 3, 4, 5 ];
export const ContentGapContext = createContext( {} );

function GapDetailPanel() {
	const preprocessController = useRef( null );
	const setFetchOptions = useTablePanels( ( state ) => state.setFetchOptions );
	const setContentGapOptions = useTablePanels( ( state ) => state.setContentGapOptions );
	const contentGapOptions = useTablePanels( ( state ) => state.contentGapOptions );

	const [ loadingUrls, setLoadingUrls ] = useState( false );

	// handle condition if submit button should be visible after change of options
	const showSubmitButton = useCallback( () => {
		return ! loadingUrls && contentGapOptions.allowUpdateResults && ! emptyUrls( contentGapOptions.urls );
	}, [ contentGapOptions.allowUpdateResults, loadingUrls, contentGapOptions.urls ] );

	// handle update of options and decide if is necesarry run processing before next table update
	const updateOptions = useCallback( ( option ) => {
		let willProcessing = false;
		Object.keys( option ).forEach( ( optionKey ) => {
			if ( processingTriggers.includes( optionKey ) ) {
				willProcessing = true;
			}
		} );
		setContentGapOptions( { ...option, allowUpdateResults: true, willProcessing } );
	}, [ setContentGapOptions ] );

	// update finally prepared options to fetchOptions and render table with new data
	const updateFetchOptions = useCallback( () => {
		let opts = { ...contentGapOptions };

		// remove options not related to api fetch
		delete opts.willProcessing;
		delete opts.allowUpdateResults;
		delete opts.forceUrlsProcessing;
		delete opts.processedUrls;
		delete opts.processingUrls;

		//do not pass empty urls
		opts = { ...opts, urls: Object.values( opts?.urls ).filter( ( url ) => url !== '' ) };
		setFetchOptions( { ...useTablePanels.getState().fetchOptions, ...opts } );
	}, [ contentGapOptions, setFetchOptions ] );

	const runProcessing = useCallback( async () => {
		if ( preprocessController.current ) {
			preprocessController.current.abort();
		}
		preprocessController.current = new AbortController();
		setContentGapOptions( { forceUrlsProcessing: false, processedUrls: {}, processingUrls: true, allowUpdateResults: false, willProcessing: false } );

		const results = await preprocessUrls( {
			urls: contentGapOptions.urls,
			parse_headers: contentGapOptions.parse_headers,
			ngrams: contentGapOptions.ngrams,
		}, 0, preprocessController.current.signal );

		// if prepare query was cancelled by new one, do nothing
		if ( results !== false ) {
			const indexedUrlsList = {};
			Object.entries( results ).forEach( ( [ key, value ] ) => {
				indexedUrlsList[ key ] = value.url;
			} );

			setContentGapOptions( {
				urls: indexedUrlsList,
				processedUrls: results,
				processingUrls: false,
			} );

			updateFetchOptions();
		}
	}, [ contentGapOptions, setContentGapOptions, updateFetchOptions ] );

	const runUpdateResults = useCallback( () => {
		// was updated option used in 'prepare' query, run processing and then update table
		if ( contentGapOptions.willProcessing ) {
			runProcessing();
			return;
		}

		// simply update only table
		setContentGapOptions( { allowUpdateResults: false, willProcessing: false } );
		updateFetchOptions();
	}, [ contentGapOptions.willProcessing, runProcessing, setContentGapOptions, updateFetchOptions ] );

	useEffect( () => {
		if ( contentGapOptions.forceUrlsProcessing ) {
			runProcessing();
		}
	}, [ contentGapOptions.forceUrlsProcessing, runProcessing ] );

	return (
		<ContentGapContext.Provider value={ { loadingUrls, setLoadingUrls, updateOptions } }>
			<Box sx={ ( theme ) => ( { backgroundColor: theme.vars.palette.common.white, padding: '1em 1.625em', borderBottom: `1px solid ${ theme.vars.palette.divider }` } ) }>

				<MainWrapper>
					<GapDetailMainSettings />
					<GapDetailUrlsSettings />
				</MainWrapper>

				{ showSubmitButton() &&
					<Box display="flex" sx={ { paddingTop: '1em' } }>
						<Button
							disabled={ false }
							onClick={ runUpdateResults }
							wider
						>
							{ __( 'Update Results', 'urlslab' ) }
						</Button>
					</Box>
				}
			</Box>
		</ContentGapContext.Provider>
	);
}

export default memo( GapDetailPanel );
