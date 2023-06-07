# Products-For-You

Products-For-You is a e-commerce web site made with django-rest-framework and React.js

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

go to  ``root -> backend -> db``

``docker-compose up -d``

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




## Licence
---
[GNU](https://www.gnu.org/licenses/gpl-3.0.html)