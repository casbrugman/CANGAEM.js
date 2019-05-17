namespace CANGAEM
{

    export class Object
    {
        worldPosition: Vector2 = new Vector2(0, 0)
        position: Vector2 = new Vector2(0, 0)
        velocity: Vector2 = new Vector2(0, 0)

        children: Object[]
        parent: Object

        context: CanvasRenderingContext2D;

        inputHelper: InputHelper;
        deltaTime: number;

        constructor()
        constructor(position = new Vector2(0, 0))
        {
            this.children = []
            this.position = position
        }

        ObjectHandler()
        {
            if (!(this instanceof Origin))
            {
                this.Update()

                this.position.x += this.velocity.x * this.deltaTime
                this.position.y += this.velocity.y * this.deltaTime

                this.worldPosition.x = this.parent.worldPosition.x + this.position.x
                this.worldPosition.y = this.parent.worldPosition.y + this.position.y
            }

            this.Draw()

            this.children.forEach(child =>
            {
                child.inputHelper = this.inputHelper;
                child.deltaTime = this.deltaTime;
                child.ObjectHandler();
            });
        }

        Update()
        {

        }

        Draw()
        {

        }

        Distance(other: Object): number
        {
            return Math.sqrt(Math.pow(this.worldPosition.x - other.worldPosition.x, 2) + Math.pow(this.worldPosition.y - other.worldPosition.y, 2));

        }

        DistanceCenterVector2(other: Object): Vector2
        {
            return new Vector2(this.worldPosition.x - other.worldPosition.x, this.worldPosition.y - other.worldPosition.y)
        }

        Add(object: Object)
        {
            this.children.push(object)


            object.parent = this
            object.inputHelper = this.inputHelper

            object.SetContext(this.context);
        }

        SetContext(context: CanvasRenderingContext2D)
        {
            this.context = context
            this.children.forEach(child =>
            {
                child.SetContext(context);
            });
        }

    }

    export class ScreenSpaceRectObject extends Object
    {
        size: Vector2 = new Vector2(0, 0)
        origin: Vector2 = new Vector2(0, 0)

        constructor(position = new Vector2(0, 0))
        {
            super()

            this.position = position
        }

        CollidesWith(other: ScreenSpaceRectObject): boolean
        {
            return (this.worldPosition.x - this.origin.x < other.worldPosition.x - other.origin.x + other.size.x &&
                this.worldPosition.x - this.origin.x + this.size.x > other.worldPosition.x - other.origin.x &&
                this.worldPosition.y - this.origin.y < other.worldPosition.y - other.origin.y + other.size.y &&
                this.worldPosition.y - this.origin.y + this.size.y > other.worldPosition.y - other.origin.y)
        }

        CenterOffset()
        {
            return new Vector2(this.size.x / 2, this.size.y / 2)
        }

        DistanceCenter(other: any): number
        {
            if (other instanceof ScreenSpaceRectObject)
            {
                return Math.sqrt(Math.pow((this.worldPosition.x - this.origin.x + this.CenterOffset().x) - (other.worldPosition.x - other.origin.x + other.CenterOffset().x), 2) + Math.pow((this.worldPosition.y - this.origin.y + this.CenterOffset().y) - (other.worldPosition.y - other.origin.y + other.CenterOffset().y), 2));

            } else if (other instanceof Object)
            {
                return Math.sqrt(Math.pow((this.worldPosition.x - this.origin.x + this.CenterOffset().x) - other.worldPosition.x, 2) + Math.pow((this.worldPosition.y - this.origin.y + this.CenterOffset().y) - other.worldPosition.y, 2));
            } else if (other instanceof Vector2)
            {
                return Math.sqrt(Math.pow((this.worldPosition.x - this.origin.x + this.CenterOffset().x) - other.x, 2) + Math.pow((this.worldPosition.y - this.origin.y + this.CenterOffset().y) - other.y, 2));
            } else
            {
                throw new Error(`Expected CANGAEM.ScreenSpaceRectObject, CANGAEM.Object or CANGAEM.Vector2, got '${typeof other}'.`)
            }
        }

        DistanceBoundingBox(other: any)
        {
            // if (other instanceof ScreenSpaceRectObject)
            // {
            //     //WIP

            // } else
            if (other instanceof Object)
            {
                let dx = Math.max(other.worldPosition.x - (this.worldPosition.x - this.origin.x + this.size.x / 2) - this.size.x / 2, 0, (this.worldPosition.x - this.origin.x + this.size.x / 2) - other.worldPosition.x - this.size.x / 2);
                let dy = Math.max(other.worldPosition.y - (this.worldPosition.y - this.origin.y + this.size.y / 2) - this.size.y / 2, 0, (this.worldPosition.y - this.origin.y + this.size.x / 2) - other.worldPosition.y - this.size.y / 2);
                return Math.sqrt(dx * dx + dy * dy);

            } else if (other instanceof Vector2)
            {
                let dx = Math.max(other.x - (this.worldPosition.x - this.origin.x + this.size.x / 2) - this.size.x / 2, 0, (this.worldPosition.x - this.origin.x + this.size.x / 2) - other.x - this.size.x / 2);
                let dy = Math.max(other.y - (this.worldPosition.y - this.origin.y + this.size.y / 2) - this.size.y / 2, 0, (this.worldPosition.y - this.origin.y + this.size.x / 2) - other.y - this.size.y / 2);
                return Math.sqrt(dx * dx + dy * dy);
            } else 
            {
                throw new Error(`Expected CANGAEM.Object or CANGAEM.Vector2, got '${typeof other}'.`)
            }
        }

        DistanceVector2(other: ScreenSpaceRectObject): Vector2
        {
            return new Vector2(this.worldPosition.x - this.origin.x - this.size.x / 2 - other.worldPosition.x, this.worldPosition.y - this.origin.y - this.size.y / 2 - other.worldPosition.y)
        }
    }

    export class ImageObject extends ScreenSpaceRectObject
    {

        image: CanvasImageSource

        constructor(src: string = "defaulticon.png", position: Vector2 = new Vector2(0, 0))
        {
            super()

            this.image = document.createElement("img")
            this.image.setAttribute("src", src)
            this.image.onload = () =>
            {
                this.size.x = <number> this.image.width;
                this.size.y = <number> this.image.height;
            }

            this.position = position;
        }

        Draw()
        {
            this.context.drawImage(this.image, this.worldPosition.x - this.origin.x, this.worldPosition.y - this.origin.x)
        }

    }

    export class RectObject extends ScreenSpaceRectObject
    {
        fillColor: string = "black"
        strokeColor: string = "black"
        strokeWidth: number = 0

        constructor(size: Vector2, position: Vector2 = new Vector2(0, 0))
        {
            super()
            this.size = size
            this.position = position
        }

        Draw()
        {
            this.context.fillStyle = this.fillColor;
            this.context.fillRect(this.worldPosition.x - this.origin.x, this.worldPosition.y - this.origin.y, this.size.x, this.size.y)

            this.context.strokeStyle = this.strokeColor;
            this.context.lineWidth = this.strokeWidth;
            this.context.strokeRect(this.worldPosition.x - this.origin.x, this.worldPosition.y - this.origin.y, this.size.x, this.size.y)
        }
    }

    export class Origin extends Object
    {
        element: HTMLElement
        canvas: HTMLCanvasElement
        context: CanvasRenderingContext2D

        lastupdate: number

        constructor(id: string = "CANGAEM")
        {
            super()

            this.parent = this

            this.inputHelper = new InputHelper()

            this.element = document.getElementById(id)

            if (!document.body.contains(this.element))
            {
                this.element = document.createElement("canvas");
                this.element.setAttribute("id", "CANGAEM_Canvas")
                document.body.appendChild(this.element)
            }

            this.canvas = <HTMLCanvasElement> this.element
            this.context = this.canvas.getContext("2d")

            this.lastupdate = Date.now();

            console.log("CANGAEM 1.1")

        }

        Update()
        {
            //calc deltatime
            let now = Date.now()
            this.deltaTime = Date.now() - this.lastupdate;
            this.lastupdate = now

            this.canvas.width = this.element.clientWidth
            this.canvas.height = this.element.clientHeight

            this.inputHelper.Update()


            //clear canvas
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

            this.position.x += this.velocity.x * this.deltaTime;
            this.position.y += this.velocity.y * this.deltaTime;

            this.worldPosition = this.position
            this.worldPosition = this.position

            super.ObjectHandler()
        }

        ScreenCenter()
        {
            return new Vector2(this.canvas.width / 2, this.canvas.height / 2)
        }
    }

    export class Vector2
    {
        x: number
        y: number

        constructor(x: number = 0, y: number = 0)
        {
            this.x = x
            this.y = y
        }

        Lenght(): number
        {
            return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
        }

        Normalize(): Vector2
        {
            let len = this.Lenght()
            return new Vector2(this.x / len, this.y / len)
        }

        FromAngle(angle: number): Vector2
        {
            return new Vector2(Math.cos(angle * Math.PI / 180), Math.sin(angle * Math.PI / 180))
        }

        Truncate(lenght: number)
        {
            let normalized = this.Normalize()
            return new Vector2(normalized.x * lenght, normalized.y * lenght)
        }

    }

    export class InputHelper
    {
        keys: [boolean, number][] = []

        constructor()
        {
            document.addEventListener("keydown", (event) =>
            {
                if (typeof this.keys[event.keyCode] == "undefined")
                {
                    this.keys[event.keyCode] = [true, 0]
                } else
                {
                    this.keys[event.keyCode][0] = true
                }
            })
            document.addEventListener("keyup", (event) =>
            {
                this.keys[event.keyCode] = [false, 0]
            })
        }

        Update()
        {
            this.keys.forEach(key =>
            {
                if (key[0])
                {
                    key[1] += 1
                }
            })
        }

        KeyDown(keyCode: number): boolean
        {

            if (typeof this.keys[keyCode] != "undefined" && this.keys[keyCode][0])
            {
                return true

            } else
            {
                return false
            }
        }
        KeyPressed(keyCode: number): boolean
        {
            if (typeof this.keys[keyCode] != "undefined" && this.keys[keyCode][0] && this.keys[keyCode][1] == 1)
            {
                return true

            } else
            {
                return false
            }
        }

    }
}