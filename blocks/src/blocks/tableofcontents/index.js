import { registerBlockType } from '@wordpress/blocks';

import Edit from './edit';
import metadata from './block.json';
import { title } from '@wordpress/icons';

registerBlockType( metadata.name, {
	icon: title,
	edit: Edit,
	save: () => {
		return null;
	},
} );
