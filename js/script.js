'use strict';

window.onload = function() {

	var game = new Phaser.Game(800, 960, Phaser.AUTO, 'game');
	var triangles;
	var hollow;
	var counter = 0;
	var addSpeed;
	var scoreString = '';
	var scoreText;
	var rond;
	var music;
	var logo;
	var start;
	var rules;
	var player;
	var separator;
	var separatory;
	var gl;
	var menu;
	var move;
	var level2;
	var level3;
	var playerdead;
	var restart;
	var gameover;
	var play;
	var rond;
	var rond2;
	var rond3;
	var move;
	var MyGame = {};


	MyGame.PlayState = function(){};


	MyGame.PlayState.prototype = {


		preload: function(){
			game.load.image('player', 'images/player.png');
			game.load.image('triangle', 'images/triangle.png');
			game.load.image('separator','images/separator.png');
			game.load.audio('ambiant', 'sounds/ThursdayNight.mp3');
		},

		create: function(){

			music = game.add.audio('ambiant');
			music.play();

			scoreString = 'Score : ';
			scoreText = game.add.text(0,0, scoreString + counter, {fill: '#fff'});

			game.physics.startSystem(Phaser.Physics.ARCADE);
			game.stage.backgroundColor = '#000';

			triangles = game.add.group();
			player = game.add.sprite(365, 925, 'player');
			separator = game.add.sprite(0, 1100, 'separator');

			player.anchor.setTo(0.5, 0.5);

			triangles.create(game.world.randomX, game.rnd.integerInRange(-128, 0), 'triangle');

			triangles.setAll("anchor.x",0.5);
			triangles.setAll("anchor.y",1);

			game.physics.enable(player, Phaser.Physics.ARCADE);
			game.physics.enable(triangles, Phaser.Physics.ARCADE);
			game.physics.enable(separator, Phaser.Physics.ARCADE);

			player.body.collideWorldBounds = true;
			triangles.setAll("collideWorldBounds", false);
			separator.body.collideWorldBounds = false;
			separator.body.immovable = true;

			if(game.time.now <= 5000){
				triangles.setAll("body.velocity.y", 1000);
			}else{
				this.accelerate();
			}

			move = game.input.keyboard.createCursorKeys();

			game.time.events.add(Phaser.Timer.SECOND * 0.25, this.generateTriangle, this);
			game.time.events.add(Phaser.Timer.SECOND * 15, this.accelerate, this);
		},

		update: function(){
			if(player.alive)	
			{
				player.body.velocity.setTo(0, 0);

				if(move.left.isDown)
				{
					player.body.velocity.x = -600;
				}else if(move.right.isDown){
					player.body.velocity.x = 600;
				}

				game.physics.arcade.collide(triangles, separator, this.killTriangle, null, this);
				game.physics.arcade.collide(player, triangles, this.collisionHandler, null, this);

				if(game.time.now >= 5000){
					this.accelerate();
				}

				if(counter >= 100){
					this.game.state.start("TransitionLv2");
				}

			}

		},

		generateTriangle: function(){
			triangles.create(game.world.randomX, game.rnd.integerInRange(-128, 0), 'triangle');
			game.physics.enable(triangles, Phaser.Physics.ARCADE);
			triangles.setAll("anchor.x",0.5);
			triangles.setAll("anchor.y",1);
			triangles.setAll("collideWorldBounds", false);

			if(game.time.now <= 5000){
				triangles.setAll('body.velocity.y', 400);
			}else{
				game.time.events.add(Phaser.Timer.SECOND * 5, this.accelerate, this);				
			}
			game.time.events.add(Phaser.Timer.SECOND * 0.25, this.generateTriangle, this);
		},
		collisionHandler: function(player, triangles){
			player.kill();
			triangles.kill();
			music.stop();
			this.game.state.start("GameOver");
		},

		killTriangle: function(triangles, separator){
			separator.kill();
			counter++;
			scoreText.text = scoreString + counter;
		},

		accelerate: function(){
			triangles.addAll('body.velocity.y', 3);
			game.time.events.add(Phaser.Timer.SECOND * 5, this.accelerate, this);
		},

		render: function(){
		}

	}


	MyGame.GameOver = function(){};


	MyGame.GameOver.prototype = {
		preload: function(){
			game.load.image('gameover', 'images/gameover.png');
			game.load.image('playerdead', 'images/playerdead.png');
			game.load.audio('death', 'sounds/dead.wav');
			game.load.image('restart', 'images/restart.png');
		},

		create: function(){


			music.stop();
			music = game.add.audio('death');
			music.play();


			playerdead = game.add.sprite(365, 925, 'playerdead');
			restart = this.game.add.button(180, 650, 'restart', this.changeState, this);
			game.physics.enable(playerdead, Phaser.Physics.ARCADE);
			playerdead.body.collideWorldBounds = true;
			playerdead.body.velocity.y = -50;

			gameover = game.add.sprite(140, 100, 'gameover');
			scoreString = 'Final Score : ';
			scoreText = game.add.text(280,600, scoreString + counter, {fill: '#fff'});
		},

		update: function(){
			counter = 0;
		},

		changeState: function(){
			this.game.state.start("GameMenu");
		},
	}

	MyGame.GameMenu = function(){};

	MyGame.GameMenu.prototype = {
		preload: function(){
			game.load.image('logo', 'images/retrodash.png');
			game.load.image('start', 'images/start.png');
			game.load.image('player', 'images/player.png');
			game.load.image('rules', 'images/rules.png');

		},

		create: function(){
			logo = game.add.sprite(160, 0, 'logo');
			start = this.game.add.button(180, 400, 'start', this.changeState, this);
			rules = this.game.add.button(210, 500, 'rules', this.viewRules, this);
			player = game.add.sprite(365, 925, 'player');
			game.physics.enable(player, Phaser.Physics.ARCADE);
			player.body.velocity.setTo(0,200);
			player.body.gravity.set(0, 100);
			player.body.collideWorldBounds = true;
			player.body.bounce.set(1);
		},

		viewRules: function(){
			this.game.state.start("Rules");
		},

		update: function(){

		},

		changeState: function(){
			this.game.state.start("PlayState");
		},



	};


	MyGame.TransitionLv2 = function(){};

	MyGame.TransitionLv2.prototype = {
		preload: function(){
			game.load.image('play', 'images/play.png');
			game.load.image('level2', 'images/level2.png');
		},

		create: function(){
			level2 = game.add.sprite(185, 100, 'level2');
			play = this.game.add.button(175, 300, 'play', this.changeState, this);
			/*			timer.onEvent.add(this.game.state.start("SideScroll"));*/
			/*			this.game.state.start("SideScroll");*/
		},

		update: function(){

		},
		changeState: function(){
			this.game.state.start("SideScroll");
		},
	}


	MyGame.TransitionLv3 = function(){};

	MyGame.TransitionLv3.prototype = {
		preload: function(){
			game.load.image('play', 'images/play.png');
			game.load.image('level3', 'images/level3.png');
		},

		create: function(){
			level3 = game.add.sprite(185, 100, 'level3');
			play = this.game.add.button(175, 300, 'play', this.changeState, this);
			/*			timer.onEvent.add(this.game.state.start("SideScroll"));*/
			/*			this.game.state.start("SideScroll");*/
		},

		update: function(){

		},
		changeState: function(){
			this.game.state.start("thirdLevel");
		},
	}


	MyGame.thirdLevel = function(){};
	MyGame.thirdLevel.prototype = {
		preload: function(){
			game.load.image('rond', 'images/rond.png');
			game.load.image('separator','images/separator.png');
			game.load.image('player', 'images/player.png');
		},

		create: function(){
			game.physics.startSystem(Phaser.Physics.ARCADE);
			scoreString = 'Score : ';
			scoreText = game.add.text(0,0, scoreString + counter, {fill: '#fff'});
			player = game.add.sprite(365, 925, 'player');
			game.physics.enable(player, Phaser.Physics.ARCADE);
			player.body.velocity.setTo(0,200);
			player.body.collideWorldBounds = true;
			rond = game.add.sprite(185, 100, 'rond');
			rond2 = game.add.sprite(160, 150, 'rond');
			rond3 = game.add.sprite(160, 150, 'rond');
			game.physics.enable(rond, Phaser.Physics.ARCADE);
			game.physics.enable(rond2, Phaser.Physics.ARCADE);
			game.physics.enable(rond3, Phaser.Physics.ARCADE);

			rond.body.collideWorldBounds = true;
			rond.body.velocity.setTo(200, 1000);
			rond.body.gravity.set(0, 2000);
			rond.body.bounce.set(1);
			rond2.body.collideWorldBounds = true;
			rond2.body.velocity.setTo(-200, 1200);
			rond2.body.gravity.set(0, 2000);
			rond2.body.bounce.set(1);
			rond3.body.collideWorldBounds = true;
			rond3.body.velocity.setTo(-500, 900);
			rond3.body.gravity.set(0, 1000);
			rond3.body.bounce.set(1);

			game.time.events.add(Phaser.Timer.SECOND * 2, this.addScore, this);
			move = game.input.keyboard.createCursorKeys();
		},

		addScore: function(){
			counter++;
			scoreText.text = scoreString + counter;
		},

		update: function(){
			if(player.alive)	
			{
				player.body.velocity.setTo(0, 0);

				if(move.left.isDown)
				{
					player.body.velocity.x = -600;
				}else if(move.right.isDown){
					player.body.velocity.x = 600;
				}

				game.physics.arcade.collide(player, rond, this.killPlayer, null, this);
				game.physics.arcade.collide(player, rond2, this.killPlayer, null, this);
				game.physics.arcade.collide(player, rond3, this.killPlayer, null, this);
			}
		},

		killPlayer: function(player, rond){
			player.kill();
			this.game.state.start("GameOver");

		},
	};


	MyGame.Rules = function(){};
	MyGame.Rules.prototype = {
		preload: function(){
			game.load.image('gl', 'images/gl.png');
			game.load.image('menu', 'images/returnmenu.png');
		},

		create: function(){
			gl = game.add.sprite(120, 100, 'gl');
			menu = this.game.add.button(185, 800, 'menu', this.changeState, this);
		},

		changeState: function(){
			this.game.state.start("GameMenu");
		},

		update: function(){

		},
	};

	MyGame.SideScroll = function(){};

	MyGame.SideScroll.prototype = {
		preload: function(){
			game.load.image('player', 'images/player.png');
			game.load.image('hollow', 'images/hollow.png');
			game.load.image('separator','images/separator.png');
			game.load.image('separator-y', 'images/separator-y.png');
			game.load.image('triangle', 'images/triangle.png');
		},

		create: function(){
			scoreString = 'Score : ';
			scoreText = game.add.text(0,0, scoreString + counter, {fill: '#fff'});

			triangles = game.add.group();
			game.physics.enable(triangles, Phaser.Physics.ARCADE);
			triangles.setAll("anchor.x",0.5);
			triangles.setAll("anchor.y",1);
			triangles.setAll("collideWorldBounds", false);
			triangles.setAll("body.velocity.y", 1000);



			player = game.add.sprite(365, 925, 'player');
			player.anchor.setTo(0.5, 0.5);
			game.physics.enable(player, Phaser.Physics.ARCADE);
			player.body.collideWorldBounds = true;

			separator = game.add.sprite(0, 1100, 'separator');
			game.physics.enable(separator, Phaser.Physics.ARCADE);
			separator.body.collideWorldBounds = false;
			separator.body.immovable = true;


			separatory = game.add.sprite(-80, 200, 'separator-y');
			game.physics.enable(separatory, Phaser.Physics.ARCADE);
			separatory.body.collideWorldBounds = false;
			separatory.body.immovable = true;

			game.physics.startSystem(Phaser.Physics.ARCADE);
			move = game.input.keyboard.createCursorKeys();

			hollow = game.add.group();
			game.time.events.add(Phaser.Timer.SECOND * Math.floor((Math.random() * 2) + 1.5), this.generateHollow, this);


			game.time.events.add(Phaser.Timer.SECOND * 8, this.makeItFall, this);

		},

		generateHollow: function(){
			hollow.create(815, 957, 'hollow');
			game.physics.enable(hollow, Phaser.Physics.ARCADE);
			hollow.setAll("anchor.x",0.5);
			hollow.setAll("anchor.y",1);
			hollow.setAll("collideWorldBounds", false);
			hollow.setAll("body.velocity.x", Math.floor(Math.random() * -200) + -400);
			game.time.events.add(Phaser.Timer.SECOND * Math.floor((Math.random() * 2) + 0.9), this.generateHollow, this);
		},

		makeItFall: function(){
			game.time.events.add(Phaser.Timer.SECOND * 0.60, this.generateTriangle, this);			
		},


		generateTriangle: function(){
			triangles.create(game.world.randomX, game.rnd.integerInRange(-128, 0), 'triangle');
			game.physics.enable(triangles, Phaser.Physics.ARCADE);
			triangles.setAll("anchor.x",0.5);
			triangles.setAll("anchor.y",1);
			triangles.setAll("collideWorldBounds", false);
			triangles.setAll("body.velocity.y", 1000);
			game.time.events.add(Phaser.Timer.SECOND * 0.60, this.generateTriangle, this);
		},

		update: function(){
			console.log(game.time.now);
			if(player.alive)	
			{
				player.body.velocity.setTo(0, 0);

				if(move.left.isDown)
				{
					player.body.velocity.x = -600;
				}else if(move.right.isDown){
					player.body.velocity.x = 600;
				}else if(move.up.isDown && player.position.y == 925){
					
					player.body.velocity.y = -5000;
					player.body.gravity.set(0, 17000);
				}

				if(counter >= 135){
					this.game.state.start("TransitionLv3");
				}

				game.physics.arcade.collide(hollow, player, this.collisionHandler, null, this);
				game.physics.arcade.collide(triangles, player, this.collisionHandler2, null, this);
				game.physics.arcade.collide(hollow, separatory, this.killHollow, null, this);
				game.physics.arcade.collide(triangles, separator, this.killTriangle, null, this);

			}
		},

		killTriangle: function(triangles, separator){
			separator.kill();
			counter++;
			scoreText.text = scoreString + counter;
		},


		killHollow: function(separatory, hollow){
			hollow.kill();
			counter++;
			scoreText.text = scoreString + counter;
		},

		collisionHandler: function(player, hollow){
			player.kill();
			hollow.kill();
			this.game.state.start("GameOver");
		},

		collisionHandler2: function(player, triangles){
			triangles.kill();
			player.kill();
			this.game.state.start("GameOver");
		},

	}
	game.state.add('Rules', MyGame.Rules);
	game.state.add('TransitionLv2', MyGame.TransitionLv2);
	game.state.add('TransitionLv3', MyGame.TransitionLv3);
	game.state.add('thirdLevel', MyGame.thirdLevel);
	game.state.add('PlayState', MyGame.PlayState);
	game.state.add('GameOver', MyGame.GameOver);
	game.state.add('SideScroll', MyGame.SideScroll);
	game.state.add('GameMenu', MyGame.GameMenu);
	game.state.start('GameMenu');
}

