import { useI18n } from '@wordpress/react-i18n/';
import {
	TagsMenu, SingleSelectMenu, LangMenu, InputField, SuggestInputField,
} from '../lib/tableImports';

import useTablePanels from '../hooks/useTablePanels';
import { useMemo, useEffect } from 'react';
import useTableStore from '../hooks/useTableStore';

export default function KeywordsPanel() {
	const { __ } = useI18n();
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );
	const slug = useTableStore( ( state ) => state.activeTable );

	// useEffect( () => {
	// 	useTablePanels.setState( () => (
	// 		{
	// 			rowEditorCells,
	// 		}
	// 	) );
	// }, [] );

	const header = {
		keyword: __( 'Keyword' ),
		urlLink: __( 'Link' ),
		lang: __( 'Language' ),
		kw_priority: __( 'Priority' ),
		urlFilter: __( 'URL filter' ),
		kw_length: __( 'Length' ),
		kwType: __( 'Type' ),
		kw_usage_count: __( 'Usage' ),
		labels: __( 'Tags' ),
	};

	const keywordTypes = useMemo( () => ( {
		M: __( 'Manual' ),
		I: __( 'Imported' ),
		X: __( 'None' ),
	} ), [ __ ] );

	const rowEditorCells = {
		keyword: <InputField liveUpdate autoFocus defaultValue="" label={ header.keyword } onChange={ ( val ) => {
			setRowToEdit( { ...rowToEdit, keyword: val } );
		} } required description={ __( 'Only exact keyword matches will be substituted with a link' ) } />,

		urlLink: <SuggestInputField suggestInput={ rowToEdit?.keyword || '' }
			liveUpdate
			defaultValue={ ( rowToEdit?.urlLink ? rowToEdit?.urlLink : window.location.origin ) }
			label={ header.urlLink }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, urlLink: val } ) }
			required
			showInputAsSuggestion={ true }
			referenceVal="keyword"
			description={ __( 'Destination URL' ) } />,

		kwType: <SingleSelectMenu defaultAccept hideOnAdd autoClose items={ keywordTypes } name="kwType" defaultValue="M" description={ __( 'Select the link type if you only want to modify certain kinds of links in HTML' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, kwType: val } ) }>{ header.kwType }</SingleSelectMenu>,

		kw_priority: <InputField liveUpdate type="number" defaultValue="10" min="0" max="100" label={ header.kw_priority }
			description={ __( 'Input a number between 0 and 100. Lower values indicate higher priority' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, kw_priority: val } ) } />,

		lang: <LangMenu autoClose defaultValue="all"
			description={ __( 'Keywords only apply to pages in the chosen language' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, lang: val } ) }>{ __( 'Language' ) }</LangMenu>,

		urlFilter: <InputField liveUpdate defaultValue=".*"
			description={ __( 'Optionally, you can permit keyword placement only on URLs that match a specific regular expression. Use value `.*` to match all URLs' ) }
			label={ header.urlFilter } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, urlFilter: val } ) } />,

		labels: <TagsMenu optionItem label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, labels: val } ) } />,
	};

	return rowEditorCells;
}
