document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');
    const recommendations = document.querySelector('.recommendations'); // Select the recommendations container
    const clearButton = document.getElementById('clearButton'); // Select the clear button

    // Event listener for the search button click
    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.toLowerCase();

        // Fetch data from the API (assuming it's hosted locally)
        fetch('travel_recommendation_api.json')
            .then(response => response.json())
            .then(data => {
                // Filter the data based on the search term
                const filteredData = filterData(data, searchTerm);

                // Display the filtered data
                displaySearchResults(filteredData);

                // Show or hide recommendations based on search results
                showOrHideRecommendations(filteredData);
            })
            .catch(error => console.error('Error fetching data:', error));
    });

    // Event listener for the clear button click
    clearButton.addEventListener('click', function() {
        // Clear search input
        searchInput.value = '';

        // Clear search results
        searchResults.innerHTML = '';

        // Hide recommendations
        recommendations.style.display = 'none';
    });

    function filterData(data, searchTerm) {
        let filteredData = {
            beach: [],
            temple: [],
            country: []
        };

        // Filter beaches
        data.beaches.forEach(beach => {
            if (beach.name.toLowerCase().includes(searchTerm) || beach.description.toLowerCase().includes(searchTerm)) {
                filteredData.beach.push(beach);
            }
        });

        // Filter temples
        data.temples.forEach(temple => {
            if (temple.name.toLowerCase().includes(searchTerm) || temple.description.toLowerCase().includes(searchTerm)) {
                filteredData.temple.push(temple);
            }
        });

        // Filter countries and cities
        data.countries.forEach(country => {
            country.cities.forEach(city => {
                if (city.name.toLowerCase().includes(searchTerm) || city.description.toLowerCase().includes(searchTerm)) {
                    filteredData.country.push(city);
                }
            });
        });

        return filteredData;
    }

    function displaySearchResults(data) {
        // Clear previous search results
        searchResults.innerHTML = '';

        // Display beach recommendations
        data.beach.forEach(beach => {
            const beachElement = createRecommendationElement(beach);
            searchResults.appendChild(beachElement);
        });

        // Display temple recommendations
        data.temple.forEach(temple => {
            const templeElement = createRecommendationElement(temple);
            searchResults.appendChild(templeElement);
        });

        // Display country recommendations
        data.country.forEach(city => {
            const countryElement = createRecommendationElement(city);
            searchResults.appendChild(countryElement);
        });
    }

    function createRecommendationElement(item) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');

        const imageElement = document.createElement('img');
        imageElement.src = item.imageUrl;
        imageElement.alt = item.name;

        const descriptionElement = document.createElement('div');
        descriptionElement.classList.add('description');
        descriptionElement.innerHTML = `<h3>${item.name}</h3><p>${item.description}</p>`;

        itemElement.appendChild(imageElement);
        itemElement.appendChild(descriptionElement);

        return itemElement;
    }

    function showOrHideRecommendations(data) {
        // Show the recommendations if there are search results
        if (data.beach.length > 0 || data.temple.length > 0 || data.country.length > 0) {
            recommendations.style.display = 'flex'; // Display the recommendations container
        } else {
            recommendations.style.display = 'none'; // Hide the recommendations container if there are no search results
        }
    }
});
