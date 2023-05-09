import { GuildMember, User, UserFlagsString, bold, formatEmoji, inlineCode, Channel, GuildBasedChannel, time, TimestampStylesString } from 'discord.js';

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

	export const Flags: {
		User: Partial<Record<UserFlagsString, string>>
	} = {
		User: {
			Staff: '966753508739121222',
			Partner: '966753508860768357',
			CertifiedModerator: '959536411894243378',
			Hypesquad: '966753508961439745',
			HypeSquadOnlineHouse1: '966753508843978872',
			HypeSquadOnlineHouse2: '966753508927889479',
			HypeSquadOnlineHouse3: '966753508776890459',
			BugHunterLevel1: '966753508848205925',
			BugHunterLevel2: '966753508755898410',
			ActiveDeveloper: '1040345950318768218',
			VerifiedDeveloper: '966753508705583174',
			PremiumEarlySupporter: '966753508751736892',
		},
	};
}

export namespace Fields {
	type FieldOption = { text: string };
	type FieldsColorOption<
		T extends
		| keyof typeof Emojis.White
		| keyof typeof Emojis.Gray
		| keyof typeof Emojis.Blurple,
		C extends 'White' | 'Gray' | 'Blurple' =
		| (T extends keyof typeof Emojis.White ? 'White' : never)
		| (T extends keyof typeof Emojis.Gray ? 'Gray' : never)
		| (T extends keyof typeof Emojis.Blurple ? 'Blurple' : never)
	> = { color: C } & FieldOption;

	export function id(idResolve: { id: string }, options: FieldOption = { text: 'ID' }) {
		return `${formatEmoji(Emojis.White.id)} ${options.text}: ${inlineCode(idResolve.id)}`;
	}

	export function nickName(member: GuildMember, options: FieldOption = { text: 'ニックネーム' }) {
		return `${formatEmoji(Emojis.White.nickName)} ${options.text} ${bold(member.nickname ?? 'なし')}`;
	}

	export function memberId(member: User | GuildMember | null | undefined | string, options?: Partial<FieldsColorOption<'member'>>) {
		const option: FieldsColorOption<'member'> = { text: 'メンバー', color: 'Gray', ...options };
		return [
			`${formatEmoji(Emojis[option.color].member)} **${option.text}:**`,
			member && typeof member !== 'string' ? `${member} [${inlineCode(member?.id)}]` : member ?? '不明',
		].join(' ');
	}
	export function memberTag(member: User | GuildMember | null | undefined | string, options?: Partial<FieldsColorOption<'member'>>) {
		const option: FieldsColorOption<'member'> = { text: 'メンバー', color: 'Gray', ...options };
		const user = member instanceof User ? member : member instanceof GuildMember ? member?.user : null;
		return [
			`${formatEmoji(Emojis[option.color].member)} **${option.text}:**`,
			user && typeof member !== 'string' ? `${member} [${inlineCode(user?.tag)}]` : member ?? '不明',
		].join(' ');
	}

	export function channelName(channel: GuildBasedChannel | null | undefined | string, options?: Partial<FieldsColorOption<'channel'>>) {
		const option: FieldsColorOption<'channel'> = { text: 'チャンネル', color: 'Gray', ...options };
		return [
			`${formatEmoji(Emojis[option.color].channel)} **${option.text}:**`,
			channel && typeof channel !== 'string' ? `${channel} [${inlineCode(channel.name)}]` : channel ?? '不明',
		].join(' ');
	}
	export function channelId(channel: Channel | null | undefined | string, options?: Partial<FieldsColorOption<'channel'>>) {
		const option: FieldsColorOption<'channel'> = { text: 'チャンネル', color: 'Gray', ...options };
		return [
			`${formatEmoji(Emojis[option.color].channel)} **${option.text}:**`,
			channel && typeof channel !== 'string' ? `${channel} [${inlineCode(channel.id)}]` : channel ?? '不明',
		].join(' ');
	}

	export function schedule(date: Date | number | null, options?: Partial<{ flag: TimestampStylesString } & FieldsColorOption<'schedule'>>) {
		const option: { flag: TimestampStylesString } & FieldsColorOption<'schedule'> = { text: '時間', color: 'Gray', flag: 'f', ...options };
		return `${formatEmoji(Emojis[option.color].schedule)} **${option.text}:** ${time(new Date(date ?? 0), option.flag)}`;
	}

	export function multiLine(...lines: unknown[]) {
		return lines.filter(v => v != null).join('\n');
	}
}

export namespace RegEx {
	export const Emoji = /\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu;
}