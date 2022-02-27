# back-end

## Table of Contents

- [About the Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Launch](#launch)
  - [Development](#development)
    - [Scripts](#scripts)
  - [Production](#production)
    - [Port bindings](#port-bindings)
- [Design](#design)

## About this project

Project contain module:

- `./packages/yagnostic-api` - Main api to store contract's proposal.

### Built with

- Backend
  - [NodeJS 12.18.0](https://nodejs.org/en/blog/release/v12.18.0/)
  - [Yarn](https://yarnpkg.com/)
  - [Webpack](https://webpack.js.org/)
  - [Docker](https://www.docker.com/)
  - [docker-compose](https://docs.docker.com/compose/)
  - [PostgreSQL](https://www.postgresql.org/)
  - [Jest](https://jestjs.io/)
- Other
  - [OpenAPI 3.0](https://swagger.io/specification/)
  - [Swagger](https://swagger.io/)
  - [pre-commit](https://pre-commit.com/)
  - [eslint](https://eslint.org/)
  - [prettier](https://github.com/prettier/prettier)

## Getting started

To start development you need to set up your dev environment

### Prerequisites

- Install [npm](https://github.com/nodesource/distributions/blob/master/README.md)

  It's recommended to install node 10 on ubuntu 18.04 as version 8 may have troubles to work with npm

  ```
  # Using Ubuntu
  curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

- Install [yarn](https://linuxize.com/post/how-to-install-yarn-on-ubuntu-18-04/)

  ```
  curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
  sudo apt update
  sudo apt install yarn
  ```

  Or:

  ```bash
  sudo npm install -g yarn
  ```

- Install [docker](https://docs.docker.com/v17.09/engine/installation/linux/docker-ce/ubuntu/)

  ```bash
  sudo apt-get update
  sudo apt-get install -y \
      apt-transport-https \
      ca-certificates \
      curl \
      software-properties-common
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
  sudo add-apt-repository \
     "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
     $(lsb_release -cs) \
     stable"
  sudo apt-get update
  sudo apt-get install -y docker-ce
  ```

- Install [docker-compose](https://docs.docker.com/compose/install/)

  ```bash
  sudo curl -L "https://github.com/docker/compose/releases/download/1.25.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
  sudo apt remove -y docker-compose
  sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

  ```

- [Allow regular user to run docker without sudo](https://docs.docker.com/install/linux/linux-postinstall/)

  ```bash
  sudo usermod -aG docker ${USER}
  sudo usermod -aG www-data ${USER}
  ```

  **You need to reboot or relogin after that**

  Once rebooted verify that you can run docker commands without sudo.

- Install tools for pre-commit validation

  ```bash
  sudo apt-get install -y python3 python3-pip shellcheck ruby-full build-essential openjdk-8-jdk curl libssl-dev
  ```

### Installation

1. Clone git repo:

   `git clone https://github.com/Yearn-Agnostic/back-end.git`

1. Install packages

   `yarn`

1. Set up packages:

- [yagnostic-api](./packages/yagnostic-api/README.md)

## Launch

Launch process description for development and production environments

### Development

Assume that you have followed installation instructions from global and packages documentation

1. Launch dev docker-compose environment:

   `yarn docker-dev`

1. Start services in dev mode:

   `yarn start-dev`

#### Scripts

- Launch eslint: `yarn lint`
- Clean test databases: `yarn docker-dev-clean-testdb`
- Clean pre-commit cache: `yarn clean-pre-commit`

### Production

1. Build all packages

   `yarn build`

1. Launch docker-compose.yml

   `docker-compose up -d --build`

/\* Also you can emulate production run on a local machine with: `yarn docker-prod`

#### Port bindings

- `3030` - yagnostic http
- `5450` - yagnostic-api PostgreSQL
- `3040` - yagnostic-api Adminer
