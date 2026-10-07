let errands = [];

function addErrand() {
    const input = document.getElementById('errandInput').value;
    if (input) {
        errands.push(input);
        renderErrands();
        document.getElementById('errandInput').value = '';
        document.getElementById('optimizeBtn').disabled = false;
    }
}

function renderErrands() {
    const list = document.getElementById('errandList');
    list.innerHTML = '';
    errands.forEach((errand, index) => {
        const li = document.createElement('li');
        li.textContent = errand;
        li.appendChild(createRemoveButton(index));
        list.appendChild(li);
    });
}

function createRemoveButton(index) {
    const button = document.createElement('button');
    button.textContent = 'Remove';
    button.onclick = () => {
        errands.splice(index, 1);
        renderErrands();
        if (errands.length === 0) {
            document.getElementById('optimizeBtn').disabled = true;
        }
    };
    return button;
}

function optimizeRoute() {
    if (errands.length < 2) {
        alert('Please add at least two errands.');
        return;
    }

    const service = new google.maps.DirectionsService();
    const waypoints = errands.slice(1, -1).map(location => ({ location, stopover: true }));
    
    const request = {
        origin: errands[0],
        destination: errands[errands.length - 1],
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
    };

    service.route(request, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            document.getElementById('results').style.display = 'block';
            renderRouteResults(response);
        } else {
            alert('Could not optimize route: ' + status);
        }
    });
}

function renderRouteResults(response) {
    const { legs } = response.routes[0];
    let output = '<h3>Optimized Route:</h3><ol>';
    legs.forEach(({ start_address, end_address, duration }) => {
        output += `<li>${start_address} to ${end_address} - ${duration.text}</li>`;
    });
    output += '</ol>';
    document.getElementById('results').innerHTML = output;
}