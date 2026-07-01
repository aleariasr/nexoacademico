#!/bin/bash

# Mantener abierta la terminal si ocurre un error.
trap 'echo; echo "Ocurrió un error. Presiona Enter para cerrar."; read' ERR

# Ir automáticamente a la carpeta donde está este archivo.
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_ROOT"

clear

echo "============================================================"
echo "                 Iniciando NexoAcadémico"
echo "============================================================"
echo

# Ejecutar el script principal.
./start-dev.sh

echo
echo "NexoAcadémico se detuvo."
echo "Presiona Enter para cerrar esta ventana."
read