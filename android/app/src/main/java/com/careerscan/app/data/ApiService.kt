package com.careerscan.app.data

import retrofit2.http.*

interface ApiService {
    @POST("auth/register")
    suspend fun register(@Body body: RegisterRequest): AuthResponse
    
    @POST("auth/login")
    suspend fun login(@Body body: LoginRequest): AuthResponse
    
    @POST("auth/refresh")
    suspend fun refresh(@Body body: RefreshRequest): TokenResponse
    
    @GET("questions")
    suspend fun getQuestions(): List<Question>
    
    @POST("match/submit")
    suspend fun submitAnswers(@Body body: SubmitRequest): MatchResponse
    
    @GET("catalog/courses")
    suspend fun getCourses(
        @Query("personaKey") personaKey: String? = null,
        @Query("city") city: String? = null,
        @Query("category") category: String? = null
    ): List<Course>
    
    @GET("catalog/institutions")
    suspend fun getInstitutions(
        @Query("city") city: String? = null,
        @Query("state") state: String? = null
    ): List<Institution>
}

data class RegisterRequest(val email: String, val password: String, val name: String)
data class LoginRequest(val email: String, val password: String)
data class RefreshRequest(val refreshToken: String)
data class AuthResponse(val user: User, val accessToken: String, val refreshToken: String)
data class TokenResponse(val accessToken: String, val refreshToken: String)
data class User(val id: String, val email: String, val name: String)

data class Question(
    val id: String,
    val text: String,
    val optionA: String,
    val optionB: String,
    val order: Int
)

data class SubmitRequest(val userId: String, val answers: List<Answer>)
data class Answer(val questionId: String, val choice: String)
data class MatchResponse(val personaKey: String, val submissionId: String, val courses: List<Course>)

data class Course(
    val id: String,
    val name: String,
    val category: String,
    val level: String,
    val description: String?,
    val tags: List<String>,
    val institution: Institution
)

data class Institution(
    val id: String,
    val name: String,
    val city: String,
    val state: String,
    val country: String,
    val website: String?
)