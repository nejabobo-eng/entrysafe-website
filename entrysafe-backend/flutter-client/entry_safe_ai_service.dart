import 'dart:convert';
import 'package:http/http.dart' as http;

/// AI Service for Entry Safe Apps
/// 
/// This service handles all AI-related API calls to the Entry Safe backend.
/// Each app (Accounting, Docs, Pricing) has its own endpoint.
class EntrySafeAIService {
  // TODO: Replace with your actual backend URL
  static const String _baseUrl = 'https://your-backend-url.com';
  
  /// Generate AI response for Entry Safe Accounting app
  /// 
  /// Example use cases:
  /// - "Analyze my expenses for this month"
  /// - "Generate invoice description for web development services"
  /// - "Suggest expense categories for R2500 restaurant bill"
  static Future<AIResponse> generateAccountingResponse(
    String prompt, {
    int maxTokens = 500,
    double temperature = 0.7,
  }) async {
    return _makeAIRequest(
      endpoint: '/api/ai/accounting',
      prompt: prompt,
      maxTokens: maxTokens,
      temperature: temperature,
    );
  }

  /// Generate AI response for Entry Safe Docs app
  /// 
  /// Example use cases:
  /// - "Summarize this document: [text]"
  /// - "Suggest tags for this invoice document"
  /// - "Extract key information from this receipt"
  static Future<AIResponse> generateDocsResponse(
    String prompt, {
    int maxTokens = 500,
    double temperature = 0.7,
  }) async {
    return _makeAIRequest(
      endpoint: '/api/ai/docs',
      prompt: prompt,
      maxTokens: maxTokens,
      temperature: temperature,
    );
  }

  /// Generate AI response for Entry Safe Pricing app
  /// 
  /// Example use cases:
  /// - "Suggest pricing for web design service"
  /// - "Calculate profit margin for R500 cost and R800 price"
  /// - "Competitive pricing analysis for accounting services"
  static Future<AIResponse> generatePricingResponse(
    String prompt, {
    int maxTokens = 500,
    double temperature = 0.7,
  }) async {
    return _makeAIRequest(
      endpoint: '/api/ai/pricing',
      prompt: prompt,
      maxTokens: maxTokens,
      temperature: temperature,
    );
  }

  /// Internal method to make AI API requests
  static Future<AIResponse> _makeAIRequest({
    required String endpoint,
    required String prompt,
    int maxTokens = 500,
    double temperature = 0.7,
  }) async {
    try {
      final url = Uri.parse('$_baseUrl$endpoint');
      
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'prompt': prompt,
          'max_tokens': maxTokens,
          'temperature': temperature,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return AIResponse.fromJson(data);
      } else {
        throw AIException(
          'Request failed with status ${response.statusCode}: ${response.body}',
        );
      }
    } catch (e) {
      throw AIException('Failed to generate AI response: $e');
    }
  }

  /// Check if AI services are available
  static Future<bool> isAIAvailable() async {
    try {
      final url = Uri.parse('$_baseUrl/api/ai/health');
      final response = await http.get(url);
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['all_ready'] ?? false;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}

/// AI Response model
class AIResponse {
  final String result;
  final int tokensUsed;

  AIResponse({
    required this.result,
    required this.tokensUsed,
  });

  factory AIResponse.fromJson(Map<String, dynamic> json) {
    return AIResponse(
      result: json['result'] ?? '',
      tokensUsed: json['tokens_used'] ?? 0,
    );
  }
}

/// AI Exception
class AIException implements Exception {
  final String message;
  AIException(this.message);

  @override
  String toString() => 'AIException: $message';
}
