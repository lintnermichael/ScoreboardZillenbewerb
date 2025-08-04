@echo OFF

docker start mongodb

echo Starting Flask backend...
start cmd /k "cd /d backend && flask --app main run --host=0.0.0.0"