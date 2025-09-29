import { Play } from "lucide-react";
import { useSiteContent } from "@/providers/SiteContentProvider";

export function DemoSection() {
  const { get } = useSiteContent();

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          {get('demo', 'title', 'See It in Action')}
        </h2>
        
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Demo placeholder - would be replaced with actual video in admin */}
          <div className="aspect-video bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
            <div className="text-center">
              <div className="p-6 bg-white rounded-full shadow-lg mb-4 mx-auto w-fit">
                <Play className="h-12 w-12 text-pink-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {get('demo', 'videoTitle', 'Demo Video Coming Soon')}
              </h3>
              <p className="text-gray-600">
                {get('demo', 'videoDescription', 'Watch how KLYP Workbench revolutionizes travel operations')}
              </p>
            </div>
          </div>
          
          {/* Video controls placeholder */}
          <div className="p-4 bg-white border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Play className="h-5 w-5" />
                </button>
                <div className="text-sm text-gray-600">
                  {get('demo', 'videoDuration', '0:00 / 2:30')}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {get('demo', 'videoQuality', 'HD Quality')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}