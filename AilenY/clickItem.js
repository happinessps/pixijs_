const app = new PIXI.Application({
    resolution : window.devicePixelRatio,
    autoResize : true
});
document.body.appendChild(app.view);
document.querySelector('h1').innerText = "your points : "+0;
// Inner radius of the circle
const radius = 60;

// The blur amount
const blurSize = 15;

const count_num =1;
var count_result = 0; 

app.loader.add('BG', 'data/0.jpg');
app.loader.load(setup);
app.renderer.autoDensity = true;

function onPointerDown (e) {
    console.log('down')
    const { x, y } = e.data.global
    pointerDownTarget = 1
}

// On pointer up, set pointerDownTarget
function onPointerUp () {
    console.log('up')
    pointerDownTarget = 0
}

  // On pointer move, calculate coordinates diff
function onPointerMove (e) {
    const { x, y } = e.data.global
    if (pointerDownTarget) {
        console.log('dragging')
        diffX = pointerDiffStart.x + (x - pointerStart.x)
        diffY = pointerDiffStart.y + (y - pointerStart.y)
    }
}

function setup(loader, resources) {
    window.addEventListener('resize', resize);
    function resize() {
        // Resize the renderer
        app.renderer.resize(window.innerWidth, window.innerHeight);
    }
    resize();

    const background = new PIXI.Sprite(resources.BG.texture);
    const item = new PIXI.Sprite.from('data/1.png');
    background.height = app.screen.height;
    background.width = background.height/1.4;
    
    app.stage.addChild(background);

    app.stage
    .on('pointerdown', onPointerDown)
    .on('pointerup', onPointerUp)
    .on('pointerupoutside', onPointerUp)
    .on('pointermove', onPointerMove)

    item.anchor.set(0.5);
    item.x = app.screen.width/3 * 1.6;
    item.y = app.screen.height/3* 2.5 ;
    item.interactive = true;
    item.buttonMode = true;
    item.on('pointerdown', onButtonDown);
    app.stage.addChild(item);
    
    const circle = new PIXI.Graphics()
        .beginFill(0xFF0000)
        .drawCircle(radius + blurSize, radius + blurSize, radius)
        .endFill();
    circle.filters = [new PIXI.filters.BlurFilter(blurSize)];

    const bounds = new PIXI.Rectangle(0, 0, (radius + blurSize) * 2, (radius + blurSize) * 2);
    const texture = app.renderer.generateTexture(circle, PIXI.SCALE_MODES.NEAREST, 1, bounds);
    const focus = new PIXI.Sprite(texture);
    app.stage.interactive = true;
    app.stage.addChild(focus);
    background.mask = focus;
    item.mask = focus;

    function onPointerMove(event) {
        focus.position.x = event.data.global.x - focus.width / 2;
        focus.position.y = event.data.global.y - focus.height / 2;
    }
    function countUP(){  
        count_result++ 
        document.querySelector('h1').innerText = "your points : "+count_result;
        return count_result;
    }

    function onButtonDown() {
        item.x = Math.floor(Math.random()*app.screen.width);
        item.y = Math.floor(Math.random()*app.screen.height);
        app.stage.addChild(background);
        app.stage.addChild(item);
        countUP();
    }
    
}

