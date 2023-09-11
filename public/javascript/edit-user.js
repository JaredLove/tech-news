async function editUserFormHandler(event) {
    event.preventDefault();
  
    const id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
    const username = document.querySelector('input[name="username"]').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const password = document.querySelector('input[name="password"]').value.trim();
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        username,
        email,
      }),
      headers: {
        'Content-Type': 'application/json'
      }

    });
  
    if (response.ok) {
      document.location.replace('/dashboard/');
    } else {
      alert(response.statusText);
    }
  }
  
  document.querySelector('.update-user-btn').addEventListener('click', editUserFormHandler);