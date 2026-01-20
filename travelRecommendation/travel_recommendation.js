// Global variable to store the fetched data
let travelData = null;

// Fetch the travel recommendation data when the page loads
async function loadTravelData() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        travelData = await response.json();
        console.log('Travel data loaded successfully:', travelData);
    } catch (error) {
        console.error('Error loading travel data:', error);
    }
}

// Call loadTravelData when the page loads
window.addEventListener('DOMContentLoaded', loadTravelData);

// Function to show different pages
function showPage(pageName) {
    // Hide all sections
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('aboutPage').classList.add('hidden');
    document.getElementById('contactPage').classList.add('hidden');
    document.getElementById('resultsSection').classList.add('hidden');
    
    // Show the selected page
    if (pageName === 'home') {
        document.getElementById('homePage').classList.remove('hidden');
        document.getElementById('searchContainer').style.display = 'flex';
    } else if (pageName === 'about') {
        document.getElementById('aboutPage').classList.remove('hidden');
        document.getElementById('searchContainer').style.display = 'none';
    } else if (pageName === 'contact') {
        document.getElementById('contactPage').classList.remove('hidden');
        document.getElementById('searchContainer').style.display = 'none';
    }
}

// Function to handle form submission
function handleSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    alert(`Thank you for your message, ${name}! We'll get back to you soon at ${email}.`);
    
    // Reset the form
    event.target.reset();
}

// Function to search for recommendations
function searchRecommendations() {
    const searchInput = document.getElementById('searchInput').value.trim();
    
    if (!searchInput) {
        alert('Please enter a valid search query.');
        return;
    }
    
    if (!travelData) {
        alert('Travel data is still loading. Please try again in a moment.');
        return;
    }
    
    // Convert search input to lowercase for case-insensitive matching
    const keyword = searchInput.toLowerCase();
    
    let results = [];
    
    // Check for beach/beaches keywords
    if (keyword.includes('beach')) {
        results = travelData.beaches || [];
    }
    // Check for temple/temples keywords
    else if (keyword.includes('temple')) {
        results = travelData.temples || [];
    }
    // Check for country/countries keywords
    else if (keyword.includes('country') || keyword.includes('countries')) {
        // For countries, we need to get cities from all countries
        if (travelData.countries) {
            results = travelData.countries.flatMap(country => 
                country.cities.map(city => ({
                    ...city,
                    countryName: country.name
                }))
            );
        }
    }
    // Try to match specific country names
    else {
        if (travelData.countries) {
            const matchedCountry = travelData.countries.find(country => 
                country.name.toLowerCase().includes(keyword)
            );
            
            if (matchedCountry) {
                results = matchedCountry.cities.map(city => ({
                    ...city,
                    countryName: matchedCountry.name
                }));
            }
        }
    }
    
    // Display results
    displayResults(results, keyword);
}

// Function to display search results
function displayResults(results, keyword) {
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsSection = document.getElementById('resultsSection');
    
    // Hide home page and show results section
    document.getElementById('homePage').classList.add('hidden');
    resultsSection.classList.remove('hidden');
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="error-message">No recommendations found for "' + keyword + '". Please try searching for "beach", "temple", or "country".</p>';
        return;
    }
    
    // Create result cards
    results.forEach(item => {
        const card = document.createElement('div');
        card.className = 'result-card';
        
        const title = item.countryName ? `${item.name}, ${item.countryName}` : item.name;
        
        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}">
            <div class="result-card-content">
                <h3>${title}</h3>
                <p>${item.description}</p>
                <a href="#" class="btn-visit">Visit</a>
            </div>
        `;
        
        resultsContainer.appendChild(card);
    });
}

// Function to clear results and return to home page
function clearResults() {
    // Clear the search input
    document.getElementById('searchInput').value = '';
    
    // Clear results container
    document.getElementById('resultsContainer').innerHTML = '';
    
    // Hide results section and show home page
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('homePage').classList.remove('hidden');
}