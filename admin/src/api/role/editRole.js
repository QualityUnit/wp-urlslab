export async function editRole(slug) {
  await fetch('/urlslab/wp-json/urlslab/v1/permission/role/nova_rola', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      'X-WP-Nonce': window.wpApiSettings.nonce,
    },
    credentials: 'include',
    body: JSON.stringify({ capabilities: ['edit', 'read'], role_name: 'Nove meno' }),
  })
    .then((response) => {
      return response.json();
    })
    .then((posts) => {
      console.log(posts);
    });
}
