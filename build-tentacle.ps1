cd "source/frontend"
npm run build
cd ..
robocopy "source\backend\tentacles" "build\OctoBot-Tentacle\tentacles\" /MIR
robocopy "source\frontend\build" "build\OctoBot-Tentacle\tentacles\Services\Interfaces\octo_ui2\static\" /MIR

echo "use this command to build a tentacle package: 'python path/to/my/OctoBot/start.py tentacles -p build\any_platform.zip -d build/OctoBot-Tentacle/tentacles'"