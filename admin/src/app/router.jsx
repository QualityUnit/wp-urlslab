import { createElement, lazy, useMemo } from 'react';
import { createHashRouter } from 'react-router-dom';
import AppRoot from '../AppRoot';

import modulesList from './modulesList.json';
import useModulesGroups from '../hooks/useModulesGroups';

// manually created static routes
const Modules = lazy( () => import( '../modules/static/Modules' ) );
const Settings = lazy( () => import( '../modules/static/Settings' ) );
const Schedule = lazy( () => import( '../modules/static/Schedule' ) );
const TagsLabels = lazy( () => import( '../modules/static/TagsLabels' ) );
const Page404 = lazy( () => import( '../modules/static/Page404' ) );

// routes generated on the base of modules files available in ./modules folder
const modulesRoutes = modulesList.map( ( ( moduleName ) => {
	const element = createElement( lazy( () => import( `../modules/${ moduleName }.jsx` ) ) );
	return {
		path: moduleName,
		element,
		children: [
			{
				path: ':section',
				element,
			},
		],
	};
} ) );

const routes = [
	// main index route
	{
		index: true,
		element: <Modules />,
	},

	// settings routes
	{
		path: 'Settings',
		element: <Settings settingId="general" />,
	},
	{
		path: 'Schedule',
		element: <Schedule />,
		children: [
			{
				path: ':section',
				element: <Schedule />,
			},
		],
	},
	{
		path: 'TagsLabels',
		element: <TagsLabels />,
	},

	// 404 route
	{
		path: '*',
		element: <Page404 />,
	},

	// generated modules routes
	...modulesRoutes,
];

const useRouter = () => {
	const groups = useModulesGroups();
	const r = useMemo( () => {
		const groupsRoutes = Object.keys( groups ).map( ( groupRoute ) => ( {
			path: groupRoute,
			element: <Modules />,
		} ) );

		return [
			{
				path: '/',
				element: <AppRoot />,
				children: [ ...routes, ...groupsRoutes ],
			},
		];
	}, [ groups ] );

	return createHashRouter( r );
};

export default useRouter;
