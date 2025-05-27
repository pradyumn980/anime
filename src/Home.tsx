import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useCallback, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import type { AnimeListResponse } from "./api-response";

export function Home() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery<AnimeListResponse>({
    queryKey: ["trending"],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(`/api/anime?q=trending&page=${pageParam}`);
      if (!res.ok) throw new Error("Failed to fetch trending anime.");
      return res.json();
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.data || lastPage.data.length === 0) return undefined;
      return pages.length + 1;
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

  // Slideshow state
  const [slideIndex, setSlideIndex] = useState(0);

  // Flatten anime list to one array for slideshow
  const allAnime = data?.pages.flatMap((page) => page.data) ?? [];

  // Auto slide every 5s
  useEffect(() => {
    if (allAnime.length === 0) return;
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % allAnime.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [allAnime.length]);

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">Error loading anime</p>;

  return (
    <main className="max-w-7xl mx-auto">
      {/* Fullscreen slideshow */}
      <section className="relative w-full h-screen overflow-hidden rounded-lg shadow-lg mb-12">
        {allAnime.length > 0 && allAnime.map((anime, i) => (
          <div
            key={anime.mal_id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === slideIndex ? "opacity-100 z-10" : "opacity-0 pointer-events-none"
            }`}
          >
            <img
              src={anime.images.webp.image_url}
              alt={anime.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Optional overlay with title */}
            <div className="absolute bottom-10 left-10 bg-black bg-opacity-50 text-white px-6 py-3 rounded-md max-w-lg">
              <h2 className="text-3xl font-bold">{anime.title}</h2>
              <p className="mt-1 text-sm max-h-24 overflow-hidden">{anime.synopsis}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Trending Anime Cards */}
      <section className="px-6">
        <h2 className="text-2xl font-bold mb-6 text-emerald-600">🔥 Trending Anime</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allAnime.map((anime) => (
            <Card key={anime.mal_id} className="card-shadow">
              <CardHeader>
                <CardTitle>
                  <a href={anime.url} target="_blank" rel="noreferrer">
                    {anime.title}
                  </a>
                </CardTitle> 
                <CardDescription>
                  {anime.type} - {anime.episodes} eps - {anime.duration}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <img
                  alt={anime.title}
                  className="anime-img"
                  src={anime.images.webp.image_url}
                  loading="lazy"
                />
                <p className="text-sm">{anime.synopsis}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div ref={observerRef} className="h-10 mt-6">
          {isFetchingNextPage && <p>Loading more...</p>}
          {!hasNextPage && <p>No more anime to load</p>}
        </div>
      </section>
    </main>
  );
}
