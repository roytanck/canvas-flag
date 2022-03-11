const cw = 1200;
const ch = 800;
let canvas = null;
let ctx = null;
let counter = 0;
let vx = 0;
let vy = 0;
const points = [];
const emitters = [];

function Point( x, y, z ) {
	this.x = x;
	this.y = y,
	this.z = z,
	this.to2d = () => {
		let tz = 0;
		for( let e=0; e<emitters.length; e++ ){
			tz += emitters[e].getValue( this.x, this.y );
		}
		let tx = this.x + ( ( ( this.x + vx ) * tz ) / 10 );
		let ty = this.y + ( ( ( this.y + vy ) * tz ) / 10 );
		return [ tx + ( cw / 2 ), ty + ( ch / 2 ) ];
	};
};

function Emitter( x, y, wl, a, speed ) {
	this.x = x;
	this.y = y;
	this.wl = wl;
	this.a = a;
	this.speed = speed;
	this.getValue = ( px, py ) => {
		let dist = pythagoras( px, py, this.x, this.y );
		return Math.sin( ( dist - ( counter * this.speed ) ) / this.wl ) * this.a;
	}
}

const init = () => {
	canvas = document.querySelector( 'canvas' );
	ctx = canvas.getContext( '2d' );
	// create points
	for( let x = -310; x<= 310; x+=20 ){
		for( let y=-210; y<=210; y+=20 ){
			let p = new Point( x, y, Math.random() );
			points.push( p );
		}
	}
	// create wave emitters
	for( let i=0; i<5; i++ ){
		let e = new Emitter(
			-( cw / 2 ) + Math.random() * ( cw / 4 ),
			-( cw / 2 ) + Math.random() * ch,
			25 + ( i * 35 ),
			Math.random() / 2.5,
			7.5 + Math.random() * 20
		);
		emitters.push( e );
	}
	// start drawing
	start();
}

const start = () => {
	let iv = setInterval( draw, 40 );
}

/**
 * Draw onto the canvas.
 */
function draw(){
	// clear
	ctx.clearRect( 0, 0, cw, ch );
	// draw
	for( let p=0; p<points.length; p++ ){
		let [ tx, ty ] = points[p].to2d();
		dot( tx, ty, ( points[p].y < 0 ? '#005bbb' : '#ffd500' ) );
	}
	counter++;
	// update the vanishing point
	vx = -points[0].x - ( cw / 10 );
	vy = -Math.cos( counter / 25 ) * ( ch / 2 );

}

const dot = ( x, y, col ) => {
	ctx.fillStyle = col;
	ctx.beginPath();
	ctx.arc( x, y, 3, 0, 2 * Math.PI );
	ctx.fill();
}

const pythagoras = ( x1, y1, x2, y2 ) => {
	return Math.sqrt( Math.pow( ( x1-x2 ), 2 ) + Math.pow( ( y1-y2 ), 2 ) );
}

document.addEventListener( 'DOMContentLoaded', init, false );
