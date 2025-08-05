import { _decorator, color, Color, Vec2 } from "cc";
import { EDITOR } from "cc/env";
import StylableLabel from "../StylableLabel";

const { ccclass, property } = _decorator;

@ccclass("UnderlayColorItem")
export class UnderlayColorItem {
    get dto() {
        return {
            underlayColor: this.underlayColor,
            underlayOffsetX: this.underlayOffset.x,
            underlayOffsetY: this.underlayOffset.y,
            underlayDilate: this.underlayDilate,
            underlaySoftness: this.underlaySoftness
        };
    }
    @property(Color)
    private _underlayColor: Color = color(0, 0, 0, 255);
    @property({
        tooltip: "Shadow color",
        type: Color,
        visible() {
            return this._enableUnderlay;
        }
    })
    public get underlayColor(): Color {
        return this._underlayColor;
    }
    public set underlayColor(v: Color) {
        if (!EDITOR && this._underlayColor === v) {
            return;
        }
        this._underlayColor = v;
    }

    @property(Vec2)
    private _underlayOffset: Vec2 = new Vec2(0, 0);
    get underlayOffset() {
        return this._underlayOffset.clone();
    }
    @property({
        tooltip: "Shadow Offset",
        type: Vec2,
        visible() {
            return this._enableUnderlay;
        }
    })
    public get underlayOffsetEditor(): Vec2 {
        return this._underlayOffset;
    }
    public set underlayOffsetEditor(v: Vec2) {
        if (!EDITOR && this._underlayOffset === v) {
            return;
        }

        this._underlayOffset = v;
    }

    @property
    private _underlayDilate: number = 0.5;
    @property({
        tooltip: "Shadow thickness",
        range: [0, 1, 0.01],
        visible() {
            return this._enableUnderlay;
        }
    })
    public get underlayDilate(): number {
        return this._underlayDilate;
    }
    public set underlayDilate(v: number) {
        if (!EDITOR && this._underlayDilate === v) {
            return;
        }
        this._underlayDilate = v;
    }

    @property
    private _underlaySoftness: number = 0.1;
    @property({
        tooltip: "Shadow Softness",
        range: [0, 1, 0.01],
        visible() {
            return this._enableUnderlay;
        }
    })
    public get underlaySoftness(): number {
        return this._underlaySoftness;
    }
    public set underlaySoftness(v: number) {
        if (!EDITOR && this._underlaySoftness === v) {
            return;
        }
        this._underlaySoftness = v;
    }
}

@ccclass("UnderlayOptions")
export class UnderlayOptions {
    constructor(comp: StylableLabel) {
        this.comp = comp;
        // if (!_comp) throw new Error("no parent passed");
    }

    @property({
        serializable: true,
        visible: false
    })
    comp: StylableLabel;

    @property({
        serializable: true
    })
    private _isUnderlayOn: boolean = false;
    @property({ tooltip: "Whether to enable the stroke effect" })
    public get isUnderlayEnabled(): boolean {
        return this._isUnderlayOn;
    }
    public set isUnderlayEnabled(v: boolean) {
        if (!EDITOR || !this.comp) {
            return;
        }
        this._isUnderlayOn = v;
        this.comp.updateTmpMatUnderlay(this.comp.getMaterialInstance(0));
    }

    get numberOfUnderlays() {
        return this._items.length;
    }

    @property({
        type: [UnderlayColorItem],
        visible: false,
        serializable: true
    })
    protected _items: UnderlayColorItem[] = [new UnderlayColorItem()];

    @property({
        type: [UnderlayColorItem],
        min: 1,
        max: 5,
        visible() {
            return this._isUnderlayOn;
        }
    })
    public set underlayUnitsEditor(value: UnderlayColorItem[]) {
        if (value.length > 4) {
            value.length = 4;
        }
        if ((!EDITOR && this._items === value) || !this.comp || !value.length) {
            return;
        }

        this._items = value;

        this.comp.updateTmpMatUnderlay(this.comp.getMaterialInstance(0));
    }
    public get underlayUnitsEditor() {
        return this._items;
    }
    public get underlayUnits() {
        const ret = this._items.map((e, i) => {
            const retInner = e.dto;
            retInner.underlayOffsetX /= this.comp.textures[0].width;
            retInner.underlayOffsetY /= this.comp.textures[0].height;
            return retInner;
        });
        return ret;
    }
}
