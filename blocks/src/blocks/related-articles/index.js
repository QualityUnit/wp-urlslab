import { registerBlockType } from '@wordpress/blocks';

import Edit from './edit';
import metadata from './block.json';
import { pages } from '@wordpress/icons';

registerBlockType( metadata.name, {
	icon: pages,
	edit: Edit,
	save: () => {
		return null;
	},
} );
