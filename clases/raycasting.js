import {degToRad, drawLine} from '../utils.js';
export default class RayCasting {
    constructor(){
    }
    throwRay(data, ctx){
        let rayAngle = data.player.angle - data.player.halfFov;
        for (let rayCount  = 0; rayCount  < data.screen.width; rayCount ++) {
            let ray = {
                x: data.player.x,
                y: data.player.y,
            }
            let rayCos = Math.cos(degToRad(rayAngle)) / data.rayCasting.precision;
            let raySin = Math.sin(degToRad(rayAngle)) / data.rayCasting.precision;
            let wall = 0;
            while(wall == 0) {
                ray.x += rayCos;
                ray.y += raySin;
                wall = data.map[Math.floor(ray.y)][Math.floor(ray.x)];
            }
            let distance = Math.sqrt(Math.pow(data.player.x - ray.x, 2) + Math.pow(data.player.y - ray.y, 2));
            let wallHeight  = Math.floor(data.screen.height / distance);
            drawLine(ctx, rayCount, 0, rayCount, data.screen.halfHeight - wallHeight, "red");

            drawLine(ctx, rayCount, data.screen.halfHeight - wallHeight, rayCount, data.screen.halfHeight + wallHeight, (wall == 2) ? "#9a7b4f": "black");
            drawLine(ctx, rayCount, data.screen.halfHeight + wallHeight, rayCount, data.screen.height, "#666666");
            rayAngle += data.rayCasting.incrementAngle;
        }
    }

}