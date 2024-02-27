# TTS for 3CX

A web app that can handle text-to-speech and audio format conversion for generating voice messages for the 3CX VoIP system.
Use MongoDB to manage user authentication
## Prerequisites


Install Node
FFmpeg is required to be installed on the OS level. Fluent-ffmpeg can't generate files that are compatible with 3cx system

``` apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*


    # Install any needed packages specified in package.json

```
## Installation

```
$ npm install
```
Add your MongoDB URL and AWS API key to complete the setup.
```
MONGODB_URI=YOUR MONGODB_URL
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET ACCESS_KEY
AWS_REGION=YOUR_AWS_REGION
```

Alternatively, a Dockerfile is provided for Docker users, a secrets.env is required to set up your MongoDB URL and AWS API keys.
Example of commands for building and running a docker container
```
docker build -t your_image_name .
docker run --name your_container_name --env-file ./secrets.env -p 80:3000 -d your_image_name
```
Example Secrets.env
```
MONGODB_URI=YOUR MONGODB_URL
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET ACCESS_KEY
AWS_REGION=YOUR_AWS_REGION
```
Screenshot of demo
![image](https://github.com/JeremyWeiZ/AWSPolly-3CX-VoIP-TTS/assets/151583068/c96f61a9-20a4-4343-b1da-8568c631ccf5)





