"use strict"

import debugMod from 'debug'
const debug = debugMod('http-service')

import express from 'express'
import directory from 'serve-index'
// import cors from 'cors'
import http from 'http'
import bodyParser from 'body-parser'

import config from '../config'

import TtsServiceMidware from './tts-service'
import indexPageLoader from './index-page.js'

import handlebars from 'express-handlebars'

class HttpService {
    constructor() {
        this.port = config.httpService.port;
        this.address = config.httpService.address;
        const staticFolder = config.httpService.staticFolder;
        const staticRootUrl = config.httpService.staticRootUrl;
        const bodyParserSizeLimit = config.httpService.bodyParserSizeLimit

        this.app = express();
        this.server = http.createServer(this.app);
        this.app.use(bodyParser.json({ limit: bodyParserSizeLimit }));

        // static folder for hosting static content
        this.app.use(staticRootUrl, express.static(staticFolder));
        this.app.use(staticRootUrl, directory(staticFolder, {
            "icon": true,
            "hidden": true
        }));

        // setup view engine
        this.app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        this.app.set('view engine', 'handlebars')
    }


    start() {
        // use tts service
        this.app.get('/', indexPageLoader);
        this.app.post('/tts', TtsServiceMidware);

        this.server.on('close', () => {
            debug("server closed");
        });

        this.server.on('connection', () => {
            debug("server connected");
        });

        this.server.listen(this.port, this.address, err => {
            if(err) {
                debug("Error on listenling on ", this.port, this.address);
            }

            debug("Listening on ", this.port, this.address);
        });
    }

    stop() {
        throw new Error("not implemented")
    }
}

export default HttpService

