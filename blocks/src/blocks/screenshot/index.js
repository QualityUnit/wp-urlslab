import { registerBlockType } from '@wordpress/blocks';

import Edit from './edit';
import metadata from './block.json';
import { image } from '@wordpress/icons';

registerBlockType( metadata.name, {
	icon: image,
	edit: Edit,
	save: () => {
		return null;
	},
} );
