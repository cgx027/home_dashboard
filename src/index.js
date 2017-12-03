"use strict"

import debugMod from 'debug'
const debug = debugMod('main')

import HttpService from './http-service'

const httpService = new HttpService()

httpService.start()
