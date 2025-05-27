import { useState } from "react";
import { DevTool } from "@hookform/devtools";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";

import type { AnimeListResponse } from "./api-response";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";

type FormValue = {
  search: string;
};

function AnimeList({ name }: { name: string }) {
  const { isPending, error, data } = useQuery<AnimeListResponse>({
    queryKey: ["anime", name],
    queryFn: () => fetch(`/api/anime?q=${name}`).then((res) => res.json()),
    enabled: !!name,
  });

  if (!name) {
    return <p className="mt-4 text-gray-600">Search for an anime, e.g: Naruto</p>;
  }

  if (isPending) {
    return <p className="mt-4">Loading...</p>;
  }

  if (error) {
    return <p className="mt-4 text-red-500">Error: {error.message}</p>;
  }

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data?.data.map((anime) => (
        <Card key={anime.mal_id}>
          <CardHeader>
            <CardTitle>
              <a href={anime.url} target="_blank" rel="noreferrer">
                {anime.title}
              </a>
            </CardTitle>
            <CardDescription>
              {anime.type} - {anime.episodes} episodes - {anime.duration}.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <img
              alt={anime.title}
              className="object-cover rounded-md aspect-square max-w-[150px]"
              src={anime.images.webp.image_url}
            />
            <p>{anime.synopsis}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function Anime() {
  const [searchBy, setSearchBy] = useState("");
  const { control, handleSubmit } = useForm<FormValue>({
    defaultValues: {
      search: "",
    },
  });

  const onSubmit: SubmitHandler<FormValue> = (data) => {
    setSearchBy(data.search);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-emerald-600">MyAnimeList</h1>
        <ul className="flex gap-6 text-gray-700 font-medium">
          <li><a href="#" className="hover:text-emerald-600">Home</a></li>
          <li><a href="#" className="hover:text-emerald-600">Explore</a></li>
          <li><a href="#" className="hover:text-emerald-600">About</a></li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {/* Search Bar */}
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute top-3 left-3 w-4 h-4 text-muted-foreground" />
            <Controller
              name="search"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Search Anime..."
                  className="pl-8 w-full rounded-lg bg-background"
                  {...field}
                />
              )}
            />
          </div>
        </form>

        {/* Anime List */}
        <AnimeList name={searchBy} />
        <DevTool control={control} />
      </main>
    </div>
  );
}
