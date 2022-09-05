cd "source/frontend"
npm run build
cd ..
cd ..
robocopy "source\backend\tentacles" "build\OctoBot-Tentacle\tentacles\" /MIR
robocopy "source\frontend\build" "build\OctoBot-Tentacle\tentacles\Services\Interfaces\octo_ui2\static\" /MIR
