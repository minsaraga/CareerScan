package com.careerscan.app.repository

import com.careerscan.app.data.*

class AuthRepository(
    private val apiService: ApiService,
    private val tokenStore: TokenStore
) {
    suspend fun register(email: String, password: String, name: String): Result<User> {
        return try {
            val response = apiService.register(RegisterRequest(email, password, name))
            tokenStore.saveTokens(response.accessToken, response.refreshToken)
            Result.success(response.user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun login(email: String, password: String): Result<User> {
        return try {
            val response = apiService.login(LoginRequest(email, password))
            tokenStore.saveTokens(response.accessToken, response.refreshToken)
            Result.success(response.user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun refreshToken(): Result<Unit> {
        return try {
            val refreshToken = tokenStore.getRefreshToken()
                ?: return Result.failure(Exception("No refresh token"))
            
            val response = apiService.refresh(RefreshRequest(refreshToken))
            tokenStore.saveTokens(response.accessToken, response.refreshToken)
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun logout() {
        tokenStore.clearTokens()
    }
    
    fun isLoggedIn(): Boolean {
        return tokenStore.getAccessToken() != null
    }
}