/**
 *@author : Danilo Teixeira
 *@balls copyright 2013
 *@GitHub : https://github.com/danilo-teixeira
 */

!function( window, document ) {

	var canvas = document.getElementById("layer");
	var ctx = canvas.getContext("2d");
	var canvasWidth;
	var canvasHeight;
	var colors = ["#10222B", "#95AB63", "#BDD684", "#E2F0D6", "#F6FFE0", "#000000"];
	var setings = [];
	var isMouseDown = false;
	var SPRING = 0.3;
	var BOUNCE = -0.5;
	var GRAVITY = 0.2;
	var mouse = {

		x : 0,
		y : 0

	};

	function init() {

		canvas.addEventListener( "click", active, false );
		canvas.addEventListener( "mousedown", mouseDown, false );
		canvas.addEventListener( "mousemove", mouseMove, false );
		canvas.addEventListener( "mouseup", mouseUp, false );
		window.addEventListener( "resize", reset, false );

		reset();
		
		for( var i = 0; i < 10; i++ ) {

			setings.push( new setBall( canvasWidth / 2, canvasHeight / 2 ) );

		};
    
		animate();
		
	}

	function reset() {

		canvasWidth = window.innerWidth;
		canvasHeight = window.innerHeight;
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

	}
	/**
	 *@param {Number} x
	 *@param {Number} y
	 */
	function setBall( x, y ) {

		this.x = x;
		this.y = y;
		this.vx = Math.random() * 6 - 3;
		this.vy = Math.random() * 6 - 3;
		this.radius = 20 + Math.random() * 20;
		this.cor = colors[Math.random() * colors.length << 0];

	}

	function draw() {

		setings.forEach( function( ball, i ) {

			ctx.beginPath();
			ctx.strokeStyle = "#000";
			ctx.fillStyle = ball.cor;
			ctx.arc( ball.x, ball.y, ball.radius, 0, Math.PI * 2, false );
			ctx.stroke();
			ctx.fill();

			move( ball, i );

		} );

	}

	function animate() {

		ctx.clearRect( 0, 0, canvasWidth, canvasHeight );
		draw();
		active();
		requestAnimationFrame( animate );

	}

	/**
	 *@param {Object} ball
	 *@param {Number} i
	 */
	function move( ball, i ) {

		for( var j = i + 1, len = setings.length; j < len; j++ ) {
      
			var dx = setings[j].x - ball.x;
			var dy = setings[j].y - ball.y;
			var dist = Math.sqrt( dx * dx + dy * dy );
  			var distMin = ball.radius + setings[j].radius;

			if( dist < distMin ) {

				var angle = Math.atan2( dy, dx );
				var tx = ball.x + Math.cos( angle ) * distMin;
				var ty = ball.y + Math.sin( angle ) * distMin;
				var ax = ( tx - setings[j].x ) * SPRING * 0.5;
				var ay = ( ty - setings[j].y ) * SPRING * 0.5;
				var depth = ( distMin - dist ) / ( dist + 1 );

				ball.x += ( ball.x - setings[j].x ) * depth * 0.5;
				ball.y += ( ball.y - setings[j].y ) * depth * 0.5;
				
				ball.vx -= ax;
				ball.vy -= ay;

				setings[j].vx += ax;
				setings[j].vy += ay;

			}

		}

		ball.vy += GRAVITY;
		ball.x += ball.vx;
		ball.y += ball.vy;

		if( ball.x + ball.radius > canvasWidth ) {

			ball.x = canvasWidth - ball.radius;
			ball.vx *= BOUNCE;

		} else 
		if( ball.x - ball.radius < 0 ) {

			ball.x = ball.radius;
			ball.vx *= BOUNCE;

		}

		if( ball.y + ball.radius > canvasHeight ) {

			ball.y = canvasHeight - ball.radius;
			ball.vy *= BOUNCE;

		} else 
		if( ball.y - ball.radius < 0 ) {

			ball.y = ball.radius;
			ball.vy *= BOUNCE;

		}
	
	}

	function active() {

		if( isMouseDown ) {

			setings.push( new setBall( mouse.x, mouse.y ) );

		}

	}
	
	function mouseUp() {

		isMouseDown = false;

	}

	function mouseDown() {
		
		isMouseDown = true;

		active();

	}

	/**
	 *@param {Object} e
	 */
	function mouseMove( e ) {

		mouse.x = e.pageX;
		mouse.y = e.pageY;

		active();

	}
  
  /**
    * requestAnimationFrame polyfill by Erik Möller
    * Fixes from Paul Irish and Tino Zijdel
    *
    * @see http://goo.gl/ZC1Lm
    * @see http://goo.gl/X0h6k
    */
    (function(){for(var d=0,a=["ms","moz","webkit","o"],b=0;b<a.length&&!window.requestAnimationFrame;++b)window.requestAnimationFrame=window[a[b]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[a[b]+"CancelAnimationFrame"]||window[a[b]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(b){var a=Date.now(),c=Math.max(0,16-(a-d)),e=window.setTimeout(function(){b(a+c)},c);d=a+c;return e});window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)})})();
  
	init();

}( window, document );