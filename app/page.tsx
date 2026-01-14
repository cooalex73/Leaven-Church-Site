import Image from "next/image";

export default function Home() {
  return (
    <main className="py-12">
      <h1 className="text-4xl font-bold">Leaven Church</h1>
      <p className="mt-4 text-lg text-white/80">
        Welcome. Join us for worship and community
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <a className="rounded-xl border border-white/10 p-6 hover:border-white/20" href="/messages">
          <h2 className="text-xl font-semibold">
            Watch Messages
          </h2>
          <p className="mt-2 text-white/20">Latest Sermon on YouTube</p>
        </a>

        <a className="rounded-xl border border-white/10 p-6 hover:border-white/20" href="/visit">
          <h2 className="text-xl font-semibold">Visit Us</h2>
          <p className="mt-2 text-white/70">Service time & location</p>
        </a>
      </div>
    </main>
  );
}
