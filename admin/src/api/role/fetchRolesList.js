/* global wpApiSettings */

export async function fetchRolesList(slug) {
  await fetch(wpApiSettings.root + 'urlslab/v1/permission/role', {
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
      console.log(posts, 'posts');
    });
}
