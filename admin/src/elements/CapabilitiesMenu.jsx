import { useQueryClient } from '@tanstack/react-query';
import { __ } from '@wordpress/i18n';
import MultiSelectMenu from './MultiSelectMenu';

export default function CapabilitiesMenu( { role, defaultValue, description, onChange } ) {
	const queryClient = useQueryClient();
	const roles = queryClient.getQueryData( [ 'roles' ] );
	const capabilities = roles[ role || Object.keys( roles )[ 0 ] ].capabilities;

	return <MultiSelectMenu className="wide"
		items={ capabilities }
		key={ role }
		defaultValue={ defaultValue || Object.keys( capabilities ) }
		id={ `capabilities-${ role }` }
		description={ description }
		onChange={ ( selectedItems ) => onChange( selectedItems ) }
	>
		{ __( 'Capabilities' ) }
	</MultiSelectMenu>;
}
