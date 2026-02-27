// URL for users data
const API_URL = 'https://69a1e6ca2e82ee536fa28a79.mockapi.io/users_api';

// application state
let users = [];
let isGridView = true; // toggled by view button

// references to DOM elements
const userGrid = document.getElementById('userGrid');
const deleteIdInput = document.getElementById('deleteIdInput');
const deleteBtn = document.getElementById('deleteBtn');
const sortByGroupBtn = document.getElementById('sortByGroupBtn');
const sortByIdBtn = document.getElementById('sortByIdBtn');
const viewToggleBtn = document.getElementById('viewToggleBtn');

// helper to render the list of user cards
function renderUsers() {
  if (!users || users.length === 0) {
    userGrid.textContent = 'No users loaded.';
    return;
  }

  // clear current contents
  userGrid.innerHTML = '';

  users.forEach(user => {
    const card = document.createElement('div');
    card.className = 'user-card';

    const title = document.createElement('h3');
    title.textContent = `${user.first_name}`;
    card.appendChild(title);
    
    const firstName = document.createElement('p');
    firstName.textContent = `first_name: ${user.first_name}`;
    card.appendChild(firstName);

    const userGroup = document.createElement('p');
    userGroup.textContent = `user_group: ${user.id}`
    card.appendChild(userGroup);

    const id = document.createElement('p');
    id.textContent = `id: ${user.id}`
    card.appendChild(id);

    userGrid.appendChild(card);
  });
}

// load users from API
async function loadUsers() {
  try {
    const resp = await fetch(API_URL);
    if (!resp.ok) throw new Error('Fetch failed');
    users = await resp.json();
    renderUsers();
  } catch (err) {
    console.error('error loading users', err);
    userGrid.textContent = 'Error loading users.';
  }
}

// delete user by ID (both locally and via API)
async function deleteUserById(id) {
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) {
    alert(`No user with ID ${id} found`);
    return;
  }

  try {
    const resp = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!resp.ok) throw new Error('Delete request failed');
    // remove from local list and re-render
    users.splice(idx, 1);
    renderUsers();
  } catch (err) {
    console.error('delete failed', err);
    alert('Failed to delete user');
  }
}

// sort functions
function sortByGroup() {
  users.sort((a, b) => {
    const ga = (a.first_name && a.first_name.name) || '';
    const gb = (b.first_name && b.first_name.name) || '';
    return ga.localeCompare(gb);
  });
  renderUsers();
}

function sortById() {
  users.sort((a, b) => a.id - b.id);
  renderUsers();
}

// toggle view
function toggleView() {
  isGridView = !isGridView;
  if (isGridView) {
    userGrid.classList.remove('list-view');
    userGrid.classList.add('grid-view');
  } else {
    userGrid.classList.remove('grid-view');
    userGrid.classList.add('list-view');
  }
}

// wire up event listeners
deleteBtn.addEventListener('click', () => {
  const id = parseInt(deleteIdInput.value, 10);
  if (isNaN(id)) {
    alert('Please enter a valid numeric ID');
    return;
  }
  deleteUserById(id);
});

sortByGroupBtn.addEventListener('click', sortByGroup);
sortByIdBtn.addEventListener('click', sortById);
viewToggleBtn.addEventListener('click', toggleView);

// load users immediately
loadUsers();
