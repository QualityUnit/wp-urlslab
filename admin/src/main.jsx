import React from 'react';
import { render } from '@wordpress/element';
import Modules from './Modules';
import './assets/styles/common/global.scss';

render(
	<React.StrictMode>
		<Modules />
	</React.StrictMode>,
	document.getElementById( 'urlslab-settings' ),
);
