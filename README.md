# What is octo-ui2?
- this is an extension (Tentacle) for OctoBot
- it adds a customizable Web UI to OctoBot
- it supports plotting for live trading and backtests
- this is in early stages so there are still bugs to fix and lots of features to add

# Getting started
## Install octo ui2 tentacle
- the current version doesnt support plotting on stock OctoBot. It requires my forks of OctoBot (my master branches on each Octobot repository), once my custom code is merged into OctoBot it will work with stock OctoBot
1. to be able to install Tentacles, you need to enable a login password for your OctoBot under "Accounts -> Interface"
2. then go to yourOctobotDomain.com:5001/advanced/tentacle_packages - paste the URL for the latest version (se at the bottom) and install it

# Ask any questions
if you have any question, bug report, feature request, etc just open an issue here:\
https://github.com/techfreaque/octo-ui-2/issues

# Customize and install from source
## It's very easy to customize and create your own custom AppWidgets

- If you take a look at /source/frontend/src/widgets/WidgetManagement you should see how to add AppWidgets with custom props
- You can just copy an existing widget which suits most and go from there \
see here: /source/frontend/src/widgets/AppWidgets \
and here: /source/frontend/src/widgets/LayoutWidgets


## Bulding from source
- if you want to use the dev branch, usually it will require my forked branches of the Octobot packages and tentacles\
`git clone https://github.com/techfreaque/octo-ui-2`\
`cd octo-ui-2`
### 1. install requirements
`cd source/frontend` \
`npm install`

### 2. Run dev Server for the frontend
- make sure to update the env in /source/frontend/.env REACT_APP_DEVELOPMENT_BOT_DOMAIN which should be the domain/ip:port of your running OctoBot instance

`cd source/frontend` \
`npm start`\
the frontend should run now and is usually available on localhost:3000\
It will fail to load until the backend runs and is properly configured

### 3. Add variables to .env
in your octobot folder, either create a .env file or edit the existing one and add those two variables.\
if you want to run your bot in production, you should remove those variables or set them to False
- CORS_MODE_ENABLED=True
- API_DEV_MODE_ENABLED=True

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

## License: GPL

If you decide to customize my code, please note that it is licensed under the GNU General Public License (GPL). This means that you have the right to use, modify, and distribute the code as long as you also distribute any modified versions under the same GPL license. If you would like to contribute your modifications back to the original codebase, please open a pull request on the repository. This allows the community to review and potentially merge your changes, while also ensuring that any improvements or modifications are shared with others. Thank you for considering using my code, and I hope it serves you well.

## Your Donation Makes a Difference

Thank you for considering donating to support this open source project! Your support allows me to continue working on new and exciting features for everyone to enjoy. As this project is developed in my free time, every donation helps to motivate me to spend more time on it and bring new ideas to life. Your contribution will go towards funding the development and maintenance of this project, and will help ensure that it remains a valuable resource for the community. Thank you for your support and for helping to make this project a reality!

### USDT wallets:

USDT - TRX (Tron TRC20): TYfDkrjMeL6KpDFbB5A667V5BwYE3vzium\
USDT - BSC (BNB Smart Chain BEP20): 0x7bc06015304f00f5dccc22f009be313eb51396aa\
USDT - SOL (Solana): 8MeDCMQHXZJdhipkyoVUxahemuLy3ueEzuA8d8LTZe8o

### BUSD wallets:

BUSD - BSC (BNB Smart Chain BEP20): 0x7bc06015304f00f5dccc22f009be313eb51396aa

### BTC wallets

BTC - BTC: 163A8EDxQPjuUYUoP9u9f91dyRPAALmER7\
BTC - BSC (BNB Smart Chain BEP20): 0x7bc06015304f00f5dccc22f009be313eb51396aa\
BTC - SegWit BTC: bc1q2qnte70sdee0mw2h33jazx0dg4qd6erexzdajl\
BTC - ETH (ERC20): 0x7bc06015304f00f5dccc22f009be313eb51396aa

### BNB Wallets

BNB - BSC (BNB Smart Chain BEP20): 0x7bc06015304f00f5dccc22f009be313eb51396aa\
BNB - ETH (ERC20): 0x7bc06015304f00f5dccc22f009be313eb51396aa

### ETH wallets

ETH - ETH (ERC20): 0x7bc06015304f00f5dccc22f009be313eb51396aa ETH - BSC (BNB Smart Chain BEP20): 0x7bc06015304f00f5dccc22f009be313eb51396aa

### DOGE wallets

DOGE - DOGE: D5WteSP23WTAhM7Jh4dXxgkCL2CRjrdFJK\
DOGE - BSC (BNB Smart Chain BEP20): 0x7bc06015304f00f5dccc22f009be313eb51396aa


## Download latest octo-ui2 tentacle package
https://raw.githubusercontent.com/techfreaque/octo-ui-2/main/releases/octo-ui2-latest/any_platform.zip

