import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private API_URL = environment.backend_url;
    private optionsWithJSON = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    constructor(private http: HttpClient) { }

    predictBERT(comment: string): Observable<any> {
        const url = `${this.API_URL}/predict/bert`;
        const body = {
            text: comment
        };
        return this.http.post<any>(url, body, this.optionsWithJSON);
    }

    predictLSTM(comment: string): Observable<any> {
        const url = `${this.API_URL}/predict/lstm`;
        const body = {
            text: comment
        };
        return this.http.post<any>(url, body, this.optionsWithJSON);
    }
}
