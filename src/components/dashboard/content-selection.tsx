import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SiInstagram } from "react-icons/si";
import { ExternalLink, Clock, Heart, MessageCircle, ArrowRight, Filter, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface ContentItem {
  Caption: string;
  CommentCount: number;
  DurationInSeconds: number;
  Id: number;
  LikeCount: number;
  MediaType: string;
  MediaUrl: string;
  PlayCount: number;
  PublishedAt: string;
  ThumbnailUrl: string;
}

interface ContentSelectionProps {
  onContinue: (selectedIds: number[]) => void;
}

export function ContentSelection({ onContinue }: ContentSelectionProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterDateRange, setFilterDateRange] = useState("all");
  const [filterContentType, setFilterContentType] = useState("all");
  const [filterPerformance, setFilterPerformance] = useState("all");
  
  // Get reels from React Query or localStorage
  const { data: queryReels } = useQuery<any[]>({
    queryKey: ['/api/content'],
  });
  const reels = useMemo(() => {
    if (Array.isArray(queryReels) && queryReels.length > 0) {
      return queryReels;
    }
    try {
      const local = localStorage.getItem("instagramReels");
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  }, [queryReels]);

  const handleToggleItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedItems.length === reels.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(reels.map(item => item.Id));
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const resetFilters = () => {
    setFilterDateRange("all");
    setFilterContentType("all");
    setFilterPerformance("all");
  };

  const handleFilter = (type: string, value: string) => {
    if (type === "date") {
      setFilterDateRange(value);
    } else if (type === "content") {
      setFilterContentType(value);
    } else if (type === "performance") {
      setFilterPerformance(value);
    }
  };

  const filterContent = (content: ContentItem[]) => {
    let filtered = [...content];
    
    // Date range filter
    if (filterDateRange !== "all") {
      const now = new Date();
      const monthsAgo = (months: number) => {
        const date = new Date(now);
        date.setMonth(date.getMonth() - months);
        return date;
      };
      
      if (filterDateRange === "30days") {
        filtered = filtered.filter(item => new Date(item.PublishedAt) >= monthsAgo(1));
      } else if (filterDateRange === "90days") {
        filtered = filtered.filter(item => new Date(item.PublishedAt) >= monthsAgo(3));
      } else if (filterDateRange === "6months") {
        filtered = filtered.filter(item => new Date(item.PublishedAt) >= monthsAgo(6));
      } else if (filterDateRange === "year") {
        filtered = filtered.filter(item => new Date(item.PublishedAt) >= monthsAgo(12));
      }
    }
    
    // Content type filter
    if (filterContentType !== "all") {
      filtered = filtered.filter(item => 
        filterContentType === "reels" ? item.MediaType === "Reel" : item.MediaType !== "Reel"
      );
    }
    
    // Performance filter
    if (filterPerformance !== "all") {
      filtered = filtered.filter(item => {
        if (filterPerformance === "high") {
          return item.PlayCount > 1000000;
        } else if (filterPerformance === "medium") {
          return item.PlayCount > 500000 && item.PlayCount <= 1000000;
        } else {
          return item.PlayCount <= 500000;
        }
      });
    }
    
    return filtered;
  };

  // Get filtered content
  const filteredContent = filterContent(reels);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
            <SiInstagram className="text-pink-600 w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Select Instagram Content</h3>
            <p className="text-sm text-gray-500">Choose reels or videosto transform</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-1.5 text-gray-600 border-gray-200"
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                {(filterDateRange !== "all" || filterContentType !== "all" || filterPerformance !== "all") && (
                  <span className="ml-1 rounded-full bg-[#FF7846] text-white w-5 h-5 flex items-center justify-center text-xs">
                    {(filterDateRange !== "all" ? 1 : 0) + 
                     (filterContentType !== "all" ? 1 : 0) + 
                     (filterPerformance !== "all" ? 1 : 0)}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filter Content</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetFilters} 
                    className="h-8 px-2 text-sm text-gray-500"
                  >
                    Reset
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Date Range</h5>
                  <RadioGroup defaultValue={filterDateRange} onValueChange={(v) => handleFilter("date", v)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="date-all" />
                      <Label htmlFor="date-all">All Time</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="30days" id="date-30" />
                      <Label htmlFor="date-30">Last 30 Days</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="90days" id="date-90" />
                      <Label htmlFor="date-90">Last 90 Days</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="6months" id="date-6m" />
                      <Label htmlFor="date-6m">Last 6 Months</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="year" id="date-year" />
                      <Label htmlFor="date-year">Last Year</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Content Type</h5>
                  <RadioGroup defaultValue={filterContentType} onValueChange={(v) => handleFilter("content", v)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="type-all" />
                      <Label htmlFor="type-all">All Types</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="reels" id="type-reels" />
                      <Label htmlFor="type-reels">Reels Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="posts" id="type-posts" />
                      <Label htmlFor="type-posts">Posts Only</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Performance</h5>
                  <RadioGroup defaultValue={filterPerformance} onValueChange={(v) => handleFilter("performance", v)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="perf-all" />
                      <Label htmlFor="perf-all">All Performance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="perf-high" />
                      <Label htmlFor="perf-high">High Performance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="perf-medium" />
                      <Label htmlFor="perf-medium">Medium Performance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="perf-low" />
                      <Label htmlFor="perf-low">Low Performance</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button 
                  className="w-full bg-[#FF7846] hover:bg-[#FF5A2D] text-sm" 
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="outline" 
            className="text-gray-600 border-gray-200 text-sm"
            onClick={handleSelectAll}
          >
            {selectedItems.length === filteredContent.length ? "Deselect All" : "Select All"}
          </Button>
        </div>
      </div>
      
      {/* Active filters display */}
      {(filterDateRange !== "all" || filterContentType !== "all" || filterPerformance !== "all") && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filterDateRange !== "all" && (
            <div className="bg-gray-100 rounded-full px-3 py-1 text-xs flex items-center gap-1">
              <span>
                {filterDateRange === "30days" ? "Last 30 Days" : 
                 filterDateRange === "90days" ? "Last 90 Days" : 
                 filterDateRange === "6months" ? "Last 6 Months" : "Last Year"}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0" 
                onClick={() => handleFilter("date", "all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {filterContentType !== "all" && (
            <div className="bg-gray-100 rounded-full px-3 py-1 text-xs flex items-center gap-1">
              <span>{filterContentType === "reels" ? "Reels Only" : "Posts Only"}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0" 
                onClick={() => handleFilter("content", "all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {filterPerformance !== "all" && (
            <div className="bg-gray-100 rounded-full px-3 py-1 text-xs flex items-center gap-1">
              <span>
                {filterPerformance === "high" ? "High Performance" : 
                 filterPerformance === "medium" ? "Medium Performance" : "Low Performance"}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0" 
                onClick={() => handleFilter("performance", "all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          <Button 
            variant="link" 
            size="sm" 
            className="text-xs h-6 px-2 text-gray-500" 
            onClick={resetFilters}
          >
            Clear All
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {filteredContent.length === 0 ? (
          <div className="col-span-2 py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <h4 className="text-lg font-medium text-gray-700 mb-2">No content matches your filters</h4>
            <p className="text-gray-500 mb-4">Try adjusting your filters or import more content</p>
            <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
          </div>
        ) : (
          filteredContent.map(item => (
            <Card 
              key={item.Id} 
              className={`overflow-hidden cursor-pointer transition-shadow hover:shadow-md ${
                selectedItems.includes(item.Id) ? 'border-[#FF7846] ring-1 ring-[#FF7846]' : 'border-gray-200'
              }`}
              onClick={() => handleToggleItem(item.Id)}
            >
              <CardContent className="p-0 flex">
                <div className="w-1/3 relative">
                  <img 
                    src={item.ThumbnailUrl} 
                    alt={item.Caption}
                    className="w-full h-full object-cover aspect-[3/4]" 
                  />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {item.MediaType.toLowerCase()}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {Math.floor(item.DurationInSeconds / 60)}:{(item.DurationInSeconds % 60).toString().padStart(2, '0')}
                  </div>
                </div>
                <div className="w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-base font-medium text-gray-900 line-clamp-2 mr-2">{item.Caption}</h4>
                      <Checkbox 
                        checked={selectedItems.includes(item.Id)}
                        className="h-5 w-5 border-2 border-gray-300 data-[state=checked]:border-[#FF7846] data-[state=checked]:bg-[#FF7846]"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{new Date(item.PublishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-xs text-gray-600 mb-1">
                      <span className="flex items-center mr-4">
                        <Heart className="w-3 h-3 mr-1" /> {formatNumber(item.LikeCount)}
                      </span>
                      <span className="flex items-center mr-4">
                        <MessageCircle className="w-3 h-3 mr-1" /> {formatNumber(item.CommentCount)}
                      </span>
                      <span className="flex items-center">
                        <ExternalLink className="w-3 h-3 mr-1" /> {formatNumber(item.PlayCount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        High Performance
                      </div>
                      <a 
                        href={item.MediaUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-gray-500 hover:text-[#FF7846] flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View on Instagram <ArrowRight className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      <div className="flex justify-between">
        <div></div>
        <Button 
          className="bg-[#FF7846] hover:bg-[#FF5A2D]"
          disabled={selectedItems.length === 0}
          onClick={() => onContinue(selectedItems)}
        >
          Continue with {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'}
        </Button>
      </div>
    </div>
  );
}