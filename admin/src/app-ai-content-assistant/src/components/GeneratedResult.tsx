import React, { useContext } from 'react';
import { __ } from '@wordpress/i18n';

import { Button, SingleSelectMenu, TextArea } from '../elements/JSXElements';
import { AppContext } from '../app/context';
import GenericDropdown from '../elements/GenericDropdown';
import UrlsList from './options/UrlsList';

import { ReactComponent as StarsIcon } from '../assets/images/icons/icon-stars.svg';
import { ReactComponent as ArrowsOuterIcon } from '../assets/images/icons/icon-arrows-direction-outer.svg';
import { ReactComponent as ArrowsInsideIcon } from '../assets/images/icons/icon-arrows-direction-inside.svg';

import '../assets/styles/components/_GeneratedResult.scss';

const fakeText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const GeneratedResult: React.FC = () => {
	return (
		<div className="urlslab-GeneratedResult flex flex-column">
			<TextArea
				label={ __( 'Generated text' ) }
				rows={ 11 }
				defaultValue={ fakeText }
			/>
			<div className="urlslab-GeneratedResult-action-buttons">
				<Button
					className=""
					onClick={ () => console.log( 'generate' ) }
				>
					<StarsIcon />
					{ __( 'Fix spelling & grammar' ) }
				</Button>
				<Button
					className=""
					onClick={ () => console.log( 'generate' ) }
				>
					<ArrowsOuterIcon />
					{ __( 'Make it longer' ) }
				</Button>
				<Button
					className=""
					onClick={ () => console.log( 'generate' ) }
				>
					<ArrowsInsideIcon />
					{ __( 'Make it shorter' ) }
				</Button>
			</div>
			<div className="urlslab-GeneratedResult-submit-section flex flex-justify-end">
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

export default React.memo( GeneratedResult );
