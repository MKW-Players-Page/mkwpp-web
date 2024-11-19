import { useContext } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../../hooks";
import { handleBars, I18nContext } from "../../utils/i18n/i18n";
import Deferred from "./Deferred";
import "./DiscordEmbed.css";

/* One day we could decouple from the default widget with a custom bot, so that we could show different and more useful data */
interface DiscordWidgetResponse {
  id: string;
  name: string;
  instant_invite: string;
  channels: Array<any>; // Always empty because the channels are locked for @everyone
  members: Array<{
    id: string;
    username: string;
    discriminator: "0000";
    avatar: null;
    status: "online" | "dnd";
    avatar_url: string;
  }>;
  presence_count: number;
}

export interface DiscordEmbedProps {
  style?: React.CSSProperties;
}

const DiscordEmbed = ({ style }: DiscordEmbedProps) => {
  const UsersToShow = 10;
  const { translations, lang } = useContext(I18nContext);

  const { isLoading, data } = useApi(
    () =>
      fetch("https://discord.com/api/guilds/956549843348783114/widget.json")
        .then((r) => r.json())
        .then((r) => r as DiscordWidgetResponse),
    [],
    "discord",
  );

  const onlineMembers = data?.members.filter(
    (r) => !r.username.includes("...") && r.status === "online",
  );

  return (
    <div className="module discord" style={style}>
      <Deferred isWaiting={isLoading}>
        <table>
          <thead>
            <tr>
              <th colSpan={2}>
                <span>{translations.discordEmbedParagraph[lang]}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {onlineMembers
              ?.map((user) => ({ user, sort: Math.random() }))
              .sort((a, b) => a.sort - b.sort)
              .slice(-UsersToShow)
              .map(({ user }) => (
                <tr key={user.username}>
                  <td colSpan={2}>
                    <span>
                      <img alt="pfp" src={user.avatar_url} />
                    </span>
                    <span>{user.username}</span>
                  </td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr>
              <th>
                <span>
                  {handleBars(translations.discordEmbedOnlineUsers[lang], [
                    ["nbsp", <>&nbsp;</>],
                    ["number", (data?.presence_count ?? 0).toString()],
                  ])}
                </span>
              </th>
              <th>
                <Link className="submit-style" target="_blank" to="//discord.gg/GTTFmVdfRN">
                  {translations.discordEmbedLinktext[lang]}
                </Link>
              </th>
            </tr>
          </tfoot>
        </table>
      </Deferred>
    </div>
  );
};

export default DiscordEmbed;
