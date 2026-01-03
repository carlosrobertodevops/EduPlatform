# FROM python:3.12-slim

# ENV PYTHONDONTWRITEBYTECODE=1
# ENV PYTHONUNBUFFERED=1

# WORKDIR /app

# COPY requirements.txt /app/requirements.txt
# RUN pip install --no-cache-dir -r requirements.txt

# COPY . /app

# ENV DJANGO_SETTINGS_MODULE=core.settings

# EXPOSE 8000

# CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2", "--threads", "4", "--timeout", "120"]

FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1 \
  PIP_DISABLE_PIP_VERSION_CHECK=1 \
  PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  build-essential \
  default-libmysqlclient-dev \
  pkg-config \
  curl \
  && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt

RUN python -m pip install --upgrade pip \
  && pip install -r /app/requirements.txt \
  && pip install gunicorn

COPY . /app

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
