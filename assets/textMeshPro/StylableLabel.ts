import {
    _decorator,
    BaseRenderData,
    color,
    Color,
    Enum,
    error,
    gfx,
    HorizontalTextAlignment,
    IColorLike,
    JsonAsset,
    Material,
    NodeEventType,
    RenderData,
    renderer,
    SpriteFrame,
    StencilManager,
    Texture2D,
    UIRenderer,
    Vec3,
    VerticalTextAlignment
} from "cc";
import { EDITOR, JSB } from "cc/env";
import { LinearGradientOptions } from "./utils/LinearGradientOptions";
import { OutlineOptions } from "./utils/OutlineOptions";
import TmpAssembler, { TmpLetterInfo } from "./utils/TmpAssembler";
import TmpFontConfig from "./utils/TmpFontConfig";
import TmpUtils from "./utils/TmpUtils";
import { UnderlayOptions } from "./utils/UnderlayOptions";

const { ccclass, property, executeInEditMode } = _decorator;

const vfmt = [
    new gfx.Attribute(gfx.AttributeName.ATTR_POSITION, gfx.Format.RGB32F),
    new gfx.Attribute(gfx.AttributeName.ATTR_TEX_COORD, gfx.Format.RG32F),
    new gfx.Attribute(gfx.AttributeName.ATTR_COLOR, gfx.Format.RGBA32F),
    new gfx.Attribute(gfx.AttributeName.ATTR_COLOR2, gfx.Format.RGBA32F),
    new gfx.Attribute("a_texture_idx", gfx.Format.R32F)
];

export enum TmpOverflow {
    NONE,
    CLAMP,
    ELLIPSIS,
    SHRINK,
    RESIZE_HEIGHT
}

@ccclass("Uniform")
export class Uniform {
    //#region TmpUniform_PROPS

    @property(Color)
    private _faceColor: Color = Color.WHITE.clone();
    @property({ tooltip: "Text body color", type: Color })
    public get faceColor(): Color {
        return this._faceColor;
    }
    public set faceColor(v: Color) {
        if (!EDITOR && this._faceColor === v) {
            return;
        }
        this._faceColor = v;
        if (!this._comp) {
            return;
        }
        this._comp.updateTmpMatFace(this._comp.getMaterialInstance(0));
    }

    @property
    private _faceDilate: number = 0.5;
    @property({ tooltip: "Text body thickness", range: [0, 1, 0.01] })
    public get faceDilate(): number {
        return this._faceDilate;
    }
    public set faceDilate(v: number) {
        if (!EDITOR && this._faceDilate === v) {
            return;
        }
        this._faceDilate = v;
        if (!this._comp) {
            return;
        }
        this._comp.updateTmpMatFace(this._comp.getMaterialInstance(0));
    }

    @property
    private _faceSoftness: number = 0.01;
    @property({ tooltip: "Text body softness", range: [0, 1, 0.01] })
    public get faceSoftness(): number {
        return this._faceSoftness;
    }
    public set faceSoftness(v: number) {
        if (!EDITOR && this._faceSoftness === v) {
            return;
        }
        this._faceSoftness = v;
        if (!this._comp) {
            return;
        }
        this._comp.updateTmpMatFace(this._comp.getMaterialInstance(0));
    }

    @property
    private _enableGlow: boolean = false;
    @property({ tooltip: "Whether to enable glow effect" })
    public get enableGlow(): boolean {
        return this._enableGlow;
    }
    public set enableGlow(v: boolean) {
        if (!EDITOR && this._enableGlow === v) {
            return;
        }
        this._enableGlow = v;
        if (!this._comp) {
            return;
        }
        this._comp.updateTmpMatGlow(this._comp.getMaterialInstance(0));
    }

    @property(Color)
    private _glowColor: Color = color(0, 255, 0, 255);
    @property({
        tooltip: "Glow color",
        type: Color,
        visible() {
            return this._enableGlow;
        }
    })
    public get glowColor(): Color {
        return this._glowColor;
    }
    public set glowColor(v: Color) {
        if (!EDITOR && this._glowColor === v) {
            return;
        }
        this._glowColor = v;
        if (!this._comp) {
            return;
        }
        this._comp.updateTmpMatGlow(this._comp.getMaterialInstance(0));
    }

    @property
    private _glowOffset: number = 0.5;
    @property({
        tooltip: "Glow offset",
        range: [0, 1, 0.01],
        visible() {
            return this._enableGlow;
        }
    })
    public get glowOffset(): number {
        return this._glowOffset;
    }
    public set glowOffset(v: number) {
        if (!EDITOR && this._glowOffset === v) {
            return;
        }
        this._glowOffset = v;
        if (!this._comp) {
            return;
        }
        this._comp.updateTmpMatGlow(this._comp.getMaterialInstance(0));
    }

    @property
    private _glowInner: number = 0.01;
    @property({
        tooltip: "The thickness of glow inward",
        range: [0, 1, 0.01],
        visible() {
            return this._enableGlow;
        }
    })
    public get glowInner(): number {
        return this._glowInner;
    }
    public set glowInner(v: number) {
        if (!EDITOR && this._glowInner === v) {
            return;
        }
        this._glowInner = v;
        if (!this._comp) {
            return;
        }
        this._comp.updateTmpMatGlow(this._comp.getMaterialInstance(0));
    }

    @property
    private _glowOuter: number = 0.01;
    @property({
        tooltip: "The thickness of the glow outward",
        range: [0, 1, 0.01],
        visible() {
            return this._enableGlow;
        }
    })
    public get glowOuter(): number {
        return this._glowOuter;
    }
    public set glowOuter(v: number) {
        if (!EDITOR && this._glowOuter === v) {
            return;
        }
        this._glowOuter = v;
        if (!this._comp) {
            return;
        }
        this._comp.updateTmpMatGlow(this._comp.getMaterialInstance(0));
    }

    @property
    private _glowPower: number = 1;
    @property({
        tooltip: "Glow intensity",
        range: [0, 1, 0.01],
        visible() {
            return this._enableGlow;
        }
    })
    public get glowPower(): number {
        return this._glowPower;
    }
    public set glowPower(v: number) {
        if (!EDITOR && this._glowPower === v) {
            return;
        }
        this._glowPower = v;
        if (!this._comp) {
            return;
        }
        this._comp.updateTmpMatGlow(this._comp.getMaterialInstance(0));
    }

    private _comp: StylableLabel = null;
    public get comp(): StylableLabel {
        return this._comp;
    }
    constructor(text?: StylableLabel) {
        if (text) this._comp = text;
    }
    public init(text: StylableLabel) {
        this._comp = text;

        let material = this._comp.getMaterialInstance(0);
        this._comp.updateTmpMatFace(material);
        this._comp.updateTmpMatUnderlay(material);
        this._comp.updateTmpMatGlow(material);
    }

    //#endregion TmpUniform_PROPS
}
@ccclass("StylableLabel")
@executeInEditMode
export default class StylableLabel extends UIRenderer {
    //#region TMP_PROPS
    @property({
        serializable: true
    })
    private _outlineOptions: OutlineOptions = null;
    @property({
        type: OutlineOptions
    })
    public get outlineOptions(): OutlineOptions {
        if (this._outlineOptions && this._outlineOptions.comp)
            return this._outlineOptions;
        else {
            this._outlineOptions = new OutlineOptions(this);
            return this._outlineOptions;
        }
    }
    public set outlineOptions(v: OutlineOptions) {
        if (!EDITOR && this._outlineOptions === v) {
            return;
        }
        this._outlineOptions = v;
        this.updateTmpMatOutline(this.getMaterialInstance(0));
    }

    @property({
        serializable: true
    })
    private _linearGradientOptions: LinearGradientOptions = null;
    @property({
        type: LinearGradientOptions
    })
    public get linearGradientOptions(): LinearGradientOptions {
        return (
            this._linearGradientOptions ||
            (() => {
                this._linearGradientOptions = new LinearGradientOptions(this);
                return this._linearGradientOptions;
            })()
        );
    }
    public set linearGradientOptions(v: LinearGradientOptions) {
        if (!EDITOR && this._linearGradientOptions === v) {
            return;
        }
        this._linearGradientOptions = v;
        this.updateTmpLinearGradient(this.getMaterialInstance(0));
    }

    @property({
        serializable: true
    })
    private _underlayOptions: UnderlayOptions = null;
    @property({
        type: UnderlayOptions
    })
    public get underlayOptions(): UnderlayOptions {
        return (
            this._underlayOptions ||
            (() => {
                this._underlayOptions = new UnderlayOptions(this);
                return this._underlayOptions;
            })()
        );
    }
    public set underlayOptions(v: UnderlayOptions) {
        if (!EDITOR && this._underlayOptions === v) {
            return;
        }
        this._underlayOptions = v;
        this.updateTmpLinearGradient(this.getMaterialInstance(0));
    }

    protected _color: Color = Color.WHITE.clone();
    @property({
        visible() {
            return !this.linearGradientOptions.linearColorGradient;
        },
        type: Color,
        serializable: true,
        displayOrder: 1,
        override: true
    })
    get color(): Readonly<Color> {
        return this._color;
    }
    set color(value) {
        if (this._color.equals(value)) {
            return;
        }
        this._color.set(value);
        this._updateColor();
        if (EDITOR) {
            const clone = this._color.clone();
            this.node.emit(NodeEventType.COLOR_CHANGED, clone);
        }
    }

    @property
    private _string: string = "";
    @property({ multiline: true })
    public get string(): string {
        return this._string;
    }
    public set string(v: string) {
        if (!EDITOR && this._string === v) {
            return;
        }
        this._string = v;
        this.markForUpdateRenderData();
    }

    @property(JsonAsset)
    private _font: JsonAsset = null;
    @property({
        tooltip:
            "Font resources\nDo not type in the picture album of the dependent texture\nWhen dragging this file in the editor, the texture must be in the same directory as this file",
        type: JsonAsset
    })
    private get font(): JsonAsset {
        return this._font;
    }
    private set font(v: JsonAsset) {
        if (!EDITOR && this._font === v) {
            return;
        }
        this._font = v;
        if (EDITOR) {
            this.editorInit();
        } else {
            if (this._renderData) {
                this.destroyRenderData();
                this._renderData = null;
            }
            this.updateRenderData(true);
        }
    }

    @property({ type: HorizontalTextAlignment })
    private _horizontalAlign: HorizontalTextAlignment =
        HorizontalTextAlignment.LEFT;
    @property({ type: HorizontalTextAlignment })
    public get horizontalAlign(): HorizontalTextAlignment {
        return this._horizontalAlign;
    }
    public set horizontalAlign(v: HorizontalTextAlignment) {
        if (!EDITOR && this._horizontalAlign === v) {
            return;
        }
        this._horizontalAlign = v;
        this.markForUpdateRenderData();
    }

    @property({ type: VerticalTextAlignment })
    private _verticalAlign: VerticalTextAlignment = VerticalTextAlignment.TOP;
    @property({ type: VerticalTextAlignment })
    public get verticalAlign(): VerticalTextAlignment {
        return this._verticalAlign;
    }
    public set verticalAlign(v: VerticalTextAlignment) {
        if (!EDITOR && this._verticalAlign === v) {
            return;
        }
        this._verticalAlign = v;
        this.markForUpdateRenderData();
    }

    @property
    private _actualFontSize: number = 0;
    @property({
        visible() {
            return this._overflow === TmpOverflow.SHRINK;
        }
    })
    public get actualFontSize(): number {
        return this._actualFontSize;
    }

    @property
    public get bmfontOriginalSize(): number {
        return this.font ? this.font.json["size"] : -1;
    }

    @property
    private _fontSize: number = 32;
    @property({ range: [0, 1024] })
    public get fontSize(): number {
        return this._fontSize;
    }
    public set fontSize(v: number) {
        if (!EDITOR && this._fontSize === v) {
            return;
        }
        this._fontSize = v;
        this.markForUpdateRenderData();
    }

    @property
    private _lineHeight: number = 32;
    @property
    public get lineHeight(): number {
        return this._lineHeight;
    }
    public set lineHeight(v: number) {
        if (!EDITOR && this._lineHeight === v) {
            return;
        }
        this._lineHeight = v;
        this.markForUpdateRenderData();
    }

    @property
    private _spacingX: number = 0;
    @property
    public get spacingX(): number {
        return this._spacingX;
    }
    public set spacingX(v: number) {
        if (!EDITOR && this._spacingX === v) {
            return;
        }
        this._spacingX = v;
        this.markForUpdateRenderData();
    }

    @property({ type: Enum(TmpOverflow) })
    private _overflow: TmpOverflow = TmpOverflow.NONE;
    @property({ tooltip: "Text layout", type: Enum(TmpOverflow) })
    public get overflow(): TmpOverflow {
        return this._overflow;
    }
    public set overflow(v: TmpOverflow) {
        if (!EDITOR && this._overflow === v) {
            return;
        }
        this._overflow = v;
        this.markForUpdateRenderData();
    }

    @property
    private _enableWrapText: boolean = true;
    @property({
        tooltip: "Whether to enable automatic line wrap",
        visible() {
            return (
                this._overflow === TmpOverflow.CLAMP ||
                this._overflow === TmpOverflow.ELLIPSIS
            );
        }
    })
    public get enableWrapText(): boolean {
        return this._enableWrapText;
    }
    public set enableWrapText(v: boolean) {
        if (!EDITOR && this._enableWrapText === v) {
            return;
        }
        this._enableWrapText = v;
        this.markForUpdateRenderData();
    }

    @property
    private _enableItalic: boolean = false;
    @property({ tooltip: "Whether italics are enabled" })
    public get enableItalic(): boolean {
        return this._enableItalic;
    }
    public set enableItalic(v: boolean) {
        if (!EDITOR && this._enableItalic === v) {
            return;
        }
        this._enableItalic = v;
        this.markForUpdateRenderData();
    }

    @property
    private _enableUnderline: boolean = false;
    @property({ tooltip: "Whether to enable underscore" })
    public get enableUnderline(): boolean {
        return this._enableUnderline;
    }
    public set enableUnderline(v: boolean) {
        if (!EDITOR && this._enableUnderline === v) {
            return;
        }
        this._enableUnderline = v;
        this.markForUpdateRenderData();
    }

    @property
    private _underlineOffset: number = 0;
    @property({
        tooltip: "Underline height offset",
        visible() {
            return this._enableUnderline;
        }
    })
    public get underlineOffset(): number {
        return this._underlineOffset;
    }
    public set underlineOffset(v: number) {
        if (!EDITOR && this._underlineOffset === v) {
            return;
        }
        this._underlineOffset = v;
        this.markForUpdateRenderData();
    }

    @property
    private _enableStrikethrough: boolean = false;
    @property({ tooltip: "Whether to enable delete line" })
    public get enableStrikethrough(): boolean {
        return this._enableStrikethrough;
    }
    public set enableStrikethrough(v: boolean) {
        if (!EDITOR && this._enableStrikethrough === v) {
            return;
        }
        this._enableStrikethrough = v;
        this.markForUpdateRenderData();
    }

    @property
    private _strikethroughOffset: number = 0;
    @property({
        tooltip: "Strike-line height offset",
        visible() {
            return this._enableStrikethrough;
        }
    })
    public get strikethroughOffset(): number {
        return this._strikethroughOffset;
    }
    public set strikethroughOffset(v: number) {
        if (!EDITOR && this._strikethroughOffset === v) {
            return;
        }
        this._strikethroughOffset = v;
        this.markForUpdateRenderData();
    }

    @property
    private _vertexColorGradient: boolean = false;
    @property({
        tooltip:
            "Whether to enable color gradient, it will be mixed with the vertex color to the final vertex color"
    })
    public get vertexColorGradient(): boolean {
        return this._vertexColorGradient;
    }
    public set vertexColorGradient(v: boolean) {
        if (!EDITOR && this._vertexColorGradient === v) {
            return;
        }
        this._vertexColorGradient = v;
        this.updateTmpVertexGradient(this.getMaterialInstance(0));
        this.markForUpdateRenderData();
    }

    @property(Color)
    private _colorLB: Color = Color.WHITE.clone();
    @property({
        tooltip: "Lower left vertex",
        type: Color,
        serializable: true,
        visible() {
            return this._vertexColorGradient;
        }
    })
    public get colorLB(): Color {
        return this._colorLB;
    }
    public set colorLB(v: Color) {
        if (!EDITOR && this._colorLB === v) {
            return;
        }
        this._colorLB = v;
        this._colorExtraDirty = true;
    }

    @property(Color)
    private _colorRB: Color = Color.WHITE.clone();
    @property({
        tooltip: "Lower right vertex",
        type: Color,
        serializable: true,
        visible() {
            return this._vertexColorGradient;
        }
    })
    public get colorRB(): Color {
        return this._colorRB;
    }
    public set colorRB(v: Color) {
        if (!EDITOR && this._colorRB === v) {
            return;
        }
        this._colorRB = v;
        this._colorExtraDirty = true;
    }

    @property(Color)
    private _colorLT: Color = Color.WHITE.clone();
    @property({
        tooltip: "Top left vertex",
        type: Color,
        serializable: true,
        visible() {
            return this._vertexColorGradient;
        }
    })
    public get colorLT(): Color {
        return this._colorLT;
    }
    public set colorLT(v: Color) {
        if (!EDITOR && this._colorLT === v) {
            return;
        }
        this._colorLT = v;
        this._colorExtraDirty = true;
    }

    @property(Color)
    private _colorRT: Color = Color.WHITE.clone();
    @property({
        tooltip: "Upper right vertex",
        type: Color,
        serializable: true,
        visible() {
            return this._vertexColorGradient;
        }
    })
    public get colorRT(): Color {
        return this._colorRT;
    }
    public set colorRT(v: Color) {
        if (!EDITOR && this._colorRT === v) {
            return;
        }
        this._colorRT = v;
        this._colorExtraDirty = true;
    }

    @property({ tooltip: "Material parameters", type: Uniform })
    public tmpUniform: Uniform = new Uniform();

    @property({
        tooltip: "Textures that fonts depend on",
        type: Texture2D,
        readonly: true
    })
    public textures: Texture2D[] = [];

    //#endregion TMP_PROPS

    private _fontConfig: TmpFontConfig = null;
    /** Font configuration management */
    public get fontConfig(): TmpFontConfig {
        return this._fontConfig;
    }

    /** The rendering data of each character does not necessarily correspond to string one by one. */
    private _lettersInfo: TmpLetterInfo[] = [];
    public get lettersInfo(): TmpLetterInfo[] {
        return this._lettersInfo;
    }

    protected _assembler: typeof TmpAssembler = null;
    private _colorExtraDirty: boolean = false;

    public colorlikeCodedUVs: IColorLike[] = [];

    private _richTextDeltaX: number = 0;
    /** Record the differencbe between letter right and next token x for use in rich text typesetting */
    public get richTextDeltaX(): number {
        return this._richTextDeltaX;
    }

    private editorInit(): void {
        if (EDITOR) {
            // Loading the picture set

            if (!this._font || !this._font["_uuid"]) {
                this.textures = [];
                this.updateRenderData(true);
                return;
            }
            //@ts-ignore

            Editor.Message.request(
                "asset-db",
                "query-url",
                this._font["_uuid"]
            ).then((url: string) => {
                if (!url) {
                    return;
                }
                let start = 12;
                let end = url.lastIndexOf("/");
                let dir = url.slice(start, end + 1);
                let arr: Promise<Texture2D>[] = [];
                this._font.json["pageData"].forEach((v) => {
                    let imgUrl = dir + v.file + "/texture";
                    arr.push(TmpUtils.load<Texture2D>(imgUrl));
                });
                Promise.all(arr).then((v) => {
                    this.textures = v;
                    this._fontConfig = TmpFontConfig.getFontConfig(
                        this._font,
                        this.textures
                    );

                    if (this._renderData) {
                        this.destroyRenderData();
                        this._renderData = null;
                    }
                    this.updateRenderData(true);
                });
            });
        }
    }

    public resetInEditor(): void {
        if (EDITOR) {
            TmpUtils.load<Material>(TmpUtils.TMP_MAT).then((mat) => {
                if (mat) {
                    this.customMaterial = mat;
                }
            });
        }
    }

    public onLoad(): void {
        super.onLoad();
        if (!this.customMaterial) {
            this.resetInEditor();
        }
        this.tmpUniform.init(this);
        if (!this._fontConfig && this.font && this.textures.length > 0) {
            this._fontConfig = TmpFontConfig.getFontConfig(
                this._font,
                this.textures
            );
        }
    }

    public onEnable(): void {
        super.onEnable();
        this._applyFontTexture();
    }

    public lateUpdate(dt: number): void {
        if (this._colorExtraDirty) {
            this._colorExtraDirty = false;
            this._assembler.updateColorExtra(this);
        }
    }

    /**
     * @en Request new render data object.
     * @zh Request a new rendered data object.
     * @return The new render data
     */
    public requestRenderData(drawInfoType = 0) {
        const data = RenderData.add(vfmt);
        data.initRenderDrawInfo(this, drawInfoType);
        this._renderData = data;
        return data;
    }

    public updateRenderData(force: boolean = false) {
        if (force) {
            this._flushAssembler();
            // Hack: Fixed the bug that richText wants to get the label length by _measureText,
            // _assembler.updateRenderData will update the content size immediately.

            if (this.renderData) {
                this.renderData.vertDirty = true;
            }
            this._applyFontTexture();
        }
        if (this._assembler) {
            this._assembler.updateRenderData(this);
        }
    }

    protected _render(render: any) {
        // render.commitComp(this, this.renderData, this.textures[0], this._assembler!, null);

        this.commitComp(
            render,
            this,
            this.renderData,
            this.textures[0],
            this._assembler!,
            null
        );
    }

    /**
     * Joint hack
     */
    private commitComp(
        render: any,
        comp: StylableLabel,
        renderData: BaseRenderData | null,
        frame: Texture2D | SpriteFrame | null,
        assembler,
        transform: Node | null
    ) {
        let dataHash = 0;
        let mat: Material;
        let bufferID = -1;
        if (renderData && renderData.chunk) {
            if (!renderData.isValid()) return;
            dataHash = renderData.dataHash;
            mat = renderData.material;
            bufferID = renderData.chunk.bufferId;
        }
        comp.stencilStage = StencilManager.sharedManager!.stage;
        const depthStencilStateStage = comp.stencilStage;

        // Determine whether the material macro and the parameters are consistent

        let isMatEqual = true;
        let tmpMatDefine = 0;
        if (comp.outlineOptions.isOutlineEnabled) {
            tmpMatDefine |= 1 << 0;
        }
        if (comp.underlayOptions.isUnderlayEnabled) {
            tmpMatDefine |= 1 << 1;
        }
        if (comp.tmpUniform.enableGlow) {
            tmpMatDefine |= 1 << 2;
        }
        if (render._currMaterial !== mat) {
            if (
                (mat instanceof renderer.MaterialInstance &&
                    render._currMaterial.parent !== mat.parent) ||
                (!(mat instanceof renderer.MaterialInstance) &&
                    render._currMaterial.parent !== mat) ||
                render._currTmpMatDefine !== tmpMatDefine
            ) {
                isMatEqual = false;
            }
            if (isMatEqual) {
                let arr = [
                    "texture0",
                    "texture1",
                    "textu  e2",
                    "texture3",
                    "faceColor",
                    "faceDilate",
                    "faceSoftness",
                    "outlineColor",
                    "outlineThickness",
                    "underlayColor",
                    "underlayOffsetX",
                    "underlayOffsetY",
                    "underlayDilate",
                    "underlaySoftness",
                    "glowColor",
                    "glowOffset",
                    "glowInner",
                    "glowOuter",
                    "glowPower"
                ];
                let renderMat = comp.getRenderMaterial(0);
                for (let i = 0; i < arr.length; i++) {
                    const propName = arr[i];
                    let v1 = renderMat.getProperty(propName);
                    let v2 = render._currMaterial.getProperty(propName);
                    if (
                        v1 instanceof Color &&
                        v2 instanceof Color &&
                        v1.equals(v2)
                    ) {
                        continue;
                    }
                    if (v1 !== v2) {
                        isMatEqual = false;
                        break;
                    }
                }
            }
        }

        if (
            render._currHash !== dataHash ||
            dataHash === 0 ||
            !isMatEqual || //render._currMaterial !== mat
            render._currDepthStencilStateStage !== depthStencilStateStage
        ) {
            // Merge all previous data to a render batch, and update buffer for next render data

            render.autoMergeBatches(render._currComponent!);
            if (renderData && !renderData._isMeshBuffer) {
                render.updateBuffer(renderData.vertexFormat, bufferID);
            }

            // Mark macro definition switch

            render._currTmpMatDefine = tmpMatDefine;

            render._currRenderData = renderData;
            render._currHash = renderData ? renderData.dataHash : 0;
            render._currComponent = comp;
            render._currTransform = transform;
            render._currMaterial = comp.getRenderMaterial(0)!;
            render._currDepthStencilStateStage = depthStencilStateStage;
            render._currLayer = comp.node.layer;
            if (frame) {
                render._currTexture = frame.getGFXTexture();
                render._currSampler = frame.getGFXSampler();
                render._currTextureHash = frame.getHash();
                render._currSamplerHash = render._currSampler.hash;
            } else {
                render._currTexture = null;
                render._currSampler = null;
                render._currTextureHash = 0;
                render._currSamplerHash = 0;
            }
        }

        assembler.fillBuffers(comp, render);
    }

    // Cannot use the base class methods directly because BMFont and CHAR cannot be updated in assambler with just color.

    protected _updateColor() {
        super._updateColor();
        this.markForUpdateRenderData();
    }

    public setEntityColor(color: Color) {
        if (JSB) {
            this._renderEntity.color = color;
        }
    }

    protected _canRender() {
        if (!super._canRender() || !this._string) {
            return false;
        }

        if (!this.fontConfig || this.textures.length <= 0) {
            return false;
        }

        return true;
    }

    protected _flushAssembler() {
        const assembler = TmpAssembler;

        if (this._assembler !== assembler) {
            this.destroyRenderData();
            this._assembler = assembler;
        }

        if (!this._renderData) {
            if (this._assembler && this._assembler.createData) {
                this._renderData = this._assembler.createData(this);
                this._renderData!.material = this.material;
                this._updateColor();
            }
        }
    }

    private _applyFontTexture(): void {
        this.markForUpdateRenderData();
        if (this.textures.length > 0) {
            if (this.renderData) {
                // this.renderData.textureDirty = true;
            }
            this.changeMaterialForDefine();
            if (this._assembler) {
                this._assembler.updateRenderData(this);
            }
        }
    }

    protected changeMaterialForDefine() {
        if (this.textures.length <= 0) {
            return;
        }

        this.updateMaterial();
    }

    protected updateMaterial(): void {
        if (!this._customMaterial) {
            return;
        }
        this.setMaterial(this._customMaterial, 0);

        // Update material parameters

        let material = this.getMaterialInstance(0);
        this._updateTmpMatTexture(material);
        if (!this.tmpUniform || !this.tmpUniform.comp) {
            return;
        }
        this.updateTmpMatFace(material);
        this.updateTmpMatOutline(material);
        this.updateTmpMatUnderlay(material);
        this.updateTmpMatGlow(material);
        this.updateTmpLinearGradient(material);
        this.updateTmpVertexGradient(material);
    }

    private _updateTmpMatTexture(material: renderer.MaterialInstance): void {
        if (!material || this.textures.length <= 0) {
            return;
        }

        material.recompileShaders({
            USE_TEXTURE_LEVEL_1: this.textures.length > 0,
            USE_TEXTURE_LEVEL_2: this.textures.length > 1,
            USE_TEXTURE_LEVEL_3: this.textures.length > 2,
            USE_TEXTURE_LEVEL_4: this.textures.length > 4
        });

        for (let i = 0; i < this.textures.length; i++) {
            material.setProperty(`texture${i}`, this.textures[i]);
        }
    }
    public updateTmpLinearGradient(material: renderer.MaterialInstance): void {
        if (!material) {
            return;
        }

        material.recompileShaders({
            USE_LINEAR_GRADIENT_2:
                this.linearGradientOptions.numberOfColors >= 2 &&
                this.linearGradientOptions.linearColorGradient,
            USE_LINEAR_GRADIENT_3:
                this.linearGradientOptions.numberOfColors >= 3 &&
                this.linearGradientOptions.linearColorGradient,
            USE_LINEAR_GRADIENT_4:
                this.linearGradientOptions.numberOfColors >= 4 &&
                this.linearGradientOptions.linearColorGradient,
            USE_LINEAR_GRADIENT_5:
                this.linearGradientOptions.numberOfColors >= 5 &&
                this.linearGradientOptions.linearColorGradient
        });
        if (this.linearGradientOptions.linearColorGradient) {
            this._updateTmpLinearGradientProps(material);
        }
        this._colorExtraDirty = true;
    }
    private updateTmpVertexGradient(material: renderer.MaterialInstance): void {
        if (!material) {
            return;
        }

        material.recompileShaders({
            USE_VERTEX_GRADIENT: this._vertexColorGradient
        });
    }

    private _updateTmpLinearGradientProps(material: renderer.MaterialInstance) {
        material.setProperty("gradientAngle", this.linearGradientOptions.angle);
        this.linearGradientOptions.items.forEach((e, i) => {
            material.setProperty(
                `gradientColor${i + 1}`,
                this.linearGradientOptions.items[i].color
            );
            material.setProperty(
                `gradientColorRatio${i + 1}`,
                this.linearGradientOptions.items[i].colorRatio
            );
        });
    }
    public updateTmpMatFace(material: renderer.MaterialInstance): void {
        if (!material) {
            return;
        }
        material.setProperty("faceColor", this.tmpUniform.faceColor);
        material.setProperty("faceDilate", this.tmpUniform.faceDilate);
        material.setProperty("faceSoftness", this.tmpUniform.faceSoftness);
    }

    public updateTmpMatOutline(material: renderer.MaterialInstance): void {
        if (!material) {
            return;
        }

        material.recompileShaders({
            USE_OUTLINE: this.outlineOptions.isOutlineEnabled,
            USE_OUTLINE_2:
                this.outlineOptions.numberOfColors >= 2 &&
                this.outlineOptions.isOutlineEnabled,
            USE_OUTLINE_3:
                this.outlineOptions.numberOfColors >= 3 &&
                this.outlineOptions.isOutlineEnabled,
            USE_OUTLINE_4:
                this.outlineOptions.numberOfColors >= 4 &&
                this.outlineOptions.isOutlineEnabled,
            USE_OUTLINE_5:
                this.outlineOptions.numberOfColors >= 5 &&
                this.outlineOptions.isOutlineEnabled
        });

        if (this.outlineOptions.isOutlineEnabled) {
            this._updateTmpOutlineProps(material);
        }
    }
    private _updateTmpOutlineProps(material: renderer.MaterialInstance) {
        material.setProperty(
            "outlineThickness",
            this.outlineOptions.outlineThickness
        );

        this.outlineOptions.colorUnits.forEach((e, i) => {
            material.setProperty(`outlineColor${i + 1}`, e.color);
            material.setProperty(`outlineColorRatio${i + 1}`, e.colorRatio);
        });
    }

    public updateTmpMatUnderlay(material: renderer.MaterialInstance): void {
        if (!material) {
            return;
        }

        material.recompileShaders({
            USE_UNDERLAY: this.underlayOptions.isUnderlayEnabled
                ? this.underlayOptions.numberOfUnderlays
                : 0
        });

        if (this.underlayOptions.isUnderlayEnabled) {
            this.underlayOptions.underlayUnits.forEach((e, i) => {
                material.setProperty(`underlayColor${i + 1}`, e.underlayColor);
                material.setProperty(
                    `underlayOffsetX${i + 1}`,
                    e.underlayOffsetX
                );
                material.setProperty(
                    `underlayOffsetY${i + 1}`,
                    e.underlayOffsetY
                );
                material.setProperty(
                    `underlayDilate${i + 1}`,
                    e.underlayDilate
                );
                material.setProperty(
                    `underlaySoftness${i + 1}`,
                    e.underlaySoftness
                );
            });
        }
    }

    public updateTmpMatGlow(material: renderer.MaterialInstance): void {
        if (!material) {
            return;
        }

        material.recompileShaders({ USE_GLOW: this.tmpUniform.enableGlow });

        if (this.tmpUniform.enableGlow) {
            material.setProperty("glowColor", this.tmpUniform.glowColor);
            material.setProperty("glowOffset", this.tmpUniform.glowOffset);
            material.setProperty("glowInner", this.tmpUniform.glowInner);
            material.setProperty("glowOuter", this.tmpUniform.glowOuter);
            material.setProperty("glowPower", this.tmpUniform.glowPower);
        }
    }

    /**
     * Update render data now
     */
    public forceUpdateRenderData(): void {
        this.updateRenderData(true);
    }

    /**
     * Setting the font, you must call this interface to dynamically set the font.
     */
    public setFont(font: JsonAsset, textures: Texture2D[]): void {
        if (!font || textures.length < 0) {
            error(`params error!`);
            return;
        }

        this._font = font;
        this.textures = textures;
        this._fontConfig = TmpFontConfig.getFontConfig(
            this._font,
            this.textures
        );
        if (!this.enabledInHierarchy) {
            return;
        }
        this.updateRenderData(true);
    }

    //#region Vertex data operation interfaces, these interfaces must be enabled and nodes are activated before they can be used.

    /**
     * Determine whether this character is visible based on the character subscript
     */
    public isVisible(index: number): boolean {
        if (!this.enabledInHierarchy) {
            return false;
        }
        return this._assembler.isVisble(this, index);
    }

    /**
     * Set whether the character is visible according to the character subscript
     */
    public setVisible(index: number, visible: boolean): void {
        if (!this.enabledInHierarchy) {
            return;
        }
        this._assembler.setVisible(this, index, visible);
    }

    /**
     * Get color vertex data according to character subscript, in the order [lower left, lower right, upper left, upper right]
     */
    public getColorExtraVertices(
        index: number
    ): [Color, Color, Color, Color] | null {
        if (!this.enabledInHierarchy) {
            return null;
        }
        return this._assembler.getColorExtraVertices(this, index);
    }

    /**
     * Set the color vertex data according to the character subscript, and it will be mixed with the node color into the final vertex color, in the order of [bottom left, bottom right, top left, top right]
     */
    public setColorExtraVertices(
        index: number,
        data: [Color, Color, Color, Color]
    ): void {
        if (!this.enabledInHierarchy) {
            return;
        }
        this._assembler.setColorExtraVertices(this, index, data);
    }
    g;
    /**
     * Get coordinate vertex data according to character subscript, in the order [lower left, lower right, upper left, upper right]
     */
    public getPosVertices(index: number): [Vec3, Vec3, Vec3, Vec3] | null {
        if (!this.enabledInHierarchy) {
            return null;
        }
        return this._assembler.getPosVertices(this, index);
    }

    /**
     * Set the coordinate vertex data according to the character subscript, in the order of [lower left, lower right, upper left, upper right]
     */
    public setPosVertices(index: number, data: [Vec3, Vec3, Vec3, Vec3]): void {
        if (!this.enabledInHierarchy) {
            return;
        }
        this._assembler.setPosVertices(this, index, data);
    }
    //#endregion
}
