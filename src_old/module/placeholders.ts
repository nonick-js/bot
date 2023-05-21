import { Guild, User } from 'discord.js';
import { PlaceHolder } from './format';

export const joinAndLeaveMessagePlaceHolder = new PlaceHolder<{ guild: Guild, user: User }>()
  .register('serverName', ({ guild }) => guild?.name)
  .register('memberCount', ({ guild }) => guild?.memberCount)
  .register('user', ({ user }) => `${user}`)
  .register('userName', ({ user }) => user?.username)
  .register('userTag', ({ user }) => user?.tag);