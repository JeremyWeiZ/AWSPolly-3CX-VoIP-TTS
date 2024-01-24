# TTS for 3CX

A web app that can handle text-to-speech and audio format conversion for generating voice messages for the 3CX VoIP system.
# Prerequisites

Install Node.
FFmpeg is required to be installed on the OS level. Fluent-ffmpeg can't generate files that are compatible with 3cx system
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
Alternatively, a Dockerfile is provided for people who use docker.
# Demo Site

http://13.238.54.16/

![image](https://github.com/JeremyWeiZ/AWSPolly-3CX-VoIP-TTS/assets/151583068/be9f0e0f-5559-44e6-b0d4-5cf724bc6643)

