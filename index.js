const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
// Configure AWS

const polly = new AWS.Polly();
const availableVoices=['Lotte', 'Maxim', 'Ayanda', 'Salli', 'Ola', 'Arthur', 'Ida', 'Tomoko', 'Remi', 'Geraint', 'Miguel', 'Elin', 'Lisa', 'Giorgio', 'Marlene', 'Ines', 'Kajal', 'Zhiyu', 'Zeina', 'Suvi', 'Karl', 'Gwyneth', 'Joanna', 'Lucia', 'Cristiano', 'Astrid', 'Andres', 'Vicki', 'Mia', 'Vitoria', 'Bianca', 'Chantal', 'Raveena', 'Daniel', 'Amy', 'Liam', 'Ruth', 'Kevin', 'Brian', 'Russell', 'Aria', 'Matthew', 'Aditi', 'Zayd', 'Dora', 'Enrique', 'Hans', 'Danielle', 'Hiujin', 'Carmen', 'Sofie', 'Gregory', 'Ivy', 'Ewa', 'Maja', 'Gabrielle', 'Nicole', 'Filiz', 'Camila', 'Jacek', 'Thiago', 'Justin', 'Celine', 'Kazuha', 'Kendra', 'Arlet', 'Ricardo', 'Mads', 'Hannah', 'Mathieu', 'Lea', 'Sergio', 'Hala', 'Tatyana', 'Penelope', 'Naja', 'Olivia', 'Ruben', 'Laura', 'Takumi', 'Mizuki', 'Carla', 'Conchita', 'Jan', 'Kimberly', 'Liv', 'Adriano', 'Lupe', 'Joey', 'Pedro', 'Seoyeon', 'Emma', 'Niamh', 'Stephen'];

app.post('/convert-to-speech', (req, res) => {
    const text = req.body.text;
    const engine = req.body.engine || 'neural'; // Default to 'standard' if not provided
    const voiceId = req.body.voiceId || 'Joanna'; 
    if (!availableVoices.includes(voiceId)) {
        return res.status(400).json({ error: 'Voice ID not available.' });
    }
    const params = {
        Text: text,
        OutputFormat: 'mp3',
        VoiceId: voiceId,
        Engine: engine
    };

    polly.synthesizeSpeech(params, (err, data) => {
        if (err) {
            console.log(err, err.stack);
            res.status(500).send('Error');
        } else if (data) {
            if (data.AudioStream instanceof Buffer) {
                res.set('Content-Type', 'audio/mpeg');
                res.send(data.AudioStream);
            }
        }
    });
});

const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));