import { useEffect, useMemo, useState } from 'react';
import { getFetch } from '../../api/fetching';
import ModuleViewHeaderBottom from '../../components/ModuleViewHeaderBottom';
import Table from '../../components/TableComponent';
import { createColumnHelper } from '@tanstack/react-table';
import { startCase } from '../../lib/startCase';
import { useI18n } from '@wordpress/react-i18n';
import ModuleViewHeader from '../../components/ModuleViewHeader';
import Button from '../../elements/Button';
import { useSelectableItems } from '../../hooks/useSelectableItems';
import { useQuery } from '@tanstack/react-query';
import AllCapabilities from '../../components/AllCapabilities';
import SelectedCapabilities from '../../components/SelectedCapabilities';
import ActionsBar from '../../components/ActionsBar';
import EditRole from '../../components/EditRole';

//constant
const roleSlug = 'permission/role';
const userSlug = 'permission/user';
const capSlug = 'permission/capability';

const header = {
	name: 'Name',
	modules: 'Allowed',
};

const tableMenu = new Map( [ [ 'Capabilities', 'Users' ] ] );
const columnHelper = createColumnHelper();
const columns = [
	columnHelper.accessor( 'Role' ),
	columnHelper.accessor( 'Capabilities' ),
	columnHelper.accessor( 'User' ),
];

export default function RolesTable() {
	const [ activeSection, setActiveSection ] = useState( 'capabilities' );
	const [ selectedRowData, setSelectedRowData ] = useState( {} );
	const [ filterBy, setFilterBy ] = useState( {} );
	const [ caps, setCaps ] = useState( [] );
	const { items, toggleSelectItem } = useSelectableItems( {
		identifierKey: 'capabilitySlug',
		initialItems: selectedRowData.CapabilitiesItem,
	} );
	const { __ } = useI18n();
	const { data: rolesData, isLoading: rolesLoading } = useQuery( {
		queryKey: [ 'roles' ],
		queryFn: async () => {
			const roleRes = await getFetch( roleSlug );
			const roleData = await roleRes.json();
			return roleData;
		},
		refetchOnWindowFocus: false,
	} );

	const { data: usersData } = useQuery( {
		queryKey: [ 'users' ],
		queryFn: async () => {
			const userRes = await getFetch( userSlug );
			const userData = await userRes.json();
			return userData;
		},
		refetchOnWindowFocus: false,
	} );

	const normalizeTableData = useMemo( () => {
		if ( rolesData && usersData ) {
			const data = rolesData.reduce( ( acc, cur ) => {
				acc = [
					...acc,
					{
						Role: cur.role.name,
						Capabilities: Object.keys( cur.role.capabilities ).length,
						User: usersData.filter( ( it ) => it.roles[ 0 ] === cur.role_key ).length,
						RoleKey: cur.role_key,
						CapabilitiesItem: Object.keys( cur.role.capabilities ).reduce(
							( accCap, curCap ) => {
								accCap = [
									...accCap,
									{
										capabilityName: startCase( curCap ),
										isSelected: cur.role.capabilities[ curCap ],
										capabilitySlug: curCap,
									},
								];
								return accCap;
							},
							[]
						),
					},
				];
				return acc;
			}, [] );
			setSelectedRowData( data[ 0 ] );
			return data;
		} return [];
	}, [ rolesData, usersData ] );

	const getCapabilities = async () => {
		const capRes = await getFetch( capSlug );
		const capData = await capRes.json();
		const normalizeCapList = capData.reduce( ( acc, cur ) => {
			acc = [
				...acc,
				{
					capabilityName: startCase( cur.capability ),
					capabilitySlug: cur.capability,
				},
			];
			return acc;
		}, [] );

		setCaps( normalizeCapList );
	};

	useEffect( () => {
		getCapabilities();
	}, [] );

	const handleFiltering = ( { input, type } ) => {
		let inputValue = input;
		if ( typeof input === 'string' ) {
			inputValue = input.toLowerCase();
		}

		setFilterBy( ( filter ) => {
			return { ...filter, [ type ]: inputValue };
		} );
	};

	return (
		<>
			<ModuleViewHeaderBottom
				noColumnsMenu
				noExport
				noImport
				noFiltering
				noCount
				hideActions
				options={ { header, notWide: true, title: 'Add new role', id: 'name' } }
			/>
			<div className="roles-layout">
				{ rolesData && usersData ? (
					<Table
						className="fadeInto"
						slug={ roleSlug }
						columns={ columns }
						data={ ! rolesLoading ? normalizeTableData : [] }
						getRowExtraProps={ ( row, rows ) => {
							return {
								onClick: () => {
									row.toggleSelected();
									setSelectedRowData( row.original );
									rows.map( ( item ) => {
										if ( item.getIsSelected() && item.id !== row.id ) {
											item.toggleSelected();
										}
									} );
								},
							};
						} }

					/>
				) : null }

				<div className="urlslab-role-details">
					<EditRole />
					<ModuleViewHeader
						moduleMenu={ tableMenu }
						noSettings
						activeMenu={ ( activemenu ) => setActiveSection( activemenu ) }
					/>
					<ActionsBar
						selectedCapCount={ items.length }
						totalCap={ caps.length || 0 }
						handleFiltering={ handleFiltering }
					/>
					<div className="urlslab-selection-details">
						<SelectedCapabilities
							selectedItems={ items }
							toggleSelectItem={ toggleSelectItem }
						/>

						<AllCapabilities data={ caps || [] } />
					</div>

					<div className="urlslab-all-capabilities-footer">
						<Button className="urlslab-button" active>
							{ __( 'Save role' ) }
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
