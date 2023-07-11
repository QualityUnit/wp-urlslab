// API to get list of roles:

fetch('/wp-json/urlslab/v1/permission/role', {
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
// API to Create a new role in Wordpress:

fetch('/wp-json/urlslab/v1/permission/role', {
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
// Delete role:

fetch('/wp-json/urlslab/v1/permission/role/nova_rola', {
  method: 'DELETE',
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
// Edit role:

fetch('/wp-json/urlslab/v1/permission/role/nova_rola', {
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
// API to get list of all capabilities:

fetch('/wp-json/urlslab/v1/permission/capability', {
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
// Get list of users:

fetch('/wp-json/urlslab/v1/permission/user', {
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
// Update roles or capabilities:

fetch('/wp-json/urlslab/v1/permission/user/208', {
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
