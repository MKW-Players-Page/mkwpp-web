import { Link } from "react-router-dom";

import "./Navbar.css";
import { Pages, resolvePage } from "../pages";

/** Properties of a link element in the navbar */
interface NavbarItem {
  /** The label displayed by the link element */
  label: string;
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
  title?: string;
  items: NavbarItem[];
}

const SECTIONS: NavbarSection[] = [
  {
    items: [
      {
        label: "Home",
        url: resolvePage(Pages.Home),
      },
      {
        label: "Rules",
        url: resolvePage(Pages.Rules),
      },
      {
        label: "Players",
        url: resolvePage(Pages.PlayerList),
      },
    ],
  },
  {
    title: "Courses",
    items: [
      {
        label: "Records",
        url: resolvePage(Pages.TrackRecords),
      },
      {
        label: "Top 10s",
        url: resolvePage(Pages.TrackTopsHome),
      },
      {
        label: "Charts",
        url: resolvePage(Pages.TrackList),
      },
      {
        label: "Standards",
        url: resolvePage(Pages.Standards),
      },
    ],
  },
  {
    title: "Players",
    items: [
      {
        label: "Average Finish",
        url: resolvePage(Pages.RankingsAverageFinish),
      },
      {
        label: "ARR",
        url: resolvePage(Pages.RankingsAverageStandard),
      },
      {
        label: "PR:WR",
        url: resolvePage(Pages.RankingsAverageRecordRatio),
      },
      {
        label: "Total Times",
        url: resolvePage(Pages.RankingsTotalTime),
      },
      {
        label: "Tally Points",
        url: resolvePage(Pages.RankingsTallyPoints),
      },
      {
        label: "Country AF",
        url: resolvePage(Pages.CountryAF),
      },
    ],
  },
  {
    title: "Historical",
    items: [
      {
        label: "WR History",
        url: "//mkwrs.com/mkwii/",
        external: true,
      },
      {
        label: "News Archive",
        url: resolvePage(Pages.BlogList),
      },
    ],
  },
  {
    title: "Links",
    items: [
      {
        label: "SMK Players' Page",
        url: "//www.mariokart64.com/smk/",
        external: true,
      },
      {
        label: "MK64 Players' Page",
        url: "//www.mariokart64.com/mk64/",
        external: true,
      },
      {
        label: "MKSC Players' Page",
        url: "//www.mariokart64.com/mksc/",
        external: true,
      },
      {
        label: "MKDD Players' Page",
        url: "//www.mariokart64.com/mkdd/",
        external: true,
      },
      {
        label: "MKDS Players' Page",
        url: "//www.mariokart64.com/mkds/",
        external: true,
      },
      {
        label: "MK7 Players' Page",
        url: "//www.mariokart64.com/mk7/",
        external: true,
      },
      {
        label: "MK8 Players' Page",
        url: "//www.mariokart64.com/mk8/",
        external: true,
      },
      {
        label: "Combined Ranks",
        url: "//www.mariokart64.com/combinedranks/",
        external: true,
      },
      {
        label: "Forums",
        url: "//www.mariokart64.com/yabb",
        external: true,
      },
    ],
  },
];

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        {SECTIONS.map((section) => (
          <section key={section.title || "Default"}>
            {section.title && <h5>{section.title}</h5>}
            <ul>
              {section.items.map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <a href={item.url} rel="noopener noreferrer">
                      {item.label}
                    </a>
                  ) : (
                    <Link to={item.url}>{item.label}</Link>
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
