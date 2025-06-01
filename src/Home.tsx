import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useCallback, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

export function Home() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["trending-anime"],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `https://api.jikan.moe/v4/top/anime?filter=bypopularity&page=${pageParam}`
      );
      if (!res.ok) throw new Error("Failed to fetch trending anime.");
      return res.json();
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.has_next_page
        ? lastPage.pagination.current_page + 1
        : undefined;
    },
  });

  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "100px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [handleObserver]);

  const [slideIndex, setSlideIndex] = useState(0);
  const allAnime = data?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    if (allAnime.length === 0) return;
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % allAnime.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [allAnime.length]);

  if (isLoading) return <p className="p-6 text-white">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">Error loading anime</p>;

  return (
    <main className="bg-gradient-to-b from-black via-[#0f172a] to-[#1f2937] text-white">
      {/* Slideshow */}
      <section className="relative w-full h-screen overflow-hidden">
        {allAnime.map((anime, i) => (
          <div
            key={anime.mal_id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === slideIndex ? "opacity-100 z-10" : "opacity-0 pointer-events-none"
            }`}
          >
            <img
                src={anime.images.webp.large_image_url}
                alt={anime.title}
                className="w-full h-full object-contain object-center bg-black"
                loading="lazy"
             />

            <div className="absolute bottom-10 left-10 bg-black bg-opacity-60 text-white px-6 py-4 rounded-lg max-w-xl backdrop-blur-md shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-red-500">{anime.title}</h2>
              <p className="mt-2 text-sm line-clamp-4">{anime.synopsis}</p>
            </div>
          </div>
        ))}
      </section>

      {}
      <section className="px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 text-red-500 border-b border-red-700 inline-block">
          🔥 Trending Anime
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {allAnime.map((anime) => (
            <Card
                key={anime.mal_id}
                className="card-shadow flex flex-col overflow-hidden rounded-xl border border-red-700 transition-transform hover:scale-[1.02] bg-[#0e0e0e] text-white"
              >
              <img
                src={anime.images.webp.large_image_url}
                alt={anime.title}
                className="w-full h-64 object-cover rounded-t-xl"
                loading="lazy"
              />

              <CardHeader className="p-4">
                <CardTitle className="text-lg font-semibold line-clamp-2 text-emerald-300">
                  <a href={anime.url} target="_blank" rel="noreferrer" className="hover:underline">
                    {anime.title}
                  </a>
                </CardTitle>
                <CardDescription className="text-sm text-gray-300 mt-1">
                  {anime.type} • {anime.episodes ?? "?"} eps • {anime.duration ?? "?"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-gray-400 line-clamp-4">{anime.synopsis}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div ref={observerRef} className="h-10 mt-6 text-center text-gray-300">
          {isFetchingNextPage && <p>Loading more...</p>}
          {!hasNextPage && <p>No more anime to load</p>}
        </div>
      </section>
    </main>
  );
}
