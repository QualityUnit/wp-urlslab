import { useEffect, useState, useRef } from 'react';
import encoding from 'encoding';
import Checkbox from './Checkbox';

import '../assets/styles/elements/_FilterMenu.scss';

export default function SortMenu({
	className, name, style, children, filterItems, filteredItems,
}) {
	const [isActive, setActive] = useState(false);
	const [isVisible, setVisible] = useState(false);
	const [checked, setChecked] = useState([]);
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

	const checkedCheckbox = (target, isChecked) => {
		if (isChecked) {
			setChecked([...checked, target]);
		}
		if (!isChecked) {
			setChecked(checked.filter((item) => item !== target));
		}
	};

	// filteredItems(checked);

	const handleMenu = () => {
		setActive(!isActive);

		setTimeout(() => {
			setVisible(!isVisible);
		}, 100);
	};

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
				<div className={`urlslab-FilterMenu__items--inn ${items.length > 8 ? 'has-scrollbar' : ''}`}>
					{items.map((val) => {
						const id = val.replace(/(\s+|[0-9])/g, '').toLowerCase();
						encoding.convert(val, 'Latin_1');

						return (
							<Checkbox
								className="urlslab-FilterMenu__item"
								key={id}
								id={id}
								onClick={checkedCheckbox}
								name={name}
								radial
							>
								{val}
							</Checkbox>
						);
					})}
				</div>
			</div>
		</div>
	);
}
