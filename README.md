# Zoning API
This project includes an API to interact with data from city planning and OpenAPI documentation for the available endpoints. 

## Local API Setup

### Use the correct version of Node
The `.nvmrc` file tells you which version of node you should be using to run the project. 
If you're using [nvm](https://github.com/nvm-sh/nvm) and already have the correct version installed, 
you can switch by running `nvm use` from the root of this repo.
 
### Install dependencies
Once you have cloned this repo, install the necessary dependencies:
```sh
npm i
```

### Set up your `.env` file
Create a file called `.env` in the root folder of the project and copy the contents of `sample.env` into that new file

### Run local database with docker compose
Next, use [docker compose](https://docs.docker.com/compose/) to stand up a local Postgres database. 
```sh
docker compose up
```

If you need to install docker compose, follow [these instructions](https://docs.docker.com/compose/install/).

### Configure PostGIS
Enable geospatial features by installing the postgis extension

```sh
npm run pg:configure
```

### Drizzle ORM setup
Structure the database tables with drizzle

```sh
npm run drizzle:migrate
```

### Data loading
Load the data into the tables. Under the hood, this uses the Postgres COPY command.

```sh
npm run pg:copy
```

## Local development
The OpenAPI documentation and the API implementation complement each other. 
The OpenAPI documentation is written first, defining expectations for endpoints.
The API is subsequently implemented based on the OpenAPI documentation.

### OpenAPI development
The OpenAPI documentation is written in the `openapi/openapi.yaml` file.
The [redoc](https://redocly.com/docs/redoc/) cli provides commands to manage the documentation,
with a few key commands integrated into npm scripts.

When writing OpenAPI documentation:
- run `npm run redoc:dev`
- open localhost:8080
- make edits to `openapi/openapi.yaml`
- view the updates in real time through port 8080

To check validity of OpenAPI documentation:
- run `npm run redoc:lint`

### API development
The API integrates with the OpenAPI documentation by implementing its endpoints. 
The OpenAPI documentation defines schemas for the API to interact with. If an endpoint description is preceded by 🚧, it indicates that the endpoint has not yet been implemented and cannot be used on the frontend. 

The API uses [Kubb](https://www.kubb.dev) to automatically generate 
Typescript definitions and zod schemas from the OpenAPI documentation.
The generated code is kept in `/src/gen`. Never make manual changes to files in this folder.

Generate these resources with:
```sh
npm run generate
```

The console may include the output below. It can be safely ignored.
```console
✖ Something went wrong

  Error: The "paths[0]" argument must be of type string. Received undefined
```

Finally, to run the api locally:
```sh
npm run dev
```

The application is running on port `3000`
- The root route `/` has the documentation built from the point where the application was run (`localhost:3000/`) 
- The `/api/{endpoint}` routes have the actual API implementation (ex: `localhost:3000/api/boroughs`)

(This command will also create a static site of the OpenAPI documentation at the root of the API.
This site reflects the documentation at the point where the command was written. Viewing changes to
the OpenAPI documentation requires restarting the development server).

## Production builds
Running a production version of the site is a two step process.
First, generate production versions of the OpenAPI documentation and API.
Both of these steps are combined into the same script:
```sh
npm run build
```

Then, run the production build:
```sh
npm run start:prod
```

