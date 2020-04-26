# AIO Rek

> Face recognition based attendance system

<img width="914" height="532" src="https://repository-images.githubusercontent.com/182638111/fedded00-8811-11ea-9d5c-398c5ab3562b" alt="aio-rek">

## Features

This starter project includes official Nuxt.js modules for best PWA project:

- [Http](https://github.com/nuxt/http)
- [Dotenv](https://github.com/nuxt-community/dotenv-module)
- [PWA](https://github.com/nuxt-community/pwa-module)

It is also enriched with the best Vue's UI framework:

- [Vuetify](https://vuetifyjs.com)
- [VeeValidate](https://logaretm.github.io/vee-validate)

## Prerequisite

You must have installed:

- [Node.js](https://nodejs.org/en/)
- [Docker](https://docs.docker.com/)

## Setup

1. Clone this repository

```bash
$ git clone https://github.com/jefrydco/aio-rek.git
$ cd aio-rek
```

2. Download the following repository [Face API](https://github.com/justadudewhohacks/face-api.js)
3. Extract its content
4. There will be a folder called `weights`. Copy that folder into `aio-rek/static`
5. Rename it in to `models`
6. Now the content of your `static` folder should looks like this:

```
static
|-cats
|-models
|-sounds
|-examples
```

7. Then run the following command to run the project

```bash
# instal dependencies
$ yarn # or npm install

# run the docker environment
$ docker-compose up

# serve the api at localhost:3001
$ yarn api

# serve with hot reload at localhost:3000
$ yarn dev
```

## Test

```bash
# run unit test
$ yarn test

# run e2e test
$ yarn test:e2e:open
```

## Getting Started

Don't forget to change your sentry dsn and google analytics id in `.env.example` file.

For detailed explanation on how things work, check out the [Nuxt.js](https://github.com/nuxt/nuxt.js) and [Vuetify.js](https://vuetifyjs.com/) documentation.

## License

[MIT License](./license.md)

Copyright (c) Jefry Dewangga (@jefrydco)
