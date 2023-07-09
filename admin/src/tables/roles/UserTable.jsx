import { useEffect, useMemo, useState } from 'react';
import { getFetch } from '../../api/fetching';
import ModuleViewHeaderBottom from '../../components/ModuleViewHeaderBottom';
import Table from '../../components/TableComponent';
import { createColumnHelper } from '@tanstack/react-table';

export default function UserTable() {
  const userSlug = 'permission/user';

  const header = {
    name: 'Name',
    modules: 'Allowed',
  };
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      const userRes = await getFetch(userSlug);
      const userData = await userRes.json();
      const normalizeTableData = userData.reduce((acc, cur) => {
        acc = [
          ...acc,
          {
            User: cur.user_email,
            Capabilities: cur.custom_capabilities.length,
            Role: cur.roles[0],
          },
        ];
        return acc;
      }, []);

      setRoles(normalizeTableData);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columnHelper = useMemo(() => createColumnHelper(), []);

  const columns = [columnHelper.accessor('User'), columnHelper.accessor('Capabilities'), columnHelper.accessor('Role')];

  return (
    <>
      <ModuleViewHeaderBottom
        noColumnsMenu
        noExport
        noImport
        noFiltering
        noCount
        hideActions
        options={{ header, notWide: true, title: 'Add user', id: 'name' }}
      />
      <div className="roles-layout">
        <Table
          className="fadeInto"
          slug={userSlug}
          columns={columns}
          data={!isLoading && roles.length ? roles : []}
        ></Table>
        <div className="urlslab-detailsContainer">salam mn container hastam</div>
      </div>
    </>
  );
}
