import React, { memo, useCallback, useContext } from 'react';
import { PromptTemplateListItem } from '../app/types.ts';
import { AppContext } from '../app/context.ts';
import '../assets/styles/components/_SingleChoiceDropdown.scss';

interface PromptTemplateListProps {
	promptTemplates: PromptTemplateListItem[];
	toggleActiveState: () => void;
}

const PromptTemplateList: React.FC<PromptTemplateListProps> = ( { promptTemplates, toggleActiveState } ) => {
	const { state, dispatch } = useContext( AppContext );
	const promptTemplateList = [ { id: 0, name: 'No Prompt Template', promptTemplate: '' }, ...promptTemplates ];

	const updatePromptTemplate = useCallback( ( promptTemplate: PromptTemplateListItem ) => {
		console.log( promptTemplate );
		dispatch( {
			type: 'promptTemplate',
			payload: promptTemplate.promptTemplate,
		} );
		toggleActiveState();
	}, [ dispatch ] );

	return (
		<div className="urlslab-SingleChoiceList">
			{ promptTemplateList.length > 0 &&
			<div className="urlslab-SingleChoiceList-items flex flex-column">
				{ promptTemplateList.map( ( item ) => {
					return (
						<div
							className="urlslab-SingleChoiceList-items-item flex flex-justify-space-between flex-align-center"
							key={ `prompt-template-list-item-${ item.id }` }
							onClick={ () => updatePromptTemplate( item ) }
						>
							{ item.name }
						</div>
					);
				} ) }
			</div>
			}
		</div>

	);
};

export default memo( PromptTemplateList );
