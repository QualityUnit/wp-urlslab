import DashboardModule from './components/DashboardModule';
import ModulesData from './data/modules.json';

export default function Modules() {
  // console.log(ModulesData);

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
    <div className="urlslab-modules flex-tablet-landscape flex-wrap">
      {
        ModulesData.map((module) => {

          return (
            <DashboardModule
              // moduleId={modules?.endpoint?.moduleId}
              // hasApi={modules?.endpoint?.moduleId?.hasApi}
              // isActive={modules?.endpoint?.moduleId?.active}
              hasApi={module.apikey}
              isActive={module.active}
              title={module.title}
              image={`/images/modules/${module.id}.png`}
            >
              {module.description}
            </DashboardModule>
          )
        })
      }
    </div>
  )
}
