import { useState } from 'react';
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 0be67eb26c4155736a6ac5a662c6545495238e7b
import '../assets/styles/elements/_Inputs.scss';

export default function InputField({ defaultValue, placeholder, message, className, type, disabled, label, labelInline, children, style }) {
	const [val, setVal] = useState(defaultValue || '');
<<<<<<< HEAD
=======

export default function InputField({ placeholder, type, disabled, label, labelInline, children, style }) {
	const [val, setVal] = useState('');
>>>>>>> f3e8a22 (fix: merging 1055)
=======
>>>>>>> 0be67eb26c4155736a6ac5a662c6545495238e7b
	const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
	const urlRegex = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#?]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

	const handleVal = (event) => {
		setVal(event.target.value);
	};
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> f3e8a22 (fix: merging 1055)
=======

>>>>>>> 0be67eb26c4155736a6ac5a662c6545495238e7b
	const valueStatus = () => {
		if (val) {
			if ((type === undefined || type === 'text') ||
				(type === 'email' && emailRegex.test(val)) ||
				(type === 'number' && (/[0-9]/i).test(val)) ||
				(type === 'url' && urlRegex.test(val))
			) {
				return 'has-value success';
			}
			return 'has-value error';
		}
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 0be67eb26c4155736a6ac5a662c6545495238e7b
		return '';
	}

	return (
		<label className={`urlslab-inputField-wrap ${className || ''} ${labelInline ? 'inline' : ''} ${valueStatus()}`} style={style}>
			<span className="urlslab-inputField-label">{label}</span>
			<div className={`urlslab-inputField ${children ? 'has-svg' : ''}`} >
<<<<<<< HEAD
=======
	}

	return (
		<label className={`urlslab-inputField-wrap ${labelInline ? 'inline' : ''}`}>
					<span className="urlslab-inputField-label">{label}</span>
					<div className={`urlslab-inputField ${children ? 'has-svg' : ''} ${valueStatus()}`} style={style}>
>>>>>>> f3e8a22 (fix: merging 1055)
						{children}
						<input
							className="urlslab-input input__text"
							type={type}
							defaultValue={val}
							onChange={handleVal}
							placeholder={placeholder}
							disabled={disabled ? 'disabled' : ''}
						/>
					</div>
					{
						message?.length && valueStatus().length
							? <div className="urlslab-inputField-message">{message}</div>
							: null
					}
				</label >
				);
=======
				{children}
				<input
					className="urlslab-input input__text"
					type={type}
					defaultValue={val}
					onChange={handleVal}
					placeholder={placeholder}
					disabled={disabled ? 'disabled' : ''}
				/>
			</div>
			{
				message?.length && valueStatus().length
					? <div className="urlslab-inputField-message">{message}</div>
					: null
			}
		</label >
	);
>>>>>>> 0be67eb26c4155736a6ac5a662c6545495238e7b
}
