import { registerBlockType } from '@wordpress/blocks';

import Edit from './edit';
import metadata from './block.json';
import { postComments } from '@wordpress/icons';

registerBlockType( metadata.name, {
	icon: postComments,
	edit: Edit,
	save: () => {
		return null;
	},
} );
