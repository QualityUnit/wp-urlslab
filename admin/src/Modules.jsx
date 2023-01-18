import { useState, useEffect } from 'react';
import apiFetch from "@wordpress/api-fetch";
import DashboardModule from './components/DashboardModule';
// import ModulesData from './data/modules.json';
import { publicDir } from './constants/variables';
import SearchField from './elements/SearchField';
import FilterMenu from './elements/FilterMenu';

export default function Modules() {
  const [searchValue, setSearchVal] = useState('');
  const [modules, setModulesData] = useState([]);
  const handleSearch = (value) => {
    setSearchVal(value);
    console.log(searchValue);
  }

  useEffect(() => {
    apiFetch({
      path: 'http://liveagent.local/wp-json/urlslab/v1/module'
      // headers: { 'X-WP-Nonce': window.myvars.nonce }
    }).then((ModulesData) => {
      setModulesData(ModulesData)
    })
  }, []);


  return (
    <>
      <SearchField onChange={(value) => handleSearch(value)} />
      {/*<FilterMenu filterItems={filterActive}>All items</FilterMenu> */}
      <div className="urlslab-modules flex-tablet-landscape flex-wrap">
        {
          modules.map((module) => {
            const title = module.title.toLowerCase();
            const excerpt = module.description.toLowerCase();
            return (
              (title.includes(searchValue) || excerpt.includes(searchValue))
                ? <DashboardModule
                  key={module.id
                  }
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
        }
      </div>
    </>
  )
}
