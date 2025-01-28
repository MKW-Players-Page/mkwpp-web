import { useContext } from "react";
import { handleBars, I18nContext, translate } from "../../utils/i18n/i18n";
import ScrollListItem from "../widgets/ScrollListItem";
import parse from "html-react-parser";

interface TrackCategoryProps {
  trackName: string;
  children: JSX.Element[];
}

const TrackCategory = ({ trackName, children }: TrackCategoryProps) => {
  // This element should have 3 children
  // The index of these in an array is the same numerical value as the category it's referring to
  // If you want to skip a category, leave it out as a Fragment `<></>`
  const { lang } = useContext(I18nContext);

  return (
    <li>
      <p>{trackName}</p>
      <ol>
        {typeof children[0].type !== "symbol" ? (
          <li>
            <p>{translate("constantCategoryNameNoSCLong", lang)}</p>
            {children[0] ?? <></>}
          </li>
        ) : (
          <></>
        )}
        {typeof children[1].type !== "symbol" ? (
          <li>
            <p>{translate("constantCategoryNameSCLong", lang)}</p>
            {children[1] ?? <></>}
          </li>
        ) : (
          <></>
        )}
        {typeof children[2].type !== "symbol" ? (
          <li>
            <p>{translate("constantCategoryNameUnresLong", lang)}</p>
            {children[2] ?? <></>}
          </li>
        ) : (
          <></>
        )}
      </ol>
    </li>
  );
};

interface LnkProps {
  url: string;
  children: string;
}

const Lnk = ({ url, children }: LnkProps) => {
  return (
    <a className="underlined" target="_blank" rel="noreferrer" href={url}>
      {children}
    </a>
  );
};

const RulesPage = () => {
  const { lang } = useContext(I18nContext);

  return (
    <>
      <h1>{translate("rulesPageHeading", lang)}</h1>
      <section className="module">
        <div className="module-content">
          <p>{translate("rulesPageShortDesc", lang)}</p>
          <p>{translate("rulesPageTableOfContentsHeading", lang)}</p>
          <ul style={{ listStyle: "square" }}>
            <ScrollListItem scrollToId="basic">
              {translate("rulesPageScrollListItemBasic", lang)}
            </ScrollListItem>
            <ScrollListItem scrollToId="platforms">
              {translate("rulesPageScrollListItemPlatforms", lang)}
            </ScrollListItem>
            <ScrollListItem scrollToId="categories">
              {translate("rulesPageScrollListItemCategories", lang)}
            </ScrollListItem>
            <ScrollListItem scrollToId="trackcategories">
              {translate("rulesPageScrollListItemTrackCategories", lang)}
            </ScrollListItem>
          </ul>
        </div>
      </section>
      <section className="module">
        <div id="basic" className="module-content">
          <h1>{translate("rulesPageHeadingBasicSiteRules", lang)}</h1>
          <p>{translate("rulesPageBasicSiteRulesParagraph1", lang)}</p>
          <p>{translate("rulesPageBasicSiteRulesParagraph2", lang)}</p>
          <p>{translate("rulesPageBasicSiteRulesParagraph3", lang)}</p>
          <p>{translate("rulesPageBasicSiteRulesParagraph4", lang)}</p>
          <p>{translate("rulesPageBasicSiteRulesParagraph5", lang)}</p>
        </div>
      </section>
      <section className="module">
        <div id="platforms" className="module-content">
          <h1>{translate("rulesPageHeadingAllowedPlatforms", lang)}</h1>
          <p>{translate("rulesPageAllowedPlatformsParagraph1", lang)}</p>
          <p>{translate("rulesPageAllowedPlatformsParagraph2", lang)}</p>
        </div>
      </section>
      <section className="module">
        <div id="categories" className="module-content">
          <h1>{translate("rulesPageHeadingCategoryRules", lang)}</h1>
          <p>{translate("rulesPageCategoryRulesParagraph1", lang)}</p>
          <ol>
            <li>
              <p>{parse(translate("rulesPageCategoryRulesParagraph2", lang))}</p>
              <ol style={{ listStyleType: "lower-alpha" }}>
                <li>
                  <p>{translate("rulesPageCategoryRulesParagraph3", lang)}</p>
                  <ol style={{ listStyleType: "lower-roman" }}>
                    <li>{translate("rulesPageCategoryRulesParagraph4", lang)}</li>
                    <li>
                      <p>{translate("rulesPageCategoryRulesParagraph5", lang)}</p>
                      <ol>
                        <li>{translate("rulesPageCategoryRulesParagraph6", lang)}</li>
                        <li>{translate("rulesPageCategoryRulesParagraph7", lang)}</li>
                      </ol>
                    </li>
                    <li>{translate("rulesPageCategoryRulesParagraph8", lang)}</li>
                    <li>
                      <p>{translate("rulesPageCategoryRulesParagraph9", lang)}</p>
                      <ol>
                        <li>{translate("rulesPageCategoryRulesParagraph10", lang)}</li>
                        <li>{translate("rulesPageCategoryRulesParagraph11", lang)}</li>
                        <li>{translate("rulesPageCategoryRulesParagraph12", lang)}</li>
                        <li>{translate("rulesPageCategoryRulesParagraph13", lang)}</li>
                      </ol>
                    </li>
                    <li>{translate("rulesPageCategoryRulesParagraph14", lang)}</li>
                    <li>{translate("rulesPageCategoryRulesParagraph15", lang)}</li>
                    <li>{translate("rulesPageCategoryRulesParagraph16", lang)}</li>
                    <li>
                      <p>{translate("rulesPageCategoryRulesParagraph17", lang)}</p>
                      <ol>
                        <li>{translate("rulesPageCategoryRulesParagraph18", lang)}</li>
                        <li>{translate("rulesPageCategoryRulesParagraph19", lang)}</li>
                      </ol>
                    </li>
                    <li>
                      <p>{translate("rulesPageCategoryRulesParagraph20", lang)}</p>
                      <ol>
                        <li>{translate("rulesPageCategoryRulesParagraph21", lang)}</li>
                        <li>{translate("rulesPageCategoryRulesParagraph22", lang)}</li>
                        <li>{translate("rulesPageCategoryRulesParagraph23", lang)}</li>
                      </ol>
                    </li>
                  </ol>
                </li>
                <li>
                  <p>{translate("rulesPageCategoryRulesParagraph24", lang)}</p>
                  <ol style={{ listStyleType: "lower-roman" }}>
                    <li>{translate("rulesPageCategoryRulesParagraph25", lang)}</li>
                    <li>{translate("rulesPageCategoryRulesParagraph26", lang)}</li>
                    <li>{translate("rulesPageCategoryRulesParagraph27", lang)}</li>
                    <li>{translate("rulesPageCategoryRulesParagraph28", lang)}</li>
                    <li>{translate("rulesPageCategoryRulesParagraph29", lang)}</li>
                    <li>{translate("rulesPageCategoryRulesParagraph30", lang)}</li>
                    <li>{translate("rulesPageCategoryRulesParagraph31", lang)}</li>
                    <li>{translate("rulesPageCategoryRulesParagraph32", lang)}</li>
                  </ol>
                </li>
              </ol>
            </li>
            <li>{translate("rulesPageCategoryRulesParagraph33", lang)}</li>
            <li>{translate("rulesPageCategoryRulesParagraph34", lang)}</li>
          </ol>
        </div>
      </section>
      <section className="module">
        <div id="trackcategories" className="module-content">
          <h1>Categories Per Track</h1>
          <ul>
            <TrackCategory trackName={translate("constantTrackNameLC", lang)}>
              <p>{translate("rulesPageTrackCategoriesLCNoSC", lang)}</p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameMMM", lang)}>
              <p>{translate("rulesPageTrackCategoriesMMMNoSC", lang)}</p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameMG", lang)}>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesMGNoSC", lang), [
                  [
                    "rulesPageTrackCategoriesMGNoSCGapJumpLinkText",
                    <Lnk url="//youtu.be/8-0Xetey5xY?t=43">
                      {translate("rulesPageTrackCategoriesMGNoSCGapJumpLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesMGSC", lang), [
                  [
                    "rulesPageTrackCategoriesMGSCWallRide1LinkText",
                    <Lnk url="//youtu.be/MtM9svSJG_A?t=21">
                      {translate("rulesPageTrackCategoriesMGSCWallRide1LinkText", lang)}
                    </Lnk>,
                  ],
                  [
                    "rulesPageTrackCategoriesMGSCWallRide2LinkText",
                    <Lnk url="//youtu.be/MtM9svSJG_A?t=44">
                      {translate("rulesPageTrackCategoriesMGSCWallRide2LinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesMGUnres", lang), [
                  [
                    "rulesPageTrackCategoriesMGUnresWallRideLinkText",
                    <Lnk url="//youtu.be/y5V_s3dMJ4k">
                      {translate("rulesPageTrackCategoriesMGUnresWallRideLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameTF", lang)}>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesTFNoSC", lang), [
                  [
                    "rulesPageTrackCategoriesTFNoSCLakeCutLinkText",
                    <Lnk url="//youtu.be/mqQa_1Cq1bw?t=38">
                      {translate("rulesPageTrackCategoriesTFNoSCLakeCutLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesTFSC", lang), [
                  [
                    "rulesPageTrackCategoriesTFSCBoxClipLinkText",
                    <Lnk url="//youtu.be/IapJ1CS0Eas?t=22">
                      {translate("rulesPageTrackCategoriesTFSCBoxClipLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameMC", lang)}>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesMCNoSC", lang), [
                  [
                    "rulesPageTrackCategoriesMCNoSCKingAlexRampLinkText",
                    <Lnk url="//youtu.be/kG8PvG8K1ZA?t=22">
                      {translate("rulesPageTrackCategoriesMCNoSCKingAlexRampLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesMCUnres", lang), [
                  [
                    "rulesPageTrackCategoriesMCUnresWallclipLinkText",
                    <Lnk url="//youtu.be/CoOLNaRK5dc">
                      {translate("rulesPageTrackCategoriesMCUnresWallclipLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameCM", lang)}>
              <></>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesCMSC", lang), [
                  [
                    "rulesPageTrackCategoriesCMSC1LinkText",
                    <Lnk url="//youtu.be/I_DTmlAWWdA">
                      {translate("rulesPageTrackCategoriesCMSC1LinkText", lang)}
                    </Lnk>,
                  ],
                  [
                    "rulesPageTrackCategoriesCMSC2LinkText",
                    <Lnk url="//youtu.be/xcheyzld7-s?t=7">
                      {translate("rulesPageTrackCategoriesCMSC2LinkText", lang)}
                    </Lnk>,
                  ],
                  [
                    "rulesPageTrackCategoriesCMSC3LinkText",
                    <Lnk url="//youtu.be/Jf-HC1Z_1FE?t=17">
                      {translate("rulesPageTrackCategoriesCMSC3LinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesCMUnres", lang), [
                  [
                    "rulesPageTrackCategoriesCMUnresParkingLotLinkText",
                    <Lnk url="//youtu.be/HwPwQ7Q">
                      {translate("rulesPageTrackCategoriesCMUnresParkingLotLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameDKSC", lang)}>
              <p>{translate("rulesPageTrackCategoriesDKSCNoSC", lang)}</p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameWGM", lang)}>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesWGMNoSC", lang), [
                  [
                    "rulesPageTrackCategoriesWGMNoSCMickeyMouseLinkText",
                    <Lnk url="//youtu.be/NbhzA2rtZ2A?t=20">
                      {translate("rulesPageTrackCategoriesWGMNoSCMickeyMouseLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesWGMSC", lang), [
                  [
                    "rulesPageTrackCategoriesWGMSCTurnskipLinkText",
                    <Lnk url="//youtu.be/WetnmZeZTEg?t=39">
                      {translate("rulesPageTrackCategoriesWGMSCTurnskipLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesWGMUnres", lang), [
                  [
                    "rulesPageTrackCategoriesWGMUnresPipebounceLinkText",
                    <Lnk url="//youtu.be/VVFXP639DRY?t=18">
                      {translate("rulesPageTrackCategoriesWGMUnresPipebounceLinkText", lang)}
                    </Lnk>,
                  ],
                  [
                    "rulesPageTrackCategoriesWGMUnresRespawnLinkText",
                    <Lnk url="//youtu.be/RlGsAQ-FE1Q?t=9">
                      {translate("rulesPageTrackCategoriesWGMUnresRespawnLinkText", lang)}
                    </Lnk>,
                  ],
                  [
                    "rulesPageTrackCategoriesWGMUnresShroomlessLinkText",
                    <Lnk url="//youtu.be/XhyLw2lW2kE?t=29">
                      {translate("rulesPageTrackCategoriesWGMUnresShroomlessLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameDC", lang)}>
              <p>{translate("rulesPageTrackCategoriesDCNoSC", lang)}</p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameKC", lang)}>
              <></>
              <></>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesKCUnres", lang), [
                  [
                    "rulesPageTrackCategoriesKCUnresLinkText",
                    <Lnk url="//youtu.be/Elb5K7woV20?t=63">
                      {translate("rulesPageTrackCategoriesKCUnresLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameMT", lang)}>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesMTNoSC", lang), [
                  [
                    "rulesPageTrackCategoriesMTNoSCTurnskipLinkText",
                    <Lnk url="//youtu.be/igcHE0-OV0g?t=33">
                      {translate("rulesPageTrackCategoriesMTNoSCTurnskipLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesMTUnres", lang), [
                  [
                    "rulesPageTrackCategoriesMTUnresLinkText",
                    <Lnk url="//youtu.be/1e3WoYHDw2Y?t=14">
                      {translate("rulesPageTrackCategoriesMTUnresLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameGV", lang)}>
              <p>{translate("rulesPageTrackCategoriesGVNoSC", lang)}</p>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesGVSC", lang), [
                  [
                    "rulesPageTrackCategoriesGVSCRockhopLinkText",
                    <Lnk url="//youtu.be/J55Fo2ZMz9M?t=33">
                      {translate("rulesPageTrackCategoriesGVSCRockhopLinkText", lang)}
                    </Lnk>,
                  ],
                  [
                    "rulesPageTrackCategoriesGVSCRockhopRespawnLinkText",
                    <Lnk url="//youtu.be/xeIoXyUsXzw?t=106">
                      {translate("rulesPageTrackCategoriesGVSCRockhopRespawnLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesGVUnres", lang), [
                  [
                    "rulesPageTrackCategoriesGVUnresLinkText",
                    <Lnk url="//youtu.be/bB0oUzdCHTA?t=12">
                      {translate("rulesPageTrackCategoriesGVUnresLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameDDR", lang)}>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesDDRNoSC", lang), [
                  [
                    "rulesPageTrackCategoriesDDRNoSCUltraLinkText",
                    <Lnk url="//youtu.be/nVcVbd4n3yM?t=84">
                      {translate("rulesPageTrackCategoriesDDRNoSCUltraLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameMH", lang)}>
              <p>{translate("rulesPageTrackCategoriesMHNoSC", lang)}</p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameBC", lang)}>
              <></>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesBCSC", lang), [
                  [
                    "rulesPageTrackCategoriesBCSCSpiralSkipLinkText",
                    <Lnk url="//youtu.be/Htt2CRmktvg?t=32">
                      {translate("rulesPageTrackCategoriesBCSCSpiralSkipLinkText", lang)}
                    </Lnk>,
                  ],
                  [
                    "rulesPageTrackCategoriesBCSCRampCutLinkText",
                    <Lnk url="//youtu.be/Htt2CRmktvg?t=37">
                      {translate("rulesPageTrackCategoriesBCSCRampCutLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameRR", lang)}>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesRRNoSC", lang), [
                  [
                    "rulesPageTrackCategoriesRRNoSCMoonjumpLinkText",
                    <Lnk url="//youtu.be/fM7uBUAI_tw?t=18">
                      {translate("rulesPageTrackCategoriesRRNoSCMoonjumpLinkText", lang)}
                    </Lnk>,
                  ],
                  [
                    "rulesPageTrackCategoriesRRNoSCSnakeCutLinkText",
                    <Lnk url="//youtu.be/fM7uBUAI_tw?t=39">
                      {translate("rulesPageTrackCategoriesRRNoSCSnakeCutLinkText", lang)}
                    </Lnk>,
                  ],
                  [
                    "rulesPageTrackCategoriesRRNoSCPathswitchLinkText",
                    <Lnk url="//youtu.be/fM7uBUAI_tw?t=55">
                      {translate("rulesPageTrackCategoriesRRNoSCPathswitchLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesRRUnres", lang), [
                  [
                    "rulesPageTrackCategoriesRRUnresWallclipsLinkText",
                    <Lnk url="//youtu.be/WoVvyOtqquU?t=22">
                      {translate("rulesPageTrackCategoriesRRUnresWallclipsLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameRPB", lang)}>
              <></>
              <></>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesRPBUnres", lang), [
                  [
                    "rulesPageTrackCategoriesRPBUnresWallclipsLinkText",
                    <Lnk url="//youtu.be/Ew-HUEUGRQI?t=37">
                      {translate("rulesPageTrackCategoriesRPBUnresWallclipsLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameRYF", lang)}>
              <p>{translate("rulesPageTrackCategoriesRYFNoSC", lang)}</p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameRGV2", lang)}>
              <></>
              <></>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesRGV2Unres", lang), [
                  [
                    "rulesPageTrackCategoriesRGV2UnresWallclipLinkText",
                    <Lnk url="//youtu.be/Ew-T7OVqaNUbzI?t=7">
                      {translate("rulesPageTrackCategoriesRGV2UnresWallclipLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameRMR", lang)}>
              <p>{translate("rulesPageTrackCategoriesRMRNoSC", lang)}</p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameRSL", lang)}>
              <p>{translate("rulesPageTrackCategoriesRSLNoSC", lang)}</p>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesRSLSC", lang), [
                  [
                    "rulesPageTrackCategoriesRSLSCWallclipLinkText",
                    <Lnk url="//youtu.be/KstIRAm_0KE?t=15">
                      {translate("rulesPageTrackCategoriesRSLSCWallclipLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesRSLUnres", lang), [
                  [
                    "rulesPageTrackCategoriesRSLUnresPoleclipLinkText",
                    <Lnk url="//youtu.be/itty-pdMLq4?t=13">
                      {translate("rulesPageTrackCategoriesRSLUnresPoleclipLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameRSGB", lang)}>
              <p>{translate("rulesPageTrackCategoriesRSGBNoSC", lang)}</p>
              <></>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesRSGBUnres", lang), [
                  [
                    "rulesPageTrackCategoriesRSGBUnresBombClipLinkText",
                    <Lnk url="//youtu.be/L4OcK4u5JNg?t=6">
                      {translate("rulesPageTrackCategoriesRSGBUnresBombClipLinkText", lang)}
                    </Lnk>,
                  ],
                  [
                    "rulesPageTrackCategoriesRSGBUnresFloorClipLinkText",
                    <Lnk url="//youtu.be/BoM9CeOjNlg?t=104">
                      {translate("rulesPageTrackCategoriesRSGBUnresFloorClipLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameRDS", lang)}>
              <p>{translate("rulesPageTrackCategoriesRDSNoSC", lang)}</p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameRWS", lang)}>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesRWSNoSC", lang), [
                  [
                    "rulesPageTrackCategoriesRWSNoSCTurn2LinkText",
                    <Lnk url="//youtu.be/K0gQpxxAGZ0?t=6">
                      {translate("rulesPageTrackCategoriesRWSNoSCTurn2LinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesRWSUnres", lang), [
                  [
                    "rulesPageTrackCategoriesRWSUnresGlitchTextLink",
                    <Lnk url="//youtu.be/2rDSx5pgQ9A?t=10">
                      {translate("rulesPageTrackCategoriesRWSUnresGlitchTextLink", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameRDH", lang)}>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesRDHNoSC", lang), [
                  [
                    "rulesPageTrackCategoriesRDHNoSCWallTouchLinkText",
                    <Lnk url="//youtu.be/W2DCAEFjAFE?t=67">
                      {translate("rulesPageTrackCategoriesRDHNoSCWallTouchLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesRDHSC", lang), [
                  [
                    "rulesPageTrackCategoriesRDHSCLakeCutLinkText",
                    <Lnk url="//youtu.be/v5Qj0DnqVo0?t=12">
                      {translate("rulesPageTrackCategoriesRDHSCLakeCutLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesRDHUnres", lang), [
                  [
                    "rulesPageTrackCategoriesRDHUnresODBLinkText",
                    <Lnk url="//youtu.be/Cu00LwuXKNg?t=14">
                      {translate("rulesPageTrackCategoriesRDHUnresODBLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameRBC3", lang)}>
              <></>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesRBC3SC", lang), [
                  [
                    "rulesPageTrackCategoriesRBC3SCUltraLinkText",
                    <Lnk url="//youtu.be/vSbSADDEzEs?t=70">
                      {translate("rulesPageTrackCategoriesRBC3SCUltraLinkText", lang)}
                    </Lnk>,
                  ],
                  [
                    "rulesPageTrackCategoriesRBC3SCWallclipsLinkText",
                    <Lnk url="//youtu.be/jmmhhIqewQg?t=14">
                      {translate("rulesPageTrackCategoriesRBC3SCWallclipsLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameRDKJP", lang)}>
              <></>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesRDKJPSC", lang), [
                  [
                    "rulesPageTrackCategoriesRDKJPSCSpiralSkipLinkText",
                    <Lnk url="//youtu.be/jmmhhIqewQg?t=14">
                      {translate("rulesPageTrackCategoriesRDKJPSCSpiralSkipLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesRDKJPUnres", lang), [
                  [
                    "rulesPageTrackCategoriesRDKJPUnresTreeClipLinkText",
                    <Lnk url="//youtu.be/bkinW1UZK6M?t=28">
                      {translate("rulesPageTrackCategoriesRDKJPUnresTreeClipLinkText", lang)}
                    </Lnk>,
                  ],
                  [
                    "rulesPageTrackCategoriesRDKJPUnresSignClipLinkText",
                    <Lnk url="//youtu.be/_lbQOL3wYxI?t=17">
                      {translate("rulesPageTrackCategoriesRDKJPUnresSignClipLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameRMC", lang)}>
              <></>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesRMCSC", lang), [
                  [
                    "rulesPageTrackCategoriesRMCSCWallclipLinkText",
                    <Lnk url="//youtu.be/QwWEFaiOquI?t=29">
                      {translate("rulesPageTrackCategoriesRMCSCWallclipLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameRMC3", lang)}>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesRMC3NoSC", lang), [
                  [
                    "rulesPageTrackCategoriesRMC3NoSCTurnWallClipLinkText",
                    <Lnk url="//youtu.be/o7kMZcDDGZI?t=18">
                      {translate("rulesPageTrackCategoriesRMC3NoSCTurnWallClipLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameRPG", lang)}>
              <></>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesRPGSC", lang), [
                  [
                    "rulesPageTrackCategoriesRPGSCTreeClipLinkText",
                    <Lnk url="//youtu.be/F2fFVrUU2oE?t=39">
                      {translate("rulesPageTrackCategoriesRPGSCTreeClipLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameRDKM", lang)}>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesRDKMNoSC", lang), [
                  [
                    "rulesPageTrackCategoriesRDKMNoSCGapLinkText",
                    <Lnk url="//youtu.be/jk5NIcHWQ-Y?t=85">
                      {translate("rulesPageTrackCategoriesRDKMNoSCGapLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesRDKMSC", lang), [
                  [
                    "rulesPageTrackCategoriesRDKMSCWallBypassLinkText",
                    <Lnk url="//youtu.be/s3uqTaxr_4A?t=43">
                      {translate("rulesPageTrackCategoriesRDKMSCWallBypassLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translate("constantTrackNameRBC", lang)}>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesRBCNoSC", lang), [
                  [
                    "rulesPageTrackCategoriesRBCNoSCRailCutLinkText",
                    <Lnk url="//youtu.be/twZes-RI6Sc?t=107">
                      {translate("rulesPageTrackCategoriesRBCNoSCRailCutLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesRBCSC", lang), [
                  [
                    "rulesPageTrackCategoriesRBCSCSpiralSkipLinkText",
                    <Lnk url="//youtu.be/3PYp8-IrY_0?t=41">
                      {translate("rulesPageTrackCategoriesRBCSCSpiralSkipLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translate("rulesPageTrackCategoriesRBCUnres", lang), [
                  [
                    "rulesPageTrackCategoriesRBCUnresPoleclipLinkText",
                    <Lnk url="//youtu.be/ylcEVLHzwJA?t=17">
                      {translate("rulesPageTrackCategoriesRBCUnresPoleclipLinkText", lang)}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
          </ul>
        </div>
      </section>
    </>
  );
};

export default RulesPage;
