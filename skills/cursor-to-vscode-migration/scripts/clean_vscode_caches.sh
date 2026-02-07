#!/bin/bash
# Removes VS Code caches and storage while preserving User/ and machineid.

# Detect platform
if [[ "$OSTYPE" == "darwin"* ]]; then
  CODE_DIR="$HOME/Library/Application Support/Code"
elif [[ "$OSTYPE" == "linux"* ]]; then
  CODE_DIR="$HOME/.config/Code"
else
  echo "Unsupported platform: $OSTYPE"
  exit 1
fi

if [ ! -d "$CODE_DIR" ]; then
  echo "VS Code data directory not found: $CODE_DIR"
  exit 1
fi

DIRS_TO_REMOVE=(
  "Backups"
  "blob_storage"
  "CachedData"
  "CachedExtensionVSIXs"
  "CachedProfilesData"
  "Code Cache"
  "Cookies"
  "Cookies-journal"
  "Crashpad"
  "DawnGraphiteCache"
  "DawnWebGPUCache"
  "GPUCache"
  "languagepacks.json"
  "Local Storage"
  "logs"
  "Network Persistent State"
  "Preferences"
  "Service Worker"
  "Session Storage"
  "Shared Dictionary"
  "shared_proto_db"
  "SharedStorage"
  "TransportSecurity"
  "Trust Tokens"
  "Trust Tokens-journal"
  "VideoDecodeStats"
  "WebStorage"
)

removed=0
for item in "${DIRS_TO_REMOVE[@]}"; do
  target="$CODE_DIR/$item"
  if [ -e "$target" ]; then
    rm -rf "$target"
    echo "Removed: $item"
    ((removed++))
  fi
done

echo ""
echo "Cleaned $removed items. Preserved: User/, machineid"
