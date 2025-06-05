// Anime.tsx
import { useState, useEffect } from "react";
import { DevTool } from "@hookform/devtools";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import type { AnimeListResponse } from "./api-response";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

type FormValue = {
  search: string;
  type: string;
  status: string;
};

function AnimeList({ search, type, status }: FormValue) {
  const query = new URLSearchParams();
  if (search) query.set("q", search);
  if (type) query.set("type", type);
  if (status) query.set("status", status);

  const queryString = query.toString();

  const { isPending, error, data } = useQuery<AnimeListResponse>({
    queryKey: ["anime", queryString],
    queryFn: () => fetch(`/api/anime?${queryString}`).then((res) => res.json()),
    enabled: !!search,
  });

  if (!search) return <p className="mt-4 text-slate-300">Search for an anime, e.g: Naruto</p>;
  if (isPending) return <p className="mt-4 text-slate-300">Loading...</p>;
  if (error) return <p className="mt-4 text-red-400">Error: {error.message}</p>;

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data?.data.map((anime) => (
        <Card
          key={anime.mal_id}
          className="bg-slate-800 shadow-lg rounded-xl overflow-hidden text-white border border-slate-700"
        >
          <CardHeader>
            <CardTitle className="text-red-400 hover:text-blue-400 transition">
              <a href={anime.url} target="_blank" rel="noreferrer">
                {anime.title}
              </a>
            </CardTitle>
            <CardDescription className="text-sm text-slate-400">
              {anime.type} - {anime.episodes} eps - {anime.duration}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <img
              alt={anime.title}
              className="object-cover rounded-lg aspect-square max-w-[150px] shadow"
              src={anime.images.webp.image_url}
              loading="lazy"
            />
            <p className="text-sm text-slate-300 line-clamp-5">{anime.synopsis}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
export function Anime() {
  const [searchParams, setSearchParams] = useState<FormValue>({
    search: "",
    type: "",
    status: "",
  });

  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const { control, handleSubmit, setValue } = useForm<FormValue>({
    defaultValues: {
      search: "",
      type: "",
      status: "",
    },
  });

  const onSubmit: SubmitHandler<FormValue> = (data) => {
    const cleanSearch = data.search.trim();
    if (!cleanSearch) return;
    const updatedParams = { ...data, search: cleanSearch };
    setSearchParams(updatedParams);
    updateSearchHistory(cleanSearch);
  };

  const updateSearchHistory = (term: string) => {
    const newHistory = [term, ...searchHistory.filter((item) => item !== term)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem("anime-search-history", JSON.stringify(newHistory));
  };

  const handleHistoryClick = (term: string) => {
    setValue("search", term);
    setSearchParams((prev) => ({ ...prev, search: term }));
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("anime-search-history");
  };

  useEffect(() => {
    const stored = localStorage.getItem("anime-search-history");
    if (stored) {
      setSearchHistory(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-slate-900 to-slate-800 text-white p-6">
      {/* Search Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6"
      >
        <Controller
          name="search"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Search anime..."
              className="w-full sm:max-w-xs bg-slate-700 border border-slate-500 text-white placeholder-slate-300"
            />
          )}
        />
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className="w-full sm:max-w-[150px] bg-slate-700 border border-slate-500 text-white px-2 py-1 rounded-md"
            >
              <option value="">Type</option>
              <option value="tv">TV</option>
              <option value="movie">Movie</option>
              <option value="ova">OVA</option>
              <option value="special">Special</option>
            </select>
          )}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className="w-full sm:max-w-[150px] bg-slate-700 border border-slate-500 text-white px-2 py-1 rounded-md"
            >
              <option value="">Status</option>
              <option value="airing">Airing</option>
              <option value="complete">Completed</option>
              <option value="upcoming">Upcoming</option>
            </select>
          )}
        />
        <Button type="submit" className="bg-red-600 hover:bg-red-700">
          <Search size={16} className="mr-1" />
          Search
        </Button>
      </form>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <div className="mb-6 max-w-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400 font-medium">Recent Searches</span>
            <button
              onClick={clearHistory}
              className="text-sm text-slate-400 hover:underline flex items-center gap-1"
            >
              <X size={14} />
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((item) => (
              <button
                key={item}
                onClick={() => handleHistoryClick(item)}
                className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-md"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Anime List */}
      <AnimeList {...searchParams} />
      <DevTool control={control} />
    </div>
  );
}
