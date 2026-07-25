"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ForecastPanel } from "./components/ForecastPanel";
import dynamic from "next/dynamic";
import { milestones } from "./lib/milestones";
import type { AgentFeed } from "./lib/agent-types";

const IntelligenceCorridor = dynamic(
  () => import("./components/IntelligenceCorridor").then((module) => module.IntelligenceCorridor),
  { ssr: false },
);

export default function Home() {
  const scrollRef = useRef<HTMLElement>(null);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const frameRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [feed, setFeed] = useState<AgentFeed | null>(null);
  const [feedError, setFeedError] = useState(false);

  const moveTo = useCallback((index: number) => {
    const next = Math.min(Math.max(index, 0), milestones.length - 1);
    sectionRefs.current[next]?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.index);
        if (Number.isFinite(index)) setActiveIndex(index);
      },
      { root: container, threshold: [0.4, 0.58, 0.76] },
    );

    sectionRefs.current.forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const updateProgress = () => {
      frameRef.current = null;
      const max = Math.max(container.scrollHeight - container.clientHeight, 1);
      setProgress(container.scrollTop / max);
    };
    const handleScroll = () => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(updateProgress);
      }
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    updateProgress();
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;
      if (["ArrowDown", "ArrowRight", "PageDown"].includes(event.key)) {
        event.preventDefault();
        moveTo(activeIndex + 1);
      }
      if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        moveTo(activeIndex - 1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, moveTo]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/signals", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Signal sweep failed");
        return response.json() as Promise<AgentFeed>;
      })
      .then((data) => setFeed(data))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setFeedError(true);
      });
    return () => controller.abort();
  }, []);

  const active = milestones[activeIndex];
  const feedOnline = feed?.status === "online" && !feedError;

  return (
    <div className="experience-shell">
      <a className="skip-link" href="#timeline">
        Skip to timeline
      </a>
      <IntelligenceCorridor
        progress={progress}
        activeIndex={activeIndex}
        nodeCount={milestones.length}
      />

      <header className="topbar">
        <button className="brand" onClick={() => moveTo(0)} aria-label="Return to origin">
          <span className="brand__mark" aria-hidden="true">A∕V</span>
          <span>
            <b>AGI / VECTOR</b>
            <small>FRONTIER INTELLIGENCE MAP</small>
          </span>
        </button>
        <div className={`agent-status ${feedOnline ? "is-online" : ""}`}>
          <i aria-hidden="true" />
          <span>
            {feedOnline
              ? `VECTOR-01 LIVE / ${milestones.length} NODES`
              : feedError
                ? `FEED DEGRADED / ${milestones.length} NODES`
                : `AGENT SWEEPING / ${milestones.length} NODES`}
          </span>
        </div>
        <button className="forecast-jump" onClick={() => moveTo(milestones.length - 1)}>
          <span>Forecast lab</span>
          <span aria-hidden="true">↗</span>
        </button>
      </header>

      <nav className="timeline-rail" aria-label="AI development timeline">
        <div className="timeline-rail__track" aria-hidden="true">
          <i style={{ height: `${progress * 100}%` }} />
        </div>
        {milestones.map((milestone, index) => (
          <button
            key={milestone.id}
            className={[
              index === activeIndex ? "is-active" : "",
              milestone.railAnchor ? "is-anchor" : "",
            ].filter(Boolean).join(" ")}
            onClick={() => moveTo(index)}
            aria-current={index === activeIndex ? "step" : undefined}
            aria-label={`Go to ${milestone.year}: ${milestone.shortTitle}`}
          >
            <span>{milestone.year}</span>
            <i aria-hidden="true" />
          </button>
        ))}
      </nav>

      <main id="timeline" ref={scrollRef} className="timeline-viewport">
        {milestones.map((milestone, index) => (
          <section
            key={milestone.id}
            id={milestone.id}
            data-index={index}
            ref={(node) => {
              sectionRefs.current[index] = node;
            }}
            className={`timeline-section timeline-section--${milestone.id} ${index === activeIndex ? "is-active" : ""}`}
            aria-labelledby={`${milestone.id}-title`}
          >
            <div className="timeline-section__content">
              {index === 0 ? (
                <div className="hero-lockup">
                  <p className="micro-label">
                    LIVE INTELLIGENCE CARTOGRAPHY / 1950-NEXT / {milestones.length} NODES
                  </p>
                  <h1 id={`${milestone.id}-title`}>
                    Map the distance to <span>general intelligence.</span>
                  </h1>
                  <p className="hero-lockup__lede">
                    Move through {milestones.length - 2} documented breakthroughs,
                    track today&apos;s frontier signals, then stress-test what comes next.
                  </p>
                  <div className="hero-lockup__actions">
                    <button className="primary-action" onClick={() => moveTo(1)}>
                      Enter the timeline <span aria-hidden="true">↓</span>
                    </button>
                    <span>SCROLL / ARROW KEYS</span>
                  </div>
                  <div className="origin-stamp">
                    <span>ORIGIN NODE</span>
                    <b>{milestone.year}</b>
                    <p>{milestone.summary}</p>
                  </div>
                </div>
              ) : milestone.id === "frontier" ? (
                <div className="frontier-feed">
                  <p className="micro-label">{milestone.era} / CONTINUOUS SWEEP</p>
                  <h2 id={`${milestone.id}-title`}>{milestone.title}</h2>
                  <p className="section-lede">{milestone.summary}</p>
                  <div className="agent-readout" aria-label="VECTOR-01 agent state">
                    <div>
                      <span>MEMORY</span>
                      <b>{feed?.mode === "persistent" ? "D1 ONLINE" : "INITIALIZING"}</b>
                    </div>
                    <div>
                      <span>CHANGESET</span>
                      <b>
                        {feed
                          ? `${feed.forecast.newSignals} NEW / ${feed.forecast.updatedSignals} UPDATED`
                          : "SCANNING"}
                      </b>
                    </div>
                    <div>
                      <span>NEXT SWEEP</span>
                      <b>
                        {feed?.nextSweepAt
                          ? new Date(feed.nextSweepAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "PENDING"}
                      </b>
                    </div>
                    <div className={`agent-readout__pressure is-${feed?.forecast.direction ?? "stable"}`}>
                      <span>FORECAST PRESSURE</span>
                      <b>
                        {feed
                          ? `${feed.forecast.direction.toUpperCase()} / ${feed.forecast.shiftYears.toFixed(1)}Y`
                          : "CALCULATING"}
                      </b>
                    </div>
                  </div>
                  <div className="signal-list" aria-live="polite">
                    {feed?.signals.length ? (
                      feed.signals.slice(0, 5).map((signal, signalIndex) => (
                        <a
                          href={signal.url}
                          target="_blank"
                          rel="noreferrer"
                          key={`${signal.url}-${signalIndex}`}
                          className="signal-row"
                        >
                          <span className="signal-row__index">0{signalIndex + 1}</span>
                          <span className="signal-row__body">
                            <small>
                              <em className={`is-${signal.change.toLowerCase()}`}>
                                {signal.change}
                              </em>
                              {signal.category} / {signal.source}
                            </small>
                            <b>{signal.title}</b>
                          </span>
                          <span className="signal-row__score">{signal.score}</span>
                          <span className="signal-row__arrow" aria-hidden="true">↗</span>
                        </a>
                      ))
                    ) : (
                      <div className="signal-empty">
                        <i aria-hidden="true" />
                        <span>{feedError ? "Live sources are temporarily unreachable." : "Sweeping official research and lab feeds…"}</span>
                      </div>
                    )}
                  </div>
                  <div className="sweep-meta">
                    <span>SOURCES / OPENAI · GOOGLE AI · ARXIV FRONTIER</span>
                    <span>
                      {feed?.generatedAt
                        ? `LAST SWEEP ${new Date(feed.generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} / ${feed.trigger.toUpperCase()}`
                        : "INITIALIZING"}
                    </span>
                  </div>
                </div>
              ) : index === milestones.length - 1 ? (
                <div className="forecast-section">
                  <p className="micro-label">{milestone.era} / ASSUMPTION ENGINE</p>
                  <h2 id={`${milestone.id}-title`}>{milestone.title}</h2>
                  <p className="section-lede">{milestone.summary}</p>
                  <ForecastPanel agentForecast={feed?.forecast} />
                  <footer>
                    <span>AGI / VECTOR</span>
                    <span>PROBABILISTIC · SOURCE-AWARE · AUDITABLE</span>
                  </footer>
                </div>
              ) : (
                <div className="milestone-lockup">
                  <p className="micro-label">
                    NODE {String(index + 1).padStart(2, "0")} / {milestone.era}
                  </p>
                  <div className="milestone-lockup__year">{milestone.year}</div>
                  <h2 id={`${milestone.id}-title`}>{milestone.title}</h2>
                  <p className="section-lede">{milestone.summary}</p>
                  <button className="next-node" onClick={() => moveTo(index + 1)}>
                    Continue to {milestones[index + 1].year}
                    <span aria-hidden="true">↓</span>
                  </button>
                </div>
              )}
            </div>
          </section>
        ))}
      </main>

      <aside className="node-inspector" aria-live="polite">
        <div className="node-inspector__header">
          <span>SELECTED NODE</span>
          <span>
            {String(activeIndex + 1).padStart(2, "0")} / {String(milestones.length).padStart(2, "0")}
          </span>
        </div>
        <div className="node-inspector__year">
          <span>{active.year}</span>
          <i className={`status-dot status-dot--${active.status}`} aria-hidden="true" />
        </div>
        <h2>{active.shortTitle}</h2>
        <p>{active.detail}</p>
        <dl>
          {active.metrics.map((metric) => (
            <div key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
        {active.sources.length > 0 && (
          <div className="node-inspector__sources">
            <span>PRIMARY REFERENCES</span>
            {active.sources.map((source) => (
              <a key={source.href} href={source.href} target="_blank" rel="noreferrer">
                {source.label}<span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        )}
      </aside>

      <div className="coordinates" aria-hidden="true">
        <span>LAT 43.6532</span>
        <span>LON −79.3832</span>
        <span>VECTOR {(progress * 100).toFixed(1)}</span>
      </div>
    </div>
  );
}
