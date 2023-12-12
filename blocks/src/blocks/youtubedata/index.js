import { registerBlockType } from '@wordpress/blocks';

import Edit from './edit';
import metadata from './block.json';
import { video } from '@wordpress/icons';

registerBlockType( metadata.name, {
	icon: video,
	edit: Edit,
	save: () => {
		return null;
	},
} );
