'use strict'

// jquery selectors
var $vintagebtn = $('#vintagebtn'),
    $noisebtn = $('#noisebtn'),
    $edgeenhancebtn = $('#edgeenhancebtn'),
    $savebtn = $('#savebtn'),
    $resetbtn = $('#resetbtn'),
    $sunrisebtn = $('#sunrisebtn'),
    $lomobtn = $('#lomobtn'),
    $embossbtn = $('#embossbtn'),
    $radialblurbtn = $('#radialblurbtn'),
    $orangepeelbtn = $('#orangepeelbtn'),
    $oldbootbtn = $('#oldbootbtn'),
    $resizebtn = $('#resizebtn');

/* As soon as slider value changes call applyFilters */
$('input[type=range]').change(applyFilters);

function reloadCanData() {
    Caman('#currentImage', function() {
        this.reloadCanvasData();
    });
}

$resizebtn.on('click', function() {
    var newWidth = parseInt($('#imgwidth').val());
    var newHeight = parseInt($('#imgheight').val());
    Caman('#currentImage', function() {
        this.resize({
            width: newWidth,
            height: newHeight
        });
        this.render();
        //this.reloadCanvasData();
    })
    $('#imgheight').val("");
    $('#imgwidth').val("");
})

function applyFilters() {
    var hue = parseInt($('#hue').val());
    var cntrst = parseInt($('#contrast').val());
    var vibr = parseInt($('#vibrance').val());
    var sep = parseInt($('#sepia').val());
    var sat = parseInt($('#saturation').val());
    var bri = parseInt($('#brightness').val());

    Caman('#currentImage', function() {
        // this.revert(false);
        this.hue(hue);
        this.contrast(cntrst);
        this.vibrance(vibr);
        this.sepia(sep);
        this.saturation(sat);
        this.brightness(bri);
        this.render();
        this.reloadCanvasData();
    });
}

$lomobtn.on('click', function() {
    Caman('#currentImage', function() {
        this.lomo();
        this.render();
    });
});

$embossbtn.on('click', function() {
    Caman('#currentImage', function() {
        this.emboss();
        this.render();
    });
});

$radialblurbtn.on('click', function() {
    Caman('#currentImage', function() {
        this.radialBlur();
        this.render();
    });
});

$orangepeelbtn.on('click', function() {
    Caman('#currentImage', function() {
        this.orangePeel();
        this.render();
    });
});

$oldbootbtn.on('click', function() {
    Caman('#currentImage', function() {
        this.oldBoot();
        this.render();
    });
});

$sunrisebtn.on('click', function() {
    Caman('#currentImage', function() {
        this.sunrise();
        this.render();
    });
});

$savebtn.on('click', function() {
    Caman('#currentImage', function() {
        this.render(function() {
            this.save('png');
            this.toBase64();
        });
    });
});

$vintagebtn.on('click', function() {
    Caman('#currentImage', function() {
        this.vintage();
        this.render();
    });
});

$noisebtn.on('click', function() {
    Caman('#currentImage', function() {
        this.noise(10);
        this.render();
    });
});

$edgeenhancebtn.on('click', function() {
    Caman('#currentImage', function() {
        this.edgeEnhance();
        this.render();
    });
});
