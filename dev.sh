#!/bin/bash
gnome-terminal -- bash -c "npx react-native start; exec bash"
sleep 2
npx react-native run-android
