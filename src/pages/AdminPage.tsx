import { useState, useEffect } from 'react';
import { Plus, X, Presentation, Trash2, ToggleLeft, ToggleRight, Edit2 } from 'lucide-react';
import { Video, HeroContent } from '../types';

const AdminPage = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [heroContent, setHeroContent] = useState<HeroContent[]>([]);
  const [editingHero, setEditingHero] = useState<HeroContent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    youtubeUrl: '',
    grade: 5,
    subject: 'math',
    channelName: ''
  });

  const [heroFormData, setHeroFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    link: '',
    standalone: false,
    includeVideos: true
  });

  useEffect(() => {
    const stored = localStorage.getItem('heroContent');
    if (stored) {
      setHeroContent(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (editingHero) {
      setHeroFormData({
        title: editingHero.title || '',
        description: editingHero.description || '',
        imageUrl: editingHero.imageUrl || '',
        link: editingHero.link || '',
        standalone: editingHero.standalone || false,
        includeVideos: editingHero.includeVideos !== false
      });
      setIsHeroModalOpen(true);
    }
  }, [editingHero]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = formData.youtubeUrl.split('v=')[1]?.split('&')[0];
    if (!videoId) {
      alert('Geçersiz YouTube URL');
      return;
    }

    const newVideo: Video = {
      id: Date.now().toString(),
      ...formData,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      watched: false,
      favorite: false,
      addedBy: 'admin'
    };

    const existingVideos = JSON.parse(localStorage.getItem('videos') || '[]');
    localStorage.setItem('videos', JSON.stringify([...existingVideos, newVideo]));

    setFormData({
      title: '',
      youtubeUrl: '',
      grade: 5,
      subject: 'math',
      channelName: ''
    });
    setIsVideoModalOpen(false);
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newHero: HeroContent = {
      id: editingHero?.id || Date.now().toString(),
      ...heroFormData,
      active: true
    };

    const updatedHeroContent = editingHero
      ? heroContent.map(h => h.id === editingHero.id ? newHero : h)
      : [...heroContent, newHero];

    localStorage.setItem('heroContent', JSON.stringify(updatedHeroContent));
    setHeroContent(updatedHeroContent);
    setHeroFormData({
      title: '',
      description: '',
      imageUrl: '',
      link: '',
      standalone: false,
      includeVideos: true
    });
    setIsHeroModalOpen(false);
    setEditingHero(null);
  };

  const handleDeleteHero = (id: string) => {
    if (window.confirm('Bu hero içeriğini silmek istediğinizden emin misiniz?')) {
      const updatedHeroContent = heroContent.filter(h => h.id !== id);
      localStorage.setItem('heroContent', JSON.stringify(updatedHeroContent));
      setHeroContent(updatedHeroContent);
    }
  };

  const toggleHeroActive = (id: string) => {
    const updatedHeroContent = heroContent.map(h =>
      h.id === id ? { ...h, active: !h.active } : h
    );
    localStorage.setItem('heroContent', JSON.stringify(updatedHeroContent));
    setHeroContent(updatedHeroContent);
  };

  const handleEditHero = (hero: HeroContent) => {
    setEditingHero(hero);
  };

  const handleCloseHeroModal = () => {
    setIsHeroModalOpen(false);
    setEditingHero(null);
    setHeroFormData({
      title: '',
      description: '',
      imageUrl: '',
      link: '',
      standalone: false,
      includeVideos: true
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-gray-400">Video ve hero içeriklerini yönetin</p>
        </div>
        <button
          onClick={() => setIsVideoModalOpen(true)}
          className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
        >
          <Plus className="w-5 h-5" />
          <span>Yeni Video Ekle</span>
        </button>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Yeni Video Ekle</h3>
              <button onClick={() => setIsVideoModalOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Başlık</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-700 rounded-md px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">YouTube URL</label>
                <input
                  type="url"
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  className="w-full bg-gray-700 rounded-md px-4 py-2"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md">
                Video Ekle
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Hero Content Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Hero İçerikleri</h2>
          <button
            onClick={() => setIsHeroModalOpen(true)}
            className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-md"
          >
            <Presentation className="w-5 h-5" />
            <span>Yeni Hero Ekle</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {heroContent.map((hero) => (
            <div key={hero.id} className="bg-gray-800 rounded-lg p-4">
              {hero.imageUrl && (
                <img 
                  src={hero.imageUrl}
                  alt={hero.title}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
              )}
              <h3 className="font-semibold mb-2">{hero.title}</h3>
              <div className="flex justify-between items-center mt-3">
                <button
                  onClick={() => toggleHeroActive(hero.id)}
                  className="flex items-center space-x-1 text-sm"
                >
                  {hero.active ? (
                    <>
                      <ToggleRight className="w-4 h-4 text-green-500" />
                      <span className="text-green-500">Aktif</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">Pasif</span>
                    </>
                  )}
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditHero(hero)}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteHero(hero.id)}
                    className="p-1 hover:bg-gray-700 rounded text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Modal */}
      {isHeroModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingHero ? 'Hero Düzenle' : 'Yeni Hero Ekle'}
              </h3>
              <button onClick={handleCloseHeroModal}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleHeroSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Başlık</label>
                <input
                  type="text"
                  value={heroFormData.title}
                  onChange={(e) => setHeroFormData({ ...heroFormData, title: e.target.value })}
                  className="w-full bg-gray-700 rounded-md px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Açıklama</label>
                <textarea
                  value={heroFormData.description}
                  onChange={(e) => setHeroFormData({ ...heroFormData, description: e.target.value })}
                  className="w-full bg-gray-700 rounded-md px-4 py-2"
                  rows={3}
                />
              </div>
              <div>
                <label className="block mb-1">Görsel URL</label>
                <input
                  type="url"
                  value={heroFormData.imageUrl}
                  onChange={(e) => setHeroFormData({ ...heroFormData, imageUrl: e.target.value })}
                  className="w-full bg-gray-700 rounded-md px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Link (Opsiyonel)</label>
                <input
                  type="url"
                  value={heroFormData.link}
                  onChange={(e) => setHeroFormData({ ...heroFormData, link: e.target.value })}
                  className="w-full bg-gray-700 rounded-md px-4 py-2"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={heroFormData.standalone}
                  onChange={(e) => setHeroFormData({ ...heroFormData, standalone: e.target.checked })}
                  id="standalone"
                  className="rounded bg-gray-700"
                />
                <label htmlFor="standalone">Tek Başına Göster</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={heroFormData.includeVideos}
                  onChange={(e) => setHeroFormData({ ...heroFormData, includeVideos: e.target.checked })}
                  id="includeVideos"
                  className="rounded bg-gray-700"
                />
                <label htmlFor="includeVideos">Videoları Dahil Et</label>
              </div>
              <button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-md">
                {editingHero ? 'Güncelle' : 'Ekle'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
