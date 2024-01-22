const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const FFmpeg = require('ffmpeg');
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
AWS.config.loadFromPath('./config.json');


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
            console.error(err, err.stack);
            res.status(500).send('Error');
            return;
        } 

        if (data && data.AudioStream instanceof Buffer) {
            // Write the buffer to a file first
            const mp3FilePath = path.join(__dirname, 'tempSpeech.mp3');
            fs.writeFileSync(mp3FilePath, data.AudioStream);

            // Construct the FFmpeg command
            const wavFilePath = path.join(__dirname, 'speech.wav');
            const command = `ffmpeg -i ${mp3FilePath} -ac 1 -ar 8000 -acodec pcm_s16le -f wav ${wavFilePath}`;

            // Execute the FFmpeg command
            child_process.exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error.message}`);
                    res.status(500).send('Error during conversion');
                    return;
                }

                if (stderr) {
                    console.error(`FFmpeg stderr: ${stderr}`);
                }

                console.log(`FFmpeg stdout: ${stdout}`);
                res.sendFile(wavFilePath, {}, function (err) {
                    if (err) {
                        console.error('Error sending file:', err);
                    } else {
                        console.log('File sent, deleting temporary files...');

                        // Delete the temporary files
                        fs.unlink(mp3FilePath, (unlinkErr) => {
                            if (unlinkErr) console.error('Error deleting MP3 file:', unlinkErr);
                            else console.log('Successfully deleted MP3 file');
                        });

                        fs.unlink(wavFilePath, (unlinkErr) => {
                            if (unlinkErr) console.error('Error deleting WAV file:', unlinkErr);
                            else console.log('Successfully deleted WAV file');
                        });
                    }
                });

                
            });
        }
    });
});


const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));