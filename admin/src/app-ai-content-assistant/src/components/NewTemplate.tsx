import React, { useContext, useState } from 'react';
import { __ } from '@wordpress/i18n';

import { Button, InputField, SingleSelectMenu, TextArea } from '../elements/JSXElements';
import { AppContext } from '../app/context';
import GenericDropdown from '../elements/GenericDropdown';
import UrlsList from './options/UrlsList';

import { ReactComponent as StarsIcon } from '../assets/images/icons/icon-stars.svg';
import { ReactComponent as ArrowsOuterIcon } from '../assets/images/icons/icon-arrows-direction-outer.svg';
import { ReactComponent as ArrowsInsideIcon } from '../assets/images/icons/icon-arrows-direction-inside.svg';

//import '../assets/styles/components/_GeneratedResult.scss';

const NewTemplate: React.FC = () => {
	const [ templateName, setTemplateName ] = useState( '' );
	return (
		<div className="urlslab-NewTemplate flex flex-column">

			<div className="urlslab-NewTemplate-header">
				<div className="urlslab-NewTemplate-header-title">{ __( 'New template name' ) }</div>
			</div>

			<InputField
				placeholder={ __( 'Type here' ) }
				description={ __( 'Explanation' ) }
				defaultValue={ templateName }
				onChange={ ( value ) => setTemplateName( value as string ) }
			/>

			<div className="urlslab-NewTemplate-submit-section flex flex-justify-end">
				<Button
					className=""
					onClick={ () => console.log( 'generate' ) }
				>
					{ __( 'Save settings as new template' ) }
				</Button>
				<Button
					className=""
					onClick={ () => console.log( 'generate' ) }
					active
				>
					{ __( 'Use text' ) }
				</Button>
			</div>
		</div>
	);
};

export default React.memo( NewTemplate );
