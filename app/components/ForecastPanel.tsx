"use client";

import { useMemo, useState } from "react";

type ForecastInputs = {
  capability: number;
  efficiency: number;
  reliability: number;
};

const controls: Array<{
  key: keyof ForecastInputs;
  label: string;
  low: string;
  high: string;
}> = [
  {
    key: "capability",
    label: "Capability velocity",
    low: "Incremental",
    high: "Compounding",
  },
  {
    key: "efficiency",
    label: "Compute efficiency",
    low: "Constrained",
    high: "Accelerating",
  },
  {
    key: "reliability",
    label: "Autonomous reliability",
    low: "Brittle",
    high: "Robust",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function ForecastPanel() {
  const [inputs, setInputs] = useState<ForecastInputs>({
    capability: 58,
    efficiency: 52,
    reliability: 41,
  });

  const result = useMemo(() => {
    const shift =
      (inputs.capability - 50) * -0.046 +
      (inputs.efficiency - 50) * -0.028 +
      (inputs.reliability - 50) * -0.038;
    const midpoint = clamp(2033.2 + shift, 2029.2, 2041.5);
    const uncertainty =
      2.5 + (100 - inputs.reliability) * 0.032 +
      Math.abs(inputs.capability - inputs.efficiency) * 0.012;
    const earliest = Math.round(midpoint - uncertainty);
    const latest = Math.round(midpoint + uncertainty);
    const confidence = Math.round(
      clamp(
        48 + inputs.reliability * 0.24 -
          Math.abs(inputs.capability - inputs.efficiency) * 0.11,
        38,
        72,
      ),
    );
    const phase =
      midpoint < 2032
        ? "Autonomous research networks"
        : midpoint < 2036
          ? "Cross-domain generalist systems"
          : "Reliable economic agents";
    return { earliest, latest, confidence, phase };
  }, [inputs]);

  return (
    <div className="forecast-lab">
      <div className="forecast-lab__result" aria-live="polite">
        <span className="micro-label">MODEL OUTPUT / V0.8</span>
        <strong>
          {result.earliest}<i>—</i>{result.latest}
        </strong>
        <p>{result.phase}</p>
        <div className="forecast-lab__confidence">
          <span>Scenario confidence</span>
          <span>{result.confidence}%</span>
          <div aria-hidden="true">
            <i style={{ width: `${result.confidence}%` }} />
          </div>
        </div>
      </div>

      <div className="forecast-lab__controls">
        {controls.map((control) => (
          <label key={control.key}>
            <span>
              {control.label}
              <b>{inputs[control.key]}</b>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={inputs[control.key]}
              onChange={(event) =>
                setInputs((current) => ({
                  ...current,
                  [control.key]: Number(event.target.value),
                }))
              }
            />
            <small>
              <span>{control.low}</span>
              <span>{control.high}</span>
            </small>
          </label>
        ))}
      </div>

      <p className="forecast-lab__note">
        A transparent scenario heuristic. It is designed to compare assumptions,
        not to certify an AGI arrival date.
      </p>
    </div>
  );
}