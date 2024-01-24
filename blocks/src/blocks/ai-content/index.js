import { registerBlockType } from '@wordpress/blocks';

import Edit from './edit';
import metadata from './block.json';
import BlockIcon from './BlockIcon';

registerBlockType( metadata.name, {
	icon: BlockIcon,
	edit: Edit,
	save: () => {
		return null;
	},
} );
