import { HslColorPicker } from 'react-colorful';
import '../assets/styles/components/_ColorPicker.scss';

export default function ColorPicker( { onChange } ) {
	const defaultColors = [ '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b' ];
	return (
		<div className="urlslab-colorPicker">
			<HslColorPicker color={ defaultColors[ 0 ] } onChange={ onChange } />
			<div className="urlslab-colorPicker-swatches">
				{ defaultColors.map( ( defaultColor ) => (
					<button
						key={ defaultColor }
						className="urlslab-colorPicker-swatch"
						style={ { background: defaultColor } }
						onClick={ () => onChange( defaultColor ) }
					/>
				) ) }
			</div>
		</div>
	);
}
