using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace EntrySafe.Services
{
    /// <summary>
    /// AI Service for Entry Safe Windows Apps
    /// Handles all AI-related API calls to the Entry Safe backend
    /// </summary>
    public class EntrySafeAIService
    {
        private static readonly HttpClient _httpClient = new HttpClient();
        private const string BaseUrl = "https://your-backend-url.com"; // TODO: Update with your actual URL

        /// <summary>
        /// Generate AI response for Entry Safe Accounting app
        /// </summary>
        public static async Task<AIResponse> GenerateAccountingResponseAsync(
            string prompt,
            int maxTokens = 500,
            double temperature = 0.7)
        {
            return await MakeAIRequestAsync(
                endpoint: "/api/ai/accounting",
                prompt: prompt,
                maxTokens: maxTokens,
                temperature: temperature
            );
        }

        /// <summary>
        /// Generate AI response for Entry Safe Docs app
        /// </summary>
        public static async Task<AIResponse> GenerateDocsResponseAsync(
            string prompt,
            int maxTokens = 500,
            double temperature = 0.7)
        {
            return await MakeAIRequestAsync(
                endpoint: "/api/ai/docs",
                prompt: prompt,
                maxTokens: maxTokens,
                temperature: temperature
            );
        }

        /// <summary>
        /// Generate AI response for Entry Safe Pricing app
        /// </summary>
        public static async Task<AIResponse> GeneratePricingResponseAsync(
            string prompt,
            int maxTokens = 500,
            double temperature = 0.7)
        {
            return await MakeAIRequestAsync(
                endpoint: "/api/ai/pricing",
                prompt: prompt,
                maxTokens: maxTokens,
                temperature: temperature
            );
        }

        /// <summary>
        /// Internal method to make AI API requests
        /// </summary>
        private static async Task<AIResponse> MakeAIRequestAsync(
            string endpoint,
            string prompt,
            int maxTokens,
            double temperature)
        {
            try
            {
                var requestBody = new
                {
                    prompt = prompt,
                    max_tokens = maxTokens,
                    temperature = temperature
                };

                var json = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync($"{BaseUrl}{endpoint}", content);

                if (response.IsSuccessStatusCode)
                {
                    var responseString = await response.Content.ReadAsStringAsync();
                    var aiResponse = JsonSerializer.Deserialize<AIResponse>(responseString, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    return aiResponse ?? throw new Exception("Failed to deserialize response");
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    throw new AIException($"Request failed with status {response.StatusCode}: {errorContent}");
                }
            }
            catch (Exception ex)
            {
                throw new AIException($"Failed to generate AI response: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Check if AI services are available
        /// </summary>
        public static async Task<bool> IsAIAvailableAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{BaseUrl}/api/ai/health");
                
                if (response.IsSuccessStatusCode)
                {
                    var responseString = await response.Content.ReadAsStringAsync();
                    var healthCheck = JsonSerializer.Deserialize<AIHealthCheck>(responseString, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    return healthCheck?.AllReady ?? false;
                }
                
                return false;
            }
            catch
            {
                return false;
            }
        }
    }

    /// <summary>
    /// AI Response model
    /// </summary>
    public class AIResponse
    {
        public string Result { get; set; } = string.Empty;
        public int TokensUsed { get; set; }
    }

    /// <summary>
    /// AI Health Check model
    /// </summary>
    public class AIHealthCheck
    {
        public bool AllReady { get; set; }
    }

    /// <summary>
    /// AI Exception
    /// </summary>
    public class AIException : Exception
    {
        public AIException(string message) : base(message) { }
        public AIException(string message, Exception innerException) : base(message, innerException) { }
    }
}
