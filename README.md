# Getting Started 

## Bulding from source
### install requirements
`cd source/frontend` \
`npm install`

### Run dev Server for the frontend
`cd source/frontend` \
`npm start`

### build installable OctoBot tentacle package
`cd source/frontend` \
`npm run build` \
`cd ..` \
`cd ..` \
`# robocopy works only on windows` \
`robocopy source/backend/tentacles build/OctoBot-Tentacle/tentacles\ /MIR` \
`robocopy source/frontend/build build/OctoBot-Tentacle/tentacles/Services/Interfaces/octo_ui2/static/ /MIR`

#### use this command to build a zipped installable tentacle package:
`cd path/to/my/OctoBot` \
`python start.py tentacles --pack  path/to/my/octo_ui2/releases/octo_ui2-v-VERSION/octo_ui2 --directory path/to/my/octo_ui2/build/OctoBot-Tentacle/tentacles`
