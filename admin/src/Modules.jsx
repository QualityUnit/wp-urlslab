import { useState, useEffect } from 'react';
<<<<<<< HEAD
import apiFetch from "@wordpress/api-fetch";
=======
import { fetchModules } from './api/modules';
>>>>>>> 0be67eb26c4155736a6ac5a662c6545495238e7b
import DashboardModule from './components/DashboardModule';
// import ModulesData from './data/modules.json';
import { publicDir } from './constants/variables';
import SearchField from './elements/SearchField';
import FilterMenu from './elements/FilterMenu';
<<<<<<< HEAD

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
=======
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
>>>>>>> 0be67eb26c4155736a6ac5a662c6545495238e7b
      setModulesData(ModulesData)
    })
  }, []);

<<<<<<< HEAD

  return (
    <>
      <SearchField onChange={(value) => handleSearch(value)} />
      {/*<FilterMenu filterItems={filterActive}>All items</FilterMenu> */}
      <div className="urlslab-modules flex-tablet-landscape flex-wrap">
        {modules
=======
  return (
    <>
      <SearchField onChange={(value) => handleSearch(value)} />
      <Checkbox onChange={() => showActive()}>Show only active</Checkbox>
      {/*<FilterMenu filterItems={filterActive}>All items</FilterMenu> */}
      <div className="urlslab-modules flex-tablet-landscape flex-wrap">
        {modules.length
>>>>>>> 0be67eb26c4155736a6ac5a662c6545495238e7b
          ? modules.map((module) => {
            const title = module.title.toLowerCase();
            const excerpt = module.description.toLowerCase();
            return (
              (title.includes(searchValue) || excerpt.includes(searchValue))
<<<<<<< HEAD
                ? <DashboardModule
                  key={module.id
                  }
=======
                // !activeOnly !== module.active
                ? <DashboardModule
                  key={module.id}
                  moduleId={module.id}
>>>>>>> 0be67eb26c4155736a6ac5a662c6545495238e7b
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
<<<<<<< HEAD
          : null
=======
          : <h2 className="urlslab-loader">Loading modules…</h2>
>>>>>>> 0be67eb26c4155736a6ac5a662c6545495238e7b
        }
      </div>
    </>
  )
}
