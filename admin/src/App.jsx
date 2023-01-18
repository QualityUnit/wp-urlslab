import { useState } from 'react'
import DashboardModule from './components/DashboardModule'
import Switch from './elements/Switch'
import Button from './elements/Button'
import Checkbox from './elements/Checkbox'
import Tooltip from './elements/Tooltip'
import SearchField from './elements/SearchField'
import InputField from './elements/InputField'
import FilterMenu from './elements/FilterMenu'
import SortMenu from './elements/SortMenu'
import RangeSlider from './elements/RangeSlider'
import OptionButton from './elements/OptionButton'

function App() {
  const [count, setCount] = useState(0);

  const testingFilterItems = {
    0: 'Most reviews from external portals',
    1: 'Best ratings from external portals',
    2: 'Out best rating',
    3: 'Recently updated'
  };

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
    <div className="App">
      <Switch checked />
      <Switch secondary />
      <Switch label="Turn on"></Switch>
      <div></div>
      <Button>Button</Button>
      <Button active>
        Button</Button>
      <div></div>
      <Checkbox checked />
      <Tooltip>This is a tooltip</Tooltip>
      <SearchField />
      <div><br /></div>
      <OptionButton name="source" id="source_files" checked>Files</OptionButton>
      <OptionButton name="source" id="source_url" >External URL</OptionButton>

      <InputField type="email" label="This is an email" message="Has some message" />
      <InputField style={{ maxWidth: '25em' }} />
      <InputField type="number" style={{ maxWidth: '25em' }} />
      <InputField type="url" style={{ maxWidth: '25em' }} disabled placeholder="This is disabled" />
      <FilterMenu filterItems={testingFilterItems}>All items</FilterMenu>
      <SortMenu filterItems={testingFilterItems} name="sort">
        <svg width="10" height="13" viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.66667 0.5L0 3.16H2V7.83333H3.33333V3.16H5.33333L2.66667 0.5ZM7.33333 9.84V5.16667H6V9.84H4L6.66667 12.5L9.33333 9.84H7.33333Z" fill="#65676B" />
        </svg>

        All items
      </SortMenu>
      <RangeSlider min="10" max="200" unit="px" onChange={({ min, max }) =>
        console.log(`min = ${min}, max = ${max}`)
      }>File Width</RangeSlider>
      {/* <DashboardModule type="media" /> */}
    </div>
  )
}

export default App
