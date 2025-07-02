#  Meal Planner & Recipe Finder 

A Single Page Application (SPA) that allows users to search for meals, filter by category, get a random meal suggestion, and manage a personal Weekly Meal Plan. The app uses TheMealDB API and JSON Server for persistent storage.

![Screenshot 2025-06-26 003735](https://github.com/user-attachments/assets/100b3812-41b4-40de-8a49-307d3c2d33bc)

## Features

- 🔍 **Search Meals** by name or main ingredient
- 📂 **Filter Meals** by category (Seafood, Vegetarian, Beef, Chicken, Dessert)
- 🎲 **Random Meal Generator** for surprise recipe suggestions
- 🍽️ **View Detailed Meal Info:** image, category, area, instructions, ingredients
- 🗓️ **Weekly Meal Plan:** Add or remove meals, saved via JSON Server
- 🌗 **Dark/Light Mode Toggle**

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- [TheMealDB API](https://www.themealdb.com/api.php)
- JSON Server (for persistent Weekly Meal Plan)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/recipe-finder-meal-planner.git
cd recipe-finder-meal-planner
```

### 2. Install JSON Server
```bash
npm install -g json-server
```

### 3. Start JSON Server
```bash
json-server --watch db.json --port 3000
```

### 4. Open the App
Open `index.html` in your browser.

## File Structure
```
/frontend
│   index.html
│   script.js
│   style.css
│
db.json
```

## API Endpoints Used
- Search by Meal Name:
  `https://www.themealdb.com/api/json/v1/1/search.php?s=`
- Filter by Category:
  `https://www.themealdb.com/api/json/v1/1/filter.php?c=`
- Random Meal:
  `https://www.themealdb.com/api/json/v1/1/random.php`

## JSON Server Endpoints
- `GET /mealPlan`
- `POST /mealPlan`
- `DELETE /mealPlan/:id`


