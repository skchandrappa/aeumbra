#!/bin/bash
# Build script for Render
# Install with specific Python version if available
python3.11 -m pip install --upgrade pip || python3 -m pip install --upgrade pip
python3.11 -m pip install -r requirements.txt || python3 -m pip install -r requirements.txt

