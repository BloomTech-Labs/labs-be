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
        var options = {
            dataType: 'json',
            method: verb,
            headers: {
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
