import 'package:flutter/foundation.dart';

/// Centralized logging for AI operations - Makes debugging super easy
class AILogger {
  
  /// Log outgoing API request
  static void logRequest(String operation, Map<String, dynamic> data) {
    if (kDebugMode) {
      print('🔵 [AI-$operation] REQUEST');
      data.forEach((key, value) {
        print('🔵   $key: $value');
      });
    }
  }

  /// Log API response
  static void logResponse(String operation, int statusCode, String body) {
    if (kDebugMode) {
      if (statusCode >= 200 && statusCode < 300) {
        print('✅ [AI-$operation] SUCCESS ($statusCode)');
        if (body.length < 500) {
          print('✅   Response: $body');
        } else {
          print('✅   Response: ${body.substring(0, 500)}... (truncated)');
        }
      } else {
        print('❌ [AI-$operation] FAILED ($statusCode)');
        print('❌   Response: $body');
      }
    }
  }

  /// Log errors with full context
  static void logError(String operation, dynamic error) {
    if (kDebugMode) {
      print('❌ [AI-$operation] ERROR');
      print('❌   Type: ${error.runtimeType}');
      print('❌   Message: $error');
      print('❌   Stack: ${StackTrace.current}');
    }
  }

  /// Log general info
  static void logInfo(String operation, String message) {
    if (kDebugMode) {
      print('ℹ️  [AI-$operation] $message');
    }
  }

  /// Log transaction parsing
  static void logTransaction(Map<String, dynamic> transaction) {
    if (kDebugMode) {
      print('💰 [AI-Transaction] Parsed:');
      print('💰   Type: ${transaction['type']}');
      print('💰   Amount: ${transaction['currency']} ${transaction['amount']}');
      print('💰   Description: ${transaction['description']}');
      
      final journalLines = transaction['journal_lines'] as List<dynamic>?;
      if (journalLines != null) {
        print('💰   Journal Lines:');
        for (var line in journalLines) {
          final account = line['account_name'];
          final debit = line['debit'];
          final credit = line['credit'];
          if (debit > 0) {
            print('💰     DR $account: $debit');
          }
          if (credit > 0) {
            print('💰     CR $account: $credit');
          }
        }
      }
    }
  }

  /// Log register/report refresh
  static void logRefresh(String registerName) {
    if (kDebugMode) {
      print('🔄 [AI-Refresh] Updating $registerName');
    }
  }
}
