/**
 * Created by srpar on 22/02/2017.
 */
'use strict'
var express = require('express')
var app = express()
var serverResponse = null
var token = null
const bodyParser = require("body-parser")

const path = require('path')
var htmlPath = path.join(__dirname, 'temp-images')

app.use(express.static(htmlPath))
const fs = require('fs')
var knowblyServer = "http://localhost:8080"
var loopbackServer = "http://localhost:3000"

if (process.env.NODE_ENV == 'production'){
        knowblyServer = process.env.KNOWBLY_FRONTED_URL || "http://dev-knowbly.mybluemix.net"
        loopbackServer = process.env.KNOWBLY_BACKEND_URL ||"http://widget-composer-sdk.mybluemix.net"
}




require('request-promise-native')
var url = "http://knowblyhost:3000/api/containers/client-2/download/diablorobot-1487800203486.png"
var localUrlSave = "temp-images/"

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/thumbnail/:mediaId/:clientId', function(req, res) {
        console.log('token', req.get('Authorization'))
        token = req.get('Authorization')
        res.setHeader('Authorization', token)
        serverResponse = res
        //---------------------IMAGE RESIZE---------------//
        var Jimp = require("jimp")
        var requestPromise = require('request-promise-native')

        requestPromise({
                encoding : null,
                uri: url,
                transform: function (body) {
                        Jimp.read(body, function (err, image) {
                                //-----300------///
                                var imageMedium = image
                                var imageSmall = image

                                imageMedium.resize(Jimp.AUTO, 300)
                                imageMedium.quality(60)
                                imageMedium.write(localUrlSave+"thumb-300.jpg")

                                //-----150------///
                                imageSmall.resize(Jimp.AUTO, 150)
                                imageSmall.quality(60)
                                imageSmall.write(localUrlSave+"thumb-150.jpg")

                               // res.send("<img src=http://knowblyhost:8003/"+localUrlSave+"thumb-300.jpg>")
                        }).catch(function (err) {
                                console.error(err)
                        })
                }
        })
})

var server = app.listen(process.env.PORT || 8003, function () {
        console.log("Listening on port %s...", server.address().port)
})