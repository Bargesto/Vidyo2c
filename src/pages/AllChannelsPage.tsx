import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import ChannelAvatar from '../components/ChannelAvatar';
import { Video } from '../types';

const AllChannelsPage = () => {
  const { channelName } = useParams();
  const [videos, setVideos] = useState<Video[]>([]);
  const [channels, setChannels] = useState<string[]>([]);

  useEffect(() => {
    const storedVideos = JSON.parse(localStorage.getItem('videos') || '[]') as Video[];
    setVideos(storedVideos);

    // Extract unique channel names
    const uniqueChannels = Array.from(
      new Set(storedVideos.map((video: Video) => video.channelName))
    ).sort();
    setChannels(uniqueChannels);
  }, []);

  const filteredVideos = channelName
    ? videos.filter(video => video.channelName === channelName)
    : videos;

  if (channelName) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <ChannelAvatar name={channelName} size="lg" />
          <div>
            <h1 className="text-2xl font-bold">{channelName}</h1>
            <p className="text-gray-400">
              {filteredVideos.length} video
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tüm Kanallar</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {channels.map(channel => {
          const channelVideos = videos.filter(video => video.channelName === channel);
          return (
            <div key={channel} className="bg-gray-800 p-4 rounded-lg">
              <ChannelAvatar name={channel} size="lg" />
              <h2 className="text-xl font-semibold mt-4">{channel}</h2>
              <p className="text-gray-400 mb-4">{channelVideos.length} video</p>
              <a
                href={`/channels/${encodeURIComponent(channel)}`}
                className="inline-block bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors"
              >
                Kanala Git
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllChannelsPage;
