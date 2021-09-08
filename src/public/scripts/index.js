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
        //document.getElementById("ipt-user-profile").textContent = JSON.stringify(await auth0.getUser());

        //displayUsers();
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
 * Attendance
 ******************************************************************************/
const attendanceForm = document.getElementById ('attendance-form');
attendanceForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Parse CSV as JSON before submitting
    const csv = attendanceForm.elements ['attendance-file'].files [0];
    const eventType = attendanceForm.elements ['event-type'].value;
    const eventDate = attendanceForm.elements ['event-date'].value;
    Papa.parse (csv, {
        header: true,
        skipEmptyLines: true,
        complete: (parsedJson) => submitAttendanceForm (parsedJson, eventType, eventDate),
    });
});

// Callback to submit JSON attendance form
const submitAttendanceForm = async (parsedJson, eventType, eventDate) => {
    await httpPut (`/api/attendance/event/${eventType}/date/${eventDate}`, parsedJson.data)
        .then(response => response.json())
        .then ((response) => console.log (response));
};


/******************************************************************************
 * API Methods
 ******************************************************************************/

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
