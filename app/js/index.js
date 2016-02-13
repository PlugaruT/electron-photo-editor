'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var remote = require('remote');
var dialog = remote.require('dialog');
var ipc = require('electron').ipcRenderer;

var fileSystem = require('./js/file-system');
var constants = require('./js/constants');

var can = document.getElementById('currentImage');
var ctx = can.getContext('2d');

// jquery selectors
var $currentImage = $('#currentImage'),
    $previous = $('#previous'),
    $next = $('#next'),
    $directoryStats = $('#directoryStats'),
    $openFile = $('#open-file'),
    $controlPanel = $('#control-panel'),
    $rotateLeft = $('#rotate-left'),
    $rotateRight = $('#rotate-right');
// the list of all retrieved files
var imageFiles = [],
    currentImageFile = '',
    currentDir = '';

var toggleButtons = function(hasSelectedImage) {
    // disable buttons?
    if (hasSelectedImage) {
        $openFile.hide();
        $currentImage.show();
        $controlPanel.show();
    } else {
        $openFile.show();
        $currentImage.hide();
        $controlPanel.hide();
    }
};

var img = new Image();

// Shows an image on the page.
var showImage = function(index) {
    toggleButtons(true);
    img.onload = function() {
        can.width = img.width;
        can.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        // ctx.drawImage(img, can.width/2-img.width/2,can.height/2-img.width/2);
        Caman('#currentImage', function() {
            this.reloadCanvasData();
        });
    }
    $currentImage.data('currentIndex', index);
    img.src = imageFiles[index];
    currentImageFile = imageFiles[index];
    setRotateDegrees(0);
    // set the stats text
    var statsText = (index + 1) + ' / ' + imageFiles.length;
    $directoryStats.text(statsText);
    //ipc.send(currentImageFile);
};

var onPreviousClick = function() {
    var currentImageId = $currentImage.data('currentIndex');
    if (currentImageId > 0) {
        $('input[type=range]').val(0);
        showImage(--currentImageId);
    }
};

$previous.click(onPreviousClick);

var onNextClick = function() {
    var currentImageId = $currentImage.data('currentIndex');
    if (currentImageId + 1 < imageFiles.length) {
        $('input[type=range]').val(0);
        showImage(++currentImageId);
    }
};

$next.click(onNextClick);

var _loadDir = function(dir, fileName) {
    currentDir = dir;
    imageFiles = fileSystem.getDirectoryImageFiles(dir);

    var selectedImageIndex = imageFiles.indexOf(fileName);
    if (selectedImageIndex === -1) {
        selectedImageIndex = 0;
    }

    if (selectedImageIndex < imageFiles.length) {
        showImage(selectedImageIndex);
    } else {
        alert('No image files found in this directory.');
    }
}

var onOpen = function(filePath) {
    filePath = filePath + ''; // convert to string
    var stat = fs.lstatSync(filePath);
    if (stat.isDirectory()) {
        onDirOpen(filePath);
    } else {
        onFileOpen(filePath);
    }
};

var onFileOpen = function(fileName) {
    fileName = fileName + ''; // convert to string.
    var dirName = path.dirname(fileName);

    _loadDir(dirName, fileName);
};

var onDirOpen = function(dir) {
    _loadDir(dir + ''); // convert to string
};

var onFileDelete = function() {
    // file has been deleted, show previous or next...
    var index = imageFiles.indexOf(currentImageFile);
    if (index > -1) {
        imageFiles.splice(index, 1);
    }
    if (index === imageFiles.length) index--;
    if (index < 0) {
        // no more images in this directory - it's empty...
        toggleButtons(false);
    } else {
        showImage(index);
    }
};

var getCurrentFile = function() {
    return currentImageFile;
};

var setRotateDegrees = function(deg) {
    $currentImage.css({
        '-webkit-transform': 'rotate(' + deg + 'deg)',
        '-moz-transform': 'rotate(' + deg + 'deg)',
        '-ms-transform': 'rotate(' + deg + 'deg)',
        '-o-transform': 'rotate(' + deg + 'deg)',
        'transform': 'rotate(' + deg + 'deg)',
        // 'zoom': 1
    });

    $currentImage.data('rotateDegree', deg);
};

var onRotate = function(rotationDegrees) {
    // get current degree and rotationDegrees
    var deg = $currentImage.data('rotateDegree') || 0;
    deg -= rotationDegrees;

    setRotateDegrees(deg);
};
function drawRotated(degrees){
    ctx.clearRect(0, 0, can.width, can.height);
    ctx.save();
    ctx.translate(ctx.width / 2, ctx.height / 2);
    ctx.rotate(degrees * Math.PI/180);
    ctx.translate(0, 0);
    ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
    ctx.restore();
}

var angleInDegrees = 0;

$rotateLeft.click(function() {
    onRotate(-90);
    // angleInDegrees-=90;
    // drawRotated(angleInDegrees);
});

$rotateRight.click(function() {
    onRotate(90);
    // angleInDegrees+=90;
    // drawRotated(angleInDegrees);
});

// Initialize the app
var initialize = function() {
    var appMenu = require('./js/app-menu');
    appMenu.initialize({
        onOpen: onOpen,
        onFileDelete: onFileDelete,
        getCurrentFile: getCurrentFile
    });

    // no files selected
    toggleButtons(false);

    $openFile.click(function() {
        dialog.showOpenDialog({
                properties: [
                    'openFile',
                    'openDirectory'
                ],
                filters: [{
                    name: 'Images',
                    extensions: constants.SupportedImageExtensions
                }]
            },
            function(fileName) {
                if (fileName) {
                    onOpen(fileName);
                }
            });
    });
};
initialize();
