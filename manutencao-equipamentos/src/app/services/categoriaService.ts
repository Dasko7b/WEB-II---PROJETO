import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class CategoriaResponse {
    id!: number;
    nomeCategoria!: string;
    ativo!: boolean;
}

export class CategoriaRequest {
    nomeCategoria!: string;
    ativo!: boolean;
}

@Injectable({ providedIn: 'root' })
export class CategoriaService {
    private apiUrl = 'http://localhost:8081/categorias';

    constructor(private http: HttpClient) { }

    getAll(): Observable<CategoriaResponse[]> {
        return this.http.get<CategoriaResponse[]>(this.apiUrl);
    }

    create(categoria: CategoriaRequest): Observable<CategoriaResponse> {
        return this.http.post<CategoriaResponse>(this.apiUrl, categoria);
    }

    update(id: number, categoria: CategoriaRequest): Observable<CategoriaResponse> {
        return this.http.put<CategoriaResponse>(`${this.apiUrl}/${id}`, categoria);
    }

    remove(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}