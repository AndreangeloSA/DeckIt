# Yu-Gi-Oh API

REST API project built using Python, Django and Django REST Framework for managing Yu-Gi-Oh! cards and creating personalized decks.

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
│  ├── cards/
│  │    ├──management
│  │        ├──commands
│  │            ├── import_cards.py
│  ├── decks/
│  ├── users/
│
├── config/
│
├── .env.example
├── .gitignore
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

### Environment Variables

Create a `.env` file in the project root and add:

```
SECRET_KEY=your_django_secret_key
DEBUG=True
```

It is optional and you could use the .env.example by changing the path on the settings.py

### Create your secret key
```
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```
add your key to the .env file

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

| Method      | Endpoint                    | Description                                  |
|-------------|-----------------------------|:---------------------------------------------|
| POST        | `/api/users/register/`      | Register user                                |
| POST        | `/api/users/token/`         | User login                                   |
| GET         | `/api/users/token/refresh/` | Refresh access token                         |
| GET         | `/api/cards/search/`        | Search cards                                 |
| POST        | `/api/decks/create/`        | Create deck                                  |
| POST/DELETE | `/api/decks/manage_cards/`  | Add, remove, alter quantity of cards on deck |
| GET         | `/api/decks/deck/`          | View deck and list cards inside              |
| GET         | `/api/decks/decklist/`      | View list of decks owned by user             |

## License

This project is licensed under the MIT License.
