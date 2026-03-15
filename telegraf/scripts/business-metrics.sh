#!/bin/sh
# Generates simulated business metrics in InfluxDB line protocol format
# Uses only POSIX shell — no bc dependency

TIMESTAMP=$(date +%s000000000)

HOUR=$(date +%H)
if [ "$HOUR" -ge 8 ] && [ "$HOUR" -le 18 ]; then
  FACTOR=15
else
  FACTOR=6
fi

# Deterministic pseudo-random using PID and timestamp
SEED=$(($$  + $(date +%S)))

rand() {
  SEED=$((SEED * 1103515245 + 12345))
  SEED=$((SEED & 2147483647))
  echo $((SEED % $1))
}

ACTIVE_USERS=$(( 1200 + $(rand 800) * FACTOR / 10 ))
API_REQUESTS=$(( 4500 + $(rand 2000) * FACTOR / 10 ))
ERROR_RATE_HUNDREDTHS=$(rand 300)
REVENUE_DAILY=$(( 8500 + $(rand 3000) * FACTOR / 10 ))
CONVERSION_HUNDREDTHS=$(( 200 + $(rand 200) ))

echo "business_metrics active_users=${ACTIVE_USERS},api_requests=${API_REQUESTS},error_rate=0.${ERROR_RATE_HUNDREDTHS},revenue_daily=${REVENUE_DAILY},conversion_rate=0.${CONVERSION_HUNDREDTHS} ${TIMESTAMP}"
