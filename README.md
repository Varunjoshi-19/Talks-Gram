## LIVE LINK 🔗  <a href="https://talksgram-client.vercel.app/">VISIT_HERE</a>

## Description 📚. 
It’s a fun and easy way to stay connected with friends. Chat in real time, share photos, videos, voice messages, and even documents. You can post your favorite moments, follow people you like, and join the conversation with likes and comments all in one place.



## Table of Contents 📑
- [Features ✨](#features-%E2%9C%A8)
- [Tech Stack 💻](#tech-stack-%F0%9F%92%BB)
- [Installation 🛠️](#installation-%F0%9F%95%A7)
- [Usage 🚀](#usage-%F0%9F%9A%80)
- [Project Structure 📂](#project-structure-%F0%9F%97%82)
- [Footer 👣](#footer-%F0%9F%91%A3)



## Features ✨

- **User Authentication:** Secure signup, login, and password reset functionalities.
- **Real-Time Chat:** Send and receive instant text messages with other users.
- **Multimedia Messaging:** Share voice notes, images, videos, and documents seamlessly.
- **Post Creation:** Upload photos, videos, and reels as posts.
- **Reels Section:** Browse and upload short-form videos in the dedicated reels section.
- **User Following:** Follow and unfollow users to build your network.
- **Like and Comment:** Like posts and comment to engage with the community.
- **Post Sharing:** Share posts within the app to increase reach.
- **Profile Management:** Update profile details including bio and display picture.
- **Notifications:** Receive real-time alerts for messages, likes, comments, and new followers.
- **Content Moderation:** Automatic filtering of inappropriate content to maintain a safe environment.
- **Message and Post Editing:** Edit or delete your messages, posts, and comments as needed.




## Tech Stack 💻
- **Frontend:**
  - React 
  - Typescript
  - Zod
  - Zustand
  - Tailwind and Vanilla CSS 
  - Axios 
- **Backend:**
  - Node.js ⚙️
  - Express 🌐
  - Mongoose 🍃



## Installation 🛠️
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Varunjoshi-19/Talks-Gram.git
   cd Talks-Gram
   ```

2. **Frontend Setup:**
   ```bash
   cd CLIENT
   npm install
   ```
   - Create a `.env.local` file in the `CLIENT` directory.
   - Add the following environment variable (example value):
     ```
      REACT_APP_BACKEND_URL=<URL>
     ```
3. **Backend Setup:**
   ```bash
   cd SERVER
   npm install
   ```

   - Create a `.env` file in the `SERVER` directory.
   - Add the following environment variables (example values):

     ```
     FRONTEND_URL=""
     SCERET_TOKEN_KEY=""
     CHAT_KEY=""
     NOTIFICATION_KEY=""
     COMMUICATION_KEY=""
     OTP_KEY=""
     MONGODB_URI=""
     
     ```


## Usage 🚀
1. **Start the Backend:**
   ```bash
   cd backend
   npm run dev # or npm start
   ```
   This will start the backend server, typically on port 4000 but you can change.

2. **Start the Frontend:**
   ```bash
   cd frontend
   npm run dev # or npm start
   ```
   This will start the frontend development server, usually on port 5173.

3. **Access the Application:**
   Open your web browser and navigate to `http://localhost:5173` to access the TalksGram platform.

## Use Cases

- **Instant Messaging:** Send real-time text, voice notes, images, videos, and documents to friends or groups.
- **Social Sharing:** Create and share posts, photos, videos, and reels with followers.
- **Networking:** Follow and connect with other users to build your social network.
- **Community Engagement:** Like, comment, and share posts to interact with the community.
- **Content Discovery:** Explore trending reels and posts from users you follow or the wider community.
- **User Profile Management:** Customize and update your profile to share more about yourself.
- **Notification Management:** Receive notifications for messages, likes, comments, and follows.
- **Safe Environment:** Automatic content moderation to filter inappropriate content.
- **Media Exchange:** Share multimedia content easily within chats to enhance conversations.



## Project Structure 📂
```
Tals-Gram/
CLIENT/
└── src/
    ├── Components/    # Reusable UI components, like buttons, forms, cards
    ├── Context/       # React context providers for global state management
    ├── Images/        # Static image assets (logos, icons, etc.)
    ├── Interfaces/    # TypeScript interfaces and types for component props and APIs
    ├── modules/       # Feature-specific modules or utilities
    ├── Scripts/       # Helper scripts and custom hooks
    ├── Styling/       # Stylesheets (CSS, SCSS, styled components, etc.)
    ├── UI/            # Composed UI layouts, screens, or views
    ├── App.tsx        # Root React application component
    ├── main.tsx       # Main file for rendering the React app
    ├── vite-env.d.ts  # Vite-specific TypeScript declarations
    public/                # Static public assets accessible at build time
    .gitignore             # Git configuration to exclude files/folders
    eslint.config.js       # ESLint configuration for code linting
    index.html             # Main HTML template for the app
    package-lock.json      # NPM package lock file for version consistency
    package.json           # NPM dependencies and scripts
    README.md              # Project documentation
    tsconfig.*.json        # TypeScript configuration files
    vercel.json            # Vercel deployment configuration

SERVER/                # Backend code
└── src/
    ├── authentication/ # Handles user login, signup, and token management
    ├── config/         # Configuration files (environment, database connections, etc.)
    ├── controllers/    # Request handlers (business logic for API endpoints)
    ├── database/       # Database-related code (connection, queries, models)
    ├── dist/           # Compiled output (production build files)
    ├── interfaces/     # TypeScript interfaces/types for strong typing
    ├── main/           # Entry point modules or initialization files
    ├── middlewares/    # Express middlewares for validation, error handling, authentication, etc.
    ├── models/         # Data models for MongoDB/SQL (schemas, definitions)
    ├── public/         # Static assets (images, uploads, etc.)
    ├── routes/         # API route definitions
    ├── services/       # Helper services (utility functions, business logic abstractions)
    ├── utils/          # Utility functions and constants
    ├── index.ts        # Main server entry file
    ├── request.rest    # API testing requests (for REST Client extension)
    ├── testing.js      # Test scripts
    ├── tsconfig.json   # TypeScript compiler configuration
    ├── package.json    # NPM dependencies and scripts
    ├── package-lock.json # Precise version info for NPM packages
    ├── README.md       # Project documentation
    └── .gitignore      # Files and folders to be excluded from git

```

## Footer 👣
- Repository Name: TalksGram
- Repository URL: [https://github.com/Varunjoshi-19/Talks-Gram.git]
- Author: Varun Joshi
- Contact: varunjoshi6283@gmail.com

