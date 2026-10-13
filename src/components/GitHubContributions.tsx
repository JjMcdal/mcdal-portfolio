import { useEffect, useMemo, useState } from "react";

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
type ApiResponse = { total: Record<string, number>; contributions: Day[] };

export type Palette = "forest" | "sage" | "silver" | "tan" | "navy";

type Props = {
  username?: string;
  years?: number[];
  palette?: Palette;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const thisYear = new Date().getFullYear();

export default function GitHubContributions({
  username = "JjMcdal",
  years = [thisYear, thisYear - 1, thisYear - 2],
  palette = "forest",
}: Props) {
  const [year, setYear] = useState(years[0]);
  const [cache, setCache] = useState<Record<number, ApiResponse>>({});
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (cache[year]) {
      setStatus("ready");
      return;
    }
    let cancelled = false;
    setStatus("loading");
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`)
      .then((r) => {
        if (!r.ok) throw new Error("bad response");
        return r.json() as Promise<ApiResponse>;
      })
      .then((data) => {
        if (cancelled) return;
        setCache((c) => ({ ...c, [year]: data }));
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [year, username, cache]);

  const data = cache[year];

  // Group days into week columns (Sunday on top, same as GitHub)
  const { weeks, monthLabels } = useMemo(() => {
    if (!data) return { weeks: [] as (Day | null)[][], monthLabels: [] as { label: string; col: number }[] };
    const days = data.contributions.filter((d) => d.date.startsWith(String(year)));
    const cols: (Day | null)[][] = [];
    let col: (Day | null)[] = new Array(new Date(days[0].date + "T00:00:00").getDay()).fill(null);
    for (const d of days) {
      col.push(d);
      if (col.length === 7) {
        cols.push(col);
        col = [];
      }
    }
    if (col.length) cols.push([...col, ...new Array(7 - col.length).fill(null)]);

    const labels: { label: string; col: number }[] = [];
    let last = -1;
    cols.forEach((c, i) => {
      const first = c.find(Boolean);
      if (!first) return;
      const m = new Date(first.date + "T00:00:00").getMonth();
      if (m !== last) {
        labels.push({ label: MONTHS[m], col: i });
        last = m;
      }
    });
    return { weeks: cols, monthLabels: labels };
  }, [data, year]);

  const total = data?.total?.[year] ?? 0;

  return (
    <section id="github" className="ghc" data-palette={palette}>
      <div className="ghc-card">
        <header className="ghc-head">
          <div className="ghc-title">
            <svg viewBox="0 0 16 16" width="32" height="32" aria-hidden="true" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            <div>
              <p className="ghc-eyebrow">GitHub contributions</p>
              <h3 aria-live="polite">
                {status === "ready"
                  ? `${total.toLocaleString()} contribution${total === 1 ? "" : "s"} in ${year}`
                  : `Contributions in ${year}`}
              </h3>
            </div>
          </div>

          <div className="ghc-controls">
            <div className="ghc-tabs" role="tablist" aria-label="Contribution year">
              {years.map((y) => (
                <button
                  key={y}
                  role="tab"
                  aria-selected={y === year}
                  className={y === year ? "active" : ""}
                  onClick={() => setYear(y)}
                >
                  {y}
                </button>
              ))}
            </div>
            <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" className="ghc-profile">
              View profile ↗
            </a>
          </div>
        </header>

        {status === "error" && (
          <p className="ghc-msg">
            Hindi ma-load ang contributions ngayon. <a href={`https://github.com/${username}`}>Tingnan sa GitHub</a>.
          </p>
        )}
        {status === "loading" && <p className="ghc-msg">Loading {year}…</p>}

        {status === "ready" && (
          <div className="ghc-scroll">
            <div className="ghc-grid-wrap">
              <div className="ghc-months" style={{ gridTemplateColumns: `repeat(${weeks.length}, var(--cell))` }}>
                {monthLabels.map((m) => (
                  <span key={m.label + m.col} style={{ gridColumnStart: m.col + 1 }}>
                    {m.label}
                  </span>
                ))}
              </div>
              <div className="ghc-body">
                <div className="ghc-days">
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                </div>
                <div className="ghc-grid" role="img" aria-label={`${total} contributions in ${year}`}>
                  {weeks.map((w, i) => (
                    <div className="ghc-col" key={i}>
                      {w.map((d, j) =>
                        d ? (
                          <span
                            key={j}
                            className="ghc-cell"
                            data-level={d.level}
                            title={`${d.count} contribution${d.count === 1 ? "" : "s"} on ${d.date}`}
                          />
                        ) : (
                          <span key={j} className="ghc-cell ghc-blank" />
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="ghc-legend" aria-hidden="true">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className="ghc-cell" data-level={l} />
          ))}
          <span>More</span>
        </footer>
      </div>
    </section>
  );
}