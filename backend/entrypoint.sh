#!/bin/sh
set -e

echo "Waiting for MySQL..."
until python - <<'EOF'
import os
import MySQLdb

MySQLdb.connect(
    host=os.getenv("DB_HOST", "db"),
    user=os.getenv("DB_USER", "grfcourses"),
    passwd=os.getenv("DB_PASSWORD", "grfcourses"),
    db=os.getenv("DB_NAME", "grfcourses"),
    port=int(os.getenv("DB_PORT", "3306")),
)
EOF
do
  sleep 2
done

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput || true

exec gunicorn core.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers ${GUNICORN_WORKERS:-2} \
  --threads ${GUNICORN_THREADS:-4} \
  --timeout ${GUNICORN_TIMEOUT:-60} \
  --access-logfile "-" \
  --error-logfile "-"
