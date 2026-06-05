# Kanban Project Management System

A full-stack Kanban-style project management application built with Django REST Framework and React.

The application allows teams to collaborate through boards, task management, role-based permissions, real-time updates, and invitation-based onboarding.

## Features

### Authentication

* JWT Authentication
* Login and Registration
* Secure token refresh mechanism

### Board Management

* Create, update, and delete boards
* Role-based access control
* Board ownership and administration

### Task Management

* Create lists and cards
* Drag and drop cards between lists
* Update and delete tasks

### Team Collaboration

* Invite users to boards
* Token-based invitation system
* Member role management
* Remove members from boards

### Real-Time Features

* WebSocket integration using Django Channels
* Live updates across connected users

### User Profiles

* Avatar uploads
* Cloudinary media storage

### Activity Tracking

* Board activity logs
* Member actions tracking

## Tech Stack

### Backend

* Django
* Django REST Framework
* PostgreSQL
* Django Channels
* JWT Authentication

### Frontend

* React
* React Router
* Axios
* Tailwind CSS

### Deployment

* Backend: Render
* Frontend: Vercel
* Media Storage: Cloudinary

## Screenshots

(Add screenshots here)

## Live Demo

Frontend: [Your Vercel URL]

## Installation

### Backend

```bash
git clone <repository-url>
cd backend

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

## Future Improvements

* Due dates
* Task priorities
* Email notifications
* Redis integration
* Docker deployment
