# What is octo-ui2?
- this is an extension (Tentacle) for OctoBot
- it adds a customizable Web UI to OctoBot
- it supports plotting for live trading and backtests
- this is in early stages so there are still bugs to fix and lots of features to add

# Getting started
## Install octo ui2 tentacle
- the current version requires my forks of all OctoBot packages, once my custom code is merged into OctoBot it will work with stock OctoBot
1. to be able to install Tentacles, you need to enable a login password for your OctoBot under "Accounts -> Interface"
2. then go to yourOctobotDomain.com:5001/advanced/tentacle_packages - paste the URL for the latest version and install it

## Latest octo-ui2 tentacle package
https://raw.githubusercontent.com/techfreaque/octo-ui-2/main/releases/octo-ui2-latest/any_platform.zip

# Customize and install from source
## It's very easy to customize and create your own custom AppWidgets

- If you take a look at /source/frontend/src/widgets/WidgetManagement you should see how to add AppWidgets with custom props
- You can just copy an existing widget which suits most and go from there \
see here: /source/frontend/src/widgets/AppWidgets \
and here: /source/frontend/src/widgets/LayoutWidgets


## Bulding from source
- if you want to use the dev branch, usually it will require my forked branches of the Octobot packages and tentacles
- currently also the main branch requires my forks, which will change soon\
`git clone https://github.com/techfreaque/octo-ui-2`\
`cd octo-ui-2`
### 1. install requirements
`cd source/frontend` \
`npm install`

### 2. Run dev Server for the frontend
- make sure to update the REACT_APP_DEVELOPMENT_BOT_DOMAIN which should be the domain/ip of your running OctoBot instance in /source/frontend/.env

`cd source/frontend` \
`npm start`\
the frontend should run now and is usually available on localhost:3000\
It will fail to load until the backend runs and is properly configured

### 3. Add variables to .env
in your octobot folder, either create a .env file or edit the existing one and add those two variables.\
if you want to run your bot in production, you should remove those variables or set them to False
- CORS_MODE_ENABLED=True
- API_DEV_MODE_ENABLED=True\

### 3. install backend

#### Easy way to install backend
follow the "Install octo ui2 tentacle" instructions above or use the instructions below to build your own package

#### Build frontend and prepare tentacle package
`# build frontend`\
`cd source/frontend` \
`npm run build` \
`cd ..` \
`cd ..` \
`# robocopy works only on windows` \
`robocopy source/backend/tentacles build/OctoBot-Tentacle/tentacles\ /MIR` \
`robocopy source/frontend/build build/OctoBot-Tentacle/tentacles/Services/Interfaces/octo_ui2/static/ /MIR`

#### create tentacle package with terminal:
with your venv enabled you need to execute the following command\
`cd path/to/my/OctoBot` \
`python start.py tentacles --pack  path/to/my/octo_ui2/releases/octo_ui2-v-VERSION/octo_ui2 --directory path/to/my/octo_ui2/build/OctoBot-Tentacle/tentacles`

#### create tentacle package with VSCode:
example VSCode launch.json:\
`{`\
`	"version": "0.2.0",`\
`	"configurations": [`\
`    	{`\
`        	"name": "Zip octo ui2",`\
`        	"type": "python",`\
`        	"request": "launch",`\
`        	"env": {`\
`            	"PYTHONPATH": "${workspaceFolder}/OctoBot;${workspaceFolder}/OctoBot-Pro;${workspaceFolder}/Async-Channel;${workspaceFolder}/OctoBot-Tentacles-Manager;${workspaceFolder}/OctoBot-Commons;${workspaceFolder}/OctoBot-Trading2;${workspaceFolder}/OctoBot-Backtesting;${workspaceFolder}/OctoBot-evaluators;${workspaceFolder}/OctoBot-Services;${workspaceFolder}/trading-backend"`\
`        	},`\
`        	"program": "start.py",`\
`        	"console": "integratedTerminal",`\
`        	"cwd": "${workspaceFolder}/OctoBot",`\
`        	"args": [`\
`            	"tentacles",`\
`            	"-p",`\
`            	"C:/Users/Max1/Desktop/projects/Octobot-Project/octobot-ui2/releases/octo-ui2-latest/any_platform.zip",`\
`            	"-d",`\
`            	"C:/Users/Max1/Desktop/projects/Octobot-Project/octobot-ui2/build/OctoBot-Tentacle/tentacles"`\
`        	],`\
`        	"justMyCode": true`\
`    	},`\
`	]`\
`}`


