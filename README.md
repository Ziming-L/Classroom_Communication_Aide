# Classroom_Communication_Aide
This is a project for **Technology for Social Good**.

## Overview:
Classroom Communication Aide is a web-based tool designed to improve communication between teachers and ELL students in diverse classrooms. It supports features like real-time translation, speech-to-text, and customizable commands to make learning more inclusive. Our website about our project is on: [Classroom Communication Aide](https://classroomcommunicationaide.github.io/)

## Features
- Real-time translation for multilingual classrooms
- Speech-to-text for accessibility
- Teacher dashboard for managing classes and messages
- Customizable commands for requests

## Project Structure:
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


## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Ziming-L/Classroom_Communication_Aide.git
   ```
2. Navigate to the project folder and install dependencies:
    ```bash
    cd src/frontend
    npm install
    cd ../backend
    npm install
    ```

## Tech Stack
- Frontend: React + Tailwind CSS
- Backend: Node.js + Express
- Database: Supabase

## Team Members:
- [Ziming Lei Lin](https://github.com/Ziming-L)
- [Diana Alvarado](https://github.com/alvardia)
- [Jonah Paulsene](https://github.com/Jonah-Paulsene)
- [Kyle Downing](https://github.com/kyledowning)

