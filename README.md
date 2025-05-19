# 🌦️ WeatherApp

A simple weather subscription service built with **NestJS**, **Prisma**, and **Docker**.  
Includes weather forecast fetching, email subscriptions, and a minimal HTML frontend.

## 🚀 Branches

- `main` – for local development and testing
- `deploy` – used for deployment

## 📦 Setup & Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/blvckwhiteee/WeatherApp.git
cd WeatherApp
```

### 2. Create a `.env` file in the root directory

Replace the values below with your own credentials:

```env
DATABASE_URL=postgresql://test_user:FQBsJoPiZjciCf2MmHE7CARkEQs8k6co@dpg-d0lmauffte5s739ls3kg-a.frankfurt-postgres.render.com/weather_app_5l7o
API_TOKEN="e9a21ef797cc4398ab9163543251801"
EMAIL_ADDRESS="test.email.for.genesis@gmail.com"
EMAIL_PASSWORD="pszstacssyhwgkvy"

APP_PORT=3000

POSTGRES_USER=test_user
POSTGRES_PASSWORD=FQBsJoPiZjciCf2MmHE7CARkEQs8k6co
POSTGRES_DB=weather-weather_app_5l7o
DB_PORT=5432
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run the app with Docker

```bash
docker compose up --build
```

App will be running at: [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deployed Version

You can access the deployed version here:  
👉 [https://weatherapp-wbb3.onrender.com/](https://weatherapp-wbb3.onrender.com/)

---

## 🧪 Available Endpoints

| Route                | Description                      |
|---------------------|----------------------------------|
| `/api`              | Swagger API documentation        |
| `/index.html`       | Main HTML page                   |
| `/weather.html`     | Get weather forecast             |
| `/subscribe.html`   | Subscribe to daily weather email |

---

## 🛠️ Tech Stack

- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Nodemailer](https://nodemailer.com/)
