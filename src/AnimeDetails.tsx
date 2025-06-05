import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useRef, useEffect } from "react";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Unknown";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Types
type Genre = {
  mal_id: number;
  type: string;
  name: string;
  url: string;
};

type Recommendation = {
  entry: {
    mal_id: number;
    title: string;
    images: {
      webp: {
        image_url: string;
      };
    };
  };
};

type Character = {
  character: {
    mal_id: number;
    name: string;
    images: {
      webp: {
        image_url: string;
      };
    };
  };
  role: string;
};

export function AnimeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const charactersRef = useRef<HTMLDivElement>(null);
  const recommendationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const {
    data: anime,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["anime-details", id],
    queryFn: async () => {
      const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
      const json = await res.json();
      if (!res.ok) throw new Error("Failed to fetch anime details.");
      return json.data;
    },
    enabled: !!id,
  });

  const { data: recommendations } = useQuery({
    queryKey: ["anime-recommendations", id],
    queryFn: async () => {
      const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/recommendations`);
      const json = await res.json();
      return json.data as Recommendation[];
    },
    enabled: !!id,
  });

  const { data: characters } = useQuery({
    queryKey: ["anime-characters", id],
    queryFn: async () => {
      const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/characters`);
      const json = await res.json();
      return json.data as Character[];
    },
    enabled: !!id,
  });

  if (isLoading)
    return <div className="p-6 text-white text-lg">Loading...</div>;

  if (error)
    return <div className="p-6 text-red-500 text-lg">Error loading anime details.</div>;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      {/* Back Button */}
     <button
  onClick={() => navigate(-1)}
  className="mb-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-semibold shadow-md"
>
  ← Back
</button>


      {/* Anime Overview */}
<div className="flex flex-col md:flex-row gap-8">
  {/* Poster */}
  <img
    src={anime.images.webp.large_image_url}
    alt={anime.title}
    className="w-full md:w-72 rounded-lg shadow-lg object-cover"
  />

  {/* Info */}
  <div className="flex-1 flex flex-col">
    <h1 className="text-4xl font-extrabold mb-2">{anime.title}</h1>
    <p className="text-gray-300 mb-4">
      {anime.title_english || anime.title}
    </p>

    {/* Genres */}
    <div className="mb-4 flex flex-wrap gap-2">
      {anime.genres.map((genre: Genre) => (
        <span
          key={genre.mal_id}
          className="bg-purple-700 px-3 py-1 rounded-full text-sm font-semibold"
        >
          {genre.name}
        </span>
      ))}
    </div>

    {/* Description */}
    <div className="bg-[#1e293b] p-4 rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-2">Description</h2>
      <p className="text-gray-300 whitespace-pre-line">
        {anime.synopsis}
      </p>
    </div>

    {/* Watch Button */}
    <a
      href={`https://myanimelist.net/anime/${anime.mal_id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block w-max bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-md shadow-md transition duration-300"
    >
      ▶ Watch
    </a>
  </div>
</div>
{/* Details Section */}
<section className="mt-12 bg-[#1e293b] rounded-lg p-6 shadow-md">
  <h2 className="text-3xl font-bold mb-6 text-yellow-300 tracking-wide">Details</h2>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-sans">
    <div className="bg-[#334155] rounded-lg p-4 shadow-md">
      <h3 className="text-purple-400 font-semibold mb-1">Episodes</h3>
      <p>{anime.episodes ?? "?"}</p>
    </div>

    <div className="bg-[#334155] rounded-lg p-4 shadow-md">
      <h3 className="text-purple-400 font-semibold mb-1">Status</h3>
      <p>{anime.status ?? "Unknown"}</p>
    </div>

    <div className="bg-[#334155] rounded-lg p-4 shadow-md">
      <h3 className="text-purple-400 font-semibold mb-1">Rating</h3>
      <p>{anime.rating ?? "Unknown"}</p>
    </div>

    <div className="bg-[#334155] rounded-lg p-4 shadow-md">
      <h3 className="text-purple-400 font-semibold mb-1">Score</h3>
      <p>{anime.score ?? "N/A"}</p>
    </div>

    <div className="bg-[#334155] rounded-lg p-4 shadow-md">
      <h3 className="text-purple-400 font-semibold mb-1">Duration</h3>
      <p>{anime.duration ?? "Unknown"}</p>
    </div>

    <div className="bg-[#334155] rounded-lg p-4 shadow-md">
      <h3 className="text-purple-400 font-semibold mb-1">Aired</h3>
      <p>
        {anime.aired
          ? `${formatDate(anime.aired.from)} - ${formatDate(anime.aired.to)}`
          : "Unknown"}
      </p>
    </div>

    <div className="bg-[#334155] rounded-lg p-4 shadow-md">
      <h3 className="text-purple-400 font-semibold mb-1">Popularity</h3>
      <p>{anime.popularity ?? "N/A"}</p>
    </div>

    <div className="bg-[#334155] rounded-lg p-4 shadow-md">
      <h3 className="text-purple-400 font-semibold mb-1">Members</h3>
      <p>{anime.members?.toLocaleString() ?? "N/A"}</p>
    </div>
  </div>
</section>


      
      {/* Trailer Section */}
{anime.trailer && anime.trailer.youtube_id && (
  <div className="mt-12">
    <h2 className="text-2xl font-bold mb-4 text-purple-400 tracking-wide">Trailer</h2>
    <div className="aspect-video max-w-full rounded-lg overflow-hidden shadow-lg">
      <iframe
        src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}?autoplay=1&mute=1&loop=1&playlist=${anime.trailer.youtube_id}`}
        title="Trailer"
        allow="autoplay; encrypted-media"
        allowFullScreen
        className="w-full h-full"
        frameBorder="0"
      />
    </div>
  </div>
)}

      {/* Characters */}
      {characters && characters.length > 0 && (
        <div className="mt-16">
          <h2 className="text-4xl font-bold mb-4 text-yellow-300 px-2 font-sans">Characters</h2>

          <div className="relative">
            <div
              ref={charactersRef}
              className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pl-8 pr-8"
            >
              {characters.slice(0, 12).map((char) => (
                <div
                  key={char.character.mal_id}
                  className="bg-[#1e293b] rounded-lg p-3 shadow-md w-40 flex-shrink-0 hover:scale-105 transition-transform"
                  title={char.character.name}
                >
                  <img
                    src={char.character.images.webp.image_url}
                    alt={char.character.name}
                    className="rounded-md w-full aspect-[3/4] object-cover mb-2"
                  />
                  <p className="text-sm text-white font-semibold truncate">{char.character.name}</p>
                  <p className="text-xs text-gray-400 italic truncate">{char.role}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => charactersRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
              className="absolute top-1/2 left-0 -translate-y-1/2 w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center"
              aria-label="Scroll characters left"
            >
              ‹
            </button>
            <button
              onClick={() => charactersRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
              className="absolute top-1/2 right-0 -translate-y-1/2 w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center"
              aria-label="Scroll characters right"
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4 text-purple-300 px-2">More Like This</h2>
          <div className="relative">
            <div
              ref={recommendationsRef}
              className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pl-8 pr-8"
            >
              {recommendations.slice(0, 10).map((rec) => (
                <div
                  key={rec.entry.mal_id}
                  onClick={() => navigate(`/anime/${rec.entry.mal_id}`)}
                  className="cursor-pointer bg-[#1e293b] rounded-lg shadow-md hover:scale-105 transition-transform w-40 flex-shrink-0"
                  title={rec.entry.title}
                >
                  <img
                    src={rec.entry.images.webp.image_url}
                    alt={rec.entry.title}
                    className="rounded-t-lg w-full aspect-[3/4] object-cover"
                  />
                  <div className="p-2 text-sm">
                    <p className="font-semibold text-white truncate">
                      {rec.entry.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => recommendationsRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
              className="absolute top-1/2 left-0 -translate-y-1/2 w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center"
              aria-label="Scroll recommendations left"
            >
              ‹
            </button>
            <button
              onClick={() => recommendationsRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
              className="absolute top-1/2 right-0 -translate-y-1/2 w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center"
              aria-label="Scroll recommendations right"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
