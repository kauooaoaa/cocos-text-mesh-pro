import {
    Component,
    tween,
    Vec3,
    _decorator,
    Color,
    CCInteger,
    Prefab,
    CCFloat,
    math,
    v3,
    log
} from "cc";
import TextMeshPro from "./TextMeshPro";
import TmpUtils from "./utils/TmpUtils";
import { EDITOR } from "cc/env";
import { type } from "os";

const { ccclass, property } = _decorator;

@ccclass("LinearGradientItem")
export class LinearGradientItem {
    @property({
        type: Color,
        serializable: true
    })
    readonly color: Color = Color.BLUE.clone();

    @property({
        type: CCFloat,
        range: [0, 1, 0.01],
        serializable: true
    })
    readonly colorRatio: number = 1;
}

@ccclass("LinearGradientOptions")
export class LinearGradientOptions {
    constructor(protected tmp: TextMeshPro) {}
    @property
    private _linearGradient: boolean = false;
    @property
    public get linearColorGradient(): boolean {
        return this._linearGradient;
    }
    public set linearColorGradient(v: boolean) {
        if (!EDITOR && this._linearGradient === v) {
            return;
        }
        this._linearGradient = v;
    }

    @property({
        serializable: true,
        visible: false
    })
    protected _direction: Vec3 = new Vec3(1, 0, 0);
    @property({
        type: CCFloat,
        serializable: true,
        visible() {
            return this._linearGradient;
        }
    })
    get angle() {
        return math.toDegree(
            Vec3.signedAngle(Vec3.RIGHT, this._direction, v3(0, 0, 1))
        );
    }
    set angle(n: number) {
        this._direction = Vec3.normalize(
            this._direction,
            Vec3.rotateZ(
                this._direction,
                v3(1, 0, 0),
                v3(0, 0, 0),
                math.toRadian(n)
            )
        );
    }
    get angleRadian() {
        return Vec3.angle(Vec3.RIGHT, this._direction);
    }

    get numberOfColors() {
        return this._items.length;
    }

    @property({
        type: [LinearGradientItem],
        visible: false,
        serializable: true
    })
    protected _items: LinearGradientItem[] = [
        new LinearGradientItem(),
        new LinearGradientItem()
    ];
    @property({
        type: [LinearGradientItem],
        min: 2,
        max: 5,
        visible() {
            return this._linearGradient;
        }
    })
    public set items(value: LinearGradientItem[]) {
        if (value.length < 2) {
            this._items.length = 2;
            return;
        }
        if (value.length > 5) {
            value.length = 5;
        }
        this._items = value;
    }
    public get items() {
        return this._items;
    }
}
