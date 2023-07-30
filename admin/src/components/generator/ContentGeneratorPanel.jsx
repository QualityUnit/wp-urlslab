import { useI18n } from '@wordpress/react-i18n';
import { memo, useState } from 'react';
import '../../assets/styles/components/_ContentGeneratorPanel.scss';
import { Editor, InputField, SingleSelectMenu } from '../../lib/tableImports';
import Button from '../../elements/Button';

function ContentGeneratorPanel() {
	const { __ } = useI18n();
	const [ generationData, setGenerationData ] = useState( {} );

	const contextTypes = {
		NO_CONTEXT: 'No Context',
		URL_CONTEXT: 'URL Context',
		DOMAIN_CONTEXT: 'Domain Context',
		SERP_CONTEXT: 'Serp Context',
	};

	return (
		<div className="urlslab-content-gen-panel">
			<div className="urlslab-content-gen-panel-control">
				<h2>Content Generator</h2>
				<div className="urlslab-content-gen-panel-control-item">
					<InputField
						liveUpdate
						defaultValue=""
						description={ __( 'The Topic you want to generate content about' ) }
						label={ __( 'Topic' ) }
						onChange={ ( val ) => setGenerationData( { ...generationData, topic: val } ) }
						required
					/>
				</div>

				<div className="urlslab-content-gen-panel-control-item">
					<SingleSelectMenu
						key={ generationData.contextType }
						items={ {
							NO_CONTEXT: __( 'No Context' ),
							URL_CONTEXT: __( 'URL Context' ),
							DOMAIN_CONTEXT: __( 'Domain Context' ),
							SERP_CONTEXT: __( 'Serp Context' ),
						} }
						name="context_menu"
						defaultAccept
						autoClose
						defaultValue={ 'NO_CONTEXT' }
						onChange={ ( val ) => setGenerationData( { ...generationData, contextType: val } ) }
					/>
				</div>

				{
					generationData.contextType && generationData.contextType === contextTypes.SERP_CONTEXT && (
						<div className="urlslab-content-gen-panel-control-item">
							<InputField
								liveUpdate
								defaultValue=""
								description={ __( 'The Primary Keyword you are targeting' ) }
								label={ __( 'Keyword to use' ) }
								onChange={ ( val ) => setGenerationData( { ...generationData, topic: val } ) }
							/>
							<Button active>Find Relevant Keywords</Button>
						</div>
					)
				}

			</div>
			<div className="urlslab-content-gen-panel-editor">
				<Editor onChange={ ( val ) => console.log( val ) } />
			</div>
		</div>
	);
}

export default memo( ContentGeneratorPanel );
