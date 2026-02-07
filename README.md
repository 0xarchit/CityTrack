---
title: citytrack
emoji: 🌆
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
pinned: true
---

# CityTrack

> **Governance at the Speed of Software**

CityTrack is an AI-powered urban issue reporting and management platform that transforms how cities handle infrastructure problems. Citizens report issues with AI validation, and autonomous agents route them to the right departments in real-time.

## Quick Overview

**The Problem:** Traditional city issue reporting systems are slow, manual, and prone to duplicates.

**The Solution:** CityTrack uses AI agents to instantly validate, deduplicate, and intelligently route urban issues—turning citizens into real-time sensors for city infrastructure.

## Key Features (MVP)

- 📸 **Live Camera Capture:** Mandatory camera verification to prevent fake reports
- 📍 **GPS Validation:** High-precision location data (< 10m accuracy)
- 🤖 **AI Issue Classification:** Automatic detection of potholes, debris, and damaged infrastructure
- 🔄 **Smart Deduplication:** Groups similar reports and prevents redundant tickets
- 👷 **Worker Dashboard:** Task list with instant notifications and routing
- 📱 **Citizen Tracking:** Real-time updates on report status

## Getting Started

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL with PostGIS extension

### Installation

```bash
git clone https://github.com/0xarchit/CityTrack.git
cd CityTrack

docker-compose up -d

npm install
pip install -r requirements.txt
```

### Running the Project

```bash
docker-compose up

npm run dev         # Frontend
python main.py      # Backend
```

## Tech Stack

- **Backend:** FastAPI, Python, SQLAlchemy, PostgreSQL
- **Frontend:** Next.js, Tailwind CSS
- **Mobile:** React Native, Expo
- **AI/ML:** YOLOv8 (Issue Detection)
- **Authentication:** Supabase
- **Infrastructure:** Docker

## The Autonomous Pipeline

1. **Vision Agent** → Validates and classifies uploaded images
2. **Geo-Dedup Agent** → Merges duplicate reports in the same area
3. **Priority Agent** → Assigns urgency levels based on context
4. **Routing Agent** → Matches issues to departments and workers
5. **Notification Agent** → Sends updates to all stakeholders

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](.github/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Team

Built by **BitBots** at IIIT Una, HackTheThrone 2026

| Role | Name | GitHub |
|------|------|--------|
| Lead Developer | Archit Jain | [@0xarchit](https://github.com/0xarchit) |
| Developer | Rachit Verma | [@vxrachit](https://github.com/vxrachit) |
| Developer | Pushpendra Sharma | [@synapticpush](https://github.com/synapticpush) |
| Developer | Deepti Yadav | [@DeeptiYadav10648](https://github.com/DeeptiYadav10648) |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.