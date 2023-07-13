import Header from './Header';
import Content from './Content';

import '../assets/styles/layouts/_Onboarding.scss';

const Onboarding = () => {
	return (
		<div className="urlslab-onboarding flex flex-column limit">
			<Header />
			<Content />
		</div>
	);
};

export default Onboarding;

