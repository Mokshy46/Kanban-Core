<div align="center">

# Kanban Core

### A Production-Grade Collaborative Project Management Platform

![Realtime Demo](./Demo-gif.mp4)

**[Live Demo](https://kanban-core-gray.vercel.app)** 

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Highlights](#-key-highlights)
- [Features](#-features)
- [Architecture Overview](#-architecture-overview)
- [System Design](#-system-design)
- [Database & Backend](#-database--backend)
- [Real-Time Collaboration](#-real-time-collaboration)
- [Security](#-security)
- [API Design](#-api-design)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Future Improvements](#-future-improvements)

---

## Overview

**Kanban Core** is a full-stack collaborative project management platform built for real-world team workflows. Inspired by tools like Trello and Linear, it enables teams to organize tasks on live-synced Kanban boards, manage workspace permissions, invite members via email, and track granular project activity - all in real time.

The platform was architected with production-grade concerns in mind: persistent task ordering, role-based access control, WebSocket-powered collaboration, optimistic UI updates, and a clean RESTful API with proper rate limiting, pagination, and validation.

---

## Key Highlights

| Capability | Implementation |
|---|---|
| **Real-Time Sync** | Django Channels (WebSocket) - live board updates across all connected clients |
| **Role-Based Access** | Owner / Admin / Member roles enforced at both API and UI layers |
| **Persistent Ordering** | Task position stored in DB; drag-and-drop order survives page refresh |
| **Optimistic Updates** | UI reflects changes instantly before server confirmation |
| **Token Invitations** | Secure email-based invite system with signed tokens |
| **Activity Feed** | Human-readable audit log: "Mokshy added John to the Board" |
| **Media Uploads** | Cloudinary-backed avatar storage with CDN delivery |
| **Secure API** | JWT auth, throttling, rate limiting, input validation, proper HTTP status codes |

---

## Features

### Authentication & Security

- JWT-based login and registration with secure token refresh
- Protected API endpoints - unauthenticated requests rejected with `401 Unauthorized`
- Rate limiting and request throttling to prevent abuse
- Input validation with descriptive error responses
- Proper HTTP status codes throughout (`200`, `201`, `400`, `401`, `403`, `404`, `422`)

### Authorization & Permissions

- Three-tier role system: **Owner**, **Admin**, **Member**
- Workspace access is strictly scoped - users can only interact with boards they belong to
- Board modification (member management, settings) restricted to Owners and Admins
- Resource-level authorization checks on every mutating API operation

### Board & Task Management

- Full CRUD for boards, lists, and tasks
- Drag-and-drop task movement between lists with **persisted order in the database**
- Task assignment to workspace members
- Filter tasks by assignee
- Full-text task search
- Soft state management, no unnecessary full-page reloads

### Collaboration & Invitations

- Invite members by email via a **signed token-based invitation system**
- Workspace membership management (promote, demote, remove)
- Real-time board updates pushed instantly to all active collaborators via WebSocket

### Activity Tracking

Every significant action is recorded and surfaced in a human-readable activity feed:

```
* Mokshy added John to the Board
* Alex joined the board
* Task "User Auth" was created
* Mike updated "Fix login bug"
```

### User Experience

- Fully responsive, mobile-friendly layout built with Tailwind CSS
- Skeleton loading states and empty state illustrations
- Error boundary handling with user-friendly fallbacks
- Optimistic UI updates changes appear instantly, with rollback on failure
- Member avatars powered by Cloudinary CDN

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│           React + React Router + Axios                  │
│         Tailwind CSS · Optimistic Updates               │
└──────────────────────┬──────────────────────────────────┘
                       │  HTTP (REST) + WebSocket
┌──────────────────────▼──────────────────────────────────┐
│                       SERVER                            │
│         Django + Django REST Framework                  │
│      Django Channels (ASGI) · JWT Auth Layer            │
│         Rate Limiting · Input Validation                │
└────────────┬──────────────────────┬─────────────────────┘
             │                      │
┌────────────▼──────────┐  ┌────────▼────────────────────┐
│      PostgreSQL        │  │        Cloudinary           │
│   Relational Data      │  │     Media / Avatars         │
│   Task Order Persist   │  │     CDN Delivery            │
└────────────────────────┘  └─────────────────────────────┘
```


## System Design

### Backend Design Decisions

**Django Channels over polling:** WebSocket connections are maintained per board session. When a task is mutated, the server publishes to a channel group (`board_{id}`), and all active subscribers receive the event enabling true real-time collaboration without polling overhead.

**Task ordering via position field:** Each task stores an integer `position` value within its list. On drag-and-drop reorder, the backend recalculates and batch-updates affected positions atomically, ensuring order consistency across concurrent users.

**Role enforcement at the view layer:** Permission classes are composed per endpoint. A custom `IsBoardAdminOrOwner` permission class is applied to destructive operations. Member-only endpoints use `IsBoardMember`. This keeps authorization logic centralized and testable.

**Token-based invitations:** Invitations generate a signed, time-limited token (expiry) stored against a pending invite record. On acceptance, the user is added to the workspace and the token is invalidated.

### Frontend Design Decisions

**Optimistic updates with rollback:** Task mutations are applied to local state immediately. If the server returns an error, the previous state is restored and an error toast is shown. This eliminates perceived latency.

**WebSocket state reconciliation:** The React app maintains a WebSocket connection per active board. Incoming server events are diffed against local state and merged-preventing flicker or duplicate updates.

---

## Database & Backend

### Core Data Models

```
### Key Model Design

**Task** — Stores `position` (int), `assigned_to` (FK), `list` (FK), `created_by` (FK), `title`, `description`, `created_at`, `updated_at`

**WorkspaceMembership** — Junction table with `role` field (`owner` / `admin` / `member`), `joined_at`

**Invitation** — Stores `token` (hashed), `email`, `workspace`, `invited_by`, `expires_at`, `accepted`

**ActivityLog** — Stores `action`, `username`, `actor`, `board`, `metadata` (JSON), `created_at`
```
### Backend Capabilities

- Pagination on all list endpoints (cursor-based where applicable)
- Filtering via `django-filter`- assignee, list, board, status
- Full-text search on task titles

---

## Real-Time Collaboration

Kanban Core uses **Django Channels** (ASGI) to power WebSocket connections for live board synchronization.

### Event Types

| Event | Payload | Trigger |
|---|---|---|
| `task.created` | `{ task }` | New task |
| `task.updated` | `{ task_id, changes }` | Task edit |
| `task.deleted` | `{ task_id }` | Task deletion |
| `member.joined` | `{ user }` | Invite accepted |

---

### Connection Flow


Client connects → WebSocket handshake → Auth token validated →
Joined to channel group board_{id} →
Receives all future board events until disconnect

---
## Security

| Layer | Implementation |
|---|---|
| **Authentication** | JWT access + refresh tokens (short-lived access, rotated refresh) |
| **Authorization** | Role-based permission classes on every endpoint |
| **Throttling** | Per-user and per-IP rate limits via DRF throttling classes |
| **Input Validation** | DRF serializers validate all input; malformed requests return `400` |
| **CORS** | Whitelist-only CORS configuration |
| **Invitation Tokens** | HMAC-signed, time-limited, single-use |
| **Media Security** | Cloudinary-hosted — no media served directly from application server |

---

## API Design

Base URL: `https://api.kanban-core.onrender.com/api/`

---

## Screenshots
<img width="1920" height="934" alt="image" src="https://github.com/user-attachments/assets/5772f413-46fb-495e-a4dd-2fbd0cc46296" />
<img width="1920" height="949" alt="image" src="https://github.com/user-attachments/assets/cc6bc8c2-0775-4090-b907-f29e89e2c011" />
<img width="1920" height="938" alt="image" src="https://github.com/user-attachments/assets/73096fbd-8605-4c23-a4f3-8fb101e12e2b" />
<img width="1920" height="960" alt="image" src="https://github.com/user-attachments/assets/baadc067-7d2a-488e-96bb-2cb4c5938f8b" />


## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+

### Backend Setup

```bash
# Clone the repository
git clone [https://github.com/yourusername/kanban-core.git](https://github.com/Mokshy46/Kanban-Core.git)
cd kanban/backend

# Create and activate a virtual environment
python -m venv venv
# Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt


# Apply migrations
python manage.py migrate


# Start the development server
python manage.py runserver
```

### Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env.local
# Set VITE_API_BASE_URL and VITE_WS_BASE_URL

# Start the development server
npm run dev
```

---

### Frontend — Vercel

The React frontend is deployed to **Vercel** via GitHub integration. Every push to `main` triggers an automatic deployment.

```bash
# Build command
npm run build

# Output directory
dist
```
---


##  Future Improvements

- [ ] **Due dates & calendar view** — task deadlines with calendar integration
- [ ] **Notification center** — in-app notifications with read/unread state
- [ ] **Subtasks** — nested task hierarchy within cards
- [ ] **Labels & tagging** — color-coded labels with multi-label filtering
- [ ] **Board templates** — predefined board layouts for common workflows
- [ ] **Audit log export** — downloadable CSV activity reports
- [ ] **OAuth login** — Google and GitHub social authentication
- [ ] **Slack integration** — activity notifications via Slack webhook
- [ ] **Offline support** — service worker caching for read operations

---

- **Engineered a real-time WebSocket collaboration layer** using Django Channels, enabling instant, bi-directional board synchronization across concurrent users — no polling, no page refresh
- **Designed a composable role-based permission system** with three access tiers enforced at the API layer, preventing unauthorized resource access and privilege escalation
- **Architected a secure, token-based invitation system** with time-limited, single-use tokens delivered via transactional email
- **Delivered a production-deployed full-stack application** across Render (Django/ASGI) and Vercel (React), with environment-specific configuration and static file handling
- **Developed a human-readable activity feed** powered by Django signals, generating structured audit logs from model events without coupling business logic to logging

---


<div align="center">

</div>
