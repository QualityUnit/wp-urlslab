import { useCallback, useEffect, useState, useRef } from 'react';

import '../assets/styles/elements/_FilterMenu.scss';
import '../assets/styles/elements/_RangeSlider.scss';

export default function RangeSlider({
	className, style, min, max, onChange, unit, children, filterItems, filteredItems,
}) {
	const [isActive, setActive] = useState(false);
	const [isVisible, setVisible] = useState(false);
	const [minimum, setMin] = useState(min);
	const [maximum, setMax] = useState(max);
	const minValRef = useRef(null);
	const maxValRef = useRef(null);
	const range = useRef(null);
	const ref = useRef(null);
	let items = {};

	if (filterItems) {
		items = Object.values(filterItems);
	}

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (!ref.current?.contains(event.target)) {
				setActive(false);
				setVisible(false);
			}
		};
		document.addEventListener('click', handleClickOutside, true);
	});

	// filteredItems(checked);

	// Convert to percentage
	const getPercent = useCallback(
		(value) => Math.round(((value - min) / (max - min)) * 100),
		[min, max]
	);

	const handleMenu = () => {
		setActive(!isActive);

		setTimeout(() => {
			setVisible(!isVisible);
		}, 100);
	};

	const handleMin = (event) => {
		const value = Math.min(+event.target.value, maximum - 1);
		setMin(value);
		minValRef.current.value = value.toString();
	}

	const handleMax = (event) => {
		const value = Math.max(+event.target.value, minimum - 1);
		setMax(value);
		maxValRef.current.value = value.toString();
	}

	// Set width of the range to decrease from the left side
	useEffect(() => {
		if (maxValRef.current) {
			const minPercent = getPercent(minimum);
			const maxPercent = getPercent(+maxValRef.current.value); // Precede with '+' to convert the value from type string to type number

			if (range.current) {
				range.current.style.left = `${minPercent}%`;
				range.current.style.width = `${maxPercent - minPercent}%`;
			}
		}
	}, [minimum, getPercent]);

	// Set width of the range to decrease from the right side
	useEffect(() => {
		if (minValRef.current) {
			const minPercent = getPercent(+minValRef.current.value);
			const maxPercent = getPercent(maximum);

			if (range.current) {
				range.current.style.width = `${maxPercent - minPercent}%`;
			}
		}
	}, [maximum, getPercent]);

	// Get min and max values when their state changes
	useEffect(() => {
		onChange({ min: minimum, max: maximum });
	}, [minimum, maximum, onChange]);

	return (
		<div className={`urlslab-FilterMenu ${className || ''}`} style={style} ref={ref}>
			<div
				className={`urlslab-FilterMenu__title ${isActive ? 'active' : ''}`}
				onClick={handleMenu}
				onKeyUp={(event) => handleMenu(event)}
				role="button"
				tabIndex={0}
			>
				{children}
			</div>
			<div className={`urlslab-FilterMenu__items ${isActive ? 'active' : ''} ${isVisible ? 'visible' : ''}`}>
				<div className={`urlslab-FilterMenu__items--inn urlslab-rangeslider ${items.length > 8 ? 'has-scrollbar' : ''}`}>
					<div className='urlslab-rangeslider-top'>
						<input
							type="range"
							min={min}
							max={max}
							value={minimum}
							ref={minValRef}
							onChange={(event) => handleMin(event)}
							className="urlslab-rangeslider-thumb urlslab-rangeslider-thumb-min"
						/>
						<input
							type="range"
							min={min}
							max={max}
							value={maximum}
							ref={maxValRef}
							onChange={(event) => handleMax(event)}
							className="urlslab-rangeslider-thumb urlslab-rangeslider-thumb-max"
						/>
						<div className="urlslab-rangeslider-slider">
							<div className="urlslab-rangeslider-track"></div>
							<div ref={range} className="urlslab-rangeslider-range"></div>
						</div>
					</div>
					<div className="urlslab-rangeslider-inputs">
						<label className="urlslab-inputField dark-text" data-unit={unit}>
							<input className="urlslab-input" type="number" min={min} max={max} ref={minValRef} value={minimum} onChange={(event) => handleMin(event)} />
						</label>
						—
						<label className="urlslab-inputField dark-text" data-unit={unit}>
							<input className="urlslab-input" type="number" min={min} max={max} ref={maxValRef} value={maximum} onChange={(event) => handleMax(event)} />
						</label>
					</div>
				</div>
			</div>
		</div>
	);
}
