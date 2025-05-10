# Products-For-You

## Overview

Products-For-You is a e-commerce web site build with django-rest-framework and React.js.

### TECH STACK:

  **Front end**:

  React.js,redux-toolkit, rtk-query, scss with css modules

  **Back end**:

  Django, django-rest-framework, elastic-search, jwt-authentication, stripe payments

#### Key Features

- faceted search, advanced search functionality using elastic search
- user authentication using jwt
- secure payments with stripe
- product management with tags, categories, custom variations
- ability to add favorite products
- shipping cost calculation, different tax-rates application
- promotions
- order history

## Installation

### BACKEND
### 1) create a virtual enviroment

### On windows

* to create the env

``python -m venv <name of the env>``

* to activate the evn

``<name of the env>\Scripts\activate``

### bash - zsh
`` python3 -m virtualenv <name_of_the_env>``
* activate

``source <name_of_the_env>/bin/activate``

---

2) Install required dependencies[^1].


[^1]: (inside the root of the project)
```python
pip install -r requirement.txt
```
---
3) run the database (docker has to be configured on the operating system)

- navigate to  ``root -> backend -> db``

- ```shell
  docker-compose up -d
```

---
4) make migrations
```python
python manage.py makemigrations
```

```python
python manage.py migrate
```
---
5) Create superuser

```bash
python manage.py createsuperuser
```

## Client setup
---
- cd into client directory
- install required dependencies

``yarn``

- start the development server

``yarn run dev``

> on windows machines there is a ps1 script that is called **start_app.ps1**. This script starts the database , runs the dev server on the client & opens a chrome browser on the correct address given that chrome is installed to default location on the system.




## Licence
---
[GNU](https://www.gnu.org/licenses/gpl-3.0.html)
