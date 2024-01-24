# TTS for 3CX

A web app that can handle text-to-speech and audio format conversion for generating voice messages for the 3CX VoIP system.
# Prerequisites

ffmpeg is required to be installed on the OS level. Fluent-ffmpeg can't generate files that are compatible with 3cx system
``` apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
# Install any needed packages specified in package.json
```
# Installation

```
$ npm install
```
# Demo Site

http://13.238.54.16/

![image](https://github.com/JeremyCybersquad/PollyProject/assets/157558995/0ebe5e13-a8d6-46e9-a0e8-33ed8de52ef7)
