import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TokenResponse { accessToken: string; refreshToken: string; }
export interface UserProfile { id: number; email: string; name: string; role: string; position?: string; address?: string; phone?: string; homeId?: number; }

const API = `${environment.apiBase}/api`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken = signal<string | null>(localStorage.getItem('access_token'));
  private refreshTokenValue = signal<string | null>(localStorage.getItem('refresh_token'));
  private userProfile = signal<UserProfile | null>(null);

  isLoggedIn = computed(() => !!this.accessToken());
  user = this.userProfile.asReadonly();
  role = computed(() => this.userProfile()?.role ?? null);
  isAdmin = computed(() => this.role() === 'Admin' || this.role() === 'Webmaster');
  isTreasurer = computed(() => this.role() === 'Treasurer');
  isWebmaster = computed(() => this.role() === 'Webmaster');
  isBoardMember = computed(() => this.isAdmin() || this.isTreasurer());

  constructor(private http: HttpClient, private router: Router) {
    if (this.accessToken()) this.loadProfile();
  }

  getToken(): string | null { return this.accessToken(); }
  getRefreshToken(): string | null { return this.refreshTokenValue(); }

  login(email: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${API}/auth/login`, { email, password }).pipe(
      tap(res => {
        this.setTokens(res);
        this.loadProfile();
      })
    );
  }

  refresh(): Observable<TokenResponse | null> {
    const rt = this.refreshTokenValue();
    if (!rt) return of(null);
    return this.http.post<TokenResponse>(`${API}/auth/refresh`, { refreshToken: rt }).pipe(
      tap(res => this.setTokens(res)),
      catchError(() => { this.clearAuth(); return of(null); })
    );
  }

  logout(): void {
    const rt = this.refreshTokenValue();
    if (rt) {
      this.http.post(`${API}/auth/logout`, { refreshToken: rt }).subscribe();
    }
    this.clearAuth();
    this.router.navigate(['/en/login']);
  }

  forgotPassword(email: string) {
    return this.http.post<{ message: string }>(`${API}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post<{ message: string }>(`${API}/auth/reset-password`, { token, newPassword });
  }

  setPassword(token: string, password: string) {
    return this.http.post<TokenResponse>(`${API}/auth/set-password`, { token, password }).pipe(
      tap(res => {
        this.setTokens(res);
        this.loadProfile();
      })
    );
  }

  loadProfile(): void {
    this.http.get<UserProfile>(`${API}/profile`).subscribe({
      next: u => this.userProfile.set(u),
      error: () => this.userProfile.set(null)
    });
  }

  updateProfile(data: { name: string; address?: string; phone?: string }) {
    return this.http.put<UserProfile>(`${API}/profile`, data).pipe(
      tap(u => this.userProfile.set(u))
    );
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.put<{ message: string }>(`${API}/profile/password`, { currentPassword, newPassword });
  }

  private setTokens(res: TokenResponse): void {
    this.accessToken.set(res.accessToken);
    this.refreshTokenValue.set(res.refreshToken);
    localStorage.setItem('access_token', res.accessToken);
    localStorage.setItem('refresh_token', res.refreshToken);
  }

  private clearAuth(): void {
    this.accessToken.set(null);
    this.refreshTokenValue.set(null);
    this.userProfile.set(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}
