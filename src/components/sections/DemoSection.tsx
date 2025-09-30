import { Play } from "lucide-react";
import { useSiteContent } from "@/providers/SiteContentProvider";

export function DemoSection() {
  const { get } = useSiteContent();
  const videoUrl = get('demo', 'videoUrl', '');
  const posterUrl = get('demo', 'posterUrl', '');
  const autoplay = get('demo', 'autoplay', false);
  const loop = get('demo', 'loop', true);
  const muted = get('demo', 'muted', true);
  const helper = get('demo', 'helper', 'Demo Video Coming Soon');

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          {get('demo', 'title', 'See It in Action')}
        </h2>
        
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          {videoUrl ? (
            <div className="aspect-video">
              <video
                src={videoUrl}
                poster={posterUrl}
                controls
                autoPlay={autoplay}
                loop={loop}
                muted={muted}
                className="w-full h-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <>
              {/* Demo placeholder - when no video is uploaded */}
              <div className="aspect-video bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="p-6 bg-white rounded-full shadow-lg mb-4 mx-auto w-fit">
                    <Play className="h-12 w-12 text-pink-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {helper}
                  </h3>
                  <p className="text-gray-600">
                    Upload a video in the admin panel
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}