# Social_network

**Pet Project Social Network**

---

## 🔎 Overview

Social_network is a minimalistic social media platform developed as a personal pet project to sharpen backend development skills.

## 📋 Features

- **User Registration & Authentication**  
  Secure signup and login using JSON Web Tokens (JWT).

- **User Profiles**  
  View and edit your own profile; browse other users’ profiles.

- **News Feed**  
  See a feed of posts made by friends.

- **Friend System**  
  Send and accept friend requests.

- **Real-Time Notifications**  
  Get notified on friend requests, messages, etc., via SignalR.

## 🛠️ Tech Stack

- **Backend:**  
  - C# with ASP.NET Core following SOLID principles  
  - SignalR for WebSocket notifications  
  - EF Core for data access

- **Database:** PostgreSQL

- **Frontend:** JavaScript with React (minimal focus)

- **Containerization:** Docker  
  - `api` container for ASP.NET API  
  - `web` container for frontend

- **Reverse Proxy:** configured on the server

## 🚀 Getting Started

### Prerequisites

- Docker  
- (Optional) PostgreSQL with an empty database or ready migrations

### Configuration

1. Clone the repository:  
   ```bash
   git clone https://github.com/Gergov00/Social_network.git
   cd Social_network
   ```
2. Add `appsettings.json` in the project root and add:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=socialdb;Username=postgres;Password=yourpassword"
  },
  "Jwt": {
    "Key": "<YourJWTKey>",
    "Issuer": "<YourIssuer>",
    "Audience": "<YourAudience>"
  }
}
```

### Database Setup

To add and apply migrations, run:

```bash
# Add a new migration named "test"
dotnet ef migrations add test --project ./Data/ --startup-project ./API/

# Apply migrations to the database
dotnet ef database update --project ./Data/ --startup-project ./API/
```

## 🐳 Running with Docker

```bash
docker run -d --name my_api_container -p 3000:3000 -e ASPNETCORE_URLS=http://+:3000 -e ASPNETCORE_ENVIRONMENT=Development -v\
 /home/yourpath/images:/app/wwwroot  gergov00/api

docker run -d --name my_site_container -p 8000:8000 gergov00/web-app
```

- Frontend: http://localhost:8000  
- API: http://localhost:3000

## ⚙️ Usage

- Register a new user.  
- Log in to receive a JWT token.  
- Use the token to access protected API endpoints.  
- Create posts, send friend requests, and enjoy real-time notifications.

## 🧪 Tests

No automated tests are available at this time.

## 📦 Roadmap

- Rewrite the frontend with Blazor (primary C# focus).  
- Add automated unit and integration tests.  
- Enhance messaging features.  
- Improve UI/UX.

## 🤝 Contributing

This project is fully open-source! Feel free to:  
- Submit issues for bugs or feature requests.  
- Open pull requests to improve backend logic or add tests.  
- Suggest frontend enhancements or share ideas.


## 📫 Contact

Questions or feedback? Open an issue or pull request on GitHub!
