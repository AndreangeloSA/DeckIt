# DeckIt API

REST API built with Python, Django and Django REST Framework for managing Yu-Gi-Oh! cards and personalized decks.

## Technologies

- Python
- Django
- Django REST Framework
- PostgreSQL (local development and Supabase)
- JWT authentication with Simple JWT

## Features and status

- Card search by name, type, attribute, race and frame type.
- User registration, JWT login and access token refresh.
- Logout through refresh token blacklisting.
- Deck creation, listing, retrieval, editing and deletion with ownership checks.
- Optional deck descriptions.
- Main, Extra and Side Deck models and validation logic, currently under development.

The frontend prototype is maintained on the `feat/frontend` branch. Password recovery, profile editing, user images and favorites are not implemented in the current API.

### Known implementation issues

The current source still requires these corrections before all documented workflows can run:

- Card import accesses `card.image`, which is used for locally stored images; verify compatibility with the current card model before running it.
- Capacity checks and writes are not yet protected against concurrent requests.

The card-management example below describes the intended request format; it is not a claim that these pending fixes are complete.

## Project structure

```text
project/
├── apps/
│   ├── cards/
│   │   └── management/
│   │       └── commands/
│   │           └── import_cards.py
│   ├── decks/
│   └── users/
├── config/
├── .env.example
├── .gitignore
├── manage.py
├── requirements.txt
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone <repo-url>
cd <repo-name>
```

### 2. Create and activate a virtual environment

Windows PowerShell:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Linux/macOS:

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
python -m pip install -r requirements.txt
```

### 4. Configure the environment

Copy `.env.example` to `.env` in the project root, then fill in the values. Do not change the dotenv path in `settings.py` or commit credentials.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Linux/macOS:

```bash
cp .env.example .env
```

Generate a secret key after installing dependencies:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Use it in your local configuration:

```dotenv
SECRET_KEY=your_generated_secret_key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
DJANGO_ENV=development
ALLOWED_REMOTE_MIGRATIONS=false

LOCAL_DB_NAME=deckit
LOCAL_DB_USER=your_local_database_user
LOCAL_DB_PASSWORD=your_local_database_password
LOCAL_DB_HOST=localhost
LOCAL_DB_PORT=5432
```

Create the local PostgreSQL database and user before applying migrations. SQLite is not configured.

The current `.env.example` spells the flag `ALLOW_REMOTE_MIGRATIONS`. Rename it to **`ALLOWED_REMOTE_MIGRATIONS`** in your `.env`, matching `settings.py`.

Supabase requires the corresponding `SUPABASE_DB_NAME`, `SUPABASE_DB_USER`, `SUPABASE_DB_PASSWORD`, `SUPABASE_DB_HOST` and `SUPABASE_DB_PORT` values. These are only needed when targeting the remote database.

## Database migrations

### Local setup

With `DJANGO_ENV=development` and remote migrations disabled:

```bash
python manage.py migrate
```

When changing models, generate migrations locally, apply them and run tests:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py test
```

Commit generated migration files alongside the model changes. Apply those same files to the remote environment; do not regenerate migrations for each database.

### Supabase migrations — PowerShell

Fill in the Supabase connection settings first. Enable the remote target and inspect the plan:

```powershell
$env:DJANGO_ENV = "production"
$env:ALLOWED_REMOTE_MIGRATIONS = "true"
python manage.py migrate --plan
```

After reviewing the plan, apply it:

```powershell
python manage.py migrate
```

Return the terminal to local development afterward, including if a command fails:

```powershell
$env:DJANGO_ENV = "development"
$env:ALLOWED_REMOTE_MIGRATIONS = "false"
```

These assignments affect the current terminal session and its child processes; they do not edit `.env`.

### How the database is selected

- `test` selects the local PostgreSQL configuration.
- `migrate` selects the local configuration unless remote migrations are enabled.
- Remote migrations require both `DJANGO_ENV=production` and `ALLOWED_REMOTE_MIGRATIONS=true`.
- Other commands, including `runserver`, `shell`, `makemigrations`, `showmigrations`, `import_cards` and `createsuperuser`, follow `DJANGO_ENV`. The migration flag does not protect them from remote access.
- The `LOCAL_` and `SUPABASE_` prefixes select credentials; verify that their hosts actually point to the intended databases.

## Running locally

After resolving the known startup issue and applying migrations:

```bash
python manage.py runserver
```

The server runs at [http://127.0.0.1:8000/](http://127.0.0.1:8000/). API routes use the `/api/` paths below; the root URL is not a frontend homepage.

Create an administrator, if needed:

```bash
python manage.py createsuperuser
```

Then visit [Django admin](http://127.0.0.1:8000/admin/).

## Tests

```bash
python manage.py test
```

Tests use the local PostgreSQL configuration. The configured user must have permission to create the test database. Existing tests need to be kept in sync with the new section and quantity behavior.

## Card import

The import command fetches data from YGOPRODeck:

```bash
python manage.py import_cards
```

Resolve the image-field compatibility issue noted above before running it. The importer uses `update_or_create` by card ID, so clearing the database is not a normal prerequisite. The current import flow also attempts image downloads; avoid unnecessary repeated runs and respect the provider's usage limits.

Do not use `python manage.py flush` as an import step: it deletes data from Django-managed tables, including users, decks and cards.

## Authentication

Register with `username`, `email` and `password`. Login accepts `username` and `password` and returns `access` and `refresh` tokens.

All deck endpoints and logout require:

```http
Authorization: Bearer <access_token>
```

Use `Content-Type: application/json` for JSON requests.

For token refresh, send a POST to `/api/users/token/refresh/`:

```json
{
  "refresh": "<refresh_token>"
}
```

Logout uses the same body at `/api/users/logout/`, together with the access-token header. It blacklists the supplied refresh token. The frontend should clear its stored tokens; an already-issued access token remains valid until expiry.

## Endpoints

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| POST | `/api/users/register/` | Public | Register a user |
| POST | `/api/users/token/` | Public | Obtain access and refresh tokens |
| POST | `/api/users/token/refresh/` | Refresh token in body | Refresh an access token |
| POST | `/api/users/logout/` | JWT | Blacklist the supplied refresh token |
| GET | `/api/cards/search/` | Public | Search cards |
| POST | `/api/decks/create/` | JWT | Create a deck |
| PATCH | `/api/decks/edit/<deck_id>` | JWT, owner | Edit name and description |
| DELETE | `/api/decks/delete/<deck_id>` | JWT, owner | Delete a deck |
| POST/DELETE | `/api/decks/manage_cards/` | JWT, owner | Add or remove copies of a card |
| GET | `/api/decks/decks/<deck_id>/` | JWT, owner | Retrieve a deck and its cards |
| GET | `/api/decks/decklist/` | JWT | List the user's decks |

The edit and delete routes currently have **no trailing slash**. Use their paths exactly as shown.

### Create or edit a deck

Example body for creation:

```json
{
  "name": "Blue-Eyes",
  "description": "My dragon deck"
}
```

Description is optional. PATCH accepts only the fields being changed.

### Manage cards

Intended JSON body for POST or DELETE:

```json
{
  "deck": 1,
  "card": 89631139,
  "card_quantity": 1,
  "section": "main"
}
```

The IDs must exist in the database. `card_quantity` is the number of copies to add or remove, not the desired final quantity. Each request accepts 1–3 copies, defaulting to 1.

Sections are `main`, `extra` and `side`. Intended capacities are 60, 15 and 15 respectively, with at most three copies of a card across all sections. See the known issues before relying on this validation.

### Search cards

All filters are optional and can be combined:

| Parameter | Matching |
|---|---|
| `name` | Partial, case-insensitive |
| `type` | Exact, case-insensitive |
| `attribute` | Exact, case-insensitive |
| `race` | Exact, case-insensitive |
| `frameType` | Exact, case-insensitive |

Example: [Search for Blue-Eyes White Dragon](http://127.0.0.1:8000/api/cards/search/?name=blue-eyes%20white%20dragon).

Results are currently unpaginated. Without filters, the endpoint returns all cards.

## License

This project declares the MIT License. A standalone `LICENSE` file still needs to be added to the repository.
