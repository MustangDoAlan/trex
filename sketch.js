var JOGAR = 1;
var ENCERRAR = 0;
var estadodeJogo = JOGAR;
var gameover,restart,gameoverimg,restartimg;
var checkpoint,pulo,morrer;

var trex, trex_correndo, trex_colidiu;
var ground, soloinvisivel,imagemdosolo;

var grupodenuvens, imagemdanuvem;
var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var pontuacao;


function preload(){
  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_colidiu = loadAnimation("trex_collided.png");
  
 imagemdosolo = loadImage("ground2.png");
  
  imagemdanuvem = loadImage("cloud2.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");

  gameoverimg = loadImage("gameOver.png");
  restartimg = loadImage("restart.png");

  pulo = loadSound("jump.mp3");
  morrer = loadSound("die.mp3");
  checkpoint = loadSound("checkPoint.mp3");
  
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  var mensagem = "isso é uma mensagem";
  console.log(mensagem);
  
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided" , trex_colidiu)
  trex.scale = 0.5;
  trex.setCollider("circle",0,0,40);
 //trex.setCollider("rectangle",10,10,100,trex.height);
  trex.debug =true;
  
 solo = createSprite(width/2,height-30,width,125);
 solo.addImage("ground",imagemdosolo);
 solo.x =solo.width /2;
  
  
  soloinvisivel = createSprite(width/2,height-20,width,10);
  soloinvisivel.visible = false;

  gameover = createSprite(width/2,height/2);
  gameover.addImage("gameOver",gameoverimg);
  gameover.scale = 0.7;

  restart = createSprite(width/2,height/2+40);
  restart.addImage("restart",restartimg);
  restart.scale = 0.5;
  
  //criar os Grupos de Obstáculos e Nuvens
  grupodeobstaculos = createGroup();
  grupodenuvens = createGroup();
  
  console.log("Olá" + 5);
  
  pontuacao = 0;
}

function draw() {
  background("white");
  console.log("isto e:"+estadodeJogo);
  //exibindo a pontuação
  text("Pontuação: "+ pontuacao, width-120,50);
  
  
  
  if(estadodeJogo === JOGAR){
    //mover o chão
    solo.velocityX = -(4+3*pontuacao/100);

    restart.visible = false;
    gameover.visible = false;
    //pontuação
    pontuacao = pontuacao + Math.round(frameRate()/60);
    if(pontuacao>0 && pontuacao % 100 === 0){
      checkpoint.play();
    }
    
    if (solo.x < 0){
      solo.x = solo.width/2;
    }
    
    //pular quando a tecla espaço é pressionada
    if(touches.lenght>0 || keyDown("space")&& trex.y >= height-60) {
        trex.velocityY = -13;
        pulo.play();
        touches =[];
    }
    
    //acrescentar gravidade
    trex.velocityY = trex.velocityY + 0.8
  
    //gerar as nuvens
    spawnClouds();
  
    //gerar obstáculos no chão
    spawnObstacles();
   
    if(grupodeobstaculos.isTouching(trex)){
      estadodeJogo = ENCERRAR;
      morrer.play();
    }
  }
   else if (estadodeJogo === ENCERRAR) {
      solo.velocityX = 0;
      trex.velocityY = 0;
      trex.changeAnimation("collided" , trex_colidiu);

      restart.visible = true;
      gameover.visible = true;

     
     
     grupodeobstaculos.setVelocityXEach(0);
     grupodeobstaculos.setLifetimeEach(-1);
     grupodenuvens.setVelocityXEach(0);
     grupodenuvens.setLifetimeEach(-1);

     if(touches.lenght>0 || mousePressedOver(restart)) {
      reset();
      touches = [];

    }
   }
  
 
  //impedir que trex cais
  trex.collide(soloinvisivel);
  
   
  
  drawSprites();
}

function reset(){
  estadodeJogo = JOGAR;
  grupodeobstaculos.destroyEach();
  grupodenuvens.destroyEach()
  trex.changeAnimation("running",trex_correndo);
  pontuacao = 0;
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstaculo = createSprite(width+20,height-45,10,40);
   obstaculo.velocityX = -(6+pontuacao/100);
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
      default: break;
    }
   
    //atribuir dimensão e tempo de vida ao obstáculo           
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
   
   //adicionar cada obstáculo ao grupo
    grupodeobstaculos.add(obstaculo);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar nuvens
   if (frameCount % 60 === 0) {
     nuvem = createSprite(width+20,100,40,10);
    nuvem.y = Math.round(random(100,height/2));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 1;
    nuvem.velocityX = -3;
    
     //atribuir tempo de vida à variável
    nuvem.lifetime = width+20;
    
    //ajustar a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionar nuvens ao grupo
   grupodenuvens.add(nuvem);
    }
}

