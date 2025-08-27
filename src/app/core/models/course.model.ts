export type Level = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Course {
  id: number;
  title: string;
  thumbnailUrl: string;
  durationMinutes: number;
  level: Level;
  rating: number;
  reviewCount: number;
  enrollmentCount: number;
  badges?: ('New Launch' | 'Bestseller' | 'Highest Rated')[];
  progressPercent?: number;
}
