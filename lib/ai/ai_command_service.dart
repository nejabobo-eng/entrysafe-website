import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:firebase_auth/firebase_auth.dart';
import '../models/user_profile.dart';
import 'ai_error_handler.dart';
import 'ai_logger.dart';

/// Handles all API communication with backend AI endpoints
class AICommandService {
  static const String baseUrl = "https://entrysafe-website.onrender.com";
  final FirebaseAuth _auth = FirebaseAuth.instance;

  /// Send AI command to backend - Returns preview transaction
  Future<Map<String, dynamic>> sendCommand({
    required String message,
    required String userId,
    String? companyId,
  }) async {
    try {
      AILogger.logRequest('sendCommand', {
        'message': message,
        'user_id': userId,
        'company_id': companyId ?? 'auto-create',
      });

      // Get fresh Firebase token
      final idToken = await _auth.currentUser?.getIdToken(true);
      if (idToken == null) {
        throw Exception('Authentication token unavailable');
      }

      // Build request body
      final Map<String, dynamic> requestBody = {
        'message': message,
        'user_id': userId,
      };
      
      // Company ID is optional - backend will auto-create if missing
      if (companyId != null && companyId.isNotEmpty) {
        requestBody['company_id'] = companyId;
      }

      final response = await http
          .post(
            Uri.parse('$baseUrl/api/ai-command'),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer $idToken',
            },
            body: jsonEncode(requestBody),
          )
          .timeout(
            const Duration(seconds: 90),
            onTimeout: () => throw Exception('Request timed out after 90 seconds'),
          );

      AILogger.logResponse('sendCommand', response.statusCode, response.body);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'success': true,
          'data': data,
        };
      } else if (response.statusCode == 401 || response.statusCode == 403) {
        throw Exception('Authentication failed. Please log in again.');
      } else {
        // Try to extract error message from response
        String errorMsg = 'Server error (${response.statusCode})';
        try {
          final errorBody = jsonDecode(response.body);
          errorMsg = errorBody['detail'] ?? errorBody['message'] ?? errorMsg;
        } catch (_) {}
        
        throw Exception(errorMsg);
      }
    } catch (e) {
      AILogger.logError('sendCommand', e);
      return {
        'success': false,
        'error': AIErrorHandler.handleError(e),
      };
    }
  }

  /// Approve transaction preview - Posts to journal
  Future<Map<String, dynamic>> approveTransaction({
    required String previewId,
  }) async {
    try {
      AILogger.logRequest('approveTransaction', {'preview_id': previewId});

      final idToken = await _auth.currentUser?.getIdToken(true);
      if (idToken == null) {
        throw Exception('Authentication token unavailable');
      }

      final response = await http
          .post(
            Uri.parse('$baseUrl/api/approve-transaction'),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer $idToken',
            },
            body: jsonEncode({'preview_id': previewId}),
          )
          .timeout(const Duration(seconds: 30));

      AILogger.logResponse('approveTransaction', response.statusCode, response.body);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'success': true,
          'data': data,
        };
      } else {
        String errorMsg = 'Approval failed (${response.statusCode})';
        try {
          final errorBody = jsonDecode(response.body);
          errorMsg = errorBody['detail'] ?? errorBody['message'] ?? errorMsg;
        } catch (_) {}
        
        throw Exception(errorMsg);
      }
    } catch (e) {
      AILogger.logError('approveTransaction', e);
      return {
        'success': false,
        'error': AIErrorHandler.handleError(e),
      };
    }
  }

  /// Get transaction preview details
  Future<Map<String, dynamic>> getTransactionPreview({
    required String previewId,
  }) async {
    try {
      final idToken = await _auth.currentUser?.getIdToken(true);
      if (idToken == null) {
        throw Exception('Authentication token unavailable');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/api/transaction-preview/$previewId'),
        headers: {'Authorization': 'Bearer $idToken'},
      ).timeout(const Duration(seconds: 30));

      if (response.statusCode == 200) {
        return {
          'success': true,
          'data': jsonDecode(response.body),
        };
      } else {
        throw Exception('Preview not found');
      }
    } catch (e) {
      return {
        'success': false,
        'error': AIErrorHandler.handleError(e),
      };
    }
  }
}
