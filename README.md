# Octo UI2
License: GPL V3
# Project Overview

Octo UI2 is a web-based user interface for OctoBot, designed to provide users with a centralized platform to manage and automate their trading strategies. Just like how the gnome desktop environment is an essential component of the Linux/GNU operating system, Octo UI2 plays a crucial role in the OctoBot ecosystem. It provides a similar level of functionality and integration, enabling users to effectively manage and automate their trading strategies.

# Current State

Octo UI2 is presently in the beta phase and functions as a Tentacle extension for OctoBot. It offers users a customizable web UI that supports plotting, editing, and testing both real and simulated trading strategies. \
Additionally, the UI includes features for backtesting and analyzing trading results. Since the project is still in its early stages, there might be some bugs that need fixing, and many new features are still being added to enhance the user experience.

# Roadmap
The Octo UI2 project has an ambitious roadmap, including the following objectives:

- Integrate all of OctoBot's frontend features into its web UI
- Improve stability, usability and aesthetics of the platform for all screen sizes
- Add 10-15 run analyzers for simulated, real and backtesting trading data
- Add features to create/copy and edit tentacles with a code editor built in

# Change Log
* You can take a look a the [latest changes here](https://github.com/techfreaque/octo-ui-2/commits/main)

# Getting started / Installation
* To install the Octo UI2 tentacle, follow these steps:
1. Make sure you have the latest OctoBot version ready to go
2. Enable a login password under "Accounts -> Interface" to be able to install Tentacles on OctoBot
3. Go to yourOctobotDomain.com:5001/advanced/tentacle_packages and paste the URL (it's at the bottom of the page) for the latest version, then install it

# Update Octo UI2
* You can simply use the built in package manager to update your octo ui2 version
* If you have any issues with a new version, you can try to download [any version from here](https://github.com/techfreaque/octo-ui-2/tree/dev/releases) 

# Ask any questions
If you have any questions, bug reports, or feature requests, please open an [issue in the Octo UI2 GitHub repository](https://github.com/techfreaque/octo-ui-2/issues).
# Help us make it more awesome
## Add custom run analyzers
* Octo UI2 comes with the new run analysis mode, which allows you to analyze your (simulated, backtest or real) trading history. Currently there are a handfull of analyzers fully working and supported. And a lot more are in development.
* You can find all the available analyzers in /tentacles/Meta/Keywords/matrix_library/RunAnalysis/AnalysisEvaluators
* For example the plot candles analyzer is just simply taking care of loading the candles and plotting them on the chart. The plot trades analyzer, takes care of loading and plotting trades and offers you options to choose the symbols to plot. But there can be more complex analyzers, for example the unrealized pnl analyzer, it takes care of loading trades and transactions data and calculates the pnl
* If you want to create your own run analyzer, and you are pretty good with python, then just ping us and you can be part of the team (max@a42.ch) 

## Add app widgets and customize the UI
* The UI is made to be extendible and fully customizeable
* If you are serious about contributing to the UI and you have previous experience with javascript/react (python is a +), then just ping us and you can be part of the team (max@a42.ch)
### It's very easy to customize and create your own custom AppWidgets

- If you take a look at /source/frontend/src/widgets/WidgetManagement you should see how to add AppWidgets with custom props
- You can just copy an existing widget which suits most and go from there \
see here: /source/frontend/src/widgets/AppWidgets \
and here: /source/frontend/src/widgets/LayoutWidgets


### Bulding from source
- if you want to use the dev server, it will require [my forked tentacles](https://github.com/techfreaque/OctoBot-Tentacles) to enable cross origin on your octobot instance for the apis \
`git clone https://github.com/techfreaque/octo-ui-2`\
`cd octo-ui-2`
### 1. install requirements
`cd source/frontend` \
`npm i`

### 2. Run the dev Server for the frontend
- make sure to update the env in /source/frontend/.env REACT_APP_DEVELOPMENT_BOT_DOMAIN which should be the domain/ip:port of your running OctoBot instance

`cd source/frontend` \
`npm run start`\
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

# License: GPL V3

If you decide to customize my code, please note that it is licensed under the GNU General Public License (GPL V3). This means that you have the right to use, modify, and distribute the code as long as you also distribute any modified versions under the same GPL license. If you would like to contribute your modifications back to the original codebase, please open a pull request on the repository. This allows the community to review and potentially merge your changes, while also ensuring that any improvements or modifications are shared with others. Thank you for considering using my code, and I hope it serves you well.

# Your Donation Makes a Difference

Thank you for considering donating to support this open source project! Your support allows me to continue working on new and exciting features for everyone to enjoy. As this project is developed in my free time, every donation helps to motivate me to spend more time on it and bring new ideas to life. Your contribution will go towards funding the development and maintenance of this project, and will help ensure that it remains a valuable resource for the community. Thank you for your support and for helping to make this project a reality!

## USDT wallets:

USDT - TRX (Tron TRC20): TYfDkrjMeL6KpDFbB5A667V5BwYE3vzium\
USDT - BSC (BNB Smart Chain BEP20): 0x7bc06015304f00f5dccc22f009be313eb51396aa\
USDT - SOL (Solana): 8MeDCMQHXZJdhipkyoVUxahemuLy3ueEzuA8d8LTZe8o

## BUSD wallets:

BUSD - BSC (BNB Smart Chain BEP20): 0x7bc06015304f00f5dccc22f009be313eb51396aa

## BTC wallets

BTC - BTC: 163A8EDxQPjuUYUoP9u9f91dyRPAALmER7\
BTC - BSC (BNB Smart Chain BEP20): 0x7bc06015304f00f5dccc22f009be313eb51396aa\
BTC - SegWit BTC: bc1q2qnte70sdee0mw2h33jazx0dg4qd6erexzdajl\
BTC - ETH (ERC20): 0x7bc06015304f00f5dccc22f009be313eb51396aa

## BNB Wallets

BNB - BSC (BNB Smart Chain BEP20): 0x7bc06015304f00f5dccc22f009be313eb51396aa\
BNB - ETH (ERC20): 0x7bc06015304f00f5dccc22f009be313eb51396aa

## ETH wallets

ETH - ETH (ERC20): 0x7bc06015304f00f5dccc22f009be313eb51396aa ETH - BSC (BNB Smart Chain BEP20): 0x7bc06015304f00f5dccc22f009be313eb51396aa

## DOGE wallets

DOGE - DOGE: D5WteSP23WTAhM7Jh4dXxgkCL2CRjrdFJK\
DOGE - BSC (BNB Smart Chain BEP20): 0x7bc06015304f00f5dccc22f009be313eb51396aa


# Download latest octo-ui2 tentacle package
https://raw.githubusercontent.com/techfreaque/octo-ui-2/main/releases/octo-ui2-latest/any_platform.zip

