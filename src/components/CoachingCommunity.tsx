const coachingReels = [
  {
    href: "https://www.instagram.com/p/DaMGn91K-4P/",
    src: "/videos/coaching-01.mp4",
    label: "Every session counts",
  },
  {
    href: "https://www.instagram.com/p/DaU4YVOOg5l/",
    src: "/videos/coaching-02.mp4",
    label: "Trust the process",
  },
  {
    href: "https://www.instagram.com/p/Db6FPiYyTf6/",
    src: "/videos/coaching-03.mp4",
    label: "Built through the work",
  },
  {
    href: "https://www.instagram.com/p/DbLyiC2OzVs/",
    src: "/videos/coaching-04.mp4",
    label: "Real progress",
  },
  {
    href: "https://www.instagram.com/p/DbJXBLUuyFA/",
    src: "/videos/coaching-05.mp4",
    label: "Better every day",
  },
] as const;

export function CoachingCommunity() {
  return (
    <section className="coaching-community" aria-labelledby="coaching-community-title">
      <div className="coaching-community__inner">
        <div className="coaching-community__intro">
          <div>
            <p className="eyebrow">THE PHENO COMMUNITY</p>
            <h2 id="coaching-community-title">The work, in motion.</h2>
          </div>
          <p>
            Real sessions from Yousef&apos;s coaching community. Follow the process, keep showing up, and pursue the rise.
          </p>
        </div>

        <div className="coaching-community__grid">
          {coachingReels.map((reel, index) => (
            <a
              className="coaching-community__card"
              href={reel.href}
              key={reel.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open PHENO coaching video ${index + 1}, ${reel.label}`}
            >
              <video
                className="coaching-community__video"
                src={reel.src}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-hidden="true"
              />
              <span className="coaching-community__shade" aria-hidden="true" />
              <span className="coaching-community__badge" aria-hidden="true">Instagram</span>
              <span className="coaching-community__meta">
                <strong>{reel.label}</strong>
                <span>View session ↗</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
