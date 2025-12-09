'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getPlatformColor, getPlatformName } from '@/config/platforms';
import type { Recommendation } from '@/types';
import { Star, Play, ExternalLink, Heart, Share2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface RecommendationCarouselProps {
  recommendations: Recommendation[];
}

export function RecommendationCarousel({
  recommendations,
}: RecommendationCarouselProps) {
  const [selectedItem, setSelectedItem] = useState<Recommendation | null>(null);

  const handleWatch = (item: Recommendation) => {
    // In production, this would use deep linking
    toast.success(`Opening ${item.title} on ${getPlatformName(item.platform)}...`);

    // Simulate opening platform (would be deep link in production)
    if (item.deepLink) {
      window.open(item.deepLink, '_blank');
    } else {
      // Fallback to web
      const platformUrls: Record<string, string> = {
        netflix: 'https://www.netflix.com',
        tv5monde: 'https://www.tv5monde.com',
        hbo: 'https://www.max.com',
        disney: 'https://www.disneyplus.com',
        prime: 'https://www.amazon.com/gp/video',
      };
      window.open(platformUrls[item.platform] || '#', '_blank');
    }
  };

  return (
    <>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4 pb-4">
          {recommendations.map((item, index) => (
            <Card
              key={item.id}
              className={cn(
                'flex-shrink-0 w-64 cursor-pointer transition-all duration-300',
                'bg-slate-800/50 border-slate-700 hover:border-slate-600',
                'hover:shadow-lg hover:shadow-slate-900/50 hover:-translate-y-1'
              )}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedItem(item)}
            >
              <CardContent className="p-0">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-slate-900 rounded-t-lg overflow-hidden">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                      <Play className="w-12 h-12 text-slate-600" />
                    </div>
                  )}

                  {/* Platform Badge */}
                  <Badge
                    className="absolute top-2 right-2 text-xs font-medium text-white"
                    style={{ backgroundColor: getPlatformColor(item.platform) }}
                  >
                    {getPlatformName(item.platform)}
                  </Badge>

                  {/* Match Score */}
                  <Badge
                    className="absolute top-2 left-2 bg-green-500/90 text-white"
                  >
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {item.matchScore}%
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h4 className="font-semibold text-white truncate">{item.title}</h4>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                    {item.reason}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                    {item.year && <span>{item.year}</span>}
                    {item.genre && (
                      <>
                        <span>•</span>
                        <span className="capitalize">{item.genre}</span>
                      </>
                    )}
                    {item.rating && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          {item.rating}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Watch Button */}
                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWatch(item);
                    }}
                  >
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    Watch Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-700">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white">{selectedItem.title}</DialogTitle>
              </DialogHeader>

              {/* Poster/Thumbnail */}
              <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden">
                {selectedItem.thumbnail ? (
                  <img
                    src={selectedItem.thumbnail}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="w-16 h-16 text-slate-600" />
                  </div>
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                  <Button
                    size="lg"
                    className="rounded-full w-16 h-16 bg-white/90 hover:bg-white text-slate-900"
                    onClick={() => handleWatch(selectedItem)}
                  >
                    <Play className="w-8 h-8 fill-current" />
                  </Button>
                </div>

                {/* Badges */}
                <Badge
                  className="absolute top-3 right-3 text-white"
                  style={{ backgroundColor: getPlatformColor(selectedItem.platform) }}
                >
                  {getPlatformName(selectedItem.platform)}
                </Badge>
                <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  {selectedItem.matchScore}% Match
                </Badge>
              </div>

              {/* Match Explanation */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-400 mb-2">
                  Why you&apos;ll love this
                </h4>
                <p className="text-slate-300">{selectedItem.reason}</p>
                {selectedItem.sellingPoints && selectedItem.sellingPoints.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {selectedItem.sellingPoints.map((point, i) => (
                      <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm text-slate-400">
                {selectedItem.year && <span>{selectedItem.year}</span>}
                {selectedItem.genre && (
                  <span className="capitalize">{selectedItem.genre}</span>
                )}
                {selectedItem.rating && (
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    {selectedItem.rating}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  onClick={() => handleWatch(selectedItem)}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Watch on {getPlatformName(selectedItem.platform)}
                </Button>
              </div>

              <div className="flex gap-2 justify-center">
                <Button variant="ghost" size="sm" className="text-slate-400">
                  <Heart className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400">
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400">
                  <X className="w-4 h-4 mr-1" />
                  Not Interested
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
