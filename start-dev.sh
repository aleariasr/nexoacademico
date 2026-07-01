#!/usr/bin/env bash

set -Eeuo pipefail

# ============================================================
# NexoAcadémico - Inicio completo del entorno de desarrollo
# macOS + MAMP + Django + Next.js
# ============================================================

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
VENV_DIR="$BACKEND_DIR/.venv"

DJANGO_HOST="127.0.0.1"
DJANGO_PORT="8000"
NEXT_HOST="localhost"
NEXT_PORT="3000"

MYSQL_HOST="127.0.0.1"
MYSQL_PORT="8889"

DJANGO_PID=""
NEXT_PID=""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RESET='\033[0m'

info() {
  printf "${CYAN}➜ %s${RESET}\n" "$1"
}

success() {
  printf "${GREEN}✓ %s${RESET}\n" "$1"
}

warning() {
  printf "${YELLOW}⚠ %s${RESET}\n" "$1"
}

error() {
  printf "${RED}✗ %s${RESET}\n" "$1" >&2
}

cleanup() {
  echo
  info "Deteniendo servidores..."

  if [[ -n "${DJANGO_PID:-}" ]] && kill -0 "$DJANGO_PID" 2>/dev/null; then
    kill "$DJANGO_PID" 2>/dev/null || true
  fi

  if [[ -n "${NEXT_PID:-}" ]] && kill -0 "$NEXT_PID" 2>/dev/null; then
    kill "$NEXT_PID" 2>/dev/null || true
  fi

  wait 2>/dev/null || true

  success "Django y Next.js detenidos."
  exit 0
}

trap cleanup SIGINT SIGTERM EXIT

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

port_is_open() {
  nc -z "$1" "$2" >/dev/null 2>&1
}

validate_project() {
  info "Validando estructura del proyecto..."

  if [[ ! -d "$BACKEND_DIR" ]]; then
    error "No existe la carpeta: $BACKEND_DIR"
    exit 1
  fi

  if [[ ! -f "$BACKEND_DIR/manage.py" ]]; then
    error "No se encontró backend/manage.py"
    exit 1
  fi

  if [[ ! -d "$FRONTEND_DIR" ]]; then
    error "No existe la carpeta: $FRONTEND_DIR"
    exit 1
  fi

  if [[ ! -f "$FRONTEND_DIR/package.json" ]]; then
    error "No se encontró frontend/package.json"
    exit 1
  fi

  if [[ ! -x "$VENV_DIR/bin/python" ]]; then
    error "No se encontró el entorno virtual en: $VENV_DIR"
    echo
    echo "Créalo con:"
    echo "  cd backend"
    echo "  python3 -m venv .venv"
    echo "  source .venv/bin/activate"
    echo "  pip install -r requirements.txt"
    exit 1
  fi

  if ! command_exists npm; then
    error "npm no está instalado o no está disponible en PATH."
    exit 1
  fi

  if ! command_exists nc; then
    error "No se encontró el comando nc."
    exit 1
  fi

  success "Estructura válida."
}

start_mamp() {
  info "Abriendo MAMP..."

  if [[ -d "/Applications/MAMP/MAMP.app" ]]; then
    open -a "/Applications/MAMP/MAMP.app" 2>/dev/null || open -a "MAMP"
  else
    error "MAMP no está instalado en /Applications/MAMP/MAMP.app"
    exit 1
  fi

  # MAMP puede incluir scripts distintos según la versión.
  # Se prueban varias ubicaciones conocidas.

  if [[ -x "/Applications/MAMP/bin/start.sh" ]]; then
    info "Iniciando servicios de MAMP..."
    "/Applications/MAMP/bin/start.sh" >/dev/null 2>&1 || true
  else
    if [[ -x "/Applications/MAMP/bin/startMysql.sh" ]]; then
      info "Iniciando MySQL de MAMP..."
      "/Applications/MAMP/bin/startMysql.sh" >/dev/null 2>&1 || true
    fi

    if [[ -x "/Applications/MAMP/bin/startApache.sh" ]]; then
      info "Iniciando Apache de MAMP..."
      "/Applications/MAMP/bin/startApache.sh" >/dev/null 2>&1 || true
    fi
  fi
}

wait_for_mysql() {
  if port_is_open "$MYSQL_HOST" "$MYSQL_PORT"; then
    success "MySQL ya está disponible en $MYSQL_HOST:$MYSQL_PORT."
    return
  fi

  info "Esperando a MySQL de MAMP en el puerto $MYSQL_PORT..."

  local max_attempts=30
  local attempt=1

  while (( attempt <= max_attempts )); do
    if port_is_open "$MYSQL_HOST" "$MYSQL_PORT"; then
      success "MySQL está disponible."
      return
    fi

    printf "."
    sleep 1
    ((attempt++))
  done

  echo
  error "MySQL no respondió en $MYSQL_HOST:$MYSQL_PORT."
  echo
  echo "Abre MAMP y presiona manualmente \"Start Servers\"."
  echo "Después vuelve a ejecutar:"
  echo "  ./start-dev.sh"
  exit 1
}

prepare_frontend() {
  if [[ ! -d "$FRONTEND_DIR/node_modules" ]]; then
    info "node_modules no existe. Instalando dependencias..."

    (
      cd "$FRONTEND_DIR"

      if [[ -f package-lock.json ]]; then
        npm ci
      else
        npm install
      fi
    )

    success "Dependencias del frontend instaladas."
  fi
}

prepare_backend() {
  info "Validando Django..."

  (
    cd "$BACKEND_DIR"

    "$VENV_DIR/bin/python" manage.py check
    "$VENV_DIR/bin/python" manage.py migrate
  )

  success "Backend preparado."
}

start_django() {
  info "Iniciando Django en http://$DJANGO_HOST:$DJANGO_PORT..."

  (
    cd "$BACKEND_DIR"
    exec "$VENV_DIR/bin/python" manage.py runserver "$DJANGO_HOST:$DJANGO_PORT"
  ) &

  DJANGO_PID=$!
}

start_next() {
  info "Iniciando Next.js en http://$NEXT_HOST:$NEXT_PORT..."

  (
    cd "$FRONTEND_DIR"
    exec npm run dev
  ) &

  NEXT_PID=$!
}

wait_for_servers() {
  info "Esperando a que los servidores respondan..."

  local max_attempts=40
  local attempt=1

  while (( attempt <= max_attempts )); do
    local django_ready=false
    local next_ready=false

    if port_is_open "$DJANGO_HOST" "$DJANGO_PORT"; then
      django_ready=true
    fi

    if port_is_open "127.0.0.1" "$NEXT_PORT"; then
      next_ready=true
    fi

    if [[ "$django_ready" == true && "$next_ready" == true ]]; then
      success "Aplicación iniciada correctamente."
      return
    fi

    if ! kill -0 "$DJANGO_PID" 2>/dev/null; then
      error "Django terminó inesperadamente."
      exit 1
    fi

    if ! kill -0 "$NEXT_PID" 2>/dev/null; then
      error "Next.js terminó inesperadamente."
      exit 1
    fi

    sleep 1
    ((attempt++))
  done

  error "Los servidores no respondieron dentro del tiempo esperado."
  exit 1
}

open_application() {
  open "http://localhost:$NEXT_PORT" >/dev/null 2>&1 || true
}

main() {
  clear

  echo "============================================================"
  echo "              NexoAcadémico - Development"
  echo "============================================================"
  echo

  validate_project
  start_mamp
  wait_for_mysql
  prepare_frontend
  prepare_backend
  start_django
  start_next
  wait_for_servers
  open_application

  echo
  success "Frontend: http://localhost:$NEXT_PORT"
  success "Backend:  http://$DJANGO_HOST:$DJANGO_PORT"
  success "MySQL:    $MYSQL_HOST:$MYSQL_PORT"
  echo
  warning "Presiona Ctrl + C para detener Django y Next.js."
  echo

  # Mantiene vivo el script mientras ambos procesos estén ejecutándose.
  wait "$DJANGO_PID" "$NEXT_PID"
}

main "$@"