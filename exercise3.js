const API_URL = 'https://69a1e6ca2e82ee536fa28a79.mockapi.io/users_api';

let users = [];

const userGrid = document.getElementById('userGrid');
const viewToggleBtn = document.getElementById('viewToggleBtn');
const deleteIdInput = document.getElementById('deleteIdInput');
const deleteBtn = document.getElementById('deleteBtn');
const sortByGroupBtn = document.getElementById('sortByGroupBtn');
const sortByIdBtn = document.getElementById('sortByIdBtn');

async function retrieveData() {
  try {
    const response = await fetch(API_URL);
    users = await response.json();
    
    console.log(users);
    render(users);

  } catch (error) {
    console.error("Error retrieving users:", error);
  }
}

function render(userArray) {
  if (!userArray || userArray.length === 0) {
    userGrid.innerHTML = "No users loaded.";
    return;
  }
  userGrid.innerHTML = "";

  userArray.forEach(user => {
    userGrid.innerHTML += `
      <article class="user-card"> 
        <h3>${user.first_name}</h3> 
        <p>first_name: ${user.first_name}</p> 
        <p>user_group: ${user.user_group}</p> 
        <p>id: ${user.id}</p> 
      </article>
    `;
  });
}

viewToggleBtn.addEventListener('click', () => {
  if (userGrid.classList.contains('grid-view')) {
    userGrid.classList.remove('grid-view');
    userGrid.classList.add('list-view');
  } else {
    userGrid.classList.remove('list-view');
    userGrid.classList.add('grid-view');
  }
});

sortByGroupBtn.addEventListener('click', () => {
  users.sort((a, b) =>
    Number(a.user_group) - Number(b.user_group)
  );
  render(users);
});

sortByIdBtn.addEventListener('click', () => {
  users.sort((a, b) =>
    Number(a.id) - Number(b.id)
  );
  render(users);
});

deleteBtn.addEventListener('click', async () => {
  const id = deleteIdInput.value.trim();
  if (!id) return console.error("Invalid ID");

  let found = false;
  users.forEach((user, i) => {
    if (user.id === id) {
      users.splice(i, 1);
      found = true;
    }
  });

  if (!found) return console.error("No matching user found");

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) console.error("Failed to delete user");
    render(users);
  } catch (err) {
    console.error("Error deleting user:", err);
  }
});

retrieveData();