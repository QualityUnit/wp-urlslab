import { Suspense, lazy, memo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { __ } from '@wordpress/i18n';

import WebVitalsOverview from '../overview/WebVitals';
import ModuleViewHeader from '../components/ModuleViewHeader';
import useModuleSectionRoute from '../hooks/useModuleSectionRoute';
import { getMapKeysArray } from '../lib/helpers';

import WebVitalsTable from '../tables/WebVitalsTable';
import WebVitalsCharts from '../charts/WebVitalsCharts.jsx';
import TablePanel from '../components/TablePanel.jsx';
import SvgIcon from '../elements/SvgIcon';

import ButtonGroup from '@mui/joy/ButtonGroup';
import Button from '@mui/joy/Button';

const SettingsModule = lazy( () => import( `./static/Settings.jsx` ) );

export default function WebVitals() {
	const { moduleId } = useOutletContext();

	const tableMenu = new Map( [
		[ 'web-vitals', __( 'Web Vitals Logs', 'urlslab' ) ],
	] );

	const activeSection = useModuleSectionRoute( [
		'overview',
		'settings',
		...getMapKeysArray( tableMenu ),
	] );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader
				moduleId={ moduleId }
				moduleMenu={ tableMenu }
				activeSection={ activeSection }
			/>
			{
				activeSection === 'overview' &&
				<WebVitalsOverview moduleId={ moduleId } />
			}
			{
				activeSection === 'web-vitals' &&
				<Suspense>
					<WebVitalsLogs />
				</Suspense>
			}
			{
				activeSection === 'settings' &&
				<Suspense>
					<SettingsModule className="fadeInto" settingId={ moduleId } />
				</Suspense>
			}
		</div>
	);
}

const WebVitalsLogs = memo( ( ) => {
	const [ showTable, setShowTable ] = useState( false );

	return (
		<>

			<TablePanel
				title={ showTable ? __( 'Web Vitals table', 'urlslab' ) : __( 'Web Vitals charts', 'urlslab' ) }
				actionButtons={
					<ButtonGroup size="sm">
						<Button
							variant={ showTable ? 'outlined' : 'solid' }
							color="primary"
							onClick={ () => setShowTable( false ) }
							startDecorator={ <SvgIcon name="chart" /> }
						>
							{ __( 'Charts', 'urlslab' ) }
						</Button>
						<Button
							variant={ showTable ? 'solid' : 'outlined' }
							color="primary"
							onClick={ () => setShowTable( true ) }
							startDecorator={ <SvgIcon name="table" /> }
						>
							{ __( 'Table', 'urlslab' ) }
						</Button>
					</ButtonGroup>
				}
				noContentPadding={ showTable }
			>
				{ showTable
					? <WebVitalsTable slug="web-vitals" />
					:	<WebVitalsCharts slug="web-vitals" />

				}

			</TablePanel>
		</>

	);
} );
