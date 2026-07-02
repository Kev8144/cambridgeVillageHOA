import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Post { slug: string; title: string; date: string; image: string; tags: string[]; }
export interface BoardMember { role: string; name: string; email: string; photo: string; }
export interface FaqItem { question: string; answer: string; }
export interface Document { title: string; file: string; label: string; }
export interface Newsletter { issue: number; label: string; pdf: string; thumbnail: string; }
export interface HomepageData {
  banner: { enable: boolean; image: string };
  highlights: { items_per_row: number; items: { title: string; icon: string; content: string }[] };
}

@Injectable({ providedIn: 'root' })
export class ContentService {
  private http = inject(HttpClient);

  getHomepage(lang: string): Observable<HomepageData> {
    return this.http.get<HomepageData>(`/data/${lang}/homepage.json`);
  }

  getFaq(lang: string): Observable<FaqItem[]> {
    return this.http.get<FaqItem[]>(`/data/${lang}/faq.json`);
  }

  getDocuments(lang: string): Observable<Document[]> {
    return this.http.get<Document[]>(`/data/${lang}/documents.json`);
  }

  getNewsletters(lang: string): Observable<Newsletter[]> {
    return this.http.get<Newsletter[]>(`/data/${lang}/newsletters.json`);
  }

  getBoard(lang: string): Observable<BoardMember[]> {
    return this.http.get<BoardMember[]>(`/data/${lang}/board.json`);
  }

  getPosts(lang: string): Observable<Post[]> {
    return this.http.get<Post[]>(`/data/${lang}/posts.json`);
  }

  getPost(lang: string, slug: string): Observable<{ body: string }> {
    return this.http.get<{ body: string }>(`/posts/${lang}/${slug}.json`);
  }
}
