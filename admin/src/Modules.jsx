import { useState, useEffect } from 'react';
import { fetchModules } from './api/modules';
import DashboardModule from './components/DashboardModule';
// import ModulesData from './data/modules.json';
import { publicDir } from './constants/variables';
import SearchField from './elements/SearchField';
import FilterMenu from './elements/FilterMenu';
import Checkbox from './elements/Checkbox';

export default function Modules() {
  const [searchValue, setSearchVal] = useState('');
  const [activeOnly, setActiveModules] = useState(false);
  const [modules, setModulesData] = useState([]);
  const handleSearch = (value) => {
    setSearchVal(value);
  }
  const showActive = () => {
    setActiveModules(!activeOnly);
  }

  useEffect(() => {
    fetchModules().then((ModulesData) => {
      setModulesData(ModulesData)
    })
  }, []);

  return (
    <>
      <SearchField onChange={(value) => handleSearch(value)} />
      <Checkbox onChange={() => showActive()}>Show only active</Checkbox>
      {/*<FilterMenu filterItems={filterActive}>All items</FilterMenu> */}
      <div className="urlslab-modules flex-tablet-landscape flex-wrap">
        {modules.length
          ? modules.map((module) => {
            const title = module.title.toLowerCase();
            const excerpt = module.description.toLowerCase();
            return (
              (title.includes(searchValue) || excerpt.includes(searchValue))
                // !activeOnly !== module.active
                ? <DashboardModule
                  key={module.id}
                  moduleId={module.id}
                  hasApi={module.apikey}
                  isActive={module.active}
                  title={module.title}
                  image={`${publicDir()}/images/modules/${module.id}.png`
                  }
                >
                  {module.description}
                </DashboardModule>
                : null
            )
          })
          : <h2 className="urlslab-loader">Loading modules…</h2>
        }
      </div>
    </>
  )
}
