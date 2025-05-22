# Products-For-You

## Overview

Products-For-You is a e-commerce web site build with django-rest-framework and React.js.

### TECH STACK:

  **Front end**:

  React.js, redux-toolkit, rtk-query, scss with css modules

  **Back end**:

  Django, django-rest-framework, elastic-search, jwt-authentication, stripe payments

#### Key Features

- faceted search, advanced search functionality using elastic search
- user authentication using jwt
- secure payments with stripe
- product management with tags, categories, custom variations
- ability to add favorite products
- shipping costs calculation using dimensional factor, different tax-rates application
- promotions-discounts system
- order history


#### Some Features regarding the react app
- custom validation hook
- custom notification system


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

## SSL configuration


there are 2 options regarding running the dev servers with https

1) create ssl keys and cert and config the front end back dev servers

  -  install the ``openssl`` package
      - for arch systems it can be installed with ``sudo pacman -Sy openssl``

  - a folder have to be made inside the project and be added to .gitignore
    to store the keys

  - the key and cert can be created with the following commands
    ```sh
    openssl genrsa -out server.key 2048
    opessl req -new -key server.key -out server.csr
    ```
  by default python runs the dev server in http

  there are 2 options for creating a proxy server to serve and decrypt the https requests

  the first option is to use the package ``stunnel``
  in arch systems in can be installed with ``pacman -Sy stunnel``

  inside the project a confing file can be created to run stunnel

  ``stunnel.conf``

  ```bash
  cert = <location of server.crt>
  key = <location of server.key>

  [https]
  accept = 8443
  connect = 8000
  TIMEOUTclose = 0

  ```





 2) there is the  plugin for vite ``vite-plugin-mkcert``
it can be installed using ``vite add vite-plugin-mkcert`

then inside vite.config.ts

 ```js
 import { defineConfig } from 'vite'
 import mkcert from 'vite-plugin-mkcert'

 export default defineConfig({
   plugins: [mkcert()],
   server: {
     https: true
   }
 })
```
after this setup it vite will serve the app through https


for the django server there is the django-sslserver package that can be installed with pip.
https://github.com/teddziuba/django-sslserver







---

## DJANGO SERVER SETUP


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


## Licence
---
[GNU](https://www.gnu.org/licenses/gpl-3.0.html)
