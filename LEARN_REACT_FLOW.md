# Beginner's Guide: How this React Project Works

Hello! If you are learning React for the first time, this guide is for you. It explains how this project is structured, how the files fit together, and the core React concepts we have used.

---

## 1. Project Folder Structure (Where things are)

Every React project has a folder structure. Here are the files you need to look at:

*   **`index.html`**: The main webpage file. It is mostly blank except for `<div id="root"></div>`. React will put our entire app inside this `div`.
*   **`src/main.jsx`**: The starting point of our React code. It takes our main component (`App.jsx`) and injects it into the `div` inside `index.html`.
*   **`src/App.jsx`**: The "Parent" component of our app. It acts like the brain, managing state and deciding whether to show the Login/Registration screen or the Dashboard screen.
*   **`src/Navbar.jsx`**: A simple navigation bar displayed at the top of our page.
*   **`src/Forms.jsx`**: Contains our Login form and the Data Request registration form.
*   **`src/API_Intergration.jsx`**: Fetches real-time coordinates from a server (API) and displays them on the page.
*   **`src/index.css`**: Simple styles for layout, buttons, inputs, and colors.

---

## 2. The Core React Concepts

### A. What is a Component?
A component is a reusable building block of a website. It is simply a JavaScript function that returns HTML-like code (called JSX).
For example, instead of writing navigation bar HTML code on every page, we write it once in `Navbar.jsx` and use it like an HTML tag:
```jsx
<Navbar title="My React Project" />
```

### B. What are Props?
Props (short for "properties") are how we pass information from a parent component to a child component. They are like function arguments.
*   **Parent (`main.jsx`) passes props**:
    ```jsx
    <App name="Space Satellite" />
    ```
*   **Child (`App.jsx`) receives props**:
    ```jsx
    function App({ name }) {
      return <h1>Welcome to {name}</h1>;
    }
    ```

### C. What is State (`useState`)?
In vanilla JavaScript, if you want to change text on a page, you have to select the element (e.g., `document.getElementById`) and change its inner HTML.
In React, we use **State**. State is a variable that React watches. When state changes, React automatically updates the page for us!
```javascript
const [isLoggedIn, setIsLoggedIn] = useState(false);
```
*   `isLoggedIn` is the variable (starts as `false`).
*   `setIsLoggedIn` is the function we call to change it (e.g., `setIsLoggedIn(true)`).

### D. What is an Effect (`useEffect`)?
Sometimes we need to run code that interacts with things outside of React (like database queries, timers, or API requests). We put this code inside a `useEffect` block.
```javascript
useEffect(() => {
  // This code runs automatically when the page first loads!
  fetchData();
}, []); // The empty brackets [] mean "run this only once when the page loads"
```

---

## 3. How the App Flow Works

1.  **Start**: The app loads and runs `main.jsx`.
2.  **App Mounts**: `main.jsx` starts `App.jsx` and passes it props from a JSON file.
3.  **Default State**: Because the user is not logged in (`isLoggedIn` is `false`), the screen displays the Login/Registration component (`Forms.jsx`).
4.  **Logging In**: When the user enters credentials and clicks login, `Forms.jsx` tells the parent component (`App.jsx`) that the login was successful.
5.  **Dashboard Shows**: `App.jsx` updates its state (`isLoggedIn = true`), causing the screen to change and display the Telemetry cards and the API component (`API_Intergration.jsx`).
6.  **Fetch API Data**: `API_Intergration.jsx` runs, fetches mock data from a web URL, and displays the coordinates on screen using `.map()`.
