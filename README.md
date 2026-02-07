---
title: CityTrack
emoji: 🏙️
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
pinned: true
---

# CityTrack

```text
   ______ _ _            _______              _             
  / _____(_) |         |__   __|            | |            
 | |       _| |_ _   _    | |_ __ __ _  ___ | | _____ _ __ 
 | |      | | __| | | |   | | '__/ _` |/ __|| |/ / _ \ '__|
 | |_____ | | |_| |_| |   | | | | (_| | (__ |   <  __/ |   
  \______||_|\__|\__, |   |_|_|  \__,_|\___||_|\_\___|_|   
                   _/ |                                    
                  |___/                                     
```

<div align="center">

![Repo Size](https://img.shields.io/github/repo-size/0xarchit/CityTrack?style=for-the-badge&color=2ecc71)
![Last Commit](https://img.shields.io/github/last-commit/0xarchit/CityTrack?style=for-the-badge&color=3498db)  
![Issues](https://img.shields.io/github/issues/0xarchit/CityTrack?style=for-the-badge&color=e74c3c)
![Pull Requests](https://img.shields.io/github/issues-pr/0xarchit/CityTrack?style=for-the-badge&color=9b59b6)

</div>

**"Governance at the Speed of Software."**

## ❏ Overview

CityTrack is an autonomous, event-driven operating system for smart cities that transforms civil infrastructure maintenance from reactive to proactive. Unlike traditional 311 systems that rely on manual triage, CityTrack leverages AI agents to instantly detect, validate, and route urban issues - such as potholes, illegal dumping, and damaged signage - without human fatigue or bias. By using citizens as real-time sensors and autonomous agents as the nervous system, CityTrack ensures city-scale, self-healing infrastructure.

## ❏ System Internals: The "Issue Packet"

Every interaction in CityTrack starts with an **Issue Packet** - an immutable, atomic unit of civic data.

**Components:**
- **Evidence:** Primary visual proof (Image/Video) captured via mandatory live camera
- **Context:** High-precision GPS (less than 10m accuracy), Compass Heading, and Device Metadata
- **Intent:** User-provided description, enhanced by NLP

### Anti-Fraud Enforcement

CityTrack implements a "Spot-Check" protocol to ensure data integrity at the source:

1. **Live Camera Only:** The mobile app restricts gallery access. Users MUST capture photos live, preventing the repurposing of old or internet images.
2. **GPS Precision Lock:** Submission is blocked unless GPS accuracy is better than 10 meters.
3. **Identity Binding:** All reports are cryptographically linked to a verified Google Identity (Supabase Auth).

## ❏ The Problem

Traditional urban governance is plagued by:

- **Manual Bottlenecks:** Every report sits in a queue waiting for human categorization
- **Redundancy:** Multiple citizens report the same issue, creating duplicate tickets and wasting resources
- **Data Black Holes:** Citizens rarely receive feedback on their reports, leading to civic frustration
- **Subjective Prioritization:** Urgent issues on main roads are often treated the same as minor issues in quiet alleys

## ❏ The Solution: CityTrack

CityTrack introduces the **"Issue Packet"** - an immutable unit of data containing visual evidence, GPS metadata, and intent. This packet triggers an autonomous chain reaction across a specialized agent pipeline.

### System Architecture

```mermaid
graph TD
    A[Citizen Mobile App] -->|Issue Packet| B[FastAPI Backend]
    B --> C[Event Bus]
    
    subgraph "Autonomous Agent Pipeline"
        C --> D[Vision Agent]
        D -->|Annotated Data| E[Geo-Deduplicate Agent]
        E -->|Clustered Info| F[Priority Agent]
        F -->|Urgency Level| G[Routing Agent]
        G -->|Assignment| H[Notification Agent]
    end
    
    H --> I[Worker Dashboard]
    H --> J[Admin Portal]
    H --> K[Citizen Updates]
    
    subgraph "Data Layer"
        L[(PostgreSQL)]
        M[(Supabase Storage)]
    end
    
    D -.-> M
    E -.-> L
```

## ❏ The Autonomous Pipeline

The system acts as a nervous system where agents react to the "Issue Packet" in real-time.

### Stage 1: The Senses (Input & Validation)

**Vision Agent: The "Eyes"**
- Uses a fine-tuned YOLOv8s model to scan incoming images
- **Rejection:** Automatically discards irrelevant images (e.g., selfies, blurry photos)
- **Classification:** Identifies defects (Pothole, Debris, Graffiti) with confidence scores

**Geo-Temporal Deduplication Agent: The "Memory"**
- **Clustering:** Uses bounding box queries and haversine distance calculation to find similar reports within X meters and Y hours
- **Merging:** Instead of creating duplicates, it merges reports into a single "Cluster", increasing its urgency score

### Stage 2: The Brain (Decision Making)

**Priority Agent: The "Judge"**
- **Context Awareness:** Combines Vision Confidence + Location Context (e.g., "Near School") + Repeat Count
- **SLA Setting:** Assigns dynamic deadlines (e.g., 4 hours for Critical)

**Routing Agent: The "Dispatcher"**
- **Logic:** Matches issue category to Department (Roads vs Sanitation) and assigns to specific workers based on geolocation and load

### Stage 3: The Enforcers (Execution)

**SLA Watchdog Agent: The "Timekeeper"**
- **AI Monitoring:** Analyzes the context of delayed issues, not just the timer
- **Escalation:** Triggers warnings at 50% and 20% remaining time

**Notification Agent: The "Messenger"**
- **Omnichannel:** Pushes updates to the Citizen (App) and Worker (Task List) simultaneously
- **Email Notifications:** Sends email notifications to respective stakeholders

## ❏ Client Ecosystem

### 1. Citizen Mobile App (The Sensors)
*Built with React Native + Expo (TypeScript)*

- **Offline-First:** Caches reports locally and syncs when connection returns (Beta)
- **Real-Time Tracking:** Server-driven events update the "Processing" screen live as agents complete their tasks
- **Gamification:** Civic points for verified reports (Planned)

### 2. Admin Command Center (The Control)
*Built with Next.js 16 (App Router) + Tailwind CSS*

- **Role-Based Access Control (RBAC):**
  - Super Admin: System configuration
  - Department Admin: Department-level oversight
  - Worker Dashboard: Task submission and resolution
- **Visual Intelligence:** Heatmaps and density plots to identify crumbling infrastructure zones

### 3. Worker Interface (The Hands)
*Mobile-First Web View*

- **Task List:** Simple, priority-sorted list of jobs
- **Navigation:** One-tap deep link to Google Maps
- **Proof of Resolution:** Workers cannot close a ticket without uploading a photo. The Vision Agent verifies this photo against the original to confirm the fix.

## ❏ Technical Architecture

### Modular Monolith Structure

The codebase is structured to scale from a Monolith to Microservices easily.

```text
/
├── Backend/              # The Core Logic (FastAPI + Async SQLAlchemy)
│   ├── agents/           # The Brain: 7 Autonomous Agents
│   │   ├── vision/       # Vision Agent (YOLOv8)
│   │   ├── geoDeduplicate/ # Geo-Temporal Deduplication
│   │   ├── priority/     # Priority Assignment
│   │   ├── routing/      # Department & Worker Routing
│   │   ├── sla/          # SLA Monitoring & Watchdog
│   │   ├── escalation/   # Escalation Management
│   │   └── notification/ # Omnichannel Notifications
│   ├── api/              # Stateless REST Endpoints
│   │   └── routes/       # Admin, Worker, Issue Routes
│   ├── core/             # Shared Infrastructure
│   │   ├── config.py     # Configuration Management
│   │   ├── events.py     # Event Bus System
│   │   ├── flow_tracker.py # Pipeline Orchestration
│   │   └── schemas.py    # Pydantic Models
│   ├── database/         # Database Layer
│   │   ├── models.py     # SQLAlchemy Models
│   │   ├── connection.py # DB Connection Pool
│   │   └── migrations/   # SQL Migrations
│   ├── orchestration/    # Agent Base Classes & Workflow Managers
│   └── services/         # External Services
│       ├── email.py      # Email Service
│       ├── geocoding.py  # Geocoding Service
│       └── vision.py     # Vision Processing
├── User/                 # Citizen Mobile App (Expo/React Native)
│   ├── src/
│   │   ├── screens/      # App Screens
│   │   ├── components/   # Reusable Components
│   │   ├── services/     # API Services
│   │   └── navigation/   # Navigation Setup
│   └── android/          # Android Build Configuration
├── Frontend/             # Admin & Worker Portals (Next.js 16)
│   ├── app/              # App Router Pages
│   │   ├── admin/        # Admin Dashboard
│   │   ├── worker/       # Worker Dashboard
│   │   └── user/         # Citizen Portal
│   └── components/       # Shared Components
└── static/               # Static page for agentic pipeline preview
└── requestly/            # Requestly export file for requestly api testing
```

## ❏ Technology Stack

### Backend
- **Framework:** FastAPI (Python 3.11+)
- **ORM:** SQLAlchemy 2.0 (Async)
- **Database:** PostgreSQL 18
- **Geospatial:** Haversine distance calculation for coordinate-based queries
- **Task Queue:** Background tasks with FastAPI BackgroundTasks
- **Authentication:** Supabase Auth

### AI/ML
- **Vision Model:** YOLOv8s (Fine-tuned for urban defects)
- **Training:** Custom dataset of 2000+ labeled urban issue images
- **Inference:** Real-time on CPU with optimized preprocessing

### Frontend
- **Web Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **State Management:** React Hooks + Context API
- **Data Fetching:** Native Fetch API with caching

### Mobile
- **Framework:** React Native with Expo SDK 54
- **Language:** TypeScript
- **Navigation:** React Navigation
- **Storage:** Async Storage + Expo Secure Store

### Infrastructure
- **Authentication:** Supabase Auth (Google OAuth)
- **Storage:** Supabase Storage (Image uploads)
- **Deployment:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Container Registry:** GitHub Container Registry (GHCR)

## ❏ Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 15+
- Android SDK (for mobile development)

### Installation

```bash
# Clone the repository
git clone https://github.com/0xarchit/CityTrack.git
cd CityTrack

# Backend Setup
cd Backend
pip install -r requirements.txt

# Frontend Setup
cd ../Frontend
npm install

# Mobile App Setup
cd ../User
npm install
```

### Environment Configuration

Create `.env` files in respective directories:

**Backend/.env**
```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/citytrack

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
SUPABASE_BUCKET=your_bucket_name
SUPABASE_JWT_SECRET=your_jwt_secret

# Supabase S3 Storage Configuration
SUPABASE_S3_ENDPOINT=your_s3_endpoint
SUPABASE_S3_REGION=your_s3_region
SUPABASE_S3_ACCESS_KEY=your_s3_access_key
SUPABASE_S3_SECRET_KEY=your_s3_secret_key

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
PROJECT_ID=your_google_project_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Configuration
SENDER_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
RESEND_API_KEY=your_resend_api_key

# AI/ML Configuration
GEMINI_API_KEY=your_gemini_api_key
```

**Frontend/.env.local**
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**User/.env**
```env
# API Configuration
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000

# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth Configuration
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### Running the Project

**Using Docker (Recommended):**
```bash
docker compose up
```

**Manual Setup:**
```bash
# Terminal 1 - Backend
cd Backend
uvicorn api.app:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 - Frontend
cd Frontend
npm run dev

# Terminal 3 - Mobile App
cd User
npm start
```

### Building for Production

**Backend Docker Image:**
```bash
docker build -t citytrack-backend .
```

**Frontend:**
```bash
cd Frontend
npm run build
npm start
```

**Mobile App (Android):**
```bash
cd User/android
./gradlew assembleRelease
```

## ❏ Key Features

### Core Functionality
- ❏ **Anti-Fraud Reporting:** Mandatory live camera and high-precision GPS lock to prevent fake reports
- ❏ **AI-Powered Validation:** Automatic classification and spam detection using YOLOv8
- ❏ **Smart Deduplication:** Geospatial clustering to merge similar reports
- ❏ **Dynamic Priority Assignment:** Context-aware urgency levels with SLA enforcement
- ❏ **Intelligent Routing:** Automatic department and worker assignment
- ❏ **Real-Time Tracking:** Live progress updates for citizens
- ❏ **Proof of Resolution:** Workers must upload "After" photos to close tickets

### Admin Features
- ❏ **Geospatial Heatmaps:** Visual density plots to identify problem areas
- ❏ **Department Management:** Create and manage city departments
- ❏ **Worker Administration:** Onboard and assign workers to departments
- ❏ **Manual Review Queue:** Review AI decisions and provide feedback
- ❏ **Analytics Dashboard:** Real-time metrics and historical trends

### Worker Features
- ❏ **Priority Task List:** Auto-sorted by urgency and proximity
- ❏ **One-Tap Navigation:** Direct integration with Google Maps
- ❏ **Evidence Upload:** Mandatory before-and-after photo comparison
- ❏ **Task History:** Complete audit trail of resolved issues

## ❏ Agent Pipeline Details

### Input & Validation Layer

**Vision Agent**
- Scans images using fine-tuned YOLOv8 model
- Detects objects: potholes, garbage, debris, damaged infrastructure
- Rejects spam: selfies, irrelevant content, low-quality images
- Classifies issues with confidence scores
- Annotates images with bounding boxes

**Geo-Temporal Deduplication Agent**
- Uses bounding box queries on indexed latitude/longitude columns
- Applies haversine distance calculation to find nearby reports
- Checks for duplicates within configurable radius and time window
- Merges duplicate reports into clusters
- Increases urgency score for repeated reports
- Maintains report history and relationships

### Decision Making Layer

**Priority Agent**
- Assigns severity levels: CRITICAL, HIGH, MEDIUM, LOW
- Considers multiple factors:
  - AI confidence score
  - Location context (near schools, hospitals, main roads)
  - Report clustering (multiple reports = higher priority)
  - Historical data (recurring issues in same location)
- Sets dynamic SLA deadlines based on severity
- Provides justification for priority assignment

**Routing Agent**
- Matches issue category to correct department
- Selects optimal worker based on:
  - Geographic proximity
  - Current workload
  - Specialization
  - Availability
- Balances resource allocation across the city
- Handles department-specific routing rules

### Execution & Follow-up Layer

**SLA Watchdog Agent**
- Monitors all active issues against SLA deadlines
- Triggers warnings at 50% and 20% remaining time
- Analyzes context of delays (holidays, weather, resource constraints)
- Provides early warning system for potential SLA breaches

**Escalation Agent**
- Handles overdue issues automatically
- Reassigns to supervisors or alternate workers
- Increases issue priority
- Flags for administrative review
- Maintains transparency in escalation chain

**Notification Agent**
- Sends real-time updates via multiple channels:
  - In-app push notifications
  - Email notifications
  - SMS (planned)
- Notifies citizens of status changes
- Alerts workers of new assignments
- Informs admins of escalations
- Supports templated messages with dynamic content

## ❏ Deployment

### Docker Deployment

The project includes a complete Docker setup for production deployment:

```bash
# Build and run with Docker Compose
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### GitHub Actions CI/CD

Automated workflows for:
- Docker image building and pushing to GHCR
- Deployment to production (completed)
- Automated testing (planned)

## ❏ Roadmap & Future Vision

### Phase 1: The Foundation (Completed)
- ❏ Autonomous Agent Pipeline (Vision, Geo, Priority, Routing, etc.)
- ❏ Cross-Platform Ecosystem (Citizen App, Admin Portal, Worker View)
- ❏ Real-time notifications and tracking
- ❏ Anti-fraud mechanisms

### Phase 2: Intelligence Enhancement (In Progress)
- ❏ Predictive Maintenance: Using historical data to predict infrastructure failures
- ❏ Automated Testing: Comprehensive test suite
- ❏ Multi-City Support: Tenant-based architecture
- ❏ Civic Reputation System: Leaderboards for top contributors

### Phase 3: Scale & Gamification (Planned)
- ❏ Advanced Analytics: ML models for pattern recognition
- ❏ Incentive Programs: Tax credits or transit passes for verified reporting
- ❏ Public API: Third-party integrations
- ❏ Mobile SDK: White-label solution for other cities
- ❏ IoT Integration: Direct feeds from smart bins, streetlights, and sensors

## ❏ Contributing

We welcome contributions! Please read our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use TypeScript for all new frontend code
- Write descriptive commit messages
- Add tests for new features
- Update documentation as needed

## ❏ Team

Built by **BitBots** at IIIT Una, HackTheThrone 2026

| Role | Name | GitHub |
|------|------|--------|
| Lead Developer | Archit Jain | [@0xarchit](https://github.com/0xarchit) |
| Developer | Rachit Verma | [@vxrachit](https://github.com/vxrachit) |
| Developer | Pushpendra Sharma | [@synapticpush](https://github.com/synapticpush) |
| Developer | Deepti Yadav | [@DeeptiYadav10648](https://github.com/DeeptiYadav10648) |

## ❏ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ❏ Acknowledgments

- YOLOv8 by Ultralytics for object detection
- Supabase for authentication and storage
- FastAPI for the robust backend framework
- Next.js and React Native teams for excellent frameworks

---

**CityTrack** - Transforming urban governance through autonomous AI agents.