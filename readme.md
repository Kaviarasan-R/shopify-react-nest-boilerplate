# Shopify React.js x Nest.js Boilerplate

An embedded app starter template to get up and ready with Shopify app development with TypeScript. This is heavily influenced by the choices Shopify Engineering team made in building their [starter template](https://github.com/Shopify/shopify-app-template-node) to ensure smooth transition between templates.

## Supporting repositories

- https://github.com/Shopify/shopify-api-js

## Tech Stack

- React.js
  - `raviger` for routing
  - `@apollo/client`
  - `@shopify/polaris`
  - `@shopify/app-bridge-react`
  - `zustand` for global state management
- Nest.js
  - `@shopify/shopify-api` for shopify oauth
  - `@prisma/client` for orm
- Turbo.js
- Postgresql
- Ngrok

## Why I made this

The Shopify CLI generates an amazing starter app but it still needs some more boilerplate code and customizations so I can jump on to building apps with a simple clone. This includes:

- Postgres based session and database management.
- Webhooks isolated and setup.
- Better react routing.
- Misc boilerplate code and templates to quickly setup inApp subscriptions, routes, webhooks and more.
- Storing data is kept to a minimal to allow building custom models for flexibility.
- Session persistence is also kept to a minimal and based on the Redis example provided by Shopify, but feel free to modify as required.

## Setup

This is an in-depth guide on using this repo. This goes over getting the base repo up and running, to understand how to add your own customizations server side like registering webhooks, routes, etc.

- [x] Run `npm i --force` to install dependencies.
  - Substantial efforts have gone into ensuring we're using the latest package versions, and some incompatibility issues always pop up while installing. There are no negative effects on the functionality just yet, but if you find anything please open an issue.
  - Do not delete `shopify.app.toml` file since that's required by Shopify CLI 3.0 to function properly, even if the file is empty.
- [x] Run `npm i --workspace <client | server> package` to install dependencies from root.
- [x] Create a new app (Public or Custom) from your [Shopify Partner Dashboard](https://partners.shopify.com).
  - The App URL will be generated later in the setup. Add `https://localhost` for now.
- [x] Build your `.env` file based on `.env.example`
  - `SHOPIFY_API_KEY`: App API key.
  - `SHOPIFY_API_SECRET`: App secret.
  - `SHOPIFY_API_SCOPES`: Scopes required by your Shopify app. A list of access scopes can be found [here](https://shopify.dev/api/usage/access-scopes)
  - `SHOPIFY_APP_URL`: URL generated from Ngrok. It should not contain trailing slash.
  - `DATABASE_URL`: Postgres connection URL. If you're using a locally hosted version, `postgresql://<username>:<password>@localhost:5432/<dbname>`
  - `ENCRYPTION_STRING`: String to use for Cryption for encrypting sessions token. Add a random salt (or a random string of letters and numbers) and save it. If you loose the string you cannot decrypt your sessions and must be kept safely.
- [x] NPM Scripts
  - `dev`: Run in dev mode.
  - `build`: Use Vite to build React into `client/dist`. If you don't run build, you cannot serve anything in dev / production modes.
  - `start`: Run in production mode. Please run `npm run build` before to compile client side.
  - `ngrok:auth`: Add in your auth token from [Ngrok](https://ngrok.com) to use the service.
  - `ngrok`: Ngrok is used to expose specific ports of your machine to the internet and serve over https. Running `npm run ngrok` auto generates a URL for you. The URL that's generated here goes in `SHOPIFY_APP_URL` and in the URL section of your app in Partner Dashboard.
  - `shopify`: Run CLI 3.0 commands with `npm run shopify [command]`;
  - `s:e:create`: Create extension scaffolding using CLI 3.0. A new folder called `extensions` is created at root that uses the new folder structure.
  - `s:e:deploy`: Deploy extension(s) to Shopify.
- [x] Setup Partner Dashboard
  - Run `npm run ngrok` to generate your subdomain. Copy the `https://<your-url>` domain and add it in `SHOPIFY_APP_URL` in your `.env` file.
  - Setup URL's manually by heading over to Shopify Partner Dashboard > Apps > _Your App Name_ > App Setup
  - In the URLs section
    - App URL: `https://<your-url>`
    - Allowed Redirection URL(s):
      - `https://<your-url>/auth/offline`
      - `https://<your-url>/auth/online`
    - GPDR handlers are available at `server/gdpr/gdpr.controller.ts` and the URLs to register are:
      - Customers Data Request: `https://<your-url>/gdpr/customers_data_request`
      - Customers Redact: `https://<your-url>/gdpr/customers_redact`
      - Shop Redact: `https://<your-url>/gdpr/shop_redact`
- [x] Running App
  - Development Mode
    - Run `npm run ngrok` to create a ngrok instance if you haven't already.
    - Run `npm run dev` to run the server in development mode.
  - Production Mode
    - Run `npm run ngrok:prod` to create a ngrok instance if you haven't already.
    - Run `npm run build` to build both react and nest.
    - Run `npm run start` to run the server in development mode.
  - Install the app by heading over to `https://ngrokurl.io/auth?shop=mystorename.myshopify.com`. In dev mode, if you try and install from your partner dashboard, it'll fail since it'll use Vite instead of Express to run the server.
