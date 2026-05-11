release: python manage.py migrate --noinput && python manage.py collectstatic --noinput
web: gunicorn balance_collective.wsgi --log-file -