📚 Book Reader – Frontend

A user-friendly React application that allows users to search, view, and manage their personal book collection using the Google Books API.

🚀 Getting Started

📦 Install Dependencies
npm install
▶️ Run in Development Mode
npm start
The app will start on http://localhost:3000.
Hot reloading is enabled, so changes will automatically reflect in the browser.
Any linting issues will be shown in the console.

🛠️ Project Structure

React + TypeScript
TailwindCSS for styling
React Query for data fetching and caching
Zustand for local state management (modals, selected books)
React Router for page navigation
Toastify for notifications
🔐 Authentication

This frontend relies on JWT-based authentication.
You must be logged in to search and manage books. The token is stored in localStorage and attached to every API request.

🔍 Features

🔎 Search books by title and/or author
📚 View book details (description, authors, rating, categories)
💾 Add books to your personal collection
📖 Organize books by reading status (Plan to Read, Reading, Read, Dropped)
⭐ View and manage recommendations
🌙 Responsive layout and optimized UX
🌐 Environment Variables

Create a .env file in the root of the project with the following variables:

REACT_APP_API_URL=http://localhost:8080
You can change this URL to point to your deployed backend server.
Make sure it matches the origin accepted by your backend CORS configuration.

🖼️ Screenshots

Here’s a preview of the book collection in action:

<img src="./public/imagesServer/bookCollection.png" width="100%" alt="Book Collection" />
🤝 Contributing

Contributions are welcome!
To propose improvements, report issues, or submit a feature, please:

Fork this repository
Create your feature branch (git checkout -b feature/your-feature)
Commit your changes (git commit -m 'Add some feature')
Push to the branch (git push origin feature/your-feature)
Open a pull request