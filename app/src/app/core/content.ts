import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Post { slug: string; title: string; date: string; image: string; tags: string[]; }
export interface BoardMember { role: string; name: string; email: string; photo: string; }
export interface FaqItem { question: string; answer: string; }
export interface Document { title: string; file: string; label: string; }
export interface Newsletter { issue: number; label: string; pdf: string; thumbnail: string; }
export interface HomepageData {
  banner: { enable: boolean; image: string };
  highlights: { items_per_row: number; items: { title: string; icon: string; content: string }[] };
}

const API = '/api';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private http = inject(HttpClient);

  // Homepage remains a static JSON file (structured layout, not DB-backed)
  getHomepage(lang: string): Observable<HomepageData> {
    return this.http.get<HomepageData>(`/data/${lang}/homepage.json`);
  }

  getFaq(lang: string): Observable<FaqItem[]> {
    return this.http.get<any[]>(`${API}/faq`).pipe(
      map(items => items.map(i => ({
        question: lang === 'es' ? i.questionEs : i.questionEn,
        answer: lang === 'es' ? i.answerEs : i.answerEn,
      })))
    );
  }

  getDocuments(lang: string): Observable<Document[]> {
    return this.http.get<any[]>(`${API}/documents`).pipe(
      map(items => items.map(i => ({
        title: lang === 'es' ? i.titleEs : i.titleEn,
        file: i.filePath,
        label: lang === 'es' ? i.labelEs : i.labelEn,
      })))
    );
  }

  getNewsletters(lang: string): Observable<Newsletter[]> {
    return this.http.get<any[]>(`${API}/newsletters`).pipe(
      map(items => items.map(i => ({
        issue: i.issue,
        label: lang === 'es' ? i.labelEs : i.labelEn,
        pdf: i.pdfPath,
        thumbnail: i.thumbnailPath,
      })))
    );
  }

  getBoard(lang: string): Observable<BoardMember[]> {
    return this.http.get<BoardMember[]>(`${API}/board`);
  }

  getPosts(lang: string): Observable<Post[]> {
    return this.http.get<any[]>(`${API}/posts`).pipe(
      map(items => items.map(i => ({
        slug: i.slug,
        title: lang === 'es' ? i.titleEs : i.titleEn,
        date: i.date,
        image: i.image,
        tags: i.tags ? String(i.tags).split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      })))
    );
  }

  getPost(lang: string, slug: string): Observable<{ body: string }> {
    return this.http.get<any>(`${API}/posts/${slug}`).pipe(
      map(p => ({ body: lang === 'es' ? p.bodyEs : p.bodyEn }))
    );
  }
}
