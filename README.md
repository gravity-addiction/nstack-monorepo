# nstack-monorepo

**Work In Progress** The goal with this is to have multiple nativescript projects in the same monorepo. I been having good success with angular/api typescripted together in the same monorepo. Nativescript code sharing seems ideal. I have a few tweeks to the nativescript webpack.config.ts file that it ships with, renamed it to webpack-tns.config.ts with some adjustments.

## Quickstart

Download github source repo, Install nativescript globally, install npm modules to repo root. Then proceed to either startup the web and api services or the mobile interface.

```shell
git clone http://github.com/gravity-addiction/nstack-monorepo.git
cd nstack-monorepo
npm install -g nativescript
npm install
```

### Web Startup

```shell
npm start
```

### Mobile Startup

for nativescript multi-project setup you have to compile from the project folder.

```shell
cd projects/com-skydiveorbust
npm run ios
npm run android
```

## Project Layout

Multi-project Angular 11 and code sharing with Nativescript 7. Fastify driven typescripted api. Shared typings between NG/NS and server API. For project compiling and serving it's been easiest to add npm run scripts in each projects/\*\*/package.json file.

API sites folders are found in /api/sites/\*\* folder from your repo root. The important files are the webpack configuration file, and the entry points that the webpack config defines. The webpack config files only need entries modified around line 10. You can add several entries and they'll get built as individual microservices. The output build folder defaults to the projects dist/api/ folder, from your repo root projects/\*\*/dist/api/

Nativescript (ns) commands and builds must be done from the projects/\*\* folders. Each project folder contains it's own App_Resources and can be built using the ns resources tool. Project folders contain their own platforms and hooks folders that are dynamically generated with ns platform add

### com-skydiveorbust

More complete project with video player, wysiwyg pdf editor, and svg state map lookups

### org-vendorportal-website

Startup project to take payments though squareup and generate dynamic pdf invoices

## API

API config files are stored in /projects/\*\*/dist/api . Configurations start with the index.js file, ```config = { }``` is what is expected. Included in that config can be, ```"configFileThread": []``` with a list of other .js config files to load in series. Each config file is deepmerged in series with the running collection. See the code of how this works in /api/lib/config/index.ts

## Angular 11

The idea is to have a multi-project angular 11 repo that is upgradeable and works as much as possible with the angular-cli.

## Nativescript 7

Code sharing next to angular 11. Multiple projects within same repo.

## Nativescript Misc

It's been a long road getting everything to play nice with each other. I believe there is still some tsconfig settings that need to be added for vscode typescript intellisense to identify the import "paths" for tns.ts files.

### Nativescript Background Push Notifications

Load xcode open project in ios folder
project -> project target -> capabilities -> capabilites + button -> add push notifications and background services
background services enable remote-notifications
