import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useRef, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { Star } from 'lucide-react';
import { showSuccessToast, showErrorToast } from "./lib/toast";

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
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-[#0f172a] to-[#1f2937] text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <div className="text-white text-xl font-semibold">Loading anime details...</div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center">
        <div className="text-center bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <div className="text-white text-xl font-semibold">Error loading anime details</div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0f172a] to-[#1f2937] text-white min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Enhanced Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-full text-white font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-purple-500/30"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
          Back
        </button>

        {/* Hero Section with Enhanced Design */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Enhanced Poster */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-rbg-gradient-to-b from-black via-[#0f172a] to-[#1f2937] text-white min-h-screen rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            <img
              src={anime.images.webp.large_image_url}
              alt={anime.title}
              className="relative w-full lg:w-80 xl:w-96 rounded-2xl shadow-2xl object-cover transform transition-transform duration-500 group-hover:scale-105"
            />
            {/* Score Badge */}
            {anime.score && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-3 py-1 rounded-full text-sm shadow-lg">
                ⭐ {anime.score}
              </div>
            )}
          </div>

          {/* Enhanced Info Section */}
          <div className="flex-1 flex flex-col justify-center space-y-3">
            <div className="space-y-2">
              <h1 className="text-3xl xl:text-4xl font-black bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent leading-tight">
                {anime.title}
              </h1>
              {anime.title_english && anime.title_english !== anime.title && (
                <p className="text-lg text-purple-300 font-medium opacity-90">
                  {anime.title_english}
                </p>
              )}
            </div>

            {/* Enhanced Genres */}
            <div className="flex flex-wrap gap-3">
              {anime.genres.map((genre: Genre, index: number) => (
                <span
                  key={genre.mal_id}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Enhanced Description */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {anime.synopsis}
              </p>
            </div>

            {/* Enhanced Watch Button */}
            <a
              href={`https://myanimelist.net/anime/${anime.mal_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 w-max bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110">▶</span>
              <span className="text-lg">View on MyAnimeList</span>
            </a>
          </div>
        </div>

        {/* Enhanced Details Section */}
        <section className="mb-8 bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-4 shadow-xl">
          <h2 className="text-2xl font-black mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent text-center">
            Anime Details
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Episodes", value: anime.episodes ?? "?", icon: "📺" },
              { label: "Status", value: anime.status ?? "Unknown", icon: "📊" },
              { label: "Rating", value: anime.rating ?? "Unknown", icon: "🔞" },
              { label: "Score", value: anime.score ?? "N/A", icon: "⭐" },
              { label: "Duration", value: anime.duration ?? "Unknown", icon: "⏱️" },
              { 
                label: "Aired", 
                value: anime.aired ? `${formatDate(anime.aired.from)} - ${formatDate(anime.aired.to)}` : "Unknown",
                icon: "📅"
              },
              { label: "Popularity", value: anime.popularity ?? "N/A", icon: "🔥" },
              { label: "Members", value: anime.members?.toLocaleString() ?? "N/A", icon: "👥" }
            ].map((item, index) => (
              <div
                key={item.label}
                className="group bg-gradient-to-br from-slate-700/60 to-slate-800/60 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </div>
                <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wide mb-2">
                  {item.label}
                </h3>
                <p className="text-white font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Enhanced Trailer Section */}
        {anime.trailer && anime.trailer.youtube_id && (
          <div className="mb-16">
            <h2 className="text-4xl font-black mb-8 bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent text-center">
              🎬 Official Trailer
            </h2>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative aspect-video max-w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50">
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
          </div>
        )}

        {/* Enhanced Characters Section */}
        {characters && characters.length > 0 && (
          <div className="mb-16">
            <h2 className="text-4xl font-black mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent text-center">
              ✨ Main Characters
            </h2>

            <div className="relative">
              <div
                ref={charactersRef}
                className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide px-8 pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {characters.slice(0, 12).map((char, index) => (
                  <div
                    key={char.character.mal_id}
                    className="group bg-gradient-to-b from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 shadow-xl hover:shadow-2xl w-48 flex-shrink-0 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                    title={char.character.name}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                      <img
                        src={char.character.images.webp.image_url}
                        alt={char.character.name}
                        className="relative rounded-xl w-full aspect-[3/4] object-cover transition-transform duration-500"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold text-sm mb-1 line-clamp-2">
                        {char.character.name}
                      </p>
                      <p className="text-purple-400 text-xs font-medium uppercase tracking-wide">
                        {char.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced Scroll Buttons */}
              <button
                onClick={() => charactersRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
                className="absolute top-1/2 left-2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white flex items-center justify-center rounded-full shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm border border-purple-500/30"
                aria-label="Scroll characters left"
              >
                ‹
              </button>
              <button
                onClick={() => charactersRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
                className="absolute top-1/2 right-2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white flex items-center justify-center rounded-full shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm border border-purple-500/30"
                aria-label="Scroll characters right"
              >
                ›
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Recommendations Section */}
        {recommendations && recommendations.length > 0 && (
          <div className="mb-16">
            <h2 className="text-4xl font-black mb-8 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent text-center">
              🎯 More Like This
            </h2>
            <div className="relative">
              <div
                ref={recommendationsRef}
                className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide px-8 pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {recommendations.slice(0, 10).map((rec, index) => (
                  <div
                    key={rec.entry.mal_id}
                    onClick={() => navigate(`/anime/${rec.entry.mal_id}`)}
                    className="group cursor-pointer bg-gradient-to-b from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl hover:shadow-2xl w-48 flex-shrink-0 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden"
                    title={rec.entry.title}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                      <img
                        src={rec.entry.images.webp.image_url}
                        alt={rec.entry.title}
                        className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <p className="font-bold text-white text-sm line-clamp-2 group-hover:text-green-300 transition-colors duration-300">
                        {rec.entry.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced Scroll Buttons */}
              <button
                onClick={() => recommendationsRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
                className="absolute top-1/2 left-2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white flex items-center justify-center rounded-full shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm border border-green-500/30"
                aria-label="Scroll recommendations left"
              >
                ‹
              </button>
              <button
                onClick={() => recommendationsRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
                className="absolute top-1/2 right-2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white flex items-center justify-center rounded-full shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm border border-green-500/30"
                aria-label="Scroll recommendations right"
              >
                ›
              </button>
            </div>
          </div>
        )}
        {/* Reviews Section (moved to end) */}
        <section className="mb-8 bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-4 shadow-xl">
          <h2 className="text-2xl font-black mb-4 bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent text-center">
            📝 Reviews
          </h2>
          <Reviews animeId={anime.mal_id} />
        </section>
      </div>
    </div>
  );
}

type Review = {
  username: string;
  text: string;
  date: string;
  rating?: number;
};

function Reviews({ animeId }: { animeId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Load reviews from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`reviews_${animeId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setReviews(parsed);
        } else {
          setReviews([]);
        }
      } else {
        setReviews([]);
      }
    } catch {
      setReviews([]);
    }
  }, [animeId]);

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(`reviews_${animeId}`, JSON.stringify(reviews));
    } catch {}
  }, [reviews, animeId]);

  // Calculate average rating
  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !text.trim() || rating === 0) {
      setError("Please enter your name, review, and rating.");
      setSuccess(false);
      return;
    }
    setError("");
    setSuccess(true);
    const newReview = {
      username: username.trim(),
      text: text.trim(),
      date: new Date().toLocaleString(),
      rating,
    };
    setReviews([newReview, ...reviews]);
    setUsername("");
    setText("");
    setRating(0);
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleDelete = (idx: number) => {
    setReviews(reviews.filter((_, i) => i !== idx));
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-xl p-4 shadow border border-slate-700/60 max-w-2xl mx-auto">
      {avgRating && (
        <div className="flex items-center gap-2 mb-2 justify-center">
          <span className="text-yellow-400 font-bold text-lg">{avgRating}</span>
          <Star className="text-yellow-400 w-5 h-5" fill="#facc15" />
          <span className="text-slate-400 text-sm">({reviews.length} review{reviews.length > 1 ? 's' : ''})</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2 items-center">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <input
            type="text"
            className="flex-1 p-2 rounded border border-slate-600 bg-slate-900 text-white text-sm"
            placeholder="Your name"
            value={username}
            onChange={e => setUsername(e.target.value)}
            maxLength={20}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold py-1 px-4 rounded shadow hover:from-pink-600 hover:to-orange-600 text-sm"
          >
            Submit
          </button>
        </div>
        <textarea
          className="w-full p-2 rounded border border-slate-600 bg-slate-900 text-white text-sm"
          placeholder="Write your review..."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
          maxLength={400}
        />
        {/* Star rating input */}
        <div className="flex gap-1 items-center justify-center my-1">
          {[1,2,3,4,5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-500'} />
            </button>
          ))}
          <span className="ml-2 text-slate-400 text-xs">{rating ? `${rating} / 5` : 'Rate'}</span>
        </div>
        {error && <div className="text-red-400 text-xs w-full text-left">{error}</div>}
        {success && <div className="text-emerald-400 text-xs w-full text-left">Review submitted!</div>}
      </form>
      <hr className="my-4 border-slate-700/50" />
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center text-slate-400 text-center">
            <Star className="w-10 h-10 mb-2 text-slate-700" />
            No reviews yet. Be the first to review!
          </div>
        ) : (
          reviews.map((review, idx) => (
            <div key={idx} className="relative flex gap-3 items-start bg-slate-800/90 border border-slate-700 rounded-lg p-3 shadow hover:shadow-lg transition-all group">
              {/* Avatar */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-base shadow-md">
                {review.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-orange-400 text-sm">{review.username}</span>
                  <span className="text-xs text-slate-400">{review.date}</span>
                  <span className="flex items-center gap-1 ml-2">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className={`w-3 h-3 ${star <= (review.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-500'}`} />
                    ))}
                  </span>
                </div>
                <div className="text-white whitespace-pre-line text-sm">{review.text}</div>
              </div>
              {/* Delete button for your own review (by name) */}
              {review.username === username && (
                <button
                  onClick={() => handleDelete(idx)}
                  className="absolute top-2 right-2 text-xs text-red-400 hover:text-red-600 bg-slate-900/80 rounded px-2 py-0.5 shadow"
                  title="Delete your review"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}