FROM python:3.12.10-alpine3.21

# to log errors
ENV PYTHONUNBUFFERED=1

# this is for debian (buster images)
# in order to communicate with postgresql container it needs libpq-dev library
# RUN apt-get udpate && apt-get install -y libpq-dev gcc python3-dev

# this is for alpine
# musl-dev is use for alpine system to provide dev files for musl that is a standard c library
RUN apk update && add postgresql-dev gcc python-dev musl-dev
WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

CMD [ "python3", "manage.py", "runserver", "0.0.0.0:8000" ]

