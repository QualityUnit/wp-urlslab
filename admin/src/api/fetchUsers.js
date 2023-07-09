export async function fetchUsers() {
  await fetch('/urlslab/wp-json/urlslab/v1/permission/user', {
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
