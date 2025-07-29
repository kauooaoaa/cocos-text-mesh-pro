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
export class OutlineColorItem {
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

@ccclass("OutlineOptions")
export class OutlineOptions {
    constructor(protected tmp: TextMeshPro) {}
    @property
    private _isOutlineOn: boolean = false;
    @property
    public get isOutlineEnabled(): boolean {
        return this._isOutlineOn;
    }
    public set isOutlineEnabled(v: boolean) {
        if (!EDITOR && this._isOutlineOn === v) {
            return;
        }
        this._isOutlineOn = v;
    }

    get numberOfColors() {
        return this._items.length;
    }

    @property({
        type: [OutlineColorItem],
        visible: false,
        serializable: true
    })
    protected _items: OutlineColorItem[] = [
        new OutlineColorItem(),
        new OutlineColorItem()
    ];
    @property({
        type: [OutlineColorItem],
        min: 2,
        max: 5,
        visible() {
            return this._isOutlineOn;
        }
    })
    public set items(value: OutlineColorItem[]) {
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
