import React, { useContext, useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';

import { InputField, TextArea } from '../elements/JSXElements';
import { AppContext } from '../app/context';
import GenericDropdown from '../elements/GenericDropdown';
import UrlsList from './UrlsList';
import PromptTemplateList from './PromptTemplateList.tsx';
import { PromptTemplateListItem } from '../app/types.ts';
import promptTemplates from '../app/data/promptTemplates.json';

const MainSettings: React.FC = () => {
	const { state, dispatch } = useContext( AppContext );
	const promptTemplateActiveState = useState( false );
	const urlFilterActiveState = useState( false );

	return (
		<div className="urlslab-popup-content-main-settings flex flex-column">
			{ /* // Will be used soon in further release.
			<div className="urlslab-popup-content-option-wrapper">
				<SingleSelectMenu
					defaultValue={ state.template }
					onChange={ ( value ) => dispatch( { type: 'template', payload: value } ) }
					name="template"
					items={ {
						item_a: 'First item',
						item_b: 'Second item',
					} }
					autoClose
				>
					{ __( 'Template' ) }
				</SingleSelectMenu>
			</div>
			*/ }
			{
				state.inputText &&
				<div className="urlslab-popup-content-option-wrapper">
					<TextArea
						label={ __( 'Input Text' ) }
						description={ __( 'Text to modify or enhance with your prompt' ) }
						placeholder={ __( 'Type here' ) }
						defaultValue={ state.inputText }
						readonly={ true }
						liveUpdate
						allowResize
					/>
				</div>
			}
			<div className="urlslab-popup-content-option-wrapper">
				<GenericDropdown
					label={ __( 'Prompt Template' ) }
					innerLabel={ __( 'Select a Prompt Template' ) }
					description={ __( 'Select a predefined Prompt Template to use' ) }
					activeState={ promptTemplateActiveState }
				>
					{ promptTemplates.length > 0 && <PromptTemplateList
						promptTemplates={ promptTemplates as PromptTemplateListItem[] }
						toggleActiveState={ () => {
							console.log( 'toggleActiveState' );
							console.log( promptTemplateActiveState[ 1 ] );
							console.log( promptTemplateActiveState[ 0 ] );
							promptTemplateActiveState[ 1 ]( true )
							console.log( promptTemplateActiveState[ 0 ] );
							promptTemplateActiveState[ 1 ]( ! promptTemplateActiveState[ 0 ] )
						}}
					/> }
				</GenericDropdown>
			</div>
			<div className="urlslab-popup-content-option-wrapper">
				<TextArea
					label={ __( 'Prompt' ) }
					description={ __( 'Clear instruction or question to guide the model\'s response.' ) }
					placeholder={ __( 'Type here' ) }
					defaultValue={ state.prompt }
					onChange={ ( value ) => dispatch( { type: 'prompt', payload: value } ) }
					liveUpdate
					allowResize
				/>
			</div>
			<div className="urlslab-popup-content-option-wrapper">
				<InputField
					label={ __( 'Semantic context' ) }
					description={ __( 'Include relevant context for more accurate response filtered from urls in Url filter.' ) }
					placeholder={ __( 'Type here' ) }
					defaultValue={ state.semantic_context }
					onChange={ ( value ) => dispatch( { type: 'semantic_context', payload: value } ) }
					liveUpdate
				/>
			</div>
			<div className="urlslab-popup-content-option-wrapper">
				<GenericDropdown
					label={ __( 'Url filter' ) }
					innerLabel={ __( 'Select or add urls' ) }
					description={ __( 'Select or add urls to fetch data from.' ) }
					activeState={ urlFilterActiveState }
				>
					<UrlsList urls={ state.url_filter } />
				</GenericDropdown>
			</div>
		</div>
	);
};

export default React.memo( MainSettings );
