# Balance Collective

Single-page Django landing site for Balance Collective. Sage / cream / tan / brown
palette, Cormorant Garamond + Jost type pairing. Contact form persists to the DB
and emails Isa via Gmail SMTP.

## Local setup

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# then edit .env — at minimum set SECRET_KEY and the EMAIL_* values

python manage.py migrate
python manage.py createsuperuser   # optional, for /admin/
python manage.py runserver
```

Visit http://127.0.0.1:8000/.

## Gmail App Password

`EMAIL_HOST_PASSWORD` must be a Google **App Password**, not your regular
Gmail password. Create one at https://myaccount.google.com/apppasswords
(requires 2-Step Verification on the Google account).

## Deploy to Railway

1. Push to GitHub.
2. New project on Railway → Deploy from GitHub repo.
3. Add a Postgres plugin (Railway injects `DATABASE_URL` automatically).
4. In the service variables, set:
   - `SECRET_KEY`
   - `DEBUG=False`
   - `ALLOWED_HOSTS=balancecollective.co,www.balancecollective.co,*.railway.app`
   - `CSRF_TRUSTED_ORIGINS=https://balancecollective.co,https://www.balancecollective.co,https://*.railway.app`
   - `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `DEFAULT_FROM_EMAIL`, `CONTACT_EMAIL`
5. Railway runs `release: python manage.py migrate` and starts gunicorn from the Procfile.
6. Add the custom domain `balancecollective.co` in the service's Settings → Networking,
   and point the registrar's DNS to Railway's CNAME target.

## Swapping in real photos

Drop images into `main/static/main/images/` and replace the
`.image-placeholder` divs in `main/templates/main/home.html`. The five
`.gallery-item` blocks are wired for the Club Balance grid; replace each
with `<img>` tags or background-image styles.
