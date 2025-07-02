// get DOM elements used
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categorySelect = document.getElementById('categorySelect');
const randomBtn = document.getElementById('randomBtn');
const mealList = document.getElementById('mealList');
const mealDetails = document.getElementById('mealDetails');
const mealPlanList = document.getElementById('mealPlanList');
const toggleTheme = document.getElementById('toggleTheme');

// Base URL for interacting with the local JSON server
const baseURL = "http://localhost:3000/mealPlan";

document.addEventListener('DOMContentLoaded', () => {
  fetchMealPlan();
  document.body.classList.add('light');
});

// Event Listeners
// Get meals by searching them by their name
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchMeals(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
  }
});

// Get the meals according to their category
categorySelect.addEventListener('change', () => {
  const category = categorySelect.value;
  if (category) {
    fetchMeals(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
  }
});

// Get a random meal
randomBtn.addEventListener('click', () => {
  fetchMeals(`https://www.themealdb.com/api/json/v1/1/random.php`, true);
});

// Toggle between light and dark theme
toggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
});

// Fetch and Display Meals
function fetchMeals(url, isRandom = false) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (isRandom) {
        displayMealDetails(data.meals[0]);
      } else {
        displayMealList(data.meals);
      }
    })
    .catch(err => console.error('Error fetching meals:', err));
}

// Get meal list display
function displayMealList(meals) {
  mealList.innerHTML = '';
  mealDetails.innerHTML = '';
  if (!meals) {
    mealList.innerHTML = '<p>No meals found.</p>';
    return;
  }
  meals.forEach(meal => {
    const mealDiv = document.createElement('div');
    mealDiv.className = 'meal';
    mealDiv.innerHTML = `
      <h4>${meal.strMeal}</h4>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    `;
    mealDiv.addEventListener('click', () => fetchMealDetails(meal.idMeal));
    mealList.appendChild(mealDiv);
  });
}

// Fetch full details of a single meal by its ID
function fetchMealDetails(id) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => displayMealDetails(data.meals[0]))
    .catch(err => console.error('Error fetching meal details:', err));
}

// Get detailed infomation for one meal
function displayMealDetails(meal) {
  mealDetails.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <p><strong>Category:</strong> ${meal.strCategory}</p>
    <p><strong>Area:</strong> ${meal.strArea}</p>
    <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
    <h3>Ingredients:</h3>
    <ul>${getIngredients(meal).map(ing => `<li>${ing}</li>`).join('')}</ul>
    <button id="addToPlan">Add to Weekly Plan</button>
  `;

  document.getElementById('addToPlan').addEventListener('click', () => addToMealPlan(meal));
}

// Extract ingredients and measurements from meal object
function getIngredients(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${ingredient} - ${measure}`);
    }
  }
  return ingredients;
}

// Meal Plan (json-server)
function fetchMealPlan() {
  fetch(baseURL)
    .then(res => res.json())
    .then(plan => displayMealPlan(plan))
    .catch(err => console.error('Error fetching meal plan:', err));
}

// Get a display of the weekly plan meal list
function displayMealPlan(plan) {
  mealPlanList.innerHTML = '';
  plan.forEach(meal => {
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="50" />
      ${meal.strMeal}
    `;

    // Add "Remove" button for each meal
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => removeFromMealPlan(meal.id));
    li.appendChild(removeBtn);
    mealPlanList.appendChild(li);
  });
}

function addToMealPlan(meal) {
  // Prevent duplicates
  fetch(`${baseURL}?mealId=${meal.idMeal}`)
    .then(res => res.json())
    .then(existing => {
      if (existing.length === 0) {
        // Meal not already in the plan, add i
        return fetch(baseURL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mealId: meal.idMeal,
            strMeal: meal.strMeal,
            strMealThumb: meal.strMealThumb
          })
        }).then(fetchMealPlan);
      } else {
        // Meal is already in the plan
        alert("Meal is already in your weekly plan.");
      }
    })
    .catch(err => console.error('Error checking for duplicates:', err));
}

// Remove a meal from the weekly plan
function removeFromMealPlan(id) {
  fetch(`${baseURL}/${id}`, { method: 'DELETE' })
    .then(fetchMealPlan)
    .catch(err => console.error('Error removing meal:', err));
}
