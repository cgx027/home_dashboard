"use strict"

import debugMod from 'debug'
const debug = debugMod('tts-service')

import childProcess from 'child_process'
const spawn = childProcess.spawn;

import uuid from 'uuid/v1'
import config from '../config'

function TtsServiceMidware(req, res){
    console.log("/tts post", req.body);
    debug('tts post request: %o', req.body)

    let wavUrl = '/static/wav/' + uuid() + ".wav";
    let wavName = '.' + wavUrl;
    let tts_proc = spawn("./tools/ifly_tts_c/bin/tts_sample",
        [req.body.text, wavName]);

    tts_proc.stdout.on('data', (data) => {
        // console.log("stdout: ", data);
        console.log(`stdout: ${data}`);
    });

    tts_proc.stderr.on('data', (data) => {
        // console.log("stderr: ", data);
        console.log(`stderr: ${data}`);
    });

    tts_proc.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        res.send({'audioUrl': wavUrl});
    });

}

export default TtsServiceMidware

