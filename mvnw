#!/bin/sh
# Maven Wrapper script
# Adapted from https://github.com/apache/maven-wrapper

set -e

MAVEN_PROJECTBASEDIR="${MAVEN_BASEDIR:-$(cd "$(dirname "$0")" && pwd)}"
MAVEN_WRAPPER_JAR="$MAVEN_PROJECTBASEDIR/.mvn/wrapper/maven-wrapper.jar"
MAVEN_WRAPPER_PROPERTIES="$MAVEN_PROJECTBASEDIR/.mvn/wrapper/maven-wrapper.properties"

if [ -r "$MAVEN_WRAPPER_JAR" ]; then
    exec java -jar "$MAVEN_WRAPPER_JAR" "$@"
else
    echo "Error: Maven wrapper jar not found at $MAVEN_WRAPPER_JAR"
    exit 1
fi
