cd "source/frontend"
npm run build
cd ..
cd ..
robocopy "source\backend\tentacles" "build\OctoBot-Tentacle\tentacles\" /MIR
robocopy "source\frontend\build" "build\OctoBot-Tentacle\tentacles\Services\Interfaces\octo_ui2\static\" /MIR

echo "use this command to build a tentacle package:"
echo "cd path/to/my/OctoBot"
echo 'python start.py tentacles --pack  path/to/my/octo_ui2/releases/octo_ui2-v-VERSION/octo_ui2 --directory path/to/my/octo_ui2/build/OctoBot-Tentacle/tentacles'