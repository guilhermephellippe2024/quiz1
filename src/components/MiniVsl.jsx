import { useEffect, useRef, useState } from "react";
import Player from "@vimeo/player";
import SubscriptionOffers from "./SubscriptionOffers";

export default function MiniVsl() {
  const host = useRef(null);
  const player = useRef(null);
  const [offersVisible, setOffersVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [ended, setEnded] = useState(false);
  const [error, setError] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);
  const [timeline, setTimeline] = useState({ seconds: 0, duration: 0 });
  const [ratio, setRatio] = useState(1);

  useEffect(() => {
    let active = true;
    const instance = new Player(host.current);
    player.current = instance;
    const failed = () => { if (active) setError(true); };
    const timeout = window.setTimeout(failed, 20000);
    instance.on("ended", () => { if (active) { setEnded(true); setTimeline((current) => ({ ...current, seconds: current.duration })); } });
    instance.on("error", failed);
    // Use the video timeline, not time spent on the page (pauses do not advance it).
    instance.on("timeupdate", ({ seconds, duration }) => {
      if (!active) return;
      setTimeline({ seconds, duration });
      if (seconds >= 90) setOffersVisible(true);
    });
    instance.ready().then(async () => {
      if (!active) return;
      window.clearTimeout(timeout);
      setError(false);
      setReady(true);
      const dimensions = await Promise.all([instance.getVideoWidth(), instance.getVideoHeight(), instance.getDuration()]);
      if (active) setTimeline((current) => ({ ...current, duration: dimensions[2] }));
      if (active && dimensions[0] && dimensions[1]) setRatio(dimensions[0] / dimensions[1]);
      // If autoplay is blocked, the sound button remains a manual start action.
      await instance.play().catch(() => { });
    }).catch(failed);
    return () => {
      active = false;
      window.clearTimeout(timeout);
      player.current = null;
      instance.destroy().catch(() => { });
    };
  }, []);

  async function playWithSound() {
    const instance = player.current;
    if (!instance) return;
    setSoundEnabled(true);
    setEnded(false);
    setPlaybackError(false);
    try {
      await instance.setMuted(false);
      // Some mobile devices leave volume control to the physical buttons.
      await instance.setVolume(1).catch(() => { });
      // Restart so the visitor hears the narration from its first sentence.
      await instance.setCurrentTime(0);
      await instance.play();
      if (player.current !== instance) return;
      setSoundEnabled(true);
      setEnded(false);
      setError(false);
    } catch {
      if (player.current === instance) { setSoundEnabled(false); setPlaybackError(true); }
    }
  }

  const progress = timeline.duration > 0 ? Math.min(100, Math.max(0, timeline.seconds / timeline.duration * 100)) : 0;

  return (
    <section className="mini-vsl" aria-label="Apresentação em vídeo">
      <div className="vsl-frame" style={{ aspectRatio: ratio }}>
        <iframe ref={host} className="vsl-player" src="https://player.vimeo.com/video/1231891598?autoplay=1&muted=1&controls=0&loop=0&playsinline=1&title=0&byline=0&portrait=0&badge=0&dnt=1" title="Mini-VSL — Método Geleias que Vendem" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen />
        {!ready && !error && <p className="vsl-message" role="status">Carregando vídeo…</p>}
        {ready && !error && (!soundEnabled || ended) &&
          <button type="button" className="vsl-sound primary-button" onClick={playWithSound}>
            {ended ? "Assistir novamente" : "Ativar som 🔊"}
          </button>
        }
      </div>
      <div className="video-progress">
        <div className="progress-track" role="progressbar" aria-label="Progresso do vídeo" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      </div>
      {playbackError && <p className="sub" role="alert">Não foi possível ativar o áudio. Toque no botão para tentar novamente.</p>}
      {error && <p className="sub" role="alert">Não foi possível reproduzir o vídeo. <a href="https://vimeo.com/1231891598" target="_blank" rel="noreferrer" className="underline">Assistir no Vimeo</a></p>}
      {offersVisible && <SubscriptionOffers />}
    </section>
  );
}
