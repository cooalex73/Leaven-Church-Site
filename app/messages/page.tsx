import Link from "next/link";
import { fetchLatestVideo } from "@/lib/youtube";
import { useState } from "react";

export default async function MessagePage()
{
    const videos = await fetchLatestVideo();
    const hero = videos[0];
    const rest = videos.slice(1,5);

  return (
    <main className="py-10">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="mt-2 text-white/70">Latest sermons from our YouTube channel</p>
      
        {hero ? (
        <section className="mt-6">
          <div className="relative overflow-hidden rounded-xl border border-white/10">
            <div className="aspect-video w-full bg-black">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${hero.id}`}
                title={hero.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Title overlay (optional) */}
            <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/70 to-transparent p-4">
              <h2 className="text-xl font-semibold">{hero.title}</h2>
            </div>
          </div>
        </section>
      ) : null}

      {/* THUMBNAILS (next 4) */}
      {rest.length ? (
        <section className="mt-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {rest.map((v) => (
              <Link
                key={v.id}
                href={`/messages/${v.id}`}
                className="group overflow-hidden rounded-lg border border-white/10 bg-black/30"
              >
                <div className="aspect-video w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={v.thumbnailUrl}
                    alt={v.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-2 text-sm line-clamp-2">{v.title}</div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}