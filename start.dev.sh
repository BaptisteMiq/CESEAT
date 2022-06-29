#!/bin/bash

CURRENT_DIR="$(echo "$(pwd)")"
APPS=()

APPS+=("Application"    "cd Application && npm run dev")
APPS+=("Database"       "cd Database && docker compose build && docker compose down && docker compose up")
APPS+=("MSC Accounts"   "cd Microservices/Accounts && npm run dev")
APPS+=("MSC CDN"        "cd Microservices/CDN && npm run dev")
APPS+=("MSC Orders"        "cd Microservices/Orders && npm run dev")
APPS+=("MSC Sockets"        "cd Microservices/Sockets && npm run dev")
APPS+=("Middleware"     "cd Middleware && npm run watch")

for ((i = 0; i < ${#APPS[@]}; i++)); do
    cd $CURRENT_DIR
    gnome-terminal --title="${APPS[$i]}" --working-directory=$CURRENT_DIR -x bash -c "${APPS[$i+1]}; bash"
    i=$((i+1))
done
