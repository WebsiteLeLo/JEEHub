# JEE Aspirant Task Management App

## Project Overview
A feature-rich, animated task management app designed specifically for JEE aspirants. The app helps students organize their study time with subject-wise task management, important links, and time tracking capabilities.

## Key Features
- Subject-wise task organization
- Time tracking and management
- Important links section
- Responsive design with animations
- Local storage for data persistence
- Modern UI with dark/light themes

## Project Architecture
- **Frontend**: React with Vite, TypeScript, Tailwind CSS, shadcn/ui (pure static site)
- **Backend**: None — fully client-side, no server required
- **Data Storage**: Browser localStorage for all persistence
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom animations
- **Build output**: `dist/` directory (Vite build)
- **Deployment**: Render static site — Build command: `npm run build`, Publish directory: `dist`

## User Preferences
- Data should be stored in local storage
- Wants a stylish, animated, and responsive design
- Requires features for JEE aspirants specifically
- User name should be collected and stored locally
- Personalized experience with user's name throughout the app

## Recent Changes
- Initial project setup (August 26, 2025)
- Created comprehensive data model for tasks, subjects, and links
- Implemented local storage persistence
- Added tabbed interface with separate sections (August 26, 2025):
  - Dashboard: Overview with stats, subject progress, and quick actions
  - Tasks: Full task management with filtering and search
  - Subjects: Subject-wise progress tracking and task organization
  - Resources: Study material links and resource management
  - Timer: Study timer with presets and session tracking
- Added user profile system with welcome modal (August 26, 2025):
  - Collects user's real name on first visit
  - Stores user preferences in local storage
  - Personalizes dashboard and timer with user's name
  - User profile management with preferences
- Added theme system with dark/light mode toggle (August 26, 2025):
  - Theme provider with localStorage persistence
  - Theme toggle button in header
  - Full dark mode support with proper color schemes
  - Enhanced responsive design across all components
  - Improved styling with semantic color tokens
- Enhanced UI with icons and animations (August 26, 2025):
  - Replaced all emojis with proper Lucide React icons for better visual consistency
  - Added smooth hover animations and transitions throughout the app
  - Enhanced progress cards with gradient overlays and interactive effects
  - Improved header with backdrop blur and animated elements
  - Added comprehensive keyframe animations for better user experience
  - Enhanced tab navigation with scale and transform effects
- Fixed resources functionality with local storage and custom popups (August 26, 2025):
  - Implemented full CRUD operations for resources with local storage persistence
  - Created custom ConfirmationDialog component for deletion confirmations
  - Fixed popup/modal issues with proper state management
  - Enhanced resource management with user-friendly confirmation dialogs
  - Improved theme consistency throughout the resources section
  - Added proper toast notifications for user feedback
- Made all modals fully responsive for mobile devices (August 26, 2025):
  - Updated SimpleModal base component with responsive breakpoints
  - Enhanced all form modals (task, resource, welcome, confirmation) for mobile-first design
  - Added responsive typography, spacing, and button layouts
  - Implemented stacked button layouts on mobile, side-by-side on desktop
  - Enhanced touch-friendly interactions and proper viewport sizing
  - Removed test modal buttons and cleaned up debugging components
- Added Schedule with Holiday day (November 2, 2025):
  - Added "Holiday" as a new day option in the schedule
  - Updated schedule day selector to include Holiday
  - Full support for scheduling tasks on holidays
- Added "For You" motivational tab (November 2, 2025):
  - Bilingual motivational quotes (English and Hindi) with cycling functionality
  - Motivational image cards with gradient backgrounds
  - Personal notes section with full CRUD operations
  - All data persisted in local storage
  - Fully responsive design with proper animations
- Added data management features to avatar dropdown (November 2, 2025):
  - Reset option to clear all application data with confirmation dialog
  - Export option to download all data as JSON file
  - Import option to restore data from JSON file with error handling
  - Toast notifications for all operations
  - Secure client-side file handling