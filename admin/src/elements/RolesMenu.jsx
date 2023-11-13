import { useQueryClient } from '@tanstack/react-query';
import { __ } from '@wordpress/i18n';
import SingleSelectMenu from './SingleSelectMenu';

export default function RolesMenu( { defaultValue, description, onChange } ) {
	const queryClient = useQueryClient();
	const roles = queryClient.getQueryData( [ 'roles' ] );

	const roleNames = Object.fromEntries( Object.keys( roles ).map( ( key ) => ( [ key, roles[ key ].name ] ) ) );

	return <SingleSelectMenu description={ description } items={ roleNames } name="roles" autoClose defaultValue={ defaultValue || Object.keys( roles )[ 0 ] } onChange={ ( val ) => onChange( val ) }>{ __( 'Roles' ) }</SingleSelectMenu>;
}
