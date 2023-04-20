import { Canvas, createCanvas, GlobalFonts, SKRSContext2D } from '@napi-rs/canvas';

export class Captcha {
	private _canvas: Canvas;
	private _width: number;
	private _height: number;
	private _ctx: SKRSContext2D;
	private _option: CaptchaOption;
	private _coord: [[number, number]];
	private _text: string;
	constructor(w = 300, h = 100, option: CaptchaOption = {}) {
		this._width = w;
		this._height = h;
		this._option = option;

		if (option.font instanceof Buffer) {
			GlobalFonts.register(option.font, 'Captcha');
			this._option.font = 'Captcha';
		}
		else { this._option.font = option.font ?? 'Sans'; }
		this._option.color = option.color ?? '#32cf7e';
		this._option.chars = option.chars ?? 6;

		this._text = getRandomText(this._option.chars);
		this._coord = this.getRandomCoord(this._option.chars);

		this._canvas = createCanvas(w, h);
		this._ctx = this._canvas.getContext('2d');
		this._ctx.lineJoin = 'miter';
		this._ctx.textBaseline = 'middle';
		this._ctx.textAlign = 'center';
		this._ctx.globalAlpha = 1;
	}

	drawDecoy(option?: drawDecoyOption) {
		const opt = {
			...this._option,
			color: '#646566',
			size: 20,
			opacity: 0.8,
			amount: Math.floor(this._width * this._height / 5000),
			...option,
		};
		const decoyText = getRandomText(opt.amount);
		this._ctx.font = `${opt.size}px ${opt.font}`;
		this._ctx.globalAlpha = opt.opacity;
		this._ctx.fillStyle = opt.color;
		for (const char of decoyText) { this._ctx.fillText(char, getRandom(30, this._width - 30), getRandom(30, this._height - 30)); }
	}

	drawLine(option: drawLineOption = {}) {
		const opt = {
			...this._option,
			color: this._option.color ?? '#32cf7e',
			opacity: 1,
			blur: 5,
			...option,
		};
		this._ctx.strokeStyle = opt.color;
		this._ctx.globalAlpha = opt.opacity;
		this._ctx.beginPath();
		this._ctx.moveTo(this._coord[0][0], this._coord[0][1] + getRandom(-opt.blur, opt.blur));
		for (let i = 1; i < this._coord.length; i++) { this._ctx.lineTo(this._coord[i][0], this._coord[i][1] + getRandom(-opt.blur, opt.blur)); }
		this._ctx.stroke();
		this._ctx.closePath();
	}

	drawText(option: drawTextOption = {}) {
		const opt = {
			...this._option,
			color: this._option.color ?? '#32cf7e',
			opacity: 0.8,
			skew: true,
			size: 40,
			rotate: 5,
			...option,
		};
		this._ctx.fillStyle = opt.color;
		this._ctx.globalAlpha = opt.opacity;
		this._ctx.font = `${opt.size}px ${opt.font}`;
		for (let i = 0; i < this._coord.length; i++) {
			this._ctx.save();
			this._ctx.translate(...this._coord[i]);
			if (opt.skew) this._ctx.transform(1, Math.random(), getRandom(20) / 100, 1, 0, 0);
			if (opt.rotate) this._ctx.rotate(getRandom(-opt.rotate, opt.rotate) * Math.PI / 100);
			this._ctx.fillText(this._text[i], 0, 0);
			this._ctx.restore();
		}
		return this;
	}

	get text() {
		return this._text;
	}

	toBuffer() {
		return this._canvas.toBuffer('image/jpeg');
	}

	private getRandomCoord(chars: number) {
		const coords: number[][] = [];
		const gap = Math.floor(this._width / chars);
		for (let i = 0; i < chars; i++) { coords.push([15 + gap * (i + 0.2), getRandom(30, this._height - 30)]); }
		return coords.sort(([a], [b]) => a - b) as [[number, number]];
	}

	static create(option: CaptchaOption & { w?: number, h?: number } = {}, decoy: drawDecoyOption = {}, line: drawLineOption & { amount?: number } = {}, text: drawTextOption = {}) {
		const captcha = new Captcha(option.w ?? 300, option.h ?? 100, option);
		captcha.drawDecoy(decoy);
		for (let i = 0; i < (line.amount ?? 1); i++) captcha.drawLine(line);
		captcha.drawText(text);

		return { image: captcha.toBuffer(), text: captcha.text };
	}
}

interface CaptchaOption {
	font?: Buffer | string;
	chars?: number;
	size?: number;
	color?: string;
}

interface drawDecoyOption {
	color?: string;
	font?: string;
	size?: number;
	opacity?: number;
	amount?: number;
}

interface drawTextOption {
	color?: string;
	size?: number;
	font?: string
	skew?: boolean;
	rotate?: number
	opacity?: number;
}

interface drawLineOption {
	blur?: number;
	color?: string;
	opacity?: number;
}

function getRandom(start = 0, end = 0): number {
	return Math.round(Math.random() * Math.abs(end - start)) + Math.min(start, end);
}

function getRandomText(length: number) {
	return new Int8Array(length).map(() => Math.min(Math.floor(Math.random() * 26) + 65, 90)).reduce((p, c) => p + String.fromCharCode(c), '');
}