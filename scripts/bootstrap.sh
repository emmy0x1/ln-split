#!/bin/sh

set -e

cat <<"EOF"
* * * * * * * * * * * * * * * * * * * * * *
*          LApp Bootstrap Script          *
* * * * * * * * * * * * * * * * * * * * * *
EOF

# Verify that Node.js is installed
command -v node >/dev/null 2>&1 || {
  echo >&2 "You need to install Node.js first.";
  exit 1;
}

# Verify that Yarn is installed
command -v yarn >/dev/null 2>&1 || {
  echo >&2 "You need to install Yarn first.";
  exit 1;
}

# Verify that PostgreSQL is installed
command -v psql >/dev/null 2>&1 || {
  echo >&2 "You need to install PostgreSQL first.";
  exit 1;
}

# Copy environment variable config
cp -n .env.example .env

# Install dependencies
echo "==> Installing Node.js dependencies"
yarn

# Setup the local database
# echo "==> Setting up database."
# psql --variable=ON_ERROR_STOP=1 --username "postgres" <<-EOSQL
#     CREATE ROLE lapp WITH LOGIN PASSWORD 'lapp';
#     CREATE DATABASE "lapp" OWNER = lapp;
#     GRANT ALL PRIVILEGES ON DATABASE "lapp" TO lapp;
# EOSQL


# Seed the database
docker-compose up db