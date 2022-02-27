# yagnostic back-end api

Service which allows storing contract proposals,

## Table of Contents

- [Getting Started](#getting-started)
  - [Folder structure](#folder-structure)
  - [Setting up environment](#setting-up-environment)
- [Launch](#launch)
  - [Development](#development)
    - [Scripts](#scripts)
  - [Production](#production)
- [API specification](#api-specification)
  - [Swagger](#swagger)
  - [API list](#api)
- [Configuration](#configuration)
  - [Configuration files](#configuration-files)
  - [Configuration file description](#configuration-file-description)

## Getting started

For basic installation you can follow instructions from main [README.md](../../README.md)

### Folder structure

- `api` - API endpoints (routes) here
- `config` - Configuration files which is handled by [config](https://www.npmjs.com/package/config) module
- `controllers` - API endpoints controllers
- `database` - Migrations, table names enums
- `services` - Services
- `utils` - utility functions
- `index.js` - Main file

### Setting up environment

1. Create `.env` file inside root of service directory, copy and set variables from `.env.xmpl`
1. Launch migrations : `yarn migrate`

## Launch

Launch service in development or production mode

### Development

1. Start service: `yarn start-dev`

#### Scripts

- `yarn migrate` - Migrate database
- `yarn migrate-down` - Rollback last applied migration
- `yarn build` - build service with webpack

### Production

1. Build service with webpack: `yarn build`
1. Start service in production mode: `yarn start-prod`

## API specification

### Swagger

Swagger documentation is available when application launched

- API docs: <http://localhost:3030/api-docs/>
- swagger.json

### API

Detailed description for API endpoints.

- Store proposal

  - method: POST
  - route: /proposal/create
  - request body:

    ```text
    {
        "id": number,  -- proposal id
        "description": string,  -- text of proposal, limit is 2000 symbols.
    }
    ```

- Get proposals by ids

  - method: POST
  - route: /proposal/get
  - request body:

    ```text
    {
        "id": [], -- Array of numbers
    }
    ```

  - Response

    ```
    [
       {
          "id": number,
          "description": string,
        },
        ...
        {
          "id": number,
          "description": string,
        }
    ]
    ```

## Configuration

Configuration parameters reference.

We use [config](https://www.npmjs.com/package/config) module to handle configuration files.

### Configuration files

- `default.json` - Configuration for development
- `production.json` - Configuration for production
- `test.json` - Test configuration

### Configuration file description

- `port` - HTTP requests port
- `postgres` - PostgreSQL configurations parameters
- `privateKey` - private key for bridge owner(optional, you can put `PRIVATE_KEY` field to `.env` instead)
  ####Bridge subconfig for each network eth and bsc
- `httpProvider` - url for node connection via http
- `abi` - bridge contract abi
- `address` - bridge address
- `blockCreation` - bridge deploying block
- `interval` - interval for cycling request to node for bridge service
- `oppositeChain` - opposite chain for bridge to work with

  ####Email subconfig for email notifying

- `smtp` - smtp server host
- `port` - smtp server port
- `user` - user authentication for smtp
- `pass` - pass authentication for smtp
- `owner` - destination email, to send bridge alarm messages
