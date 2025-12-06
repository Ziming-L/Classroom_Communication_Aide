# Classroom_Communication_Aide
This project was developed for the **Technology for Social Good** course during **Fall 2025**, taught by **Dr. Shameem Ahmed**.

## 📖 Overview:
Classroom Communication Aide is a web-based tool designed to improve communication between teachers and ELL students in diverse classrooms. It supports features like real-time translation, speech-to-text, and customizable commands to make learning more inclusive. Learn more about our project on: [Classroom Communication Aide](https://classroomcommunicationaide.github.io/)

## ✨ Features
- Real-time translation for multilingual classrooms
- Speech-to-text for accessibility
- Teacher dashboard for managing classes and messages
- Customizable commands for requests

## 🗂️ Project Structure:
<!-- PROJECT_STRUCTURE_START -->
```
├── .github
│   └── workflows
│       └── update-readme.yml
├── .gitignore
├── README.md
├── package-lock.json
├── scripts
│   └── update_readme.py
└── src
    ├── backend
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── routes
    │   │   ├── authRoutes.js
    │   │   ├── studentRoutes.js
    │   │   ├── teacherRoutes.js
    │   │   └── translateRoutes.js
    │   ├── server.js
    │   ├── services
    │   │   ├── authService.js
    │   │   ├── profileService.js
    │   │   ├── supabaseClient.js
    │   │   └── translateService.js
    │   └── utils
    │       └── defaultCommands.js
    └── frontend
        ├── .gitignore
        ├── App.jsx
        ├── components
        │   ├── CommandPopUp.jsx
        │   ├── EditableButton.jsx
        │   ├── GoBackButton.jsx
        │   ├── MessageBox.jsx
        │   ├── Profile.jsx
        │   ├── StarBox.jsx
        │   ├── SwapButton.jsx
        │   ├── TeacherPage
        │   │   ├── AddClassModal.jsx
        │   │   ├── ClassQueue.jsx
        │   │   ├── MessageQueue.jsx
        │   │   ├── StudentEntry.jsx
        │   │   ├── StudentEntryList.jsx
        │   │   ├── StudentMessage.jsx
        │   │   └── styles.module.css
        │   ├── Tooltip.jsx
        │   └── TranslatorBox.jsx
        ├── eslint.config.js
        ├── hooks
        │   └── useSpeechToText.js
        ├── images
        │   ├── button_icon
        │   │   ├── edit_icon.png
        │   │   ├── send_icon.png
        │   │   └── translate_icon.png
        │   ├── commands_icon
        │   │   ├── .DS_Store
        │   │   ├── chicken_moving.png
        │   │   ├── computer_moving.png
        │   │   └── ... (7 more)
        │   ├── other
        │   │   ├── bad_face.png
        │   │   ├── cool_face.png
        │   │   ├── lightning.png
        │   │   └── ... (1 more)
        │   ├── translate_screen
        │   │   ├── flip.png
        │   │   ├── microphone.png
        │   │   ├── sound.png
        │   │   └── ... (2 more)
        │   └── user_profile_icon
        │       ├── baby_chick_1.png
        │       ├── badger_1.png
        │       ├── bat_1.png
        │       └── ... (124 more)
        ├── index.css
        ├── index.html
        ├── main.jsx
        ├── package-lock.json
        ├── package.json
        ├── pages
        │   ├── AuthCallbackPage.jsx
        │   ├── LandingPage.jsx
        │   ├── LoginPage.jsx
        │   ├── StudentPage.jsx
        │   ├── StudentSubPages
        │   │   ├── CommandEditPage.jsx
        │   │   └── StudentProfile.jsx
        │   ├── TeacherPage.jsx
        │   ├── TeacherSubPages
        │   │   ├── AllStudentPage.jsx
        │   │   ├── CustomMessagePage.jsx
        │   │   ├── RequestLogPage.jsx
        │   │   └── TeacherProfile.jsx
        │   └── TranslatorPage.jsx
        ├── utils
        │   ├── auth.js
        │   ├── constants.js
        │   ├── speechSynthesis.js
        │   ├── studentButtons.js
        │   ├── supabase.js
        │   └── translateText.js
        └── vite.config.js
```
<!-- PROJECT_STRUCTURE_END -->



## 🚀 Getting Started
1. **Install Node.js**  
   Download and install [Node.js](https://nodejs.org/en). npm is included with Node.js.

2. **Clone the repository**  
   ```bash
   git clone https://github.com/Ziming-L/Classroom_Communication_Aide.git
   ```
   
3. **Navigate to the project folder and install dependencies:**
    ```bash
    cd src/frontend
    npm install
    cd ../backend
    npm install
    ```

## 🔑 Backend Environment Setup
To run the backend, you need to configure environment variables for API keys and services. Create a `.env` file inside the `src/backend` directory with the following content:

    # Server configuration
    PORT=YOUR_PORT_NUMBER
    
    # Supabase credentials
    SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    SUPABASE_SECRET_KEY=YOUR_SUPABASE_SECRET_KEY
    
    # Azure Translator API credentials
    AZURE_TRANSLATE_KEY=YOUR_AZURE_TRANSLATOR_API_KEY
    AZURE_LOCATION=YOUR_AZURE_TRANSLATOR_LOCATION

### 🗒️ Notes:
- You will need a [Supabase](https://supabase.com/) account and a [Microsoft Azure](https://azure.microsoft.com/en-us/) account.

## 🔍 Supabase RPC Usage
We implemented custom RPC functions in Supabase. These functions:
- Handle complex queries and batch updates.
- Improve performance by running logic at the database layer.
- Keep sensitive operations secure and centralized.
- Handle rollbacks on errors without adding to the database, ensuring transactional integrity.

This approach improves performance and keeps sensitive logic inside the database layer.


## ⚠️ Deployment Notes
This project relies on custom **Supabase RPC functions** and specific **Database tables** that are part of our private Supabase instance.  
Because these database functions and schema are not included in this repository, the backend cannot be fully deployed without access to our Supabase configuration.

If you want to explore or contribute:
- You can run the **frontend** locally with mock data for limited functionality.
- For full functionality, please contact the team for access or replicate the database schema and RPC functions in your own Supabase project.


## 🖥️ Frontend Environment Setup
To run the frontend, you need to configure environment variables for Supabase, Google OAuth, and API integration. Create a `.env` file inside the `src/frontend` directory with the following content:

    # Supabase credentials
    VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    
    # Google OAuth credential
    VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
    
    # Backend API base URL
    VITE_API_BASE_URL=YOUR_BACKEND_URL


## ▶️ Running the Project
To test the actual website locally, you need to run both the backend and frontend servers:

1. **Start the backend server**  
- Open a terminal and run:
   ```bash
   cd src/backend && node server.js
   ```
2. **Start the frontend server**
- In a separate terminal, run:
   ```bash
   cd src/frontend && npm run dev
   ```
   

## 🛠️ Tech Stack
- Frontend: React + Tailwind CSS
- Backend: Node.js + Express
- Database: Supabase

## 🧑‍🤝‍🧑 Team Members:
- [Ziming Lei Lin](https://github.com/Ziming-L)
- [Diana Alvarado](https://github.com/alvardia) 
- [Jonah Paulsene](https://github.com/Jonah-Paulsene)
- [Kyle Downing](https://github.com/kyledowning)

