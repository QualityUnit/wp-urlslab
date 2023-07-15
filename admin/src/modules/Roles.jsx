// eslint-disable-next-line import/no-extraneous-dependencies

import { Suspense, lazy, useState } from 'react';

import '../assets/styles/layouts/_Roles.scss';

import ModuleViewHeader from '../components/ModuleViewHeader';

export default function Roles( { moduleId } ) {
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const slug = 'roles';

	const RolesTable = lazy( () => import( `../tables/roles/RolesTable.jsx` ) );
	const UserTable = lazy( () => import( `../tables/roles/UserTable.jsx` ) );

	const tableMenu = new Map( [
		[ slug, 'Roles' ],
		[ 'user', 'Users' ],
	] );

	return (
		<div className="urlslab-roles">
			<ModuleViewHeader
				moduleId={ moduleId }
				moduleMenu={ tableMenu }
				noSettings
				activeMenu={ ( activemenu ) => setActiveSection( activemenu ) }
			/>
			{ activeSection === slug && (
				<div className="urlslab-tableView">
					<Suspense>
						<RolesTable />
					</Suspense>
				</div>
			) }
			{ activeSection === 'user' && (
				<div className="urlslab-tableView">
					<Suspense>
						<UserTable />
					</Suspense>
				</div>
			) }
		</div>
	);
}
