import z from "zod";
import { zBoundedCharacters } from "../../../utils";
import { CountersPlugin } from "../../Counters/CountersPlugin";
import { LogsPlugin } from "../../Logs/LogsPlugin";
import { automodAction } from "../helpers";

export const SetCounterAction = automodAction({
  configSchema: z.strictObject({
    counter: zBoundedCharacters(0, 100),
    value: z.number(),
  }),

  async apply({ pluginData, contexts, actionConfig, ruleName }) {
    const countersPlugin = pluginData.getPlugin(CountersPlugin);
    if (!countersPlugin.counterExists(actionConfig.counter)) {
      pluginData.getPlugin(LogsPlugin).logBotAlert({
        body: `Unknown counter \`${actionConfig.counter}\` in \`set_counter\` action of Automod rule \`${ruleName}\``,
      });
      return;
    }

    countersPlugin.setCounterValue(
      actionConfig.counter,
      contexts[0].message?.channel_id || null,
      contexts[0].user?.id || null,
      actionConfig.value,
    );
  },
});
