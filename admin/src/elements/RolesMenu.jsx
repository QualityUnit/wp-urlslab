import { useQueryClient } from '@tanstack/react-query';
import { __ } from '@wordpress/i18n';
import SingleSelectMenu from './SingleSelectMenu';

export default function RolesMenu( { defaultValue, noLabel, disabled, description, onChange } ) {
	const queryClient = useQueryClient();
	let roles = { none: { name: 'None', capabilities: {} } };
	const rolesFromQuery = queryClient.getQueryData( [ 'roles' ] );
	roles = { ...roles, ...rolesFromQuery };

	const roleNames = Object.fromEntries( Object.keys( roles ).map( ( key ) => ( [ key, roles[ key ].name ] ) ) );

	return <SingleSelectMenu disabled={ disabled } description={ description } items={ roleNames } name="roles" autoClose defaultValue={ ( ! disabled && defaultValue ) || 'none' } onChange={ ( val ) => onChange( val === 'none' ? '' : val ) }>{ ! noLabel && __( 'Roles', 'urlslab' ) }</SingleSelectMenu>;
}
