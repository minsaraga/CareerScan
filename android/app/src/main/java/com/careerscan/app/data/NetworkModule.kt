package com.careerscan.app.data

import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory

object NetworkModule {
    private const val BASE_URL = "http://10.0.2.2:8080/" // For emulator
    // Use "http://192.168.x.x:8080/" for physical device
    
    fun provideApiService(tokenStore: TokenStore): ApiService {
        val authInterceptor = Interceptor { chain ->
            val original = chain.request()
            val token = tokenStore.getAccessToken()
            val request = if (token != null) {
                original.newBuilder()
                    .addHeader("Authorization", "Bearer $token")
                    .build()
            } else original
            chain.proceed(request)
        }
        
        val loggingInterceptor = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }
        
        val client = OkHttpClient.Builder()
            .addInterceptor(authInterceptor)
            .addInterceptor(loggingInterceptor)
            .build()
        
        val retrofit = Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(client)
            .addConverterFactory(MoshiConverterFactory.create())
            .build()
        
        return retrofit.create(ApiService::class.java)
    }
}

interface TokenStore {
    fun getAccessToken(): String?
    fun getRefreshToken(): String?
    suspend fun saveTokens(accessToken: String, refreshToken: String)
    suspend fun clearTokens()
}