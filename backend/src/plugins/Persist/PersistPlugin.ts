import { PluginOptions } from "knub";
import { GuildLogs } from "../../data/GuildLogs";
import { GuildPersistedData } from "../../data/GuildPersistedData";
import { trimPluginDescription } from "../../utils";
import { GuildMemberCachePlugin } from "../GuildMemberCache/GuildMemberCachePlugin";
import { LogsPlugin } from "../Logs/LogsPlugin";
import { RoleManagerPlugin } from "../RoleManager/RoleManagerPlugin";
import { zeppelinGuildPlugin } from "../ZeppelinPluginBlueprint";
import { LoadDataEvt } from "./events/LoadDataEvt";
import { StoreDataEvt } from "./events/StoreDataEvt";
import { PersistPluginType, zPersistConfig } from "./types";

const defaultOptions: PluginOptions<PersistPluginType> = {
  config: {
    persisted_roles: [],
    persist_nicknames: false,
    persist_voice_mutes: false,
  },
};

export const PersistPlugin = zeppelinGuildPlugin<PersistPluginType>()({
  name: "persist",
  showInDocs: true,
  info: {
    prettyName: "Persist",
    description: trimPluginDescription(`
      Re-apply roles or nicknames for users when they rejoin the server.
      Mute roles are re-applied automatically, this plugin is not required for that.
    `),
    configSchema: zPersistConfig,
  },

  dependencies: () => [LogsPlugin, RoleManagerPlugin, GuildMemberCachePlugin],
  configParser: (input) => zPersistConfig.parse(input),
  defaultOptions,

  // prettier-ignore
  events: [
    StoreDataEvt,
    LoadDataEvt,
  ],

  beforeLoad(pluginData) {
    const { state, guild } = pluginData;

    state.persistedData = GuildPersistedData.getGuildInstance(guild.id);
    state.logs = new GuildLogs(guild.id);
  },
});
