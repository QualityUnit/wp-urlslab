import { createElement, lazy } from 'react';
import { createHashRouter } from 'react-router-dom';
import AppRoot from '../AppRoot';

import modulesList from './generatedModulesList.json';

// manually created static routes
const Modules = lazy( () => import( '../modules/static/Modules' ) );
const Settings = lazy( () => import( '../modules/static/Settings' ) );
const Schedule = lazy( () => import( '../modules/static/Schedule' ) );
const TagsLabels = lazy( () => import( '../modules/static/TagsLabels' ) );

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
	},
	{
		path: 'TagsLabels',
		element: <TagsLabels />,
	},

	// 404 route
	{
		path: '*',
		element: <Modules />,
	},

	// generated modules routes
	...modulesRoutes,
];

export const router = createHashRouter( [
	{
		path: '/',
		element: <AppRoot />,
		children: routes,
	},
] );
