#!/usr/bin/env bash
set -euo pipefail

# list of ports you want to free
ports=(4200 4201 4202)

for port in "${ports[@]}"; do
  # get only the PIDs (-t) on this TCP port
  pids=$(lsof -t -i TCP:"$port" || true)

  if [[ -n $pids ]]; then
    echo "Killing port $port → PIDs: $pids"
    # first try a gentle SIGTERM, then SIGKILL if still around
    kill $pids
    sleep 0.5
    # any leftovers?
    leftover=$(lsof -t -i TCP:"$port" || true)
    [[ -z $leftover ]] || kill -9 $leftover
  else
    echo "No process found on port $port"
  fi
done
