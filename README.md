# Yu-Gi-Oh API

REST API project built using Python, Django and Django REST Framework for managing Yu-Gi-Oh cards and creating personalized decks.

## Technologies

- Python
- Django
- Django REST Framework
- SQLite (development)
- JWT

## Features

- Card search
- Deck creation
- User system
- RESTful endpoints

## Project Structure

```text
project/
│
├── apps/
│   ├── cards/
        ├──management
            ├──commands
    ├── decks/
    ├── users/
│
├── config/
├── db.sqlite3
├── manage.py
├── requirements.txt
└── README.md
```

## Installation

### Clone the repository

```bash
git clone <repo-url>
cd <repo-name>
```

### Create a virtual environment

#### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

#### Linux/macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

## Running the Project

### Apply migrations

```bash
python manage.py migrate
```

### Run the development server

```bash
python manage.py runserver
```

The application will be available at:

```text
http://127.0.0.1:8000/
```

## Import cards

```
python manage.py import_cards
** use with discretion, external API has requests limit per IP
```
### If database is already populated, run to clear data:

```
python manage.py flush
```

## Search for a card

```
Example: http://127.0.0.1:8000/api/cards/search/?name=blue-eyes%20white%20dragon
```

## Creating a Superuser

```bash
python manage.py createsuperuser
```

## Endpoints

| Method | Endpoint                    | Description                     |
|--------|-----------------------------|---------------------------------|
| POST   | `/api/users/register/`      | Register user                   |
| POST   | `/api/users/token/`         | User login                      |
| GET    | `/api/users/token/refresh/` | Refresh access token            |
| GET    | `/api/cards/search/`        | Search cards                    |
| POST   | `/api/decks/create/`        | Create deck                     |
| POST   | `/api/decks/add/`           | Add card to deck                |
| GET    | `/api/decks/decks/`         | View deck and list cards inside |

## License

This project is licensed under the MIT License.
