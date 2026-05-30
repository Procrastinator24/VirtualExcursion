export interface User{
    id: number
    email: string
    name: string
    role: string
    isApproved: boolean
    guideProfileId: 1
}
export interface LoginResponse{
    id: number
    email: string
    name: string
    role: string
    token: string
}


// "id": 5,
//     "name": "Sergey",
//     "email": "ser1970koz@mail.ru",
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjUiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiU2VyZ2V5IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoic2VyMTk3MGtvekBtYWlsLnJ1IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiVXNlciIsImV4cCI6MTc3OTM3ODQ3MSwiaXNzIjoiVmlydHVhbEV4Y3Vyc2lvbkFQSSIsImF1ZCI6IlZpcnR1YWxFeGN1cnNpb25DbGllbnQifQ.Wf2xNzQpUWPHlrWb6qTeNLOn233n0dzIVTQ-RATLoPU",
//     "tokenExpiresAt": "2026-05-21T15:47:51.3842763Z",
//     "role": "User",
//     "hasGuideProfile": true