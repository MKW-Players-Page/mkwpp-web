import { useContext } from "react";

import { FormContext } from "./Form";
import { MetadataContext } from "../../utils/Metadata";
import { I18nContext, translate, translateTrack, TranslationKey } from "../../utils/i18n/i18n";
import { Autocomplete, createFilterOptions, TextField } from "@mui/material";

export interface TrackDropdownProps {
  /** The currently selected option. If included, the value for allTracks is `-5`. */
  value: number;
  /** Callback to invoke when user attempts to select a new track */
  onChange: any;
  disabled?: boolean;
  /** Enables an all tracks option */
  allTracks?: boolean;
}

export const TrackDropdown = ({
  value,
  onChange,
  disabled,
  allTracks = false,
}: TrackDropdownProps) => {
  const metadata = useContext(MetadataContext);
  const { lang } = useContext(I18nContext);

  const options: number[] = [];

  if (allTracks) options.push(-5);

  metadata.tracks?.forEach((track) => options.push(track.id));

  return (
    <Autocomplete
      value={value}
      style={{ minWidth: "300px" }}
      onChange={(_, v) => {
        if (v === null) return;
        onChange(v);
      }}
      disabled={disabled}
      groupBy={(option) => {
        if (option === -5) return "";
        return (
          metadata.cups?.find((cup) => cup.id === Math.floor((option - 1) / 4) + 1)?.code ?? ""
        );
      }}
      renderGroup={(params) => {
        if (params.group === "")
          return (
            <li key={params.key}>
              <ul style={{ padding: 0 }}>{params.children}</ul>
            </li>
          );

        return (
          <li key={params.key}>
            <div
              style={{
                position: "sticky",
                top: "-8px",
                fontWeight: 500,
                fontSize: ".875rem",
                padding: "0 16px",
                lineHeight: "48px",
                listStyle: "none",
                boxSizing: "border-box",
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                backgroundColor: "#121212",
              }}
            >
              <span style={{ marginRight: "10px" }}>
                <img
                  width="30px"
                  height="30px"
                  src={`/mkw/cups/${metadata.cups?.find((cup) => cup.code === params.group)?.id ?? 1}.png`}
                  alt="cup img"
                />
              </span>
              {translate(`constantCup${params.group.toLocaleUpperCase()}` as TranslationKey, lang)}
            </div>
            <ul style={{ padding: 0 }}>{params.children}</ul>
          </li>
        );
      }}
      autoComplete
      autoHighlight
      openOnFocus
      options={options}
      filterOptions={createFilterOptions({
        ignoreCase: true,
        ignoreAccents: true,
      })}
      renderInput={(params) => {
        if (value !== -5) {
          const cupId = metadata.tracks?.find((r) => r.id === value)?.cupId;
          if (cupId !== undefined) {
            params.InputProps.startAdornment = (
              <span>
                <img width="30px" height="30px" src={`/mkw/cups/${cupId}.png`} alt="cup img" />
              </span>
            );
          }
        }
        return <TextField {...params} />;
      }}
      getOptionLabel={(option) => {
        if (option === -5) return translate("trackDropdownAllTracks", lang);
        return translateTrack(
          metadata.tracks?.find((r) => r.id === option),
          lang,
        );
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        const track = metadata.tracks?.find((r) => r.id === option);
        const trackText =
          option === -5 ? translate("trackDropdownAllTracks", lang) : translateTrack(track, lang);
        return (
          <li key={key} {...optionProps}>
            {trackText}
          </li>
        );
      }}
    />
  );
};

export interface TrackSelectProps {
  /** Name of the state property to control */
  field: string;
  /** Select label */
  label?: string;
  disabled?: boolean;
}

const TrackSelect = ({ field, label, disabled }: TrackSelectProps) => {
  const { getValue, setValue, getErrors, disabled: disabledByForm } = useContext(FormContext);

  const onChange = (e: number) => {
    setValue(field, e);
  };

  const errors = getErrors(field);

  return (
    <div className="field">
      {label && <p>{label}</p>}
      <TrackDropdown
        onChange={onChange}
        disabled={disabled || disabledByForm}
        value={getValue(field)}
      />
      {errors.map((error) => (
        <p className="field-error">{error}</p>
      ))}
    </div>
  );
};

export default TrackSelect;
