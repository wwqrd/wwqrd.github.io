#!/usr/bin/env bash
zola build
cp -R public/* ../dist/
