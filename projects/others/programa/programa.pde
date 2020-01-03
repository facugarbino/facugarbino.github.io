/* @pjs preload="negro.png, sapopepe.jpg, ash.png"; */
final int BACKGROUND_COLOR = 0;
float x,y;
float dim=80.0;
boolean gifOk = false;
PImage meme;
String negro = "negro.png";
String pepe = "sapopepe.jpg";
String ash = "ash.png";
void setup() {
  size(1000, 1000);
  noStroke();
  background(BACKGROUND_COLOR);
  menu();
  //meme = null;
}
void menu() {
  fill(255);
  rect(0,0,320,300);
  fill(0,127,255);
  textSize(45);
  text("MEME CRAZY",10,70);
  textSize(40);
  text("A=",30,125);
  text("S=",30,200);
  text("D=",30,275);
  meme = loadImage(negro);
  image(meme, 100,75,70,70);
  meme = loadImage(pepe, "png");
  image(meme, 100,150,70,70);
  meme = loadImage(ash);
  image(meme, 100,225,70,70);
  textSize(20);
  text("R = RESET",200,290);
meme = loadImage(negro);
}

void draw() {
    if (mousePressed) {
      if (meme==null) {
        gifOk=true;
      } else{
        image(meme, mouseX-75, mouseY-75,150,150);
      }
    }
}
void keyPressed() {
  switch (keyCode){  
    case 65: meme = loadImage(negro, "png"); break;
    case 83: meme = loadImage(pepe, "png"); break;
    case 68: meme = loadImage(ash, "png"); break;
    case 82: {
      background(BACKGROUND_COLOR);
      menu();
      meme = null;
      gifOk=false;
      break;
    }
    default: {
      gifOk=true;
    }
  }
}
