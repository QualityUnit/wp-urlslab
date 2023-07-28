import usePrefetchQueries from './queries/usePrefetchQueries';
import MainMenu from './components/MainMenu';
import Header from './components/Header';
import DynamicModule from './components/DynamicModule';

const AppRoot = () => {
	usePrefetchQueries();
	return <>
		<MainMenu />
		<div className="urlslab-app-main">
			<Header />
			<DynamicModule />
		</div>
	</>;
};

export default AppRoot;
