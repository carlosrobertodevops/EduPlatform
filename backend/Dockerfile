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

# AGORA é relativo ao contexto ./backend
COPY requirements.txt /app/requirements.txt

RUN python -m pip install --upgrade pip \
  && pip install -r /app/requirements.txt \
  && pip install gunicorn

# Copia todo o backend (contexto já é ./backend)
COPY . /app

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
