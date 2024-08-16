
# Electric Museum

## Live Website

[Electric Museum](https://electric-museum.web.app)

## Repositories

- **Frontend:** [Electric Museum Client](https://github.com/arparvej1/electric-museum-client)
- **Backend:** [Electric Museum Server](https://github.com/arparvej1/electric-museum-server)

## Project Overview

Electric Museum is a full-stack single-page web application built using the MERN stack. The website allows users to browse and search for products, with functionalities like pagination, filtering by categories, sorting, and user authentication.

### Key Features

1. **Pagination**: Efficient product loading with pagination.
2. **Searching**: Search for products by name.
3. **Categorization**: Filter products by Brand Name, Category Name, and Price Range.
4. **Sorting**: Sort products by Price (Low to High, High to Low) and Date Added (Newest First).
5. **Authentication**: Secure user authentication using Google and Email/Password with Firebase.
6. **Responsive Design**: Mobile-first design for a seamless experience across devices.

## Tech Stack

- **Frontend**: React.js, CSS, Firebase Authentication
- **Backend**: Node.js, Express.js, MongoDB
- **Others**: Mongoose, Firebase Hosting

## Setup Instructions

### Backend

1. Clone the backend repository:

   \```bash
   git clone https://github.com/arparvej1/electric-museum-server.git
   cd electric-museum-server
   \```

2. Install the required dependencies:

   \```bash
   npm install
   \```

3. Create a `.env` file in the root directory and add your MongoDB connection string and other environment variables:

   \```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   \```

4. Run the server:

   \```bash
   npm start
   \```

### Frontend

1. Clone the frontend repository:

   \```bash
   git clone https://github.com/arparvej1/electric-museum-client.git
   cd electric-museum-client
   \```

2. Install the required dependencies:

   \```bash
   npm install
   \```

3. Create a `.env` file in the root directory and add your Firebase configuration:

   \```env
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
   \```

4. Run the frontend:

   \```bash
   npm start
   \```

## Usage

1. Access the website via the [live link](https://electric-museum.web.app).
2. Use the search bar to find specific products by name.
3. Filter products using the categorization options.
4. Sort products by price or date added.
5. Authenticate using Google or Email/Password to access additional features.

## Contributing

Feel free to fork the repositories and submit pull requests. Please ensure your code follows the project’s coding guidelines.

## License

This project is licensed under the MIT License. For details, please refer to the LICENSE file.
