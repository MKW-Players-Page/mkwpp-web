import { Link } from "react-router-dom";

import "./Navbar.css";
import { Pages, resolvePage } from "../pages";
import { I18nContext, LanguageDropdown, TranslationKey } from "../../utils/i18n/i18n";
import { useContext } from "react";

/** Properties of a link element in the navbar */
interface NavbarItem {
  /** The label displayed by the link element */
  label: TranslationKey;
  /** Where the item should navigate to */
  url: string;
  /** Whether the link is external and should be a regular `a` element, or is internal and should
   * use React Router DOM's `Link` element.
   *
   * Omitting this field has the same effect as the value `false`.
   */
  external?: boolean;
}

/** A section within the navbar. It consists of a title or heading, followed by an arbitrary amount
 * of navbar items.
 *
 * If the title is omitted, no heading will be displayed. Only the first section should omit title.
 */
interface NavbarSection {
  title?: TranslationKey;
  items: NavbarItem[];
}

const SECTIONS: NavbarSection[] = [
  {
    items: [
      {
        label: "navbarLabelHome",
        url: resolvePage(Pages.Home),
      },
      {
        label: "navbarLabelRules",
        url: resolvePage(Pages.Rules),
      },
      {
        label: "navbarLabelPlayers",
        url: resolvePage(Pages.PlayerList),
      },
    ],
  },
  {
    title: "navbarTitleCourses",
    items: [
      {
        label: "navbarLabelRecords",
        url: resolvePage(Pages.TrackRecords),
      },
      {
        label: "navbarLabelTop10s",
        url: resolvePage(Pages.TrackTopsHome),
      },
      {
        label: "navbarLabelCharts",
        url: resolvePage(Pages.TrackList),
      },
      {
        label: "navbarLabelStandards",
        url: resolvePage(Pages.Standards),
      },
    ],
  },
  {
    title: "navbarTitlePlayers",
    items: [
      {
        label: "navbarLabelAverageFinish",
        url: resolvePage(Pages.RankingsAverageFinish),
      },
      {
        label: "navbarLabelAverageStandardTitle",
        url: resolvePage(Pages.RankingsAverageStandard),
      },
      {
        label: "navbarLabelAverageRecordRatioTitle",
        url: resolvePage(Pages.RankingsAverageRecordRatio),
      },
      {
        label: "navbarLabelTotalTimeTitle",
        url: resolvePage(Pages.RankingsTotalTime),
      },
      {
        label: "navbarLabelTallyPointsTitle",
        url: resolvePage(Pages.RankingsTallyPoints),
      },
      {
        label: "navbarLabelCountryAverageFinishTitle",
        url: resolvePage(Pages.CountryAF),
      },
    ],
  },
  {
    title: "navbarTitleInteractive",
    items: [
      {
        label: "navbarLabelMatchups",
        url: resolvePage(Pages.MatchupHome),
      },
      {
        label: "navbarLabelContribute",
        url: resolvePage(Pages.Contribute),
      },
    ],
  },
  {
    title: "navbarTitleHistorical",
    items: [
      {
        label: "navbarLabelWRHistory",
        url: "//mkwrs.com/mkwii/",
        external: true,
      },
      {
        label: "navbarLabelNewsArchive",
        url: resolvePage(Pages.BlogList),
      },
    ],
  },
  {
    title: "navbarTitleLinks",
    items: [
      {
        label: "navbarLabelSMKPlayersPage",
        url: "//www.mariokart64.com/smk/",
        external: true,
      },
      {
        label: "navbarLabelMK64PlayersPage",
        url: "//www.mariokart64.com/mk64/",
        external: true,
      },
      {
        label: "navbarLabelMKSCPlayersPage",
        url: "//www.mariokart64.com/mksc/",
        external: true,
      },
      {
        label: "navbarLabelMKDDPlayersPage",
        url: "//www.mariokart64.com/mkdd/",
        external: true,
      },
      {
        label: "navbarLabelMKDSPlayersPage",
        url: "//www.mariokart64.com/mkds/",
        external: true,
      },
      {
        label: "navbarLabelMK7PlayersPage",
        url: "//www.mariokart64.com/mk7/",
        external: true,
      },
      {
        label: "navbarLabelMK8PlayersPage",
        url: "//www.mariokart64.com/mk8/",
        external: true,
      },
      {
        label: "navbarLabelCombinedRanks",
        url: "//www.mariokart64.com/combinedranks/",
        external: true,
      },
      {
        label: "navbarLabelForums",
        url: "//www.mariokart64.com/yabb",
        external: true,
      },
      {
        label: "navbarLabelDiscord",
        url: "//discord.gg/GTTFmVdfRN",
        external: true,
      },
      {
        label: "navbarLabelGithub",
        url: "//github.com/MKW-Players-Page",
        external: true,
      },
    ],
  },
];

const Navbar = () => {
  const { translations, lang } = useContext(I18nContext);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <LanguageDropdown />
        {SECTIONS.map((section) => (
          <section key={section.title ?? "Default"}>
            {section.title && <h5>{translations[section.title][lang]}</h5>}
            <ul>
              {section.items.map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <a href={item.url} rel="noopener noreferrer">
                      {translations[item.label][lang]}
                    </a>
                  ) : (
                    <Link to={item.url}>{translations[item.label][lang]}</Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
