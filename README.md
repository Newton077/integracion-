# WavyNode Integration Template

This is a template repository for building and deploying a WavyNode integration.

## Environment Variables

This project uses a `.env` file for environment variables. A template file, `.env.template`, is provided.

1.  **Create a `.env` file:**

    ```bash
    cp .env.template .env
    ```

2.  **Update the `.env` file** with your specific configuration.

## Development

To start the development server, run the following command:

```bash
bun run dev
```

## Building for Production

To build the application for production, run the following command:

> Alternatively, you can just build the Dockerimage and deploy it

```bash
bun run build
```

This will create a `.output` directory with the production-ready server.

## Routes

This integration has two base routes:

*   A webhook route (`/webhook`)
*   A users API endpoint (`/users`)

## Project Structure

*   `server/`: The main directory for your application logic.
    *   `middleware/`: Contains your server middleware.
    *   `routes/`: Contains your API routes.
*   `types/`: Contains your TypeScript type definitions.
*   `nitro.config.ts`: The configuration file for Nitro.
*   `package.json`: The project's dependencies and scripts.
