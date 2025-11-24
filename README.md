# Classroom_Communication_Aide
This is a project for Technology for Social Good class

Our website about our project is on: [Classroom Communication Aide](https://classroomcommunicationaide.github.io/)

## Folder Layout:
<!-- FOLDER_STRUCTURE_START -->
```
├── .git
│   ├── FETCH_HEAD
│   ├── HEAD
│   ├── config
│   ├── description
│   ├── hooks
│   │   ├── applypatch-msg.sample
│   │   ├── commit-msg.sample
│   │   ├── fsmonitor-watchman.sample
│   │   ├── post-update.sample
│   │   ├── pre-applypatch.sample
│   │   ├── pre-commit.sample
│   │   ├── pre-merge-commit.sample
│   │   ├── pre-push.sample
│   │   ├── pre-rebase.sample
│   │   ├── pre-receive.sample
│   │   ├── prepare-commit-msg.sample
│   │   ├── push-to-checkout.sample
│   │   ├── sendemail-validate.sample
│   │   └── update.sample
│   ├── index
│   ├── info
│   │   └── exclude
│   ├── logs
│   │   ├── HEAD
│   │   └── refs
│   │       ├── heads
│   │       │   └── main
│   │       └── remotes
│   │           └── origin
│   │               └── main
│   ├── objects
│   │   ├── info
│   │   └── pack
│   │       ├── pack-5cf0faddf28949e871c01f6340a521c03614c114.idx
│   │       ├── pack-5cf0faddf28949e871c01f6340a521c03614c114.pack
│   │       └── pack-5cf0faddf28949e871c01f6340a521c03614c114.rev
│   ├── refs
│   │   ├── heads
│   │   │   └── main
│   │   ├── remotes
│   │   │   └── origin
│   │   │       └── main
│   │   └── tags
│   └── shallow
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
        │   │   ├── cup.png
        │   │   ├── glasses.png
        │   │   ├── pencil.png
        │   │   ├── question.png
        │   │   ├── raining.png
        │   │   ├── sick.png
        │   │   └── star.png
        │   ├── other
        │   │   ├── bad_face.png
        │   │   ├── cool_face.png
        │   │   ├── lightning.png
        │   │   └── star_shining.png
        │   ├── translate_screen
        │   │   ├── flip.png
        │   │   ├── microphone.png
        │   │   ├── sound.png
        │   │   ├── stop.png
        │   │   └── x.png
        │   └── user_profile_icon
        │       ├── baby_chick_1.png
        │       ├── badger_1.png
        │       ├── bat_1.png
        │       ├── bear_1.png
        │       ├── beaver_1.png
        │       ├── bird_1.png
        │       ├── bison_1.png
        │       ├── boar_1.png
        │       ├── boy_1.png
        │       ├── boy_2.png
        │       ├── boy_3.png
        │       ├── boy_4.png
        │       ├── camel_1.png
        │       ├── camel_2.png
        │       ├── cat_1.png
        │       ├── cat_2.png
        │       ├── cat_3.png
        │       ├── chicken_1.png
        │       ├── child_1.png
        │       ├── child_2.png
        │       ├── child_3.png
        │       ├── child_4.png
        │       ├── child_5.png
        │       ├── child_6.png
        │       ├── chipmunk_1.png
        │       ├── cow_1.png
        │       ├── crocodile_1.png
        │       ├── deer_1.png
        │       ├── default_user.png
        │       ├── dodo_1.png
        │       ├── dog_1.png
        │       ├── dog_2.png
        │       ├── dog_3.png
        │       ├── dolphin_1.png
        │       ├── donkey_1.png
        │       ├── dove_1.png
        │       ├── dragon_1.png
        │       ├── dragon_2.png
        │       ├── eagle_1.png
        │       ├── elephant_1.png
        │       ├── ewe_1.png
        │       ├── flamingo_1.png
        │       ├── fox_1.png
        │       ├── frog_1.png
        │       ├── giraffe_1.png
        │       ├── goat_1.png
        │       ├── hamster_1.png
        │       ├── hatching_chick_1.png
        │       ├── hedgehog_1.png
        │       ├── hippopotamus_1.png
        │       ├── horse_1.png
        │       ├── horse_2.png
        │       ├── kangaroo_1.png
        │       ├── koala_1.png
        │       ├── leopard_1.png
        │       ├── lion_1.png
        │       ├── lizard_1.png
        │       ├── llama_1.png
        │       ├── mammoth_1.png
        │       ├── monkey_1.png
        │       ├── monkey_2.png
        │       ├── monkey_3.png
        │       ├── monkey_4.png
        │       ├── moose_1.png
        │       ├── mouse_1.png
        │       ├── otter_1.png
        │       ├── owl_1.png
        │       ├── ox_1.png
        │       ├── panda_1.png
        │       ├── parrot_1.png
        │       ├── peacock_1.png
        │       ├── penguin_1.png
        │       ├── person_1.png
        │       ├── person_2.png
        │       ├── person_3.png
        │       ├── person_4.png
        │       ├── phoenix_bird_1.png
        │       ├── pig_1.png
        │       ├── pig_2.png
        │       ├── polar_bear_1.png
        │       ├── rabbit_1.png
        │       ├── rabbit_2.png
        │       ├── raccoon_1.png
        │       ├── ram_1.png
        │       ├── rhinoceros_1.png
        │       ├── sauropod_1.png
        │       ├── seal_1.png
        │       ├── skunk_1.png
        │       ├── sloth_1.png
        │       ├── snake_1.png
        │       ├── spouting-whale_1.png
        │       ├── swan_1.png
        │       ├── t-rex_1.png
        │       ├── teacher_1.png
        │       ├── teacher_10.png
        │       ├── teacher_11.png
        │       ├── teacher_12.png
        │       ├── teacher_13.png
        │       ├── teacher_14.png
        │       ├── teacher_15.png
        │       ├── teacher_16.png
        │       ├── teacher_17.png
        │       ├── teacher_18.png
        │       ├── teacher_2.png
        │       ├── teacher_3.png
        │       ├── teacher_4.png
        │       ├── teacher_5.png
        │       ├── teacher_6.png
        │       ├── teacher_7.png
        │       ├── teacher_8.png
        │       ├── teacher_9.png
        │       ├── tiger_1.png
        │       ├── tiger_2.png
        │       ├── turtle_1.png
        │       ├── unicorn_1.png
        │       ├── water_buffalo_1.png
        │       ├── whale_1.png
        │       ├── wolf_1.png
        │       ├── woman_1.png
        │       ├── woman_2.png
        │       ├── woman_3.png
        │       ├── woman_4.png
        │       ├── woman_5.png
        │       ├── woman_6.png
        │       ├── woman_7.png
        │       ├── woman_8.png
        │       └── zebra_1.png
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
<!-- FOLDER_STRUCTURE_END -->

## Group Member:
- [Ziming Lei Lin](https://github.com/Ziming-L)
- [Diana Alvarado](https://github.com/alvardia)
- [Jonah Paulsene](https://github.com/Jonah-Paulsene)
- [Kyle Downing](https://github.com/kyledowning)
