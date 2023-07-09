export async function createRole(slug) {
  await fetch('/urlab/wp-json/urlslab/v1/permission/role', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      'X-WP-Nonce': window.wpApiSettings.nonce,
    },
    credentials: 'include',
    body: JSON.stringify({ role_id: 'nova_rola', role_name: 'Meno Roly', capabilities: ['edit', 'read'] }),
  })
    .then((response) => {
      return response.json();
    })
    .then((posts) => {
      console.log(posts);
    });
}
