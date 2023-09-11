async function editProfileHandler(event) {
  event.preventDefault();

  // const username = document.querySelector('input[name="username"]').value.trim();
  const profilepicture = document.querySelector("input[name='selectedImage']:checked").value.trim();
  const id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
  const response = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      profilepicture
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (response.ok) {

    document.location.replace('/profile');
  } else {
    alert(response.statusText);
  }
}


document.querySelector('.edit-profile-form').addEventListener('submit', editProfileHandler)