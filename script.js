const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categorySelect = document.getElementById('categorySelect');
const randomBtn = document.getElementById('randomBtn');
const mealList = document.getElementById('mealList');
const mealDetails = document.getElementById('mealDetails');
const mealPlanList = document.getElementById('mealPlanList');
const toggleTheme = document.getElementById('toggleTheme');
const baseURL = "http://localhost:3000/mealPlan";

document.addEventListener('DOMContentLoaded', fetchMealPlan);

searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchMeals(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
  }
});

categorySelect.addEventListener('change', () => {
  const category = categorySelect.value;
  if (category) {
    fetchMeals(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
  }
});

randomBtn.addEventListener('click', () => {
  fetchMeals(`https://www.themealdb.com/api/json/v1/1/random.php`, true);
});

toggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
});
document.body.classList.add('light');

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
    mealDiv.innerHTML = `<h4>${meal.strMeal}</h4><img src="${meal.strMealThumb}" alt="${meal.strMeal}">`;
    mealDiv.addEventListener('click', () => {
      fetchMealDetails(meal.idMeal);
    });
    mealList.appendChild(mealDiv);
  });
}

function fetchMealDetails(id) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => displayMealDetails(data.meals[0]));
}

function displayMealDetails(meal) {
  mealDetails.innerHTML = `<h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <p><strong>Category:</strong> ${meal.strCategory}</p>
    <p><strong>Area:</strong> ${meal.strArea}</p>
    <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
    <h3>Ingredients:</h3>
    <ul>${getIngredients(meal).map(ing => `<li>${ing}</li>`).join('')}</ul>
    <button id="addToPlan">Add to Weekly Plan</button>`;

  document.getElementById('addToPlan').addEventListener('click', () => addToMealPlan(meal));
}

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

function fetchMealPlan() {
  fetch(baseURL)
    .then(res => res.json())
    .then(plan => displayMealPlan(plan));
}

function displayMealPlan(plan) {
  mealPlanList.innerHTML = '';
  plan.forEach(meal => {
    const li = document.createElement('li');
    li.textContent = meal.strMeal;
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => removeFromMealPlan(meal.id));
    li.appendChild(removeBtn);
    mealPlanList.appendChild(li);
  });
}

function addToMealPlan(meal) {
  fetch(baseURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: meal.idMeal, strMeal: meal.strMeal })
  }).then(fetchMealPlan);
}

function removeFromMealPlan(id) {
  fetch(`${baseURL}/${id}`, { method: 'DELETE' })
    .then(fetchMealPlan);
}
