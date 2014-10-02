#!/bin/bash

git checkout gh-pages
git merge master
git add --all
git commit -m "Updating github pages to latest from master"
git push
git checkout master