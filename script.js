const BASE_URLS = {
    people: 'https://swapi.dev/api/people/',
    planets: 'https://swapi.dev/api/planets/',
    starships: 'https://swapi.dev/api/starships/'
};

let currentCategory = 'people';
let currentItem = null;

const itemList = document.getElementById('itemList');
const searchBar = document.getElementById('searchBar');
const itemDetails = document.getElementById('itemDetails');
const itemName = document.getElementById('itemName');
const itemInfo = document.getElementById('itemInfo');
const additionalInfo = document.getElementById('additionalInfo');
const showMoreBtn = document.getElementById('showMoreBtn');

// Fetch and display items based on category
async function fetchData(category) {
    currentCategory = category;
    searchBar.value = '';

    const url = BASE_URLS[category];
    const response = await fetch(url);
    const data = await response.json();

    itemList.innerHTML = '';

    data.results.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.textContent = item.name || item.title;
        itemDiv.onclick = () => showItemDetails(item);
        itemList.appendChild(itemDiv);
    });
}

// Display details for selected item
function showItemDetails(item) {
    currentItem = item;
    itemDetails.style.display = 'block';
    itemName.textContent = item.name || item.title;
    itemInfo.innerHTML = getBasicInfo(item);

    additionalInfo.style.display = 'none';
    showMoreBtn.style.display = 'block';
}

// Get basic info based on the category
function getBasicInfo(item) {
    if (currentCategory === 'people') {
        return `Height: ${item.height} cm<br>Mass: ${item.mass} kg<br>Gender: ${item.gender}`;
    } else if (currentCategory === 'planets') {
        return `Population: ${item.population}<br>Climate: ${item.climate}<br>Terrain: ${item.terrain}`;
    } else if (currentCategory === 'starships') {
        return `Model: ${item.model}<br>Manufacturer: ${item.manufacturer}<br>Cost: ${item.cost_in_credits} credits`;
    }
}

// Toggle additional information
function toggleAdditionalInfo() {
    if (additionalInfo.style.display === 'none') {
        additionalInfo.style.display = 'block';
        fetchAdditionalInfo();
    } else {
        additionalInfo.style.display = 'none';
    }
}

// Fetch additional info for the current item based on the category
async function fetchAdditionalInfo() {
    if (currentCategory === 'people') {
        // Basic character details
        let extraInfo = `
            Hair Color: ${currentItem.hair_color}<br>
            Skin Color: ${currentItem.skin_color}<br>
            Eye Color: ${currentItem.eye_color}<br>
            Birth Year: ${currentItem.birth_year}<br>
            Gender: ${currentItem.gender}<br>
        `;

        // Fetch homeworld
        if (currentItem.homeworld) {
            const homeworldData = await fetch(currentItem.homeworld).then(res => res.json());
            extraInfo += `Homeworld: ${homeworldData.name}<br>`;
        }

        // Fetch species
        if (currentItem.species.length > 0) {
            const speciesData = await fetch(currentItem.species[0]).then(res => res.json());
            extraInfo += `Species: ${speciesData.name}<br>`;
        } else {
            extraInfo += `Species: Human<br>`; // Default to Human if no species data
        }

        // Fetch vehicles
        if (currentItem.vehicles.length > 0) {
            const vehicles = await Promise.all(currentItem.vehicles.map(url => fetch(url).then(res => res.json())));
            extraInfo += `Vehicles: ${vehicles.map(vehicle => vehicle.name).join(', ')}<br>`;
        } else {
            extraInfo += `Vehicles: None<br>`;
        }

        // Fetch starships
        if (currentItem.starships.length > 0) {
            const starships = await Promise.all(currentItem.starships.map(url => fetch(url).then(res => res.json())));
            extraInfo += `Starships: ${starships.map(starship => starship.name).join(', ')}<br>`;
        } else {
            extraInfo += `Starships: None<br>`;
        }

        // Fetch films
        if (currentItem.films.length > 0) {
            const films = await Promise.all(currentItem.films.map(url => fetch(url).then(res => res.json())));
            extraInfo += `Films: ${films.map(film => film.title).join(', ')}<br>`;
        } else {
            extraInfo += `Films: None<br>`;
        }

        // Display the compiled additional information
        additionalInfo.innerHTML = extraInfo;
    } else if (currentCategory === 'planets') {
        additionalInfo.innerHTML = `
            Orbital Period: ${currentItem.orbital_period} days<br>
            Rotation Period: ${currentItem.rotation_period} hours<br>
            Surface Water: ${currentItem.surface_water}%<br>
            Gravity: ${currentItem.gravity}<br>
            Diameter: ${currentItem.diameter}<br>
        `;
        if (currentItem.residents.length > 0) {
            const residents = await Promise.all(currentItem.residents.map(url => fetch(url).then(res => res.json())));
            additionalInfo.innerHTML += `Residents: ${residents.map(resident => resident.name).join(', ')}<br>`;
        } else {
            additionalInfo.innerHTML += `Residents: None<br>`
        }
        if (currentItem.films.length > 0) {
            const films = await Promise.all(currentItem.films.map(url => fetch(url).then(res => res.json())));
            additionalInfo.innerHTML += `Films: ${films.map(film => film.title).join(', ')}<br>`;
        } else {
            additionalInfo.innerHTML += `Films: None<br>`;
        }

    } else if (currentCategory === 'starships') {
        additionalInfo.innerHTML = `
            Starship Class: ${currentItem.starship_class}<br>
            Crew: ${currentItem.crew}<br>
            Hyperdrive Rating: ${currentItem.hyperdrive_rating}<br>
            Max Speed: ${currentItem.max_atmosphering_speed}<br>
            Lenght: ${currentItem.length}<br>
            Passengers: ${currentItem.passengers}<br>
            Cargo Capacity: ${currentItem.cargo_capacity}<br>
            Consumables: ${currentItem.consumables}<br>
            MGLT: ${currentItem.MGLT}<br>
        `;
        if (currentItem.pilots.length > 0) {
            const pilots = await Promise.all(currentItem.pilots.map(url => fetch(url).then(res => res.json())));
            additionalInfo.innerHTML += `Pilots: ${pilots.map(pilot => pilot.name).join(', ')}<br>`
        } else {
            additionalInfo.innerHTML += `Pilots: None<br>`
        }
        if (currentItem.films.length > 0) {
            const films = await Promise.all(currentItem.films.map(url => fetch(url).then(res => res.json())));
            additionalInfo.innerHTML += `Films: ${films.map(film => film.title).join(', ')}<br>`;
        } else {
            additionalInfo.innerHTML += `Films: None<br>`;
        }
    }
}

// Search and filter items
async function searchData() {
    const searchTerm = searchBar.value.toLowerCase();
    const url = `${BASE_URLS[currentCategory]}?search=${searchTerm}`;
    const response = await fetch(url);
    const data = await response.json();

    itemList.innerHTML = '';

    data.results.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.textContent = item.name || item.title;
        itemDiv.onclick = () => showItemDetails(item);
        itemList.appendChild(itemDiv);
    });
}

// Initial fetch of people category on load
fetchData('people');
