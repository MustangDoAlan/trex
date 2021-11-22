var JOGAR = 1;
var ENCERRAR = 0;
var estadodeJogo = JOGAR;

var trex, trex_correndo, trex_colidiu;
var ground, soloinvisivel,imagemdosolo;

var grupodenuvens, imagemdanuvem;
var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var pontuacao;


function preload(){
  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_colidiu = loadAnimation("trex_collided.png");
  
 imagemdosolo = loadImage("ground2.png");
  
  imagemdanuvem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided" , trex_colidiu)
  trex.scale = 0.5;
  trex.setCollider("circle",0,0,40);
  trex.debug =true;
  
 solo = createSprite(200,180,400,20);
 solo.addImage("ground",imagemdosolo);
 solo.x =solo.width /2;
  
  
  soloinvisivel = createSprite(200,190,400,10);
  soloinvisivel.visible = false;
  
  //criar os Grupos de Obstáculos e Nuvens
  grupodeobstaculos = createGroup();
  grupodenuvens = createGroup();
  
  console.log("Olá" + 5);
  
  pontuacao = 0;
}

function draw() {
  background(160);
  console.log("isto e:"+estadodeJogo);
  //exibindo a pontuação
  text("Pontuação: "+ pontuacao, 500,50);
  
  
  
  if(estadodeJogo === JOGAR){
    //mover o chão
    solo.velocityX = -4;
    //pontuação
    pontuacao = pontuacao + Math.round(frameCount/60);
    
    if (solo.x < 0){
      solo.x = solo.width/2;
    }
    
    //pular quando a tecla espaço é pressionada
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -13;
    }
    
    //acrescentar gravidade
    trex.velocityY = trex.velocityY + 0.8
  
    //gerar as nuvens
    spawnClouds();
  
    //gerar obstáculos no chão
    spawnObstacles();
   
    if(grupodeobstaculos.isTouching(trex)){
      estadodeJogo = ENCERRAR;
    }
  }
   else if (estadodeJogo === ENCERRAR) {
      solo.velocityX = 0;
      trex.velocityY = 0;
      trex.changeAnimation("collided" , trex_colidiu);
     
     grupodeobstaculos.setVelocityXEach(0);
     grupodeobstaculos.setLifetimeEach(-1);
     grupodenuvens.setVelocityXEach(0);
     grupodenuvens.setLifetimeEach(-1);
   }
  
 
  //impedir que trex cais
  trex.collide(soloinvisivel);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstaculo = createSprite(600,165,10,40);
   obstaculo.velocityX = -6;
   
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
     nuvem = createSprite(600,100,40,10);
    nuvem.y = Math.round(random(10,60));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
     //atribuir tempo de vida à variável
    nuvem.lifetime = 250;
    
    //ajustar a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionar nuvens ao grupo
   grupodenuvens.add(nuvem);
    }
}

