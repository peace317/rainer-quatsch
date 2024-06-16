This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) und setup from boilerplate [Primereact-Sakai](https://sakai.primereact.org/)

<div align="center">

[![Build Status][github-actions-status]][github-actions-url]
[![Github Tag][github-tag-image]][github-tag-url]


</div>

## Getting Started

### Requirements
- [Docker](https://www.docker.com/products/docker-desktop/) essential for development database
- [Node](https://nodejs.org/en) essential as runtime engine
- [LiveKit](https://docs.livekit.io/realtime/self-hosting/local/) local server (optional, if you use the cloud)
- [MongoDB Tools](https://www.mongodb.com/try/download/database-tools) used to execute dumps and imports to the db

### VSC Plugin suggestions
- [Prisma](vscode:extension/Prisma.prisma) for syntax highlighting in prisma files
- [Prettier](vscode:extension/esbenp.prettier-vscode) code formatter
- [Playwright](vscode:extension/ms-playwright.playwright) testing in VSC

### Additional tooling
- [MongoDBCompass](https://www.mongodb.com/products/tools/compass) for inspecting the db

### Install
To get started, install dependencies with npm:

```bash
npm install
```
### Create DB 
To setup a Mongodb in Docker run

```bash
npm run docker:db-dev
```

### Prisma generate
After that you need to generate the prisma entities.

```bash
npx prisma generate
```

If you have problems with certificates, you may need to set `set NODE_TLS_REJECT_UNAUTHORIZED=0` to install prisma client. 
Other helping commands are `npm config set strict-ssl false` and `npm config set registry "http://registry.npmjs.org/"`

### Start the server
Then run the server. The server would also start without any other service (e.g. db or websocket server).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Import ruletables
To import ruletables data simply run

```bash
npm run db:import
```

## Deployment

To package Next.js for [deployment](https://nextjs.org/docs/app/building-your-application/deploying) run

```bash
npm run build
```
This will generate the optimal build of the app. In addition to that, it also does code checks with eslint and there should be no errors to continue.

### Build docker images
For shipment and final deployment you can run 

```bash
npm run docker:build
```
This will build the image for the app and all components.

If you want to only build and update a certain service use 

```bash
npm run docker:build:app
```

to build only the specified image.

### Deploy
To deploy the the app with an mongodb cluster run

```bash
npm run docker:deploy
```
The db cluster can be accessed with an mongodb express agent [http://localhost:8081](http://localhost:8081) (root/prisma)

## Testing
For testing simply run

```bash
npm run test
```

### Debug local Test run
The easiest way to debug tests is via the VSC Plugin in the testing view or in the testfile itself.

To test the server without running any tests you can run.

```bash
npm run dev:test
```

This start the normal webserver with the test environment configuration.

You can also run the server and execute any test against the server. Playwright won't start another webserver, if there is already one live. This also applies to to socket server.

Now you can start the test run in debug mode.

```bash
npm run test:debug
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Maintainers

- [Janik Piepenhagen](https://github.com/peace317)

## License

MIT © [RainerQuatsch](https://github.com/peace317/rainer-quatsch)

[github-actions-status]: https://github.com/peace317/rainer-quatsch/workflows/Test/badge.svg
[github-actions-url]: https://github.com/peace317/rainer-quatsch/actions
[github-tag-image]: https://img.shields.io/github/v/tag/peace317/rainer-quatsch.svg?label=version
[github-tag-url]: https://github.com/peace317/rainer-quatsch/releases/latest