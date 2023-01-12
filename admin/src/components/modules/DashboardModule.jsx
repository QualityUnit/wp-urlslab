import { ReactComponent as Info } from '../../assets/info.svg';

export default function DashboardModule({ type }) {

	return (
		<div className="DashboardModule">
			<Info />
			{type}
			Gule
		</div>
	)
}
