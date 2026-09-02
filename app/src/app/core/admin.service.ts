import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API = `${environment.apiBase}/api`;

export interface ApiPost {
  id?: number; slug: string; titleEn: string; titleEs: string;
  bodyEn: string; bodyEs: string; image?: string; date: string; tags?: string;
  images?: string;
}
export interface ApiNewsletter {
  id?: number; issue: number; labelEn: string; labelEs: string;
  pdfPath: string; thumbnailPath: string;
}
export interface ApiDocument {
  id?: number; titleEn: string; titleEs: string;
  filePath: string; labelEn: string; labelEs: string;
}
export interface ApiFaqItem {
  id?: number; questionEn: string; questionEs: string;
  answerEn: string; answerEs: string; sortOrder: number;
}
export interface ApiBoardMember {
  id?: number; role: string; name: string; email: string;
  photo: string; sortOrder: number;
}
export interface ApiHome {
  id?: number; address: string; lotNumber?: string; isActive: boolean;
  residents?: { id: number; name: string; email: string }[];
}
export interface ApiDues {
  id?: number; homeId: number; userId?: number; amount: number;
  dueDate: string; paidDate?: string | null; status: string;
  reference?: string; description?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);

  // Posts
  getPosts(): Observable<ApiPost[]> { return this.http.get<ApiPost[]>(`${API}/posts`); }
  createPost(p: ApiPost) { return this.http.post<ApiPost>(`${API}/posts`, p); }
  updatePost(id: number, p: ApiPost) { return this.http.put<ApiPost>(`${API}/posts/${id}`, p); }
  deletePost(id: number) { return this.http.delete(`${API}/posts/${id}`); }

  // Newsletters
  getNewsletters(): Observable<ApiNewsletter[]> { return this.http.get<ApiNewsletter[]>(`${API}/newsletters`); }
  createNewsletter(n: ApiNewsletter) { return this.http.post<ApiNewsletter>(`${API}/newsletters`, n); }
  updateNewsletter(id: number, n: ApiNewsletter) { return this.http.put<ApiNewsletter>(`${API}/newsletters/${id}`, n); }
  deleteNewsletter(id: number) { return this.http.delete(`${API}/newsletters/${id}`); }

  // Documents
  getDocuments(): Observable<ApiDocument[]> { return this.http.get<ApiDocument[]>(`${API}/documents`); }
  createDocument(d: ApiDocument) { return this.http.post<ApiDocument>(`${API}/documents`, d); }
  updateDocument(id: number, d: ApiDocument) { return this.http.put<ApiDocument>(`${API}/documents/${id}`, d); }
  deleteDocument(id: number) { return this.http.delete(`${API}/documents/${id}`); }

  // FAQ
  getFaq(): Observable<ApiFaqItem[]> { return this.http.get<ApiFaqItem[]>(`${API}/faq`); }
  createFaq(f: ApiFaqItem) { return this.http.post<ApiFaqItem>(`${API}/faq`, f); }
  updateFaq(id: number, f: ApiFaqItem) { return this.http.put<ApiFaqItem>(`${API}/faq/${id}`, f); }
  deleteFaq(id: number) { return this.http.delete(`${API}/faq/${id}`); }

  // Board
  getBoard(): Observable<ApiBoardMember[]> { return this.http.get<ApiBoardMember[]>(`${API}/board`); }
  createBoard(b: ApiBoardMember) { return this.http.post<ApiBoardMember>(`${API}/board`, b); }
  updateBoard(id: number, b: ApiBoardMember) { return this.http.put<ApiBoardMember>(`${API}/board/${id}`, b); }
  deleteBoard(id: number) { return this.http.delete(`${API}/board/${id}`); }

  // Residents
  getResidents() { return this.http.get<any[]>(`${API}/residents`); }
  inviteResident(data: { email: string; name: string; role?: string; position?: string; homeId?: number }) {
    return this.http.post<{ message: string; userId: number; enrollUrl: string }>(`${API}/residents/invite`, data);
  }
  toggleResident(id: number) { return this.http.patch(`${API}/residents/${id}/toggle-active`, {}); }
  updateResident(id: number, data: any) { return this.http.put(`${API}/residents/${id}`, data); }
  getInviteLink(id: number) { return this.http.post<{ enrollUrl: string }>(`${API}/residents/${id}/invite-link`, {}); }

  // Homes
  getHomes(): Observable<ApiHome[]> { return this.http.get<ApiHome[]>(`${API}/homes`); }
  createHome(h: ApiHome) { return this.http.post<ApiHome>(`${API}/homes`, h); }
  updateHome(id: number, h: ApiHome) { return this.http.put<ApiHome>(`${API}/homes/${id}`, h); }
  deleteHome(id: number) { return this.http.delete(`${API}/homes/${id}`); }

  // Financial
  getDuesByHome() { return this.http.get<any[]>(`${API}/dues/by-home`); }

  // Dues records per home
  getDuesForHome(homeId: number) { return this.http.get<ApiDues[]>(`${API}/dues?homeId=${homeId}`); }
  createDues(record: ApiDues) { return this.http.post<ApiDues>(`${API}/dues`, record); }
  updateDues(id: number, record: ApiDues) { return this.http.put<ApiDues>(`${API}/dues/${id}`, record); }
  deleteDues(id: number) { return this.http.delete(`${API}/dues/${id}`); }

  // File upload — returns the stored public path
  uploadFile(file: File): Observable<{ path: string }> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<{ path: string }>(`${API}/uploads`, form);
  }
}
