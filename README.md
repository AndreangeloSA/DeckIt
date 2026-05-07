# Yu-Gi-Oh API

API REST desenvolvida com Django e Django REST Framework para gerenciamento de cards, decks e usuários do universo Yu-Gi-Oh.

## Tecnologias

- Python
- Django
- Django REST Framework
- SQLite (desenvolvimento)

## Funcionalidades

- Pesquisa de cards
- Criação de decks
- Sistema de usuários
- Endpoints RESTful (TODO)

## Estrutura do Projeto

```text
project/
│
├── apps/
│   ├── cards/
│   ├── decks/
│   └── users/
│
├── config/
│
├── manage.py
├── requirements.txt
└── README.md
```

## Instalação

### Clone o repositório

```bash
git clone <repo-url>
cd <repo-name>
```

### Crie um ambiente virtual

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

### Instale as dependências

```bash
pip install -r requirements.txt
```

## Executando o projeto

### Aplicar migrations

```bash
python manage.py migrate
```

### Rodar o servidor

```bash
python manage.py runserver
```

A aplicação estará disponível em:

```text
http://127.0.0.1:8000/
```

## Criando superusuário

```bash
python manage.py createsuperuser
```

## Endpoints (TODO)

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/cards/` | Listar cards |
| POST | `/api/cards/` | Criar card |
| GET | `/api/decks/` | Listar decks |
| POST | `/api/decks/` | Criar deck |

## Licença

Este projeto está sob a licença MIT.
