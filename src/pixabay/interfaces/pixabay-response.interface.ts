import { PixabayHit } from './pixabay-hit.interface';

export interface PixabayResponse {
  total: number;
  totalHits: number;
  images: PixabayHit[];
}
