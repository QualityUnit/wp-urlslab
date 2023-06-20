import React from 'react';

import '../assets/styles/elements/_InputWithSlider.scss';

type InputWithSliderType = {
	label: string
	description: string
	value: number
	min?: number
	max?: number
	step?: number
	onChange?: ( event: React.ChangeEvent<HTMLInputElement> ) => void
}
const InputWithSlider: React.FC<InputWithSliderType> = ( {
	label, description, value, min = 0, max, step, onChange,
}: InputWithSliderType ) => {
	return (
		<div className="urlslab-InputWithSlider">
			{ label && <span className="urlslab-inputField-label">{ label }</span> }
			<div className="urlslab-inputWithSlider-controls flex flex-align-center">
				<div className="urlslab-inputField">
					<input className="urlslab-input input__text" type="number" min={ min } max={ max } step={ step } value={ value } onChange={ onChange } />
				</div>
				<input className="urlslab-slider" type="range" min={ min } max={ max } step={ step } value={ value } onChange={ onChange } />
			</div>
			{ description && <p className="urlslab-inputField-description">{ description }</p> }
		</div>
	);
};

export default React.memo( InputWithSlider );
