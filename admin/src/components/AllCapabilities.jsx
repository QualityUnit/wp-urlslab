import { useI18n } from '@wordpress/react-i18n';
import Checkbox from '../elements/Checkbox';

export default function AllCapabilities( props ) {
	const { data } = props;
	const { __ } = useI18n();
	return (
		<div className="urlslab-all-capabilities">
			<p className="urlslab-all-capabilities-header">{ __( 'All capabilities' ) }</p>
			{ data.map( ( item, index ) => (
				<div key={ index } className="urlslab-capability-item" >
					<Checkbox>{ item.capabilityName }</Checkbox>
				</div>
			) ) }
		</div>
	);
}
