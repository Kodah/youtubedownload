'use strict';

var express = require('express');
var port = process.env.PORT || 9000;
var bodyParser = require('body-parser');
var router = express.Router();
var app = express();
var path = require('path');
var uuid = require('node-uuid');
var fs = require('fs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', function(req, res) {
    res.sendFile("/public/index.html", {
        "root": __dirname
    });
});

router.get('/data/:uuid/:filename', function(req, res) {
    console.log(req.params.uuid);
    var path = './data/' + req.params.uuid;
    res.download(path,req.params.filename, function() {
        // fs.unlink(path);
    });
});



router.post('/api/mp3', function(req, res) {

    var youtubedl = require('youtube-dl');
    var ffmpeg = require('fluent-ffmpeg');

    var video = youtubedl(req.body.youtubeURL, ['--format=18'], {
        cwd: __dirname
    });

    var videoFilename = 'data/' + uuid.v4() + '.mp4';
    var audioFilename = 'data/' + uuid.v4() + '.mp3';
    var infoDict = [];

    // Will be called when the download starts.
    video.on('info', function(info) {
        console.log('Download started');
        console.log('filename: ' + info._filename);
        console.log('size: ' + info.size);
        
        var title = info.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        var exportPath = title + '.mp3';
        console.log(audioFilename);

        infoDict.push({
            "title": info.title,
            "pathTitle" : exportPath,
            "thumbnail": info.thumbnail,
            "uuid": audioFilename
        });

        console.log(infoDict);

    }).on('end', function() {

        console.log('finished downloading! ', videoFilename);

        var command = ffmpeg(fs.createReadStream(videoFilename))
            .output(audioFilename)
            .on('end', function() {
                console.log('Processing finished !', audioFilename);

                fs.unlinkSync(videoFilename);
                res.json(infoDict);
                // res.download(audioFilename, function() {
                //     fs.unlink(audioFilename);
                // });
            })
            .run();
    });

    video.pipe(fs.createWriteStream(videoFilename));
});

app.use('/', router);

app.listen(port);