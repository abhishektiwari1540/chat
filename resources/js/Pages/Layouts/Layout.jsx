import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import Footer from "./Footer";
import CardDetails from "../../components/Card";

const Layout = () => {
    const [videos, setVideos] = useState([]);

    const fetchVideos = async () => {
        try {
            // Step 1: Fetch 10 videos from YouTube API
            const searchResponse = await axios.get("https://www.googleapis.com/youtube/v3/search", {
                params: {
                    part: "snippet",
                    q: "seedh-maut", // Change topic if needed
                    maxResults: 10, // Fetch more to filter out unavailable videos
                    type: "video",
                    videoEmbeddable: "true", // Ensures only embeddable videos
                    key: "AIzaSyBnKqLM4zUN2h9baQfAUos6Y7J3b2jyEPU" // Replace with your API key
                }
            });

            // Extract video IDs
            const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(",");

            // Step 2: Check if videos are playable
            const detailsResponse = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
                params: {
                    part: "status",
                    id: videoIds, // Get details for all videos at once
                    key: "AIzaSyBnKqLM4zUN2h9baQfAUos6Y7J3b2jyEPU"
                }
            });

            // Step 3: Filter out unavailable videos
            const playableVideos = detailsResponse.data.items
                .filter(video => video.status.embeddable) // Only keep embeddable videos
                .map(video => video.id);

            // Step 4: Set state with first 6 playable videos
            setVideos(playableVideos.slice(0, 6));

        } catch (error) {
            console.error("Error fetching videos:", error);
        }
    };

    // Call function when component mounts
    useEffect(() => {
        fetchVideos();
    }, []);


  return (
    <div>
      <Header />
      <main className="container my-4">
        <div className="row">
          <div className="col-md-8">
            <h2>Main Content</h2>
            <p>This is the main content area where you can add articles, blog posts, or any other content.</p>
          </div>
          <div className="col-md-4">
            <h2>Sidebar</h2>
            <p>This is a sidebar where you can place additional information, links, or advertisements.</p>
          </div>
        </div>
        <CardDetails />

        <div className="row">
                    <div className="col-md-8">
                        <h2>YouTube Videos</h2>
                        <div className="row">
                            {videos.map((videoId, index) => (
                                <div key={index} className="col-md-4 mb-3">
                                    <div className="embed-responsive embed-responsive-16by9">
                                        <iframe
                                            className="embed-responsive-item"
                                            src={`https://www.youtube.com/embed/${videoId}`}
                                            title={`YouTube Video ${index}`}
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
