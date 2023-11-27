## Description

The intent of this repository is to demonstrate the organization and structure of a complete (albeit small) NestJS application that leverages MongoDb. This application is a REST API that allows users perform CRUD operations on a users collection, and login and log out via separate endpoints. The application supports authorization through an API key and/or bearer tokens, which are sent to the user upon login.

The application is containerized using Docker.

## Installation

```bash
$ npm install
$ docker compose up -d
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test
```
