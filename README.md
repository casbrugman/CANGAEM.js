# CANGAEM
Simple HTML canvas game-framework written in typescript

>NOTE: this is just a small project of mine and is made in a few days and is very limited. However, any additions or suggestions are welcome.  
    

## How to use

To setup create a new html document and add this:

* first create a canvas and give it an id and size of your liking
  > you can also set the canvas to 100% width & height in css and the framework will do the rest
* import the CANGAEM.js file from the build folder
* create a new `CANGAEM.Origin()` object called game and give it the id of the canvas as parameter
* this will set up a instance of a OriginObject, to which you can add other objects
* in this example we will create a new `CANGAEM.RectObject()` called testobject and give it as parameter a new `CANGAEM.Vector2(<size X>, <size Y>)`
* a `CANGAEM.RectObject()` will draw a rectangle on the screen with the size of your vector2.
* we set the velocity of our testobject in the x dimension to 0.1
* add our testobject to the game with `game.Add(testobject)`
* and finally to update the game create a basic requestAnimationFrame loop in which we update the origin object which will also update all the objects added to it.

### Code:
```html
<canvas id="game" width="200" height="200"></canvas>
<script src="CANGAEM.js"></script>
<script>
    var game = new CANGAEM.Origin("game")

    var testobject = new CANGAEM.RectObject(new CANGAEM.Vector2(20, 20))
    testobject.velocity.x = 0.1

    game.Add(testobject)

    function animate() {
      requestAnimationFrame(animate)

      game.Update()
    }
    animate();
</script>
```

Now you will have a very simple scene with a 10 x 10 rectangle moving to right side of the screen

## Adding functionality
To add code to the different types of objects you can create a new classes that extend from CANGAEM.  
### example:

```typescript
//CANGAEM.ImageObject is the same as a CANGAEM.RectObject except that is draws a image on the canvas
class Player extends CANGAEM.ImageObject
{
    constructor()
    {
        //typescript uses super to access the extended class
        super("mario.jpg")
        this.position.y = 200
    }

    //Update is called by the parent object every frame
    Update()
    {
        //every object has a velocity that is applied automatically
        this.velocity.y += 0.01

        //input helper is a object which you can use to get user input
        //keyDown returns true when the key is down and keyPressed only the frame the key is pressed.
        if (this.inputHelper.KeyDown(68) || this.inputHelper.KeyDown(39))
        {
            this.velocity.x = 0.5
        } else if (this.inputHelper.KeyDown(65) || this.inputHelper.KeyDown(37))
        {
            this.velocity.x = -0.5
        } else
        {
            this.velocity.x = 0
        }

        if (this.inputHelper.KeyPressed(32))
        {
            this.velocity.y = -1
        }
    }
}

//don't forget to add the player to the game
game.Add(Player)
```

If you want to learn more about the functionality you can check CANGAEM.ts source file.
