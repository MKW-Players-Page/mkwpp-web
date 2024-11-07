import { useContext } from "react";
import { handleBars, I18nContext } from "../../utils/i18n/i18n";
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
  const { translations, lang } = useContext(I18nContext);

  return (
    <li>
      <p>{trackName}</p>
      <ol>
        {typeof children[0].type !== "symbol" ? (
          <li>
            <p>{translations.constantCategoryNameNoSCLong[lang]}</p>
            {children[0] ?? <></>}
          </li>
        ) : (
          <></>
        )}
        {typeof children[1].type !== "symbol" ? (
          <li>
            <p>{translations.constantCategoryNameSCLong[lang]}</p>
            {children[1] ?? <></>}
          </li>
        ) : (
          <></>
        )}
        {typeof children[2].type !== "symbol" ? (
          <li>
            <p>{translations.constantCategoryNameUnresLong[lang]}</p>
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
  const { translations, lang } = useContext(I18nContext);

  return (
    <>
      <h1>{translations.rulesPageHeading[lang]}</h1>
      <section className="module">
        <div className="module-content">
          <p>{translations.rulesPageShortDesc[lang]}</p>
          <p>{translations.rulesPageTableOfContentsHeading[lang]}</p>
          <ul style={{ listStyle: "square" } as React.CSSProperties}>
            <ScrollListItem scrollToId="basic">
              {translations.rulesPageScrollListItemBasic[lang]}
            </ScrollListItem>
            <ScrollListItem scrollToId="platforms">
              {translations.rulesPageScrollListItemPlatforms[lang]}
            </ScrollListItem>
            <ScrollListItem scrollToId="categories">
              {translations.rulesPageScrollListItemCategories[lang]}
            </ScrollListItem>
            <ScrollListItem scrollToId="trackcategories">
              {translations.rulesPageScrollListItemTrackCategories[lang]}
            </ScrollListItem>
          </ul>
        </div>
      </section>
      <section className="module">
        <div id="basic" className="module-content">
          <h1>{translations.rulesPageHeadingBasicSiteRules[lang]}</h1>
          <p>{translations.rulesPageBasicSiteRulesParagraph1[lang]}</p>
          <p>{translations.rulesPageBasicSiteRulesParagraph2[lang]}</p>
          <p>{translations.rulesPageBasicSiteRulesParagraph3[lang]}</p>
          <p>{translations.rulesPageBasicSiteRulesParagraph4[lang]}</p>
          <p>{translations.rulesPageBasicSiteRulesParagraph5[lang]}</p>
        </div>
      </section>
      <section className="module">
        <div id="platforms" className="module-content">
          <h1>{translations.rulesPageHeadingAllowedPlatforms[lang]}</h1>
          <p>{translations.rulesPageAllowedPlatformsParagraph1[lang]}</p>
          <p>{translations.rulesPageAllowedPlatformsParagraph2[lang]}</p>
        </div>
      </section>
      <section className="module">
        <div id="categories" className="module-content">
          <h1>{translations.rulesPageHeadingCategoryRules[lang]}</h1>
          <p>{translations.rulesPageCategoryRulesParagraph1[lang]}</p>
          <ol>
            <li>
              <p>{parse(translations.rulesPageCategoryRulesParagraph2[lang])}</p>
              <ol style={{ listStyleType: "lower-alpha" } as React.CSSProperties}>
                <li>
                  <p>{translations.rulesPageCategoryRulesParagraph3[lang]}</p>
                  <ol style={{ listStyleType: "lower-roman" } as React.CSSProperties}>
                    <li>{translations.rulesPageCategoryRulesParagraph4[lang]}</li>
                    <li>
                      <p>{translations.rulesPageCategoryRulesParagraph5[lang]}</p>
                      <ol>
                        <li>{translations.rulesPageCategoryRulesParagraph6[lang]}</li>
                        <li>{translations.rulesPageCategoryRulesParagraph7[lang]}</li>
                      </ol>
                    </li>
                    <li>{translations.rulesPageCategoryRulesParagraph8[lang]}</li>
                    <li>
                      <p>{translations.rulesPageCategoryRulesParagraph9[lang]}</p>
                      <ol>
                        <li>{translations.rulesPageCategoryRulesParagraph10[lang]}</li>
                        <li>{translations.rulesPageCategoryRulesParagraph11[lang]}</li>
                        <li>{translations.rulesPageCategoryRulesParagraph12[lang]}</li>
                        <li>{translations.rulesPageCategoryRulesParagraph13[lang]}</li>
                      </ol>
                    </li>
                    <li>{translations.rulesPageCategoryRulesParagraph14[lang]}</li>
                    <li>{translations.rulesPageCategoryRulesParagraph15[lang]}</li>
                    <li>{translations.rulesPageCategoryRulesParagraph16[lang]}</li>
                    <li>
                      <p>{translations.rulesPageCategoryRulesParagraph17[lang]}</p>
                      <ol>
                        <li>{translations.rulesPageCategoryRulesParagraph18[lang]}</li>
                        <li>{translations.rulesPageCategoryRulesParagraph19[lang]}</li>
                      </ol>
                    </li>
                    <li>
                      <p>{translations.rulesPageCategoryRulesParagraph20[lang]}</p>
                      <ol>
                        <li>{translations.rulesPageCategoryRulesParagraph21[lang]}</li>
                        <li>{translations.rulesPageCategoryRulesParagraph22[lang]}</li>
                        <li>{translations.rulesPageCategoryRulesParagraph23[lang]}</li>
                      </ol>
                    </li>
                  </ol>
                </li>
                <li>
                  <p>{translations.rulesPageCategoryRulesParagraph24[lang]}</p>
                  <ol style={{ listStyleType: "lower-roman" } as React.CSSProperties}>
                    <li>{translations.rulesPageCategoryRulesParagraph25[lang]}</li>
                    <li>{translations.rulesPageCategoryRulesParagraph26[lang]}</li>
                    <li>{translations.rulesPageCategoryRulesParagraph27[lang]}</li>
                    <li>{translations.rulesPageCategoryRulesParagraph28[lang]}</li>
                    <li>{translations.rulesPageCategoryRulesParagraph29[lang]}</li>
                    <li>{translations.rulesPageCategoryRulesParagraph30[lang]}</li>
                    <li>{translations.rulesPageCategoryRulesParagraph31[lang]}</li>
                    <li>{translations.rulesPageCategoryRulesParagraph32[lang]}</li>
                  </ol>
                </li>
              </ol>
            </li>
            <li>{translations.rulesPageCategoryRulesParagraph33[lang]}</li>
            <li>{translations.rulesPageCategoryRulesParagraph34[lang]}</li>
          </ol>
        </div>
      </section>
      <section className="module">
        <div id="trackcategories" className="module-content">
          <h1>Categories Per Track</h1>
          <ul>
            <TrackCategory trackName={translations.constantTrackNameLC[lang]}>
              <p>{translations.rulesPageTrackCategoriesLCNoSC[lang]}</p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameMMM[lang]}>
              <p>{translations.rulesPageTrackCategoriesMMMNoSC[lang]}</p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameMG[lang]}>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesMGNoSC[lang], [
                  [
                    "rulesPageTrackCategoriesMGNoSCGapJumpLinkText",
                    <Lnk url="//youtu.be/8-0Xetey5xY?t=43">
                      {translations.rulesPageTrackCategoriesMGNoSCGapJumpLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesMGSC[lang], [
                  [
                    "rulesPageTrackCategoriesMGSCWallRide1LinkText",
                    <Lnk url="//youtu.be/MtM9svSJG_A?t=21">
                      {translations.rulesPageTrackCategoriesMGSCWallRide1LinkText[lang]}
                    </Lnk>,
                  ],
                  [
                    "rulesPageTrackCategoriesMGSCWallRide2LinkText",
                    <Lnk url="//youtu.be/MtM9svSJG_A?t=44">
                      {translations.rulesPageTrackCategoriesMGSCWallRide2LinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesMGUnres[lang], [
                  [
                    "rulesPageTrackCategoriesMGUnresWallRideLinkText",
                    <Lnk url="//youtu.be/y5V_s3dMJ4k">
                      {translations.rulesPageTrackCategoriesMGUnresWallRideLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameTF[lang]}>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesTFNoSC[lang], [
                  [
                    "rulesPageTrackCategoriesTFNoSCLakeCutLinkText",
                    <Lnk url="//youtu.be/mqQa_1Cq1bw?t=38">
                      {translations.rulesPageTrackCategoriesTFNoSCLakeCutLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesTFSC[lang], [
                  [
                    "rulesPageTrackCategoriesTFSCBoxClipLinkText",
                    <Lnk url="//youtu.be/IapJ1CS0Eas?t=22">
                      {translations.rulesPageTrackCategoriesTFSCBoxClipLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameMC[lang]}>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesMCNoSC[lang], [
                  [
                    "rulesPageTrackCategoriesMCNoSCKingAlexRampLinkText",
                    <Lnk url="//youtu.be/kG8PvG8K1ZA?t=22">
                      {translations.rulesPageTrackCategoriesMCNoSCKingAlexRampLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesMCUnres[lang], [
                  [
                    "rulesPageTrackCategoriesMCUnresWallclipLinkText",
                    <Lnk url="//youtu.be/CoOLNaRK5dc">
                      {translations.rulesPageTrackCategoriesMCUnresWallclipLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameCM[lang]}>
              <></>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesCMSC[lang], [
                  [
                    "rulesPageTrackCategoriesCMSC1LinkText",
                    <Lnk url="//youtu.be/I_DTmlAWWdA">
                      {translations.rulesPageTrackCategoriesCMSC1LinkText[lang]}
                    </Lnk>,
                  ],
                  [
                    "rulesPageTrackCategoriesCMSC2LinkText",
                    <Lnk url="//youtu.be/xcheyzld7-s?t=7">
                      {translations.rulesPageTrackCategoriesCMSC2LinkText[lang]}
                    </Lnk>,
                  ],
                  [
                    "rulesPageTrackCategoriesCMSC3LinkText",
                    <Lnk url="//youtu.be/Jf-HC1Z_1FE?t=17">
                      {translations.rulesPageTrackCategoriesCMSC3LinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesCMUnres[lang], [
                  [
                    "rulesPageTrackCategoriesCMUnresParkingLotLinkText",
                    <Lnk url="//youtu.be/HwPwQ7Q">
                      {translations.rulesPageTrackCategoriesCMUnresParkingLotLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameDKSC[lang]}>
              <p>{translations.rulesPageTrackCategoriesDKSCNoSC[lang]}</p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameWGM[lang]}>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesWGMNoSC[lang], [
                  [
                    "rulesPageTrackCategoriesWGMNoSCMickeyMouseLinkText",
                    <Lnk url="//youtu.be/NbhzA2rtZ2A?t=20">
                      {translations.rulesPageTrackCategoriesWGMNoSCMickeyMouseLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesWGMSC[lang], [
                  [
                    "rulesPageTrackCategoriesWGMSCTurnskipLinkText",
                    <Lnk url="//youtu.be/WetnmZeZTEg?t=39">
                      {translations.rulesPageTrackCategoriesWGMSCTurnskipLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesWGMUnres[lang], [
                  [
                    "rulesPageTrackCategoriesWGMUnresPipebounceLinkText",
                    <Lnk url="//youtu.be/VVFXP639DRY?t=18">
                      {translations.rulesPageTrackCategoriesWGMUnresPipebounceLinkText[lang]}
                    </Lnk>,
                  ],
                  [
                    "rulesPageTrackCategoriesWGMUnresRespawnLinkText",
                    <Lnk url="//youtu.be/RlGsAQ-FE1Q?t=9">
                      {translations.rulesPageTrackCategoriesWGMUnresRespawnLinkText[lang]}
                    </Lnk>,
                  ],
                  [
                    "rulesPageTrackCategoriesWGMUnresShroomlessLinkText",
                    <Lnk url="//youtu.be/XhyLw2lW2kE?t=29">
                      {translations.rulesPageTrackCategoriesWGMUnresShroomlessLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameDC[lang]}>
              <p>{translations.rulesPageTrackCategoriesDCNoSC[lang]}</p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameKC[lang]}>
              <></>
              <></>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesKCUnres[lang], [
                  [
                    "rulesPageTrackCategoriesKCUnresLinkText",
                    <Lnk url="//youtu.be/Elb5K7woV20?t=63">
                      {translations.rulesPageTrackCategoriesKCUnresLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameMT[lang]}>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesMTNoSC[lang], [
                  [
                    "rulesPageTrackCategoriesMTNoSCTurnskipLinkText",
                    <Lnk url="//youtu.be/igcHE0-OV0g?t=33">
                      {translations.rulesPageTrackCategoriesMTNoSCTurnskipLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesMTUnres[lang], [
                  [
                    "rulesPageTrackCategoriesMTUnresLinkText",
                    <Lnk url="//youtu.be/1e3WoYHDw2Y?t=14">
                      {translations.rulesPageTrackCategoriesMTUnresLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameGV[lang]}>
              <p>{translations.rulesPageTrackCategoriesGVNoSC[lang]}</p>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesGVSC[lang], [
                  [
                    "rulesPageTrackCategoriesGVSCRockhopLinkText",
                    <Lnk url="//youtu.be/J55Fo2ZMz9M?t=33">
                      {translations.rulesPageTrackCategoriesGVSCRockhopLinkText[lang]}
                    </Lnk>,
                  ],
                  [
                    "rulesPageTrackCategoriesGVSCRockhopRespawnLinkText",
                    <Lnk url="//youtu.be/xeIoXyUsXzw?t=106">
                      {translations.rulesPageTrackCategoriesGVSCRockhopRespawnLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesGVUnres[lang], [
                  [
                    "rulesPageTrackCategoriesGVUnresLinkText",
                    <Lnk url="//youtu.be/bB0oUzdCHTA?t=12">
                      {translations.rulesPageTrackCategoriesGVUnresLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameDDR[lang]}>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesDDRNoSC[lang], [
                  [
                    "rulesPageTrackCategoriesDDRNoSCUltraLinkText",
                    <Lnk url="//youtu.be/nVcVbd4n3yM?t=84">
                      {translations.rulesPageTrackCategoriesDDRNoSCUltraLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameMH[lang]}>
              <p>{translations.rulesPageTrackCategoriesMHNoSC[lang]}</p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameBC[lang]}>
              <></>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesBCSC[lang], [
                  [
                    "rulesPageTrackCategoriesBCSCSpiralSkipLinkText",
                    <Lnk url="//youtu.be/Htt2CRmktvg?t=32">
                      {translations.rulesPageTrackCategoriesBCSCSpiralSkipLinkText[lang]}
                    </Lnk>,
                  ],
                  [
                    "rulesPageTrackCategoriesBCSCRampCutLinkText",
                    <Lnk url="//youtu.be/Htt2CRmktvg?t=37">
                      {translations.rulesPageTrackCategoriesBCSCRampCutLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameRR[lang]}>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesRRNoSC[lang], [
                  [
                    "rulesPageTrackCategoriesRRNoSCMoonjumpLinkText",
                    <Lnk url="//youtu.be/fM7uBUAI_tw?t=18">
                      {translations.rulesPageTrackCategoriesRRNoSCMoonjumpLinkText[lang]}
                    </Lnk>,
                  ],
                  [
                    "rulesPageTrackCategoriesRRNoSCSnakeCutLinkText",
                    <Lnk url="//youtu.be/fM7uBUAI_tw?t=39">
                      {translations.rulesPageTrackCategoriesRRNoSCSnakeCutLinkText[lang]}
                    </Lnk>,
                  ],
                  [
                    "rulesPageTrackCategoriesRRNoSCPathswitchLinkText",
                    <Lnk url="//youtu.be/fM7uBUAI_tw?t=55">
                      {translations.rulesPageTrackCategoriesRRNoSCPathswitchLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesRRUnres[lang], [
                  [
                    "rulesPageTrackCategoriesRRUnresWallclipsLinkText",
                    <Lnk url="//youtu.be/WoVvyOtqquU?t=22">
                      {translations.rulesPageTrackCategoriesRRUnresWallclipsLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameRPB[lang]}>
              <></>
              <></>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesRPBUnres[lang], [
                  [
                    "rulesPageTrackCategoriesRPBUnresWallclipsLinkText",
                    <Lnk url="//youtu.be/Ew-HUEUGRQI?t=37">
                      {translations.rulesPageTrackCategoriesRPBUnresWallclipsLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameRYF[lang]}>
              <p>{translations.rulesPageTrackCategoriesRYFNoSC[lang]}</p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameRGV2[lang]}>
              <></>
              <></>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesRGV2Unres[lang], [
                  [
                    "rulesPageTrackCategoriesRGV2UnresWallclipLinkText",
                    <Lnk url="//youtu.be/Ew-T7OVqaNUbzI?t=7">
                      {translations.rulesPageTrackCategoriesRGV2UnresWallclipLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameRMR[lang]}>
              <p>{translations.rulesPageTrackCategoriesRMRNoSC[lang]}</p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameRSL[lang]}>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesRSLSC[lang], [
                  [
                    "rulesPageTrackCategoriesRSLSCWallclipLinkText",
                    <Lnk url="//youtu.be/KstIRAm_0KE?t=15">
                      {translations.rulesPageTrackCategoriesRSLSCWallclipLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesRSLUnres[lang], [
                  [
                    "rulesPageTrackCategoriesRSLUnresPoleclipLinkText",
                    <Lnk url="//youtu.be/itty-pdMLq4?t=13">
                      {translations.rulesPageTrackCategoriesRSLUnresPoleclipLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameRSGB[lang]}>
              <p>{translations.rulesPageTrackCategoriesRSGBNoSC[lang]}</p>
              <></>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesRSGBUnres[lang], [
                  [
                    "rulesPageTrackCategoriesRSGBUnresBombClipLinkText",
                    <Lnk url="//youtu.be/L4OcK4u5JNg?t=6">
                      {translations.rulesPageTrackCategoriesRSGBUnresBombClipLinkText[lang]}
                    </Lnk>,
                  ],
                  [
                    "rulesPageTrackCategoriesRSGBUnresFloorClipLinkText",
                    <Lnk url="//youtu.be/BoM9CeOjNlg?t=104">
                      {translations.rulesPageTrackCategoriesRSGBUnresFloorClipLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameRDS[lang]}>
              <p>{translations.rulesPageTrackCategoriesRDSNoSC[lang]}</p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameRWS[lang]}>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesRWSNoSC[lang], [
                  [
                    "rulesPageTrackCategoriesRWSNoSCTurn2LinkText",
                    <Lnk url="//youtu.be/K0gQpxxAGZ0?t=6">
                      {translations.rulesPageTrackCategoriesRWSNoSCTurn2LinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesRWSUnres[lang], [
                  [
                    "rulesPageTrackCategoriesRWSUnresGlitchTextLink",
                    <Lnk url="//youtu.be/2rDSx5pgQ9A?t=10">
                      {translations.rulesPageTrackCategoriesRWSUnresGlitchTextLink[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameRDH[lang]}>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesRDHNoSC[lang], [
                  [
                    "rulesPageTrackCategoriesRDHNoSCWallTouchLinkText",
                    <Lnk url="//youtu.be/W2DCAEFjAFE?t=67">
                      {translations.rulesPageTrackCategoriesRDHNoSCWallTouchLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesRDHSC[lang], [
                  [
                    "rulesPageTrackCategoriesRDHSCLakeCutLinkText",
                    <Lnk url="//youtu.be/v5Qj0DnqVo0?t=12">
                      {translations.rulesPageTrackCategoriesRDHSCLakeCutLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesRDHUnres[lang], [
                  [
                    "rulesPageTrackCategoriesRDHUnresODBLinkText",
                    <Lnk url="//youtu.be/Cu00LwuXKNg?t=14">
                      {translations.rulesPageTrackCategoriesRDHUnresODBLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameRBC3[lang]}>
              <></>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesRBC3SC[lang], [
                  [
                    "rulesPageTrackCategoriesRBC3SCUltraLinkText",
                    <Lnk url="//youtu.be/vSbSADDEzEs?t=70">
                      {translations.rulesPageTrackCategoriesRBC3SCUltraLinkText[lang]}
                    </Lnk>,
                  ],
                  [
                    "rulesPageTrackCategoriesRBC3SCWallclipsLinkText",
                    <Lnk url="//youtu.be/jmmhhIqewQg?t=14">
                      {translations.rulesPageTrackCategoriesRBC3SCWallclipsLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameRDKJP[lang]}>
              <></>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesRDKJPSC[lang], [
                  [
                    "rulesPageTrackCategoriesRDKJPSCSpiralSkipLinkText",
                    <Lnk url="//youtu.be/jmmhhIqewQg?t=14">
                      {translations.rulesPageTrackCategoriesRDKJPSCSpiralSkipLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesRDKJPUnres[lang], [
                  [
                    "rulesPageTrackCategoriesRDKJPUnresTreeClipLinkText",
                    <Lnk url="//youtu.be/bkinW1UZK6M?t=28">
                      {translations.rulesPageTrackCategoriesRDKJPUnresTreeClipLinkText[lang]}
                    </Lnk>,
                  ],
                  [
                    "rulesPageTrackCategoriesRDKJPUnresSignClipLinkText",
                    <Lnk url="//youtu.be/_lbQOL3wYxI?t=17">
                      {translations.rulesPageTrackCategoriesRDKJPUnresSignClipLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameRMC[lang]}>
              <></>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesRMCSC[lang], [
                  [
                    "rulesPageTrackCategoriesRMCSCWallclipLinkText",
                    <Lnk url="//youtu.be/QwWEFaiOquI?t=29">
                      {translations.rulesPageTrackCategoriesRMCSCWallclipLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameRMC3[lang]}>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesRMC3NoSC[lang], [
                  [
                    "rulesPageTrackCategoriesRMC3NoSCTurnWallClipLinkText",
                    <Lnk url="//youtu.be/o7kMZcDDGZI?t=18">
                      {translations.rulesPageTrackCategoriesRMC3NoSCTurnWallClipLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameRPG[lang]}>
              <></>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesRPGSC[lang], [
                  [
                    "rulesPageTrackCategoriesRPGSCTreeClipLinkText",
                    <Lnk url="//youtu.be/F2fFVrUU2oE?t=39">
                      {translations.rulesPageTrackCategoriesRPGSCTreeClipLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameRDKM[lang]}>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesRDKMNoSC[lang], [
                  [
                    "rulesPageTrackCategoriesRDKMNoSCGapLinkText",
                    <Lnk url="//youtu.be/jk5NIcHWQ-Y?t=85">
                      {translations.rulesPageTrackCategoriesRDKMNoSCGapLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesRDKMSC[lang], [
                  [
                    "rulesPageTrackCategoriesRDKMSCWallBypassLinkText",
                    <Lnk url="//youtu.be/s3uqTaxr_4A?t=43">
                      {translations.rulesPageTrackCategoriesRDKMSCWallBypassLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <></>
            </TrackCategory>
            <TrackCategory trackName={translations.constantTrackNameRBC[lang]}>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesRBCNoSC[lang], [
                  [
                    "rulesPageTrackCategoriesRBCNoSCRailCutLinkText",
                    <Lnk url="//youtu.be/twZes-RI6Sc?t=107">
                      {translations.rulesPageTrackCategoriesRBCNoSCRailCutLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesRBCSC[lang], [
                  [
                    "rulesPageTrackCategoriesRBCSCSpiralSkipLinkText",
                    <Lnk url="//youtu.be/3PYp8-IrY_0?t=41">
                      {translations.rulesPageTrackCategoriesRBCSCSpiralSkipLinkText[lang]}
                    </Lnk>,
                  ],
                ])}
              </p>
              <p>
                {handleBars(translations.rulesPageTrackCategoriesRBCUnres[lang], [
                  [
                    "rulesPageTrackCategoriesRBCUnresPoleclipLinkText",
                    <Lnk url="//youtu.be/ylcEVLHzwJA?t=17">
                      {translations.rulesPageTrackCategoriesRBCUnresPoleclipLinkText[lang]}
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
