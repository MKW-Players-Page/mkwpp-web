import { Link } from "react-router-dom";
import ScrollListItem from "../widgets/ScrollListItem";

interface TrackCategoryProps {
  trackName: string;
  children: JSX.Element[];
}

const TrackCategory = ({ trackName, children }: TrackCategoryProps) => {
  // This element should have 3 children
  // The index of these in an array is the same numerical value as the category it's referring to
  // If you want to skip a category, leave it out as a Fragment `<></>`
  return (
    <li>
      <p>{trackName}</p>
      <ol>
        {typeof children[0].type !== "symbol" ? (
          <li>
            <p>No-Shortcut</p>
            {children[0]}
          </li>
        ) : (
          <></>
        )}
        {typeof children[1].type !== "symbol" ? (
          <li>
            <p>Shortcut</p>
            {children[1]}
          </li>
        ) : (
          <></>
        )}
        {typeof children[2].type !== "symbol" ? (
          <li>
            <p>Glitch</p>
            {children[2]}
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
    <Link className="underlined" target="_blank" to={url}>
      {children}
    </Link>
  );
};

const RulesPage = () => {
  return (
    <>
      <h1>Mario Kart Wii Time Trials Rules</h1>
      <section className="module">
        <div className="module-content">
          <p>This page is all the rules related to submitting time on this website.</p>
          <p>Table of Contents:</p>
          <ul style={{ listStyle: "square" } as React.CSSProperties}>
            <ScrollListItem scrollToId="basic">Basic Site Rules</ScrollListItem>
            <ScrollListItem scrollToId="platforms">Allowed Platforms</ScrollListItem>
            <ScrollListItem scrollToId="categories">Category Rules</ScrollListItem>
            <ScrollListItem scrollToId="trackcategories">Categories Per Track</ScrollListItem>
          </ul>
        </div>
      </section>
      <section className="module">
        <div id="basic" className="module-content">
          <h1>Basic Site Rules</h1>
          <p>
            This page only deals with Mario Kart Wii in the Time Trial mode. No Online, Grand Prix,
            VS. Mode or Battle Mode data will be tracked.
          </p>
          <p>
            Modding the game is disallowed, this includes: Custom Music, Muting the game's music,
            Rapid Fire Inputs, Slowdowns, Live Replay, Savestates.
          </p>
          <p>
            Also banned are playing the game in the Wii's 50Hz Video Display mode to abuse of the
            Wheelie bug, and "Pause Buffering" which is pausing the game to buffer inputs.
          </p>
          <p>
            Knowingly wasting the time of Moderators, Admins and Updaters alike is frowned upon.
          </p>
          <p>
            Hoarding times, despite usually being harmless, can be frowned upon following incidents
            in other series' games.
          </p>
        </div>
      </section>
      <section className="module">
        <div id="platforms" className="module-content">
          <h1>Allowed Platforms</h1>
          <p>
            No emulators are allowed, due to concerns regarding cheating and even emulation
            inaccuracy.
          </p>
          <p>
            No mods are allowed, unless the Time Trial feature complies with Vanilla gameplay,
            notable exception to this is the mod CTGP-R. If you're going to play with a mod that is
            not CTGP-R, you're highly encouraged to disclose the fact and check with Updaters before
            submission.
          </p>
        </div>
      </section>
      <section className="module">
        <div id="categories" className="module-content">
          <h1>Category Rules</h1>
          <p>
            This ruleset is a collection of compromises to find a balance between a solid and easily
            understandable set of rules, as well as upholding the spirit of the game. It is, by
            definition, unfinished due to constant progress being made, and new discoveries will be
            met by updates to the ruleset whenever they are warranted.
          </p>
          <ol>
            <li>
              <p>
                The No-SC leaderboard allows every eligible time trial, except for any time trial
                that uses a banned technique <u>to gain a significant routing advantage</u>.
              </p>
              <ol style={{ listStyleType: "lower-alpha" } as React.CSSProperties}>
                <li>
                  <p>List of known banned No-SC techniques</p>
                  <ol style={{ listStyleType: "lower-roman" } as React.CSSProperties}>
                    <li>Obtaining a lap count while skipping a key checkpoint</li>
                    <li>
                      <p>Wallclips</p>
                      <ol>
                        <li>
                          Hitting a wall in a way that results in airtime, as well as maintaining
                          most of the speed before hitting the wall
                        </li>
                        <li>Includes the outside drift bike bounce</li>
                      </ol>
                    </li>
                    <li>Driving on fall boundaries, without resulting in a respawn</li>
                    <li>
                      <p>Driving through walls</p>
                      <ol>
                        <li>Method 1: exploiting the horizontal wall glitch</li>
                        <li>Method 2: passing backwards through a wall</li>
                        <li>Method 3: driving through walls via double-sided solid walls</li>
                        <li>Walls: defined by the KCL model</li>
                      </ol>
                    </li>
                    <li>Driving on walls using mushroom physics</li>
                    <li>Respawn shortcuts</li>
                    <li>
                      Using reject road to velocity stack, resulting in extremely high external
                      velocity
                    </li>
                    <li>
                      <p>Checkpoint manipulations that do not result in skipped key checkpoints</p>
                      <ol>
                        <li>Method 1: delayed lap counts</li>
                        <li>Method 2: driving backwards to hit key checkpoints</li>
                      </ol>
                    </li>
                    <li>
                      <p>Historical SC categories, as listed below</p>
                      <ol>
                        <li>GV rock hop/rockless</li>
                        <li>rDH lake cut (including lake cuts without wallclips)</li>
                        <li>rBC3 turnskip using yellow ramps</li>
                      </ol>
                    </li>
                  </ol>
                </li>
                <li>
                  <p>List of techniques permitted under No-SC (non-exhaustive)</p>
                  <ol style={{ listStyleType: "lower-roman" } as React.CSSProperties}>
                    <li>Using reject road to gain small amounts of velocity.</li>
                    <li>Evading the effects of sticky road.</li>
                    <li>
                      Gaining or maintaining significant diagonal velocity using outside drift
                      vehicles. Supergrinding/superhopping will not be considered for now, because
                      they are not RTA viable on Nintendo tracks.
                    </li>
                    <li>
                      Driving into a fall boundary, to reach a lap count before hitting the fall
                      boundary.
                    </li>
                    <li>Wrapping around walls with blue zippers.</li>
                    <li>
                      RR kart moonjump w/ turnskip, despite sometimes driving through vertical fall
                      boundary.
                    </li>
                    <li>Strategies for MT turnskip that pass through an invisible wall.</li>
                    <li>
                      Uses of banned techniques that give a very miniscule routing advantage,
                      usually occurring by accident. For example, clipping the wall on the MG gap
                      jump to achieve a slightly tighter line.
                    </li>
                  </ol>
                </li>
              </ol>
            </li>
            <li>
              The Shortcut leaderboard allows every eligible time trial, except for any time trial
              containing a lap count that skips a key checkpoint.
            </li>
            <li>The Unrestricted leaderboard allows every eligible time trial.</li>
          </ol>
        </div>
      </section>
      <section className="module">
        <div id="trackcategories" className="module-content">
          <h1>Categories Per Track</h1>
          <ul>
            <TrackCategory trackName="Luigi Circuit">
              <p>There is no known RTA-viable Luigi Circuit shortcut.</p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName="Moo Moo Meadows">
              <p>There is no known RTA-viable Moo Moo Meadows shortcut.</p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName="Mushroom Gorge">
              <p>
                <Lnk url="//youtu.be/8-0Xetey5xY?t=43">The Gap Jump</Lnk> is allowed
              </p>
              <p>
                Wallrides, such as{" "}
                <Lnk url="//youtu.be/MtM9svSJG_A?t=21">the one at the first turn</Lnk> or{" "}
                <Lnk url="//youtu.be/MtM9svSJG_A?t=44">the one on the last turn</Lnk>, are allowed.
              </p>
              <p>
                <Lnk url="//youtu.be/y5V_s3dMJ4k">Riding the wall to skip laps</Lnk> is considered a
                Glitch.
              </p>
            </TrackCategory>
            <TrackCategory trackName="Toad's Factory">
              <p>
                <Lnk url="//youtu.be/mqQa_1Cq1bw?t=38">The Lake Cut</Lnk> is allowed.
              </p>
              <p>
                <Lnk url="//youtu.be/IapJ1CS0Eas?t=22">The Box Clip</Lnk> is allowed.
              </p>
              <></>
            </TrackCategory>
            <TrackCategory trackName="Mario Circuit">
              <p>
                Ramp cuts, such as <Lnk url="//youtu.be/kG8PvG8K1ZA?t=22">the KingAlex ramp</Lnk>,
                are allowed.
              </p>
              <></>
              <p>
                <Lnk url="//youtu.be/CoOLNaRK5dc">Any wallclip</Lnk>, is allowed.
              </p>
            </TrackCategory>
            <TrackCategory trackName="Coconut Mall">
              <></>
              <p>
                Going out of bounds is allowed, but you must follow key checkpoints. This allows for{" "}
                <Lnk url="//youtu.be/I_DTmlAWWdA">the current BKT method</Lnk>,{" "}
                <Lnk url="//youtu.be/xcheyzld7-s?t=7">the RTA-possible TAS method</Lnk> and the{" "}
                <Lnk url="//youtu.be/Jf-HC1Z_1FE?t=17">ancient method</Lnk>.
              </p>
              <p>
                <Lnk url="//youtu.be/HaR-HwPwQ7Q">Driving circles in the parking lot</Lnk> is
                allowed.
              </p>
            </TrackCategory>
            <TrackCategory trackName="DK's Snowboard Cross">
              <p>There is no known RTA-viable DK's Snowboard Cross shortcut.</p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName="Wario's Gold Mine">
              <p>
                Strats that <Lnk url="//youtu.be/NbhzA2rtZ2A?t=20">avoid the main road</Lnk> without
                going Out of Bounds or skipping key checkpoints are allowed.
              </p>
              <p>
                <Lnk url="//youtu.be/WetnmZeZTEg?t=39">Touching the beam</Lnk> when doing the
                Turnskip is not allowed.
              </p>
              <p>
                Any variation of the Ultra, such as{" "}
                <Lnk url="//youtu.be/VVFXP639DRY?t=18">the Pipebounce</Lnk> or{" "}
                <Lnk url="//youtu.be/RlGsAQ-FE1Q?t=9">the Respawn</Lnk> or{" "}
                <Lnk url="//youtu.be/XhyLw2lW2kE?t=29">the Shroomless</Lnk>, are allowed.
              </p>
            </TrackCategory>
            <TrackCategory trackName="Daisy Circuit">
              <p>There is no known RTA-viable Daisy Circuit shortcut.</p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName="Koopa Cape">
              <></>
              <></>
              <p>
                <Lnk url="//youtu.be/Elb5K7woV20?t=63">Whatever this trickery is</Lnk>, it's allowed
              </p>
            </TrackCategory>
            <TrackCategory trackName="Maple Treeway">
              <p>
                Any form of Out Of Bounds and No Lap Count glitches, despite being slower, are not
                allowed. You are allowed to perform{" "}
                <Lnk url="//youtu.be/igcHE0-OV0g?t=33">the Turnskip</Lnk>.
              </p>
              <></>
              <p>
                <Lnk url="//youtu.be/1e3WoYHDw2Y?t=14">Skipping the first turn</Lnk> is allowed.
              </p>
            </TrackCategory>
            <TrackCategory trackName="Grumble Volcano">
              <p>Driving on any of the rocks is not allowed.</p>
              <p>
                Driving on the rocks (such as{" "}
                <Lnk url="//youtu.be/J55Fo2ZMz9M?t=33">the Rockhop</Lnk>) is allowed as far as it
                doesn't skip a lap. It is also allowed to do{" "}
                <Lnk url="//youtu.be/xeIoXyUsXzw?t=106">the Respawn shortcut</Lnk>.
              </p>
              <p>
                <Lnk url="//youtu.be/bB0oUzdCHTA?t=12">Driving around the left-side rock</Lnk> to
                skip laps is allowed.
              </p>
            </TrackCategory>
            <TrackCategory trackName="Dry Dry Ruins">
              <p>
                There is no known RTA-viable Dry Dry Ruins shortcut. It is allowed to drive{" "}
                <Lnk url="//youtu.be/nVcVbd4n3yM?t=84">the so-called "Ultra"</Lnk>
              </p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName="Moonview Highway">
              <p>There is no known RTA-viable Moonview Highway shortcut.</p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName="Bowser's Castle">
              <></>
              <p>
                Both <Lnk url="//youtu.be/Htt2CRmktvg?t=32">the Spiralskip</Lnk> and the subsequent{" "}
                <Lnk url="//youtu.be/Htt2CRmktvg?t=37">Ramp cut</Lnk> are allowed
              </p>
              <></>
            </TrackCategory>
            <TrackCategory trackName="Rainbow Road">
              <p>
                <Lnk url="//youtu.be/fM7uBUAI_tw?t=18">The Moonjump</Lnk>,{" "}
                <Lnk url="//youtu.be/fM7uBUAI_tw?t=39">the S-Turn cut</Lnk> and{" "}
                <Lnk url="//youtu.be/fM7uBUAI_tw?t=55">the Pathswitch</Lnk> are all allowed.
              </p>
              <></>
              <p>
                <Lnk url="//youtu.be/WoVvyOtqquU?t=22">Wallclips near the beginning</Lnk> are
                allowed.
              </p>
            </TrackCategory>
            <TrackCategory trackName="GCN Peach Beach">
              <></>
              <></>
              <p>
                <Lnk url="//youtu.be/Ew-HUEUGRQI?t=37">Wallclips near the finish line</Lnk> are
                allowed
              </p>
            </TrackCategory>
            <TrackCategory trackName="DS Yoshi Falls">
              <p>There is no known RTA-viable DS Yoshi Falls shortcut.</p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName="SNES Ghost Valley 2">
              <></>
              <></>
              <p>
                <Lnk url="//youtu.be/T7OVqaNUbzI?t=7">Skipping the first turn via a wallclip</Lnk>{" "}
                and all subsequent wallclips are allowed
              </p>
            </TrackCategory>
            <TrackCategory trackName="N64 Mario Raceway">
              <p>There is no known RTA-viable N64 Mario Raceway shortcut.</p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName="N64 Sherbet Land">
              <p>Cutting the gaps on the inside line of turns is allowed.</p>
              <p>
                <Lnk url="//youtu.be/KstIRAm_0KE?t=15">
                  Using wallclips to bounce off the floor to cut more of the gaps
                </Lnk>{" "}
                is allowed
              </p>
              <p>
                <Lnk url="//youtu.be/itty-pdMLq4?t=13">The Poleclip</Lnk> near the start is allowed
              </p>
            </TrackCategory>
            <TrackCategory trackName="GBA Shy Guy Beach">
              <p>Skipping large portions of the off-road with the Magikruiser is allowed</p>
              <></>
              <p>
                <Lnk url="//youtu.be/L4OcK4u5JNg?t=6">Clipping a bomb</Lnk> or{" "}
                <Lnk url="//youtu.be/BoM9CeOjNlg?t=104">clipping the floor</Lnk> to respawn behind
                the finish line are allowed.
              </p>
            </TrackCategory>
            <TrackCategory trackName="DS Delfino Square">
              <p>
                There is no known RTA-viable DS Delfino Square shortcut. The dock cuts are all
                allowed.
              </p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName="GCN Waluigi Stadium">
              <p>
                It is not allowed to do the{" "}
                <Lnk url="//youtu.be/K0gQpxxAGZ0?t=6">No Lap Count shortcut on Turn 2</Lnk> as it
                takes the player through the non-solid side of a wall.
              </p>
              <></>
              <p>
                It is allowed to do{" "}
                <Lnk url="//youtu.be/2rDSx5pgQ9A?t=10">the glitch at the start</Lnk>.
              </p>
            </TrackCategory>
            <TrackCategory trackName="DS Desert Hills">
              <p>
                Unlike older rulesets, it is allowed to{" "}
                <Lnk url="//youtu.be/W2DCAEFjAFE?t=67">touch the wall at the end of a lap</Lnk>.
                This is only useful at the end of flap runs.
              </p>
              <p>
                <Lnk url="//youtu.be/v5Qj0DnqVo0?t=12">Any method used to skip the lake</Lnk> is
                considered as a Shortcut.
              </p>
              <p>
                Although it's not yet been pulled off RTA, it is allowed to do{" "}
                <Lnk url="//youtu.be/Cu00LwuXKNg?t=14">this glitch</Lnk>
              </p>
            </TrackCategory>
            <TrackCategory trackName="GBA Bowser Castle 3">
              <></>
              <p>
                It is allowed to skip turns through the use of{" "}
                <Lnk url="//youtu.be/vSbSADDEzEs?t=70">bumper ramp mechanics</Lnk>, it is also
                allowed to <Lnk url="//youtu.be/jmmhhIqewQg?t=14">cut corners with wallclips</Lnk>.
              </p>
              <></>
            </TrackCategory>
            <TrackCategory trackName="N64 DK's Jungle Parkway">
              <></>
              <p>
                It is allowed to perform the{" "}
                <Lnk url="//youtu.be/WRXMrAUnOLo?t=18">Turnskip/Spiralskip</Lnk> before the cannon.
              </p>
              <p>
                It is allowed to go from the finish line into the cave with either{" "}
                <Lnk url="//youtu.be/bkinW1UZK6M?t=28">Treeclip</Lnk> or{" "}
                <Lnk url="//youtu.be/_lbQOL3wYxI?t=17">Signclip</Lnk>.
              </p>
            </TrackCategory>
            <TrackCategory trackName="GCN Mario Circuit">
              <></>
              <p>
                It is allowed to{" "}
                <Lnk url="//youtu.be/QwWEFaiOquI?t=29">skip the second-last turn</Lnk>
              </p>
              <></>
            </TrackCategory>
            <TrackCategory trackName="SNES Mario Circuit 3">
              <p>
                There is no known RTA-viable SNES Mario Circuit 3 shortcut.{" "}
                <Lnk url="//youtu.be/o7kMZcDDGZI?t=18">The wallclip on Turn 4</Lnk> is allowed due
                to community approval.
              </p>
              <></>
              <></>
            </TrackCategory>
            <TrackCategory trackName="DS Peach Gardens">
              <></>
              <p>
                The <Lnk url="//youtu.be/F2fFVrUU2oE?t=39">treeclip near the second-last turn</Lnk>{" "}
                is a shortcut.
              </p>
              <></>
            </TrackCategory>
            <TrackCategory trackName="GCN DK Mountain">
              <p>
                It is allowed to <Lnk url="//youtu.be/jk5NIcHWQ-Y?t=85">jump over the gap</Lnk> at
                the end of the mountain.
              </p>
              <p>
                It is allowed to{" "}
                <Lnk url="//youtu.be/s3uqTaxr_4A?t=43">
                  clip through the wall nearing the zipper ramp
                </Lnk>
                .
              </p>
              <></>
            </TrackCategory>
            <TrackCategory trackName="N64 Bowser's Castle">
              <p>It is allowed to perform the <Lnk url="//youtu.be/twZes-RI6Sc?t=107">Rail cut</Lnk> on the last turn.</p>
              <p>It is allowed to perform the <Lnk url="//youtu.be/3PYp8-IrY_0?t=41">Spiral Skip</Lnk>.</p>
              <p>It is allowed to perform the <Lnk url="//youtu.be/ylcEVLHzwJA?t=17">Respawn Glitch</Lnk>.</p>
            </TrackCategory>
          </ul>
        </div>
      </section>
    </>
  );
};

export default RulesPage;
