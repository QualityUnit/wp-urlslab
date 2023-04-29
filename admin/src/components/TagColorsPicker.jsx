import { CompactPicker } from 'react-color';
import '../assets/styles/components/_TagColorsPicker.scss';

export default function TagColorsPicker( { onChange } ) {
	return (
		<div className="urlslab-tagColors">
			<CompactPicker onChangeComplete={ onChange } />
		</div>
	);
}
