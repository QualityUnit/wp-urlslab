import { useEffect, useMemo, useState } from 'react';
import { getFetch } from '../../api/fetching';
import ModuleViewHeaderBottom from '../../components/ModuleViewHeaderBottom';
import Table from '../../components/TableComponent';
import { createColumnHelper } from '@tanstack/react-table';
import { startCase } from '../../lib/startCase';
import SearchField from '../../elements/SearchField';
import { useI18n } from '@wordpress/react-i18n';
import ModuleViewHeader from '../../components/ModuleViewHeader';
import Button from '../../elements/Button';
import { ReactComponent as PlusIcon } from '../../assets/images/icons/icon-plus.svg';
import Checkbox from '../../elements/Checkbox';
import InputField from '../../elements/InputField';
import { useSelectableItems } from '../../hooks/useSelectableItems';
import { useQuery } from '@tanstack/react-query';

//constant
const roleSlug = 'permission/role';
const userSlug = 'permission/user';
const capSlug = 'permission/capability';

const header = {
  name: 'Name',
  modules: 'Allowed',
};

const tableMenu = new Map([['Capabilities', 'Users']]);
const columnHelper = createColumnHelper();
const columns = [columnHelper.accessor('Role'), columnHelper.accessor('Capabilities'), columnHelper.accessor('User')];

export default function RolesTable() {
  const [activeSection, setActiveSection] = useState('capabilities');
  const [selectedRowData, setSelectedRowData] = useState({});
  const [filterBy, setFilterBy] = useState({});
  const [caps, setCaps] = useState([]);
  const { items, toggleSelectItem } = useSelectableItems({
    identifierKey: 'capabilitySlug',
    initialItems: selectedRowData.CapabilitiesItem,
  });
  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const roleRes = await getFetch(roleSlug);
      const roleData = await roleRes.json();
      console.log('role', roleData);
      return roleData;
    },
    refetchOnWindowFocus: false,
  });
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const userRes = await getFetch(userSlug);
      const userData = await userRes.json();
      return userData;
    },
    refetchOnWindowFocus: false,
  });

  const normalizeTableData = useMemo(() => {
    console.log({ rolesData, usersData }, 'run');
    if (rolesData && usersData) {
      return rolesData.reduce((acc, cur) => {
        acc = [
          ...acc,
          {
            Role: cur.role.name,
            Capabilities: Object.keys(cur.role.capabilities).length,
            User: usersData.filter((it) => it.roles[0] === cur.role_key).length,
            RoleKey: cur.role_key,
            CapabilitiesItem: Object.keys(cur.role.capabilities).reduce((accCap, curCap) => {
              accCap = [
                ...accCap,
                {
                  capabilityName: startCase(curCap),
                  isSelected: cur.role.capabilities[curCap],
                  capabilitySlug: curCap,
                },
              ];
              return accCap;
            }, []),
          },
        ];
        return acc;
      }, []);
    } else return [];
  }, [rolesData, usersData]);

  const getCapabilities = async () => {
    const capRes = await getFetch(capSlug);
    const capData = await capRes.json();
    const normalizeCapList = capData.reduce((acc, cur) => {
      acc = [...acc, { capabilityName: startCase(cur.capability), capabilitySlug: cur.capability }];
      return acc;
    }, []);

    setCaps(normalizeCapList);
  };

  useEffect(() => {
    getCapabilities();
  }, []);

  const handleFiltering = ({ input, type }) => {
    let inputValue = input;
    if (typeof input === 'string') {
      inputValue = input.toLowerCase();
    }

    setFilterBy((filter) => {
      return { ...filter, [type]: inputValue };
    });
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
        options={{ header, notWide: true, title: 'Add new role', id: 'name' }}
      />

      <div className="roles-layout">
        <Table
          className="fadeInto"
          slug={roleSlug}
          columns={columns}
          data={!rolesLoading ? normalizeTableData : []}
          getRowExtraProps={(row, rows) => ({
            onClick: (e) => {
              row.toggleSelected();
              setSelectedRowData(row.original);
              rows.map((item) => {
                if (item.getIsSelected() && item.id !== row.id) {
                  item.toggleSelected();
                }
              });
            },
          })}
        />

        <div className="urlslab-role-details">
          <EditRole />
          <ModuleViewHeader
            moduleMenu={tableMenu}
            noSettings
            activeMenu={(activemenu) => setActiveSection(activemenu)}
          />
          <ActionsBar
            selectedCapCount={items.length}
            totalCap={caps.length || 0}
            handleFiltering={handleFiltering}
          />
          <div className="urlslab-selection-details">
            <SelectedCapabilities
              selecteditems={items}
              toggleSelectItem={toggleSelectItem}
            />

            <AllCapabilities
              data={caps || []}
            />

          </div>

          <div className='urlslab-all-capabilities-footer'>
            <Button className='urlslab-button' active>
              Save role
            </Button>
          </div>

        </div>

      </div>
    </>
  );
}

function EditRole(props) {
  return (
    <div className="urlslab-edit-container">
      <h3>Edit role:</h3>
      <InputField disabled style={{ maxWidth: '360px' }} />
      <Button>
        <PlusIcon /> Edit name
      </Button>
      <Button className={'simple'}>Copy role</Button>
    </div>
  );
}

function ActionsBar(props) {
  const { selectedCapCount, totalCap, handleFiltering } = props;
  const { __ } = useI18n();

  return (
    <div className="urlslab-actionsbar">
      <SearchField
        liveUpdate
        autoFocus
        onChange={(input) => handleFiltering({ input, type: 'search' })}
        placeholder={__('Search')}
      />
      <Button className={'simple'}>
        <PlusIcon /> Add capability
      </Button>

      <p style={{ marginLeft: 'auto' }}>
        Selected: {selectedCapCount} from {totalCap}
      </p>
    </div>
  );
}

function SelectedCapabilities(props) {
  const { selecteditems, toggleSelectItem } = props
  return (
    <div className="urlslab-selected-capabilities">
      <h5 style={{ marginBottom: '15px' }}>selected</h5>
      {selecteditems.map((item) => (
        <div className="urlslab-capability-item">
          <label role="Controlled Checkbox" className={`urlslab-checkbox `}>
            <input
              className="urlslab-checkbox-input"
              type="checkbox"
              checked={item.isSelected}
              onChange={() => toggleSelectItem(item)}
            />
            <div className="urlslab-checkbox-box"></div>
            <span className={`urlslab-checkbox-text`}>{item.capabilityName}</span>
          </label>
        </div>
      ))}
    </div>
  )
}

function AllCapabilities(props) {
  const { data } = props
  return (
    <div className="urlslab-all-capabilities">
      <p style={{ marginBottom: '15px', minWidth: '100%' }}>All capabilities</p>
      {data.map((item) => (
        <div className="urlslab-capability-item" style={{ width: '30%' }}>
          <Checkbox>{item.capabilityName}</Checkbox>
        </div>
      ))}
    </div>
  )
}
