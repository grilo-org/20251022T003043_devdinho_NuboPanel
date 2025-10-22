#!/bin/bash
if [ -f ".env" ]; then
  export $(grep -v "^#" .env | xargs)
fi

VITE_ENV=${VITE_ENV:-dev}
echo "Executando comando: npm run $VITE_ENV"

if [ "$VITE_ENV" = "dev" ]; then
  exec npm run dev -- --host 0.0.0.0
else
  exec npm run "$VITE_ENV"
fi
