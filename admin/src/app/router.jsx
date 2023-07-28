import { lazy } from 'react';
import { createHashRouter } from 'react-router-dom';
import AppRoot from '../AppRoot';

const Modules 			= lazy( () => import( '../modules/Modules' ) );
const Cache 			= lazy( () => import( '../modules/Cache' ) );
const CssOptimizer 		= lazy( () => import( '../modules/CssOptimizer' ) );
const CustomHTML 		= lazy( () => import( '../modules/CustomHtml' ) );
const Faq 				= lazy( () => import( '../modules/Faq' ) );
const Generator 		= lazy( () => import( '../modules/Generator' ) );
const ImageAltAttribute = lazy( () => import( '../modules/ImageAltAttribute' ) );
const KeywordsLinks 	= lazy( () => import( '../modules/KeywordsLinks' ) );
const LazyLoading 		= lazy( () => import( '../modules/LazyLoading' ) );
const LinkEnhancer 		= lazy( () => import( '../modules/LinkEnhancer' ) );
const MediaOffloader 	= lazy( () => import( '../modules/MediaOffloader' ) );
const MetaTag 			= lazy( () => import( '../modules/MetaTag' ) );
const Optimize 			= lazy( () => import( '../modules/Optimize' ) );
const Redirects 		= lazy( () => import( '../modules/Redirects' ) );
const RelatedResources 	= lazy( () => import( '../modules/RelatedResources' ) );
const Screenshot 		= lazy( () => import( '../modules/Screenshot' ) );
const SearchAndReplace 	= lazy( () => import( '../modules/SearchAndReplace' ) );
const Serp 				= lazy( () => import( '../modules/Serp' ) );

const Settings 			= lazy( () => import( '../modules/Settings' ) );
const Schedule 			= lazy( () => import( '../modules/Schedule' ) );
const TagsLabels 		= lazy( () => import( '../modules/TagsLabels' ) );

// routes paths are represented by modules IDs

const routes = [
	// main index route
	{
		index: true,
		element: <Modules />,
	},

	// modules routes
	{
		path: 'urlslab-cache',
		element: <Cache />,
	},
	{
		path: 'urlslab-css-optimizer',
		element: <CssOptimizer />,
	},
	{
		path: 'urlslab-custom-html',
		element: <CustomHTML />,
	},
	{
		path: 'faq',
		element: <Faq />,
	},
	{
		path: 'urlslab-generator',
		element: <Generator />,
	},
	{
		path: 'urlslab-image-alt-attribute',
		element: <ImageAltAttribute />,
	},
	{
		path: 'urlslab-keywords-links',
		element: <KeywordsLinks />,
	},
	{
		path: 'urlslab-lazy-loading',
		element: <LazyLoading />,
	},
	{
		path: 'urlslab-link-enhancer',
		element: <LinkEnhancer />,
	},
	{
		path: 'urlslab-media-offloader',
		element: <MediaOffloader />,
	},
	{
		path: 'urlslab-meta-tag',
		element: <MetaTag />,
	},
	{
		path: 'optimize',
		element: <Optimize />,
	},
	{
		path: 'redirects',
		element: <Redirects />,
	},
	{
		path: 'urlslab-related-resources',
		element: <RelatedResources />,
	},
	{
		path: 'urlslab-screenshot',
		element: <Screenshot />,
	},
	{
		path: 'urlslab-search-and-replace',
		element: <SearchAndReplace />,
	},
	{
		path: 'serp',
		element: <Serp />,
	},

	// settings routes
	{
		path: 'settings',
		element: <Settings settingId="general" />,
	},
	{
		path: 'schedule',
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
];

export const router = createHashRouter( [
	{
		path: '/',
		element: <AppRoot />,
		children: routes,
	},
] );
