# Yu-Gi-Oh API

Academic REST API project built using Python, Django and Django REST Framework for managing Yu-Gi-Oh cards and creating personalized decks.

## Technologies

- Python
- Django
- Django REST Framework
- SQLite (development)

## Features

- Card search
- Deck creation (TODO)
- User system (TODO)
- RESTful endpoints (TODO)

## Project Structure

```text
project/
│
├── apps/
│   ├── cards/
        ├──management
            ├──commands
│   ├── decks/
    ├── users/
│
├── config/
│
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

## Endpoints (TODO)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cards/` | List cards |
| POST | `/api/cards/` | Create card |
| GET | `/api/decks/` | List decks |
| POST | `/api/decks/` | Create deck |

## License

This project is licensed under the MIT License.
