export async function roleCapabilityUpdater() {
  await fetch('/urlslab/wp-json/urlslab/v1/permission/user/208', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      'X-WP-Nonce': window.wpApiSettings.nonce,
    },
    credentials: 'include',
    body: JSON.stringify({ roles: ['developer'], capabilities: ['userlab_read'] }),
  })
    .then((response) => {
      return response.json();
    })
    .then((posts) => {
      console.log(posts);
    });
}
