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
    if (!response.ok) throw new Error("Failed to fetch users");

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

  userGrid.innerHTML = userArray.map(user => `
    <article class="user-card"> 
      <h3>${user.first_name ?? ""}</h3> 
      <p>first_name: ${user.first_name ?? ""}</p> 
      <p>user_group: ${user.user_group ?? ""}</p> 
      <p>id: ${user.id ?? ""}</p> 
    </article>
  `).join("");
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

  if (!id) {
    console.error("Invalid ID");
    return;
  }

  const userExists = users.find(user => user.id === id);

  if (!userExists) {
    console.error("No matching user found");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error("Delete failed");

    users = users.filter(user => user.id !== id);
    render(users);

  } catch (error) {
    console.error("Error deleting user:", error);
  }
});

retrieveData();