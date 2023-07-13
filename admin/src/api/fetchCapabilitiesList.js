export async function fetchCapabilitiesList() {
  await fetch('/urlslab/wp-json/urlslab/v1/permission/capability', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      'X-WP-Nonce': window.wpApiSettings.nonce,
    },
    credentials: 'include',
  })
    .then((response) => {
      return response.json();
    })
    .then((posts) => {
      console.log(posts);
    });
}
