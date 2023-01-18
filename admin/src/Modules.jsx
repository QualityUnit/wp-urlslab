import { useState } from 'react';

import DashboardModule from './components/DashboardModule';
import ModulesData from './data/modules.json';
import { publicDir } from './constants/variables';
import SearchField from './elements/SearchField';
import FilterMenu from './elements/FilterMenu';

export default function Modules() {
  const [searchValue, setSearchVal] = useState('');
  const handleSearch = (value) => {
    setSearchVal(value);
    console.log(searchValue);
  }

  // const filterActive = {};
  // ModulesData.map(module => {
  //   if (module.active) {
  //     filterActive[0] = 'Active modules';
  //   }
  // })
  // console.log(filterActive);

  // Use "for" loop for large data set


  // const createPost = fetch('http://liveagent.local/wp-json/wp/v2/posts', {
  //   method: "POST",
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'accept': 'application/json',
  //     'X-WP-Nonce': urlslabNonceAuth.nonce,
  //   },
  //   body: JSON.stringify({
  //     title: 'New Post',
  //     content: 'This is the way to add posts from your frontend.',
  //     status: 'publish',
  //   })
  // }).then((response) => {
  //   return response.json();
  // }).then((post) => {
  //   console.log(post);
  // });

  return (
    <>
      <SearchField onChange={(value) => handleSearch(value)} />
      {/* <FilterMenu filterItems={filterActive}>All items</FilterMenu> */}
      <div className="urlslab-modules flex-tablet-landscape flex-wrap">
        {
          ModulesData.map((module) => {
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
                  image={`${publicDir || ''}/images/modules/${module.id}.png`
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
