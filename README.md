# QuickMem Server

QuickMem Server is an API server built with NestJS for the QuickMem application. It provides authentication, email
processing, and other functionalities.

## Description

This project uses NestJS, TypeORM, Bull for job queues, and various other libraries to create a robust backend server.

## Project Setup

### Prerequisites

- Node.js (v20.x)
- npm (v10.x)
- PostgreSQL
- Redis

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/quickmem-server.git
   cd quickmem-server
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Set up environment variables:

    - Create a `.env` file in the root directory.
    - Copy the contents of `.env.stage.dev` or `.env.stage.prod` and update the values as needed.

### Running the Application

#### Development

```bash
npm run start:dev
```

#### Production

```bash
npm run start:prod
```

### Running Tests

#### Unit Tests

```bash
npm run test
```

#### End-to-End Tests

```bash
npm run test:e2e
```

#### Test Coverage

```bash
npm run test:cov
```

## Features

- **Authentication**: User signup, login, OTP verification, password reset.
- **Email Processing**: Sending OTP and welcome emails using Bull and Nodemailer.
- **Database**: PostgreSQL with TypeORM.
- **Job Queue**: Redis with Bull.

## Configuration

The application uses environment variables for configuration. Refer to `src/config.schema.ts` for the required
variables.

## Contributing

This is graduation project server for QuickMem application. Contributions are not accepted at this time.
