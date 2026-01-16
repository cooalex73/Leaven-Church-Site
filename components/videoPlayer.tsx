"use client";

import { useState } from "react";
import type { YouTubeVideo } from "@/lib/youtube";

export default function videoPlayer({videos} : {videos: YouTubeVideo[]}){
    const[hero, setHero] = useState(videos[0]);
}