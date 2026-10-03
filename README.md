# Petazl's Retro Portfolio

Instead of presenting my portfolio as a conventional webpage, the site is built to feel like using an old desktop operating system — complete with draggable windows, a taskbar, desktop icons, a music player, CRT effects, and other interactive elements.

Live site: [Coming soon]

# Features

-  Windows 98-inspired desktop interface
-  Draggable application windows
-  Window focus and z-index management
-  Minimise and maximise window functionality
-  Desktop application icons
-  Built-in music player
-  Randomised track selection
-  Taskbar volume control and mute functionality
-  System clock
-  Animated CRT monitor effects
-  Custom retro scrollbars
-  Responsive behaviour for smaller screens
-  Component-based React architecture

# Stack

React - UI and component architecture
TypeScript - Type=safe application logic
Vite - Development server and build tooling
CSS - Windows 98-inspired styling and animations
HTML5 Audio API - Music player functionality
ESLint - Code quality and linting

# Architecture

The project was originally built as a single large React component, but has since been refactored into a modular component architecture.

The application is now separated into:

-  Components — visual/UI elements

-  Hooks — application logic and state management

-  Data — static application data

-  Types — shared TypeScript definitions

-  Assets — images and music

# Project Structure

```
src/
│
├── App.tsx
├── App.css
│
├── components/
│   │
│   ├── Desktop/
│   │   ├── Desktop.tsx
│   │   └── Desktop.css
│   │
│   ├── Windows/
│   │   ├── RetroWindow.tsx
│   │   ├── RetroWindow.css
│   │   │
│   │   ├── AboutWindow.tsx
│   │   ├── AboutWindow.css
│   │   │
│   │   ├── SocialWindow.tsx
│   │   ├── SocialWindow.css
│   │   │
│   │   ├── MusicWindow.tsx
│   │   └── MusicWindow.css
│   │
│   ├── Taskbar/
│   │   ├── Taskbar.tsx
│   │   ├── Taskbar.css
│   │   │
│   │   ├── VolumeControl.tsx
│   │   ├── VolumeControl.css
│   │   │
│   │   ├── Clock.tsx
│   │   └── Clock.css
│   │
│   └── CRT/
│       ├── CRT.tsx
│       └── CRT.css
│
├── data/
│   └── playlist.ts
│
├── hooks/
│   ├── useAudioPlayer.ts
│   └── useWindowManager.ts
│
├── types/
│   └── windows.ts
│
└── assets/
    ├── about-me.png
    ├── social.png
    ├── desktop-background.png
    ├── windows98-cd.png
    │
    └── music/
        ├── A Night Alone -TrackTribe.mp3
        ├── Entrance Wreath - Chika.mp3
        ├── Local Elevator - Kevin MacLeod.mp3
        ├── Muscat and White Dishes - Takahashi Takashi.mp3
        ├── Relaxed Scene - James Clarke.mp3
        ├── Summer Sky and Homework - Takahashi Takashi.mp3
        └── Wind Trail - Chika.mp3
```

# Roadmap

This portfolio is still an ongoing project. Potential future additions include:

-  Projects application
-  Individual project windows
-  File Explorer / "My Computer"
-  Skills / system information window
-  Interactive mini-game
-  Notepad / blog system
-  More desktop applications
-  More animations and system interactions
-  Additional personal content

# Design

The visual design is heavily inspired by the desktop software of the Windows 95/98 era, whilst the implementation is built using standard modern web technologies.

# Credits

Music and icons used by the website is credited to the respective artists.

-  Tracktribe
-  Chika
-  Kevin MacLeod
-  Takahashi Takashi
-  James CLarke
-  Microsoft Corporation
-  Alex Meub

Additional assets and design elements are either original to this project or used in accordance with their respective licences.

# License

This project is primarily a personal portfolio project.
Unless otherwise stated, the source code and original assets are © Richmond Kyawzay.
Third-party assets, including music, remain the property of their respective creators and are subject to their original licences
