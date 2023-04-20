export namespace Emojis {
	export const White = {
		addMark: '988439798324817930',
		boost: '896591259886567434',
		channel: '966588719635267624',
		id: '1005688192818761748',
		message: '966596708458983484',
		moderator: '969148338597412884',
		nickName: '1005688190931320922',
		pencil: '988439788132646954',
		removeMark: '989089271275204608',
		role2: '1053347359695835146',
		role: '966719258430160986',
		schedule: '1014603109001085019',
		timeOut: '1016740772340576306',
		image: '1018167020824576132',
		download: '1018760839743950909',
		link: '1065688873281265674',
		reply: '971069195343249458',
		addLink: '1066923392172818502',
		addSelectRole: '1066923389245202453',
		addButtonRole: '1066923387563290784',
		setting: '966588719635263539',
		home: '971389898076598322',
	} as const;

	export const Gray = {
		member: '1064889710843002991',
		text: '1064889722796773376',
		link: '1064889715863601192',
		edit: '1064889719680401460',
		channel: '1064889714139746304',
		schedule: '966773928620064841',
	} as const;

	export const Blurple = {
		member: '1064891793642098708',
		text: '1064891791385571359',
		admin: '1064924738960490546',
	} as const;

	export const space = '1064892783804043344';
}

export namespace RegEx {
	export const Emoji = /\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu;
}