import Switch from '../elements/Switch';
import { setModule } from '../api/modules';
import { ReactComponent as ArrowIcon } from "../assets/images/icon-arrow.svg";
import { ReactComponent as ApiIcon } from "../assets/images/api-exclamation.svg";
import "../assets/styles/components/_DashboardModule.scss";
import { useState } from 'react';

export default function DashboardModule({ moduleId, image, isActive, title, hasApi, children }) {
	const [moduleActive, setModuleActive] = useState(isActive ? true : false);
	const [activating, setIsActivating] = useState(false);
	const handleSwitch = () => {
		setIsActivating(true)
		setModule(moduleId, { active: !moduleActive }).then(data => {
			if (data) {
				setModuleActive(data.active)
				setIsActivating(false)
				console.log(data)
			}
		}
		);
	}

	return (
		<div className={`urlslab-dashboardmodule ${activating ? 'activating' : ''} ${moduleActive ? 'active' : ''}`}>
			{hasApi
				? <div className="urlslab-dashboardmodule-api">
					<ApiIcon />
					This module requires API key
				</div>
				: ''
			}
			{activating
				? <div className="urlslab-dashboardmodule-activating">{moduleActive ? 'Dectivating…' : 'Activating…'}</div>
				: ''
			}
			<Switch
				secondary
				onChange={(isActive) => handleSwitch(isActive)}
				className="urlslab-dashboardmodule-switch"
				label="Activate module"
				labelOff="Deactivate module"
				checked={isActive}
			/>
			<div className="urlslab-dashboardmodule-main flex-tablet flex-align-center">
				{image
					? <img className="urlslab-dashboardmodule-image" src={image} alt={title} />
					: null
				}

				<h3 className="urlslab-dashboardmodule-title">{title}</h3>
				<div className="urlslab-dashboardmodule-content">
					<p>{children}</p>
					<div className="urlslab-learnMore">Manage module <ArrowIcon /></div>
				</div>
			</div>
		</div>
	)
}
