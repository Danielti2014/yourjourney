#!/usr/bin/env bash
# Espera um servico ficar de pe antes de seguir adiante.
#
# O 'docker compose up' termina quando os conteineres FORAM INICIADOS, e nao
# quando eles ja estao respondendo. Subir a API leva alguns segundos a mais que
# isso. Sem esta espera, quem roda 'make up' abre o navegador cedo demais, ve um
# erro de conexao e acha que quebrou -- quando so faltava esperar.
#
# Uso:
#   wait-for.sh http://localhost:8080/health  "API"   [segundos]
#   wait-for.sh localhost:5432                "banco" [segundos]

set -euo pipefail

ALVO="${1:?informe a URL ou host:porta}"
NOME="${2:-$ALVO}"
LIMITE="${3:-90}"

vermelho() { printf '\033[31m%s\033[0m\n' "$1"; }
verde()    { printf '\033[32m%s\033[0m\n' "$1"; }

responde() {
  if [[ "$ALVO" == http://* || "$ALVO" == https://* ]]; then
    curl --silent --fail --max-time 2 --output /dev/null "$ALVO"
  else
    local host="${ALVO%%:*}"
    local porta="${ALVO##*:}"
    # /dev/tcp e um recurso do proprio bash: abrir esse "arquivo" tenta uma
    # conexao TCP. Serve para testar porta sem depender de nc ou telnet.
    (exec 3<>"/dev/tcp/$host/$porta") 2>/dev/null
  fi
}

printf 'Esperando %s (ate %ss)' "$NOME" "$LIMITE"

decorrido=0
while ! responde; do
  if [ "$decorrido" -ge "$LIMITE" ]; then
    echo
    vermelho "$NOME nao respondeu em ${LIMITE}s."
    echo
    echo "O que fazer:"
    echo "  1. 'make ps'    -- ver se o conteiner esta de pe"
    echo "  2. 'make logs'  -- ver o erro que impediu ele de subir"
    exit 1
  fi
  printf '.'
  sleep 2
  decorrido=$((decorrido + 2))
done

echo
verde "$NOME respondendo."
