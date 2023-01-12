import { useState } from 'react'
import DashboardModule from './components/modules/DashboardModule'
import Switch from './elements/Switch'
import Button from './elements/Button'
import Checkbox from './elements/Checkbox'
import Tooltip from './elements/Tooltip'
import SearchField from './elements/SearchField'
import './assets/style/common/global.scss'
import InputField from './elements/InputField'

function App() {
  const [count, setCount] = useState(0)

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
      <Switch>Turn on</Switch>
      <div></div>
      <Button>Button</Button>
      <Button active>Button</Button>
      <div></div>
      <Checkbox checked />
      <Tooltip>This is a tooltip</Tooltip>
      {/* <SearchField /> */}
      <div><br /></div>

      <InputField type="email" style={{ maxWidth: '25em' }} label="This is an email" />
      <InputField style={{ maxWidth: '25em' }} />
      <InputField type="number" style={{ maxWidth: '25em' }} />
      <InputField type="url" style={{ maxWidth: '25em' }} disabled placeholder="This is disabled" />
      {/* <DashboardModule type="media" /> */}
    </div>
  )
}

export default App
