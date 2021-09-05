/******************************************************************************
 * Auth0
 ******************************************************************************/

let auth0 = null;
const fetchAuthConfig = () => fetch('/auth/config');
 
const configureClient = async () => {
    const response = await fetchAuthConfig();
    const config = await response.json();

    auth0 = await createAuth0Client({
        domain: config.domain,
        client_id: config.clientId,
        audience: config.audience,
    });
};

const updateUI = async () => {
    const isAuthenticated = await auth0.isAuthenticated();
    document.getElementById("btn-logout").disabled = !isAuthenticated;
    document.getElementById("btn-login").disabled = isAuthenticated;

    // Show/hide protected content after authentication
    if (isAuthenticated) {
        Array.from(document.getElementsByClassName("protected")).forEach ((elm) => elm.classList.remove("hidden"));

        document.getElementById("ipt-access-token").innerHTML = await auth0.getTokenSilently();
        document.getElementById("ipt-user-profile").textContent = JSON.stringify(await auth0.getUser());

        displayUsers();
    } else {
        Array.from(document.getElementsByClassName("protected")).forEach ((elm) => elm.classList.add("hidden"));
    }
};

window.login = async () => {
    await auth0.loginWithRedirect({
        redirect_uri: window.location.origin
    });
};

window.logout = () => {
    auth0.logout({
        returnTo: window.location.origin
    });
};
 
window.onload = async () => {
    await configureClient();

    updateUI();

    const isAuthenticated = await auth0.isAuthenticated();

    if (isAuthenticated) {
        // Show protected content
        return;
    }

    // Check for the code and state parameters
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {

        // Process the login state
        await auth0.handleRedirectCallback();

        updateUI();

        // Use replaceState to redirect the user away and remove the querystring parameters
        window.history.replaceState({}, document.title, "/");
    }
}


/******************************************************************************
 * Fetch and display users
 ******************************************************************************/

const displayUsers = async () => {
    await httpGet('/api/users/all')
        .then(response => response.json())
        .then((response) => {
            console.log (response);
            var allUsers = response.users;
            // Empty the anchor
            var allUsersAnchor = document.getElementById('all-users-anchor');
            allUsersAnchor.innerHTML = '';
            // Append users to anchor
            allUsers.forEach((user) => {
                allUsersAnchor.innerHTML += getUserDisplayEle(user);
            });
        });
};


function getUserDisplayEle(user) {
    return `<div class="user-display-ele">

        <div class="normal-view">
            <div>Name: ${user.name}</div>
            <div>Email: ${user.email}</div>
            <button class="edit-user-btn" data-user-id="${user.id}">
                Edit
            </button>
            <button class="delete-user-btn" data-user-id="${user.id}">
                Delete
            </button>
        </div>
        
        <div class="edit-view">
            <div>
                Name: <input class="name-edit-input" value="${user.name}">
            </div>
            <div>
                Email: <input class="email-edit-input" value="${user.email}">
            </div>
            <button class="submit-edit-btn" data-user-id="${user.id}">
                Submit
            </button>
            <button class="cancel-edit-btn" data-user-id="${user.id}">
                Cancel
            </button>
        </div>
    </div>`;
}


/******************************************************************************
 * Add, Edit, and Delete Users
 ******************************************************************************/

document.addEventListener('click', function (event) {
    event.preventDefault();
    var ele = event.target;
    if (ele.matches('#add-user-btn')) {
        addUser();
    } else if (ele.matches('.edit-user-btn')) {
        showEditView(ele.parentNode.parentNode);
    } else if (ele.matches('.cancel-edit-btn')) {
        cancelEdit(ele.parentNode.parentNode);
    } else if (ele.matches('.submit-edit-btn')) {
        submitEdit(ele);
    } else if (ele.matches('.delete-user-btn')) {
        deleteUser(ele);
    }
}, false)


function addUser() {
    var nameInput = document.getElementById('name-input');
    var emailInput = document.getElementById('email-input');
    var data = {
        user: {
            name: nameInput.value,
            email: emailInput.value
        },
    };
    httpPost('/api/users/add', data)
        .then(() => {
            displayUsers();
        })
}


function showEditView(userEle) {
    var normalView = userEle.getElementsByClassName('normal-view')[0];
    var editView = userEle.getElementsByClassName('edit-view')[0];
    normalView.style.display = 'none';
    editView.style.display = 'block';
}


function cancelEdit(userEle) {
    var normalView = userEle.getElementsByClassName('normal-view')[0];
    var editView = userEle.getElementsByClassName('edit-view')[0];
    normalView.style.display = 'block';
    editView.style.display = 'none';
}


function submitEdit(ele) {
    var userEle = ele.parentNode.parentNode;
    var nameInput = userEle.getElementsByClassName('name-edit-input')[0];
    var emailInput = userEle.getElementsByClassName('email-edit-input')[0];
    var id = ele.getAttribute('data-user-id');
    var data = {
        user: {
            name: nameInput.value,
            email: emailInput.value,
            id: id
        }
    };
	httpPut('/api/users/update', data)
        .then(() => {
            displayUsers();
        })
}


function deleteUser(ele) {
    var id = ele.getAttribute('data-user-id');
	httpDelete('/api/users/delete/' + id)
        .then(() => {
            displayUsers();
        })
}


const httpGet = async (path) => {
    return await fetch(path, await getOptions('GET'));
};


const httpPost = async (path, data) => {
    return await fetch(path, await getOptions('POST', data));
};


const httpPut = async (path, data) => {
    return await fetch(path, await getOptions('PUT', data));
}


const httpDelete = async (path) => {
    return await fetch(path, await getOptions('DELETE'));
}


const getOptions = async (verb, data) => {
    try {
        // Get the access token from the Auth0 client
        const token = await auth0.getTokenSilently();

        var options = {
            dataType: 'json',
            method: verb,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        return options;

    } catch (e) {
        console.error (e);
    }
}
