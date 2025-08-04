import { _decorator, CCFloat, Color, log } from "cc";
import { EDITOR } from "cc/env";
import TextMeshPro from "./TextMeshPro";

const { ccclass, property } = _decorator;

@ccclass("OutlineColorItem")
export class OutlineColorItem {
    @property({
        type: Color,
        serializable: true
    })
    readonly color: Color = Color.WHITE.clone();

    @property({
        type: CCFloat,
        range: [0, 1, 0.01],
        serializable: true
    })
    readonly colorRatio: number = 1;
}

@ccclass("OutlineOptions")
export class OutlineOptions {
    constructor(comp: TextMeshPro) {
        this.comp = comp;
        // if (!_comp) throw new Error("no parent passed");
    }

    @property({
        serializable: true,
        visible: false
    })
    comp: TextMeshPro;

    @property({
        serializable: true
    })
    private _isOutlineOn: boolean = false;
    @property({ tooltip: "Whether to enable the stroke effect" })
    public get isOutlineEnabled(): boolean {
        return this._isOutlineOn;
    }
    public set isOutlineEnabled(v: boolean) {
        if (!EDITOR && this._isOutlineOn === v) {
            return;
        }
        this._isOutlineOn = v;
        if (!this.comp) {
            return;
        }
        this.comp.updateTmpMatOutline(this.comp.getMaterialInstance(0));
    }

    @property
    private _outlineThickness: number = 0.15;
    @property({
        tooltip: "Stroke thickness",
        range: [0, 1, 0.01],
        visible() {
            return this._isOutlineOn;
        }
    })
    public get outlineThickness(): number {
        return this._outlineThickness;
    }
    public set outlineThickness(v: number) {
        if (!EDITOR && this._outlineThickness === v) {
            return;
        }
        this._outlineThickness = v;
        if (!this.comp) {
            return;
        }
        this.comp.updateTmpMatOutline(this.comp.getMaterialInstance(0));
    }

    get numberOfColors() {
        return this._items.length;
    }

    @property({
        type: [OutlineColorItem],
        visible: false,
        serializable: true
    })
    protected _items: OutlineColorItem[] = [new OutlineColorItem()];

    @property({
        type: [OutlineColorItem],
        min: 1,
        max: 5,
        visible() {
            return this._isOutlineOn;
        }
    })
    public set colorUnits(value: OutlineColorItem[]) {
        if (value.length > 5) {
            value.length = 5;
        }
        if ((!EDITOR && this._items === value) || !this.comp || !value.length) {
            return;
        }

        this._items = value;
        this.comp.updateTmpMatOutline(this.comp.getMaterialInstance(0));
    }
    public get colorUnits() {
        return this._items;
    }
}
