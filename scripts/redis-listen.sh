#!/usr/bin/env bash
docker compose exec redis redis-cli SUBSCRIBE offers:new
