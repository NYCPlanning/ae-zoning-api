# Zoning API
This project is an API for serving data related to zoning, such as zoning districts and tax lots.

## Running the project locally

### Make sure you're using the correct version of Node
The `.nvmrc` file tells you which version of node you should be using to run the project. If you're using [nvm](https://github.com/nvm-sh/nvm) and already have the correct version installed, you can switch by running `nvm use` from the root of this repo.
 
### Install dependencies
Once you have cloned this repo, install the necessary dependencies:
```
npm i
```
### Run local database with docker compose
Next, use [docker compose](https://docs.docker.com/compose/) to stand up a local Postgresql database with PostGIS installed. If you need to install docker compose, follow [these instructions](https://docs.docker.com/compose/install/).

### Set up your `.env` file
Create a file called `.env` in the root folder of the project and copy the contents of `sample.env` into that new file

### Run the project
Finally, to run the project locally:
```
npm run dev
```

### OpenApi documentation
Open Api documentation is managed through [redoc](https://redocly.com/docs/redoc/). Changes to the documentation are managed through edits to the `openapi/openapi.yaml` file. The `openapi/index.html` is used to serve the rendered documentation. It is generated through the redocly cli and should not be manually edited.

The api serves the documentation on its root path.

- To serve a development version of the rendered documentation while making edits, use `npm run redoc:dev`.
- To check for linting errors in the `openapi/openapi.yaml`, use `npm run redoc:lint`.
- To rebuild the `openapi/index.html` with the latest changes to the `openapi/openapi.yaml`, use `npm run redoc:build`
  - The api serves the documentation from this html file. It is only updated when it is specifically rebuilt.

For production workflows, `npm run build` includes the command to build the documentation into the html file, ensuring the production site serves the latest api documentation.
