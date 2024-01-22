const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
AWS.config.loadFromPath('./config.json');
ffmpeg.setFfmpegPath(ffmpegStatic);


const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
// Configure AWS

const polly = new AWS.Polly();
const availableVoices=['Lotte', 'Maxim', 'Ayanda', 'Salli', 'Ola', 'Arthur', 'Ida', 'Tomoko', 'Remi', 'Geraint', 'Miguel', 'Elin', 'Lisa', 'Giorgio', 'Marlene', 'Ines', 'Kajal', 'Zhiyu', 'Zeina', 'Suvi', 'Karl', 'Gwyneth', 'Joanna', 'Lucia', 'Cristiano', 'Astrid', 'Andres', 'Vicki', 'Mia', 'Vitoria', 'Bianca', 'Chantal', 'Raveena', 'Daniel', 'Amy', 'Liam', 'Ruth', 'Kevin', 'Brian', 'Russell', 'Aria', 'Matthew', 'Aditi', 'Zayd', 'Dora', 'Enrique', 'Hans', 'Danielle', 'Hiujin', 'Carmen', 'Sofie', 'Gregory', 'Ivy', 'Ewa', 'Maja', 'Gabrielle', 'Nicole', 'Filiz', 'Camila', 'Jacek', 'Thiago', 'Justin', 'Celine', 'Kazuha', 'Kendra', 'Arlet', 'Ricardo', 'Mads', 'Hannah', 'Mathieu', 'Lea', 'Sergio', 'Hala', 'Tatyana', 'Penelope', 'Naja', 'Olivia', 'Ruben', 'Laura', 'Takumi', 'Mizuki', 'Carla', 'Conchita', 'Jan', 'Kimberly', 'Liv', 'Adriano', 'Lupe', 'Joey', 'Pedro', 'Seoyeon', 'Emma', 'Niamh', 'Stephen'];

app.post('/convert-to-speech', (req, res) => {
    const text = req.body.text;
    const engine = req.body.engine || 'neural';
    const voiceId = req.body.voiceId || 'Joanna'; 

    if (!availableVoices.includes(voiceId)) {
        return res.status(400).json({ error: 'Voice ID not available.' });
    }

    const params = {
        Text: text,
        OutputFormat: 'mp3', // Polly currently only supports mp3 for neural engine
        VoiceId: voiceId,
        Engine: engine
    };

    polly.synthesizeSpeech(params, (err, data) => {
        if (err) {
            console.log(err, err.stack);
            res.status(500).send('Error');
        } else if (data) {
            if (data.AudioStream instanceof Buffer) {
                // Convert MP3 to WAV
                const stream = require('stream');
                const pass = new stream.PassThrough();
                pass.end(data.AudioStream);

                res.set({
                    'Content-Type': 'audio/wav',
                    'Content-Disposition': 'attachment; filename="speech.wav"'
                });
                
                ffmpeg(pass)
                    .audioChannels(1)               // Mono channel
                    .audioFrequency(8000)           // 8 kHz sample rate
                    .audioCodec('pcm_s16le')       // 16-bit PCM audio in little-endian            
                    .audioBitrate('128k')           // Set audio bit rate to 128 kbps
                    .format('wav')                  // Output format as WAV (change if necessary)
                    .outputOptions([
                        '-fflags', 'bitexact',      // Ensure bit-exact flags for file
                        '-flags:v', 'bitexact',     // Ensure bit-exact flags for video (not applicable here but included for completeness)
                        '-flags:a', 'bitexact',     // Ensure bit-exact flags for audio
                        '-strict', 'experimental'   // Sometimes required for AAC encoding
                    ])
                    .on('error', (err) => {
                        console.error('An error occurred: ', err.message);
                        res.status(500).send('Error during conversion');
                    })
                    .pipe(res, { end: true });

            }
        }
    });
});


const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));