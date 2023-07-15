import Button from '../elements/Button';
import InputField from '../elements/InputField';
import { ReactComponent as EditIcon } from '../assets/images/icons/icon-edit.svg';
import '../assets/styles/layouts/_Roles.scss';
import { useI18n } from '@wordpress/react-i18n';

export default function EditRole() {
	const { __ } = useI18n();
	return (
		<div className="urlslab-edit-container">
			<h3>{ __( 'Edit role' ) }:</h3>
			<InputField className="urlslab-edit-container-input" />
			<Button>
				<EditIcon /> { __( 'Edit name' ) }
			</Button>
			<Button className="simple">{ __( 'Copy role' ) }</Button>
		</div>
	);
}
