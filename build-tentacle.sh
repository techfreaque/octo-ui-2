cd "source/frontend"
npm run build
cd ..
cd ..
rsync -a --delete -vh source/backend/tentacles/ build/OctoBot-Tentacle/tentacles/
rsync -a --delete -vh source/frontend/build/ build/OctoBot-Tentacle/tentacles/Services/Interfaces/octo_ui2/static/

echo "use this command to build a installable tentacle package:"
echo "cd path/to/my/OctoBot"
echo 'python start.py tentacles --pack  path/to/my/octo_ui2/releases/octo_ui2-v-VERSION/octo_ui2 --directory path/to/my/octo_ui2/build/OctoBot-Tentacle/tentacles'