#!/usr/bin/env bash
# Confere tudo o que precisa existir ANTES de tentar subir o projeto.
# A ideia e falhar aqui, com uma mensagem que diz o que fazer, em vez de
# falhar dez linhas depois com um erro do Docker que nao explica nada.

set -euo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

vermelho() { printf '\033[31m%s\033[0m\n' "$1"; }
verde()    { printf '\033[32m%s\033[0m\n' "$1"; }

falhar() {
  vermelho "FALTA ALGO: $1"
  echo
  echo "Como resolver:"
  echo "  $2"
  exit 1
}

if ! command -v docker >/dev/null 2>&1; then
  falhar "o Docker nao esta instalado." \
         "Instale o Docker Desktop: https://docs.docker.com/get-started/get-docker/"
fi

if ! docker info >/dev/null 2>&1; then
  falhar "o Docker esta instalado, mas nao esta rodando." \
         "Abra o Docker Desktop e espere ele terminar de iniciar. Depois rode 'make up' de novo."
fi

if ! docker compose version >/dev/null 2>&1; then
  falhar "o plugin 'docker compose' nao foi encontrado." \
         "Atualize o Docker Desktop, que ja vem com ele. Atencao: 'docker-compose' com hifen e a versao antiga."
fi

if [ ! -f "$RAIZ/.env" ]; then
  falhar "o arquivo .env nao existe." \
         "Rode 'make setup' (ou 'cp .env.example .env') e preencha o que for necessario."
fi

verde "Pre-requisitos OK: Docker rodando, compose disponivel e .env no lugar."
