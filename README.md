# Spanner

A comprehensive vehicle tracking and maintenance application that helps you keep records of your vehicles and stay on top of maintenance schedules.

## Features

- **Multi-vehicle tracking** - Keep records for as many vehicles as you want
- **Smart reminders** - Email notifications for date or mileage-based maintenance
- **Mileage estimation** - Current and yearly mileage projections
- **Maintenance history** - Complete service record tracking
- **Responsive design** - Works seamlessly on desktop and mobile devices

## Architecture

This is a monorepo containing two main applications:

### `/web` - Frontend Application
- **Framework**: Next.js 13+ with React 18
- **Language**: TypeScript
- **Styling**: Chakra UI with Emotion
- **State Management**: SWR for server state
- **Authentication**: Iron Session
- **Testing**: Jest with React Testing Library

### `/api` - Backend API
- **Framework**: Ruby on Rails 8.0 (API mode)
- **Language**: Ruby 3.4.6
- **Database**: PostgreSQL
- **Server**: Puma
- **Authentication**: Token-based with email magic links

## Getting Started

### Prerequisites

- Node.js 22.19.0+
- Ruby 3.4.6
- PostgreSQL
- Yarn package manager

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/nicinabox/spanner.git
   cd spanner
   ```

2. **Setup the API**
   ```bash
   cd api
   bundle install
   rails db:create db:migrate db:seed
   rails server -p 3001
   ```

3. **Setup the Web Application**
   ```bash
   cd web
   yarn install
   yarn dev
   ```

4. **Access the applications**
   - Frontend: http://localhost:3000
   - API: http://localhost:3001

## Development Commands

### Web Application
```bash
cd web
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
yarn lint:fix     # Fix ESLint issues
yarn test         # Run tests
```

### API Application
```bash
cd api
rails server      # Start development server
rails console     # Open Rails console
rails test        # Run tests
rails db:migrate  # Run database migrations
```

## Setup

### Environment Variables

#### Web Application
Create a `.env.local` file in the `web` directory:
```sh
cp .env.example .env.local

# Generate a client secret
openssl rand -base64 32

# Update .env.local
CLIENT_SECRET=your_session_secret
```

## Testing

### Web Application
```bash
cd web
yarn test        # Run all tests
yarn test:watch  # Run tests in watch mode
```

### API Application
```bash
cd api
rails test       # Run all tests
rails test test/models  # Run specific test suite
```

## Project Structure

```
spanner/
├── api/                    # Ruby on Rails API
│   ├── app/
│   ├── config/
│   ├── db/
│   ├── Gemfile
│   └── README.md
├── web/                    # Next.js Frontend
│   ├── pages/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
└── README.md              # This file
```

For detailed information about each application, see their respective README files:
- [Web Application README](web/README.md)
- [API README](api/README.md)

## License

This project is licensed under the MIT License.

## Author

**Nic Haynes** - [nic@nicinabox.com](mailto:nic@nicinabox.com) - [https://nicinabox.com](https://nicinabox.com)
